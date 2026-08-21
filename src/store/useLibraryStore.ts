import { create } from 'zustand';
import { db } from '../data/db/client';
import { mediaItems, watchProgress } from '../data/db/schema';
import { MediaItemSchema } from '../data/db/schema/mediaItems';
import { scanDeviceMedia } from '../data/mediaScanner/deviceMediaScanner';
import { eq, gt, desc } from 'drizzle-orm';

export interface WatchProgressItem {
  mediaItem: MediaItemSchema;
  positionMs: number;
  durationMs: number;
  progressPercent: number;
}

export interface LibraryStore {
  mediaItemsList: MediaItemSchema[];
  continueWatchingList: WatchProgressItem[];
  isScanning: boolean;
  permissionGranted: boolean;
  fetchLibrary: () => Promise<void>;
  scanMedia: () => Promise<void>;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  mediaItemsList: [],
  continueWatchingList: [],
  isScanning: false,
  permissionGranted: true,

  fetchLibrary: async () => {
    try {
      const items = await db
        .select()
        .from(mediaItems)
        .orderBy(desc(mediaItems.createdAt))
        .all();

      const progressRows = await db
        .select({
          mediaItem: mediaItems,
          positionMs: watchProgress.positionMs,
          durationMs: watchProgress.durationMs,
        })
        .from(watchProgress)
        .innerJoin(mediaItems, eq(watchProgress.mediaItemId, mediaItems.id))
        .where(gt(watchProgress.positionMs, 0))
        .orderBy(desc(watchProgress.lastWatchedAt))
        .all();

      const continueWatching: WatchProgressItem[] = progressRows.map((row) => {
        const dur = row.durationMs > 0 ? row.durationMs : row.mediaItem.durationMs || 1;
        const progressPercent = Math.min(100, Math.max(0, (row.positionMs / dur) * 100));
        return {
          mediaItem: row.mediaItem,
          positionMs: row.positionMs,
          durationMs: dur,
          progressPercent,
        };
      });

      set({ mediaItemsList: items, continueWatchingList: continueWatching });
    } catch (error) {
      console.warn('Failed to fetch library from database:', error);
    }
  },

  scanMedia: async () => {
    set({ isScanning: true });
    try {
      const { permissionGranted } = await scanDeviceMedia();
      set({ permissionGranted });
      await get().fetchLibrary();
    } finally {
      set({ isScanning: false });
    }
  },
}));
