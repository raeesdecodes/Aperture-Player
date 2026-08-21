/**
 * Domain model representing current media playback state.
 */
export interface PlaybackState {
  positionMs: number;
  durationMs: number;
  isPlaying: boolean;
  isBuffering: boolean;
}
