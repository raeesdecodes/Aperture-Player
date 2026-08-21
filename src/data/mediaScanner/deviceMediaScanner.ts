import * as MediaLibrary from 'expo-media-library';
import { db } from '../db/client';
import { mediaItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface ScanResult {
  scannedCount: number;
  permissionGranted: boolean;
}

export async function requestMediaPermissions(): Promise<boolean> {
  const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
  if (status === 'granted') {
    return true;
  }
  if (canAskAgain) {
    const requested = await MediaLibrary.requestPermissionsAsync();
    return requested.status === 'granted';
  }
  return false;
}

export async function scanDeviceMedia(): Promise<ScanResult> {
  const permissionGranted = await requestMediaPermissions();
  if (!permissionGranted) {
    return { scannedCount: 0, permissionGranted: false };
  }

  let hasNextPage = true;
  let afterCursor: string | undefined = undefined;
  let scannedCount = 0;

  const now = Date.now();

  while (hasNextPage) {
    const page = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.VIDEO, MediaLibrary.MediaType.AUDIO],
      first: 100,
      after: afterCursor,
      sortBy: ['creationTime'],
    });

    const assets = page.assets;
    afterCursor = page.endCursor;
    hasNextPage = page.hasNextPage;

    for (const asset of assets) {
      const existing = await db
        .select()
        .from(mediaItems)
        .where(eq(mediaItems.id, asset.id))
        .get();

      const itemValues = {
        id: asset.id,
        uri: asset.uri,
        filename: asset.filename,
        title: asset.filename.substring(0, asset.filename.lastIndexOf('.')) || asset.filename,
        durationMs: Math.round(asset.duration * 1000),
        sizeBytes: 0,
        mimeType: asset.mediaType === MediaLibrary.MediaType.VIDEO ? 'video/mp4' : 'audio/mpeg',
        createdAt: asset.creationTime || now,
        updatedAt: asset.modificationTime || now,
      };

      if (!existing) {
        await db.insert(mediaItems).values(itemValues).execute();
      } else {
        await db
          .update(mediaItems)
          .set({
            uri: itemValues.uri,
            filename: itemValues.filename,
            durationMs: itemValues.durationMs,
            updatedAt: itemValues.updatedAt,
          })
          .where(eq(mediaItems.id, asset.id))
          .execute();
      }
      scannedCount++;
    }
  }

  return { scannedCount, permissionGranted: true };
}
