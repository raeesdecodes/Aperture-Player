import { create } from 'zustand';
import { AppTheme, AppSettings } from '../domain/types/settings';
import * as FileSystem from 'expo-file-system/legacy';
import { db } from '../data/db/client';
import { mediaItems } from '../data/db/schema';

export interface SettingsStore extends AppSettings {
  setTheme: (theme: AppTheme) => void;
  setGestureSensitivity: (sensitivity: number) => void;
  setDefaultSubtitleLanguage: (language: string) => void;
  toggleAutoAdvanceFolder: () => void;
  clearThumbnailCache: () => Promise<number>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: 'dark',
  gestureSensitivity: 1.0,
  defaultSubtitleLanguage: 'en',
  autoAdvanceFolder: true,

  setTheme: (theme: AppTheme) => set({ theme }),
  setGestureSensitivity: (gestureSensitivity: number) =>
    set({ gestureSensitivity: Math.max(0.5, Math.min(2.0, gestureSensitivity)) }),
  setDefaultSubtitleLanguage: (defaultSubtitleLanguage: string) =>
    set({ defaultSubtitleLanguage }),
  toggleAutoAdvanceFolder: () => set({ autoAdvanceFolder: !get().autoAdvanceFolder }),

  clearThumbnailCache: async () => {
    try {
      const BASE_DIR = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
      const THUMBNAILS_DIR = `${BASE_DIR}thumbnails/`;

      const dirInfo = await FileSystem.getInfoAsync(THUMBNAILS_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(THUMBNAILS_DIR, { idempotent: true });
      }

      await db
        .update(mediaItems)
        .set({ thumbnailPath: null })
        .execute();

      return 1;
    } catch (err) {
      console.warn('Failed to clear thumbnail cache:', err);
      return 0;
    }
  },
}));
