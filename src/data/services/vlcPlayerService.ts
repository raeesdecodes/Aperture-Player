import { PlayerService } from '../../domain/interfaces/playerService';
import { PlaybackState } from '../../domain/types/playbackState';
import { detectLocalSubtitle } from './localSubtitleDetector';
import { useLibraryStore } from '../../store/useLibraryStore';

/**
 * Concrete implementation of PlayerService backed by react-native-vlc-media-player.
 */
export class VlcPlayerService implements PlayerService {
  private state: PlaybackState = {
    positionMs: 0,
    durationMs: 0,
    isPlaying: false,
    isBuffering: false,
  };

  private currentUri: string | null = null;
  private activeSubtitleUri: string | null = null;
  private volume: number = 100;
  private playbackRate: number = 1.0;
  private listeners: Set<(state: PlaybackState) => void> = new Set();
  private vlcPlayerRef: any = null;

  public getPlaybackRate(): number {
    return this.playbackRate;
  }

  public setPlaybackRate(rate: number): void {
    const clampedRate = Math.max(0.25, Math.min(3.0, rate));
    this.playbackRate = clampedRate;
    if (this.vlcPlayerRef?.setRate) {
      this.vlcPlayerRef.setRate(clampedRate);
    }
  }

  /**
   * Binds the active VLCPlayer component ref to this service instance.
   */
  public attachRef(ref: any): void {
    this.vlcPlayerRef = ref;
  }

  /**
   * Unbinds the VLCPlayer component ref.
   */
  public detachRef(): void {
    this.vlcPlayerRef = null;
  }

  /**
   * Internal helper to emit state updates to all subscribers.
   */
  public updateState(partialState: Partial<PlaybackState>): void {
    this.state = { ...this.state, ...partialState };
    this.listeners.forEach((callback) => callback(this.state));
  }

  /**
   * Gets the current URI opened in the player.
   */
  public getCurrentUri(): string | null {
    return this.currentUri;
  }

  /**
   * Gets the active auto-detected or manually set subtitle URI.
   */
  public getActiveSubtitleUri(): string | null {
    return this.activeSubtitleUri;
  }

  /**
   * Sets active subtitle URI manually.
   */
  public setSubtitleUri(subtitleUri: string | null): void {
    this.activeSubtitleUri = subtitleUri;
  }

  /**
   * Gets current volume (0 to 100).
   */
  public getVolume(): number {
    return this.volume;
  }

  public async open(uri: string): Promise<void> {
    this.currentUri = uri;
    this.activeSubtitleUri = await detectLocalSubtitle(uri);
    this.updateState({
      positionMs: 0,
      durationMs: 0,
      isPlaying: true,
      isBuffering: true,
    });
  }

  public async play(): Promise<void> {
    if (this.vlcPlayerRef?.resume) {
      this.vlcPlayerRef.resume();
    }
    this.updateState({ isPlaying: true });
  }

  public async pause(): Promise<void> {
    this.updateState({ isPlaying: false });
  }

  public handleEndReached(): void {
    this.updateState({ isPlaying: false });
    useLibraryStore.getState().playNext();
  }

  public async seek(positionMs: number): Promise<void> {
    const clampedPosMs = Math.max(0, Math.min(positionMs, this.state.durationMs));
    if (this.state.durationMs > 0 && this.vlcPlayerRef?.seek) {
      const positionFraction = clampedPosMs / this.state.durationMs;
      this.vlcPlayerRef.seek(positionFraction);
    }
    this.updateState({ positionMs: clampedPosMs });
  }

  public async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    this.volume = clampedVolume;
  }

  private audioDelayMs: number = 0;

  /**
   * Sets audio delay offset in milliseconds (positive = audio lags video, negative = audio leads video).
   */
  public setAudioDelay(delayMs: number): void {
    this.audioDelayMs = delayMs;
    if (this.vlcPlayerRef?.setAudioDelay) {
      this.vlcPlayerRef.setAudioDelay(delayMs);
    }
  }

  /**
   * Gets current audio delay offset in milliseconds.
   */
  public getAudioDelay(): number {
    return this.audioDelayMs;
  }

  public setEqualizerEnabled(enabled: boolean): void {
    if (this.vlcPlayerRef?.setEqualizerEnabled) {
      this.vlcPlayerRef.setEqualizerEnabled(enabled);
    }
  }

  public setEqualizerBands(gains: number[]): void {
    if (this.vlcPlayerRef?.setEqualizerBands) {
      this.vlcPlayerRef.setEqualizerBands(gains);
    }
  }

  public onPlaybackStateChange(callback: (state: PlaybackState) => void): () => void {
    this.listeners.add(callback);
    callback(this.state);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

/**
 * Singleton factory instance for VlcPlayerService.
 */
export const vlcPlayerService = new VlcPlayerService();
