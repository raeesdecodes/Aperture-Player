import { create } from 'zustand';
import { db } from '../data/db/client';
import { mediaItems, watchProgress } from '../data/db/schema';
import { MediaItemSchema } from '../data/db/schema/mediaItems';
import { scanDeviceMedia } from '../data/mediaScanner/deviceMediaScanner';
import { generateMissingThumbnails } from '../data/mediaScanner/thumbnailGenerator';
import { vlcPlayerService } from '../data/services/vlcPlayerService';
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
  playlistQueue: MediaItemSchema[];
  currentIndex: number;
  isScanning: boolean;
  permissionGranted: boolean;
  fetchLibrary: () => Promise<void>;
  scanMedia: () => Promise<void>;
  setQueue: (items: MediaItemSchema[], startIndex: number) => void;
  playNext: () => Promise<boolean>;
  playPrevious: () => Promise<boolean>;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  mediaItemsList: [],
  continueWatchingList: [],
  playlistQueue: [],
  currentIndex: -1,
  isScanning: false,
  permissionGranted: true,

  setQueue: (items: MediaItemSchema[], startIndex: number) => {
    set({ playlistQueue: items, currentIndex: startIndex });
  },

  playNext: async () => {
    const { playlistQueue, currentIndex } = get();
    if (playlistQueue.length === 0 || currentIndex >= playlistQueue.length - 1) {
      return false;
    }
    const nextIndex = currentIndex + 1;
    const nextItem = playlistQueue[nextIndex];
    set({ currentIndex: nextIndex });
    await vlcPlayerService.open(nextItem.uri);
    return true;
  },

  playPrevious: async () => {
    const { playlistQueue, currentIndex } = get();
    if (playlistQueue.length === 0 || currentIndex <= 0) {
      return false;
    }
    const prevIndex = currentIndex - 1;
    const prevItem = playlistQueue[prevIndex];
    set({ currentIndex: prevIndex });
    await vlcPlayerService.open(prevItem.uri);
    return true;
  },

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
      // Background thumbnail generation
      generateMissingThumbnails().then((count) => {
        if (count > 0) {
          get().fetchLibrary();
        }
      });
    } finally {
      set({ isScanning: false });
    }
  },
}));
