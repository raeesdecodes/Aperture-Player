import { usePlayerStore } from '../src/store/usePlayerStore';
import { PlayerService } from '../src/domain/interfaces/playerService';
import { PlaybackState } from '../src/domain/types/playbackState';

class MockPlayerService implements PlayerService {
  public state: PlaybackState = {
    positionMs: 1000,
    durationMs: 10000,
    isPlaying: false,
    isBuffering: false,
  };
  private callback: ((state: PlaybackState) => void) | null = null;

  public async open(uri: string): Promise<void> {
    this.state.isPlaying = true;
    this.notify();
  }

  public async play(): Promise<void> {
    this.state.isPlaying = true;
    this.notify();
  }

  public async pause(): Promise<void> {
    this.state.isPlaying = false;
    this.notify();
  }

  public async seek(positionMs: number): Promise<void> {
    this.state.positionMs = positionMs;
    this.notify();
  }

  public async setVolume(volume: number): Promise<void> {}

  public onPlaybackStateChange(callback: (state: PlaybackState) => void): () => void {
    this.callback = callback;
    callback(this.state);
    return () => {
      this.callback = null;
    };
  }

  private notify() {
    if (this.callback) {
      this.callback({ ...this.state });
    }
  }
}

describe('usePlayerStore', () => {
  let mockService: MockPlayerService;

  beforeEach(() => {
    mockService = new MockPlayerService();
    usePlayerStore.getState().setPlayerService(mockService);
  });

  it('updates state on open, play, pause, and seekRelative', async () => {
    const store = usePlayerStore.getState();

    await store.open('test.mp4');
    expect(usePlayerStore.getState().playbackState.isPlaying).toBe(true);

    await store.pause();
    expect(usePlayerStore.getState().playbackState.isPlaying).toBe(false);

    await store.seekRelative(2000);
    expect(usePlayerStore.getState().playbackState.positionMs).toBe(3000);
  });
});
