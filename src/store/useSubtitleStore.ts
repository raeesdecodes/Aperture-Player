import { create } from 'zustand';
import { SubtitleTrack } from '../domain/types/subtitleTrack';
import { openSubtitlesApi } from '../data/remote/openSubtitles/openSubtitlesApi';
import { OpenSubtitleResultItem } from '../data/remote/openSubtitles/openSubtitlesTypes';
import { vlcPlayerService } from '../data/services/vlcPlayerService';
import * as FileSystem from 'expo-file-system/legacy';

export interface SubtitleStore {
  activeSubtitleTrack: SubtitleTrack | null;
  availableTracks: SubtitleTrack[];
  searchResults: OpenSubtitleResultItem[];
  isSearching: boolean;
  isDownloading: boolean;

  setActiveSubtitleTrack: (track: SubtitleTrack | null) => void;
  setAvailableTracks: (tracks: SubtitleTrack[]) => void;
  searchOnline: (query: { filename?: string; language?: string }) => Promise<void>;
  downloadAndApply: (fileId: number) => Promise<string | null>;
}

export const useSubtitleStore = create<SubtitleStore>((set, get) => ({
  activeSubtitleTrack: null,
  availableTracks: [],
  searchResults: [],
  isSearching: false,
  isDownloading: false,

  setActiveSubtitleTrack: (track: SubtitleTrack | null) => {
    set({ activeSubtitleTrack: track });
    vlcPlayerService.setSubtitleUri(track?.uri || null);
  },

  setAvailableTracks: (tracks: SubtitleTrack[]) => {
    set({ availableTracks: tracks });
  },

  searchOnline: async (query) => {
    set({ isSearching: true, searchResults: [] });
    try {
      const results = await openSubtitlesApi.searchSubtitles(query);
      set({ searchResults: results });
    } catch (err) {
      console.warn('Failed online subtitle search:', err);
    } finally {
      set({ isSearching: false });
    }
  },

  downloadAndApply: async (fileId: number) => {
    set({ isDownloading: true });
    try {
      const { link, fileName } = await openSubtitlesApi.downloadSubtitle(fileId);

      const BASE_DIR = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
      const localSubUri = `${BASE_DIR}subtitles/${fileName}`;

      const dirInfo = await FileSystem.getInfoAsync(`${BASE_DIR}subtitles/`);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(`${BASE_DIR}subtitles/`, { intermediates: true });
      }

      await FileSystem.downloadAsync(link, localSubUri);

      const newTrack: SubtitleTrack = {
        id: `remote-${fileId}`,
        name: fileName,
        type: 'remote',
        uri: localSubUri,
      };

      const updatedTracks = [...get().availableTracks, newTrack];
      set({
        availableTracks: updatedTracks,
        activeSubtitleTrack: newTrack,
      });

      vlcPlayerService.setSubtitleUri(localSubUri);
      return localSubUri;
    } catch (err) {
      console.warn('Failed subtitle download:', err);
      return null;
    } finally {
      set({ isDownloading: false });
    }
  },
}));
