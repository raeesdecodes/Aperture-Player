import { PlaybackState } from '../types/playbackState';

/**
 * Abstract interface contract for the playback engine service.
 * Pure TypeScript contract with no React Native or native engine dependencies.
 */
export interface PlayerService {
  open(uri: string): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  onPlaybackStateChange(callback: (state: PlaybackState) => void): () => void;
}
