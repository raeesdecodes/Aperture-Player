import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system/legacy';
import { db } from '../db/client';
import { mediaItems } from '../db/schema';
import { isNull, eq } from 'drizzle-orm';

const BASE_DIR = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
const THUMBNAILS_DIR = `${BASE_DIR}thumbnails/`;

async function ensureThumbnailsDir() {
  if (!THUMBNAILS_DIR) return;
  const dirInfo = await FileSystem.getInfoAsync(THUMBNAILS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(THUMBNAILS_DIR, { intermediates: true });
  }
}

export async function generateMissingThumbnails(): Promise<number> {
  let generatedCount = 0;
  try {
    await ensureThumbnailsDir();

    const itemsWithoutThumbnail = await db
      .select()
      .from(mediaItems)
      .where(isNull(mediaItems.thumbnailPath))
      .all();

    for (const item of itemsWithoutThumbnail) {
      if (!item.mimeType?.startsWith('video/')) {
        continue;
      }
      try {
        const { uri: thumbTempUri } = await VideoThumbnails.getThumbnailAsync(item.uri, {
          time: Math.min(2000, Math.floor(item.durationMs / 2)),
        });

        const cachedPath = `${THUMBNAILS_DIR}${item.id}.jpg`;
        await FileSystem.copyAsync({
          from: thumbTempUri,
          to: cachedPath,
        });

        await db
          .update(mediaItems)
          .set({ thumbnailPath: cachedPath })
          .where(eq(mediaItems.id, item.id))
          .execute();

        generatedCount++;
      } catch (err) {
        console.warn(`Failed thumbnail generation for media item ${item.id}:`, err);
      }
    }
  } catch (err) {
    console.warn('Failed generateMissingThumbnails process:', err);
  }
  return generatedCount;
}
