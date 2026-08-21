import { create } from 'zustand';
import { PlayerService } from '../domain/interfaces/playerService';
import { PlaybackState } from '../domain/types/playbackState';
import { vlcPlayerService } from '../data/services/vlcPlayerService';

export interface PlayerStore {
  playbackState: PlaybackState;
  service: PlayerService;
  setPlayerService: (service: PlayerService) => void;
  open: (uri: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekRelative: (deltaMs: number) => Promise<void>;
}

let activeUnsubscribe: (() => void) | null = null;

const initialPlaybackState: PlaybackState = {
  positionMs: 0,
  durationMs: 0,
  isPlaying: false,
  isBuffering: false,
};

export const usePlayerStore = create<PlayerStore>((set, get) => {
  const subscribeToService = (service: PlayerService) => {
    if (activeUnsubscribe) {
      activeUnsubscribe();
    }
    activeUnsubscribe = service.onPlaybackStateChange((newState) => {
      set({ playbackState: newState });
    });
  };

  // Subscribe to default initial service
  subscribeToService(vlcPlayerService);

  return {
    playbackState: initialPlaybackState,
    service: vlcPlayerService,

    setPlayerService: (newService: PlayerService) => {
      subscribeToService(newService);
      set({ service: newService });
    },

    open: async (uri: string) => {
      await get().service.open(uri);
    },

    play: async () => {
      await get().service.play();
    },

    pause: async () => {
      await get().service.pause();
    },

    seekRelative: async (deltaMs: number) => {
      const { positionMs, durationMs } = get().playbackState;
      const targetPosMs = Math.max(0, Math.min(positionMs + deltaMs, durationMs));
      await get().service.seek(targetPosMs);
    },
  };
});
