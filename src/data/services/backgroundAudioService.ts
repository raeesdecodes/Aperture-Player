import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

let isSetup = false;

export async function setupBackgroundAudio(): Promise<boolean> {
  if (isSetup) return true;
  try {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
    isSetup = true;
    return true;
  } catch (err) {
    console.warn('Failed background TrackPlayer setup:', err);
    return false;
  }
}

export async function updateMediaNotification(
  title: string,
  artist: string = 'Aperture Player',
  durationMs: number = 0,
): Promise<void> {
  try {
    await setupBackgroundAudio();
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: 'active_media',
      url: 'https://dummy.mp3', // Placeholder audio track for Android OS media notification integration
      title: title || 'Now Playing',
      artist: artist,
      duration: durationMs > 0 ? durationMs / 1000 : 0,
    });
  } catch (err) {
    console.warn('Failed updateMediaNotification:', err);
  }
}
