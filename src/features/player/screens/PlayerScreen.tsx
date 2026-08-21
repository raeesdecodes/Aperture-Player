import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { vlcPlayerService } from '../../../data/services/vlcPlayerService';

import GestureLayer from '../components/GestureLayer';
import VolumeBrightnessIndicator from '../components/VolumeBrightnessIndicator';
import SeekScrubOverlay from '../components/SeekScrubOverlay';
import PlayerControlsOverlay from '../components/PlayerControlsOverlay';

interface PlayerScreenProps {
  uri?: string;
  title?: string;
  onBack?: () => void;
}

const DEFAULT_SAMPLE_URI =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function PlayerScreen({
  uri = DEFAULT_SAMPLE_URI,
  title,
  onBack,
}: PlayerScreenProps) {
  const vlcRef = useRef<any>(null);
  const { playbackState, open } = usePlayerStore();
  const { isPlaying } = playbackState;

  useEffect(() => {
    open(uri);
  }, [uri, open]);

  const handleRef = (ref: any) => {
    vlcRef.current = ref;
    if (ref) {
      vlcPlayerService.attachRef(ref);
    } else {
      vlcPlayerService.detachRef();
    }
  };

  const handleProgress = (event: any) => {
    const currentMs = (event.currentTime || 0) * 1000;
    const durMs = (event.duration || 0) * 1000;
    vlcPlayerService.updateState({
      positionMs: currentMs,
      durationMs: durMs > 0 ? durMs : playbackState.durationMs,
      isBuffering: false,
    });
  };

  const handlePlaying = (event: any) => {
    const durMs = (event.duration || 0) * 1000;
    vlcPlayerService.updateState({
      isPlaying: true,
      isBuffering: false,
      durationMs: durMs > 0 ? durMs : playbackState.durationMs,
    });
  };

  const handlePaused = () => {
    vlcPlayerService.updateState({ isPlaying: false });
  };

  const handleBuffering = () => {
    vlcPlayerService.updateState({ isBuffering: true });
  };

  return (
    <View style={styles.container}>
      <GestureLayer>
        <VLCPlayer
          ref={handleRef}
          style={styles.video}
          source={{ uri }}
          paused={!isPlaying}
          onProgress={handleProgress}
          onPlaying={handlePlaying}
          onPaused={handlePaused}
          onBuffering={handleBuffering}
          autoplay={true}
        />
        <VolumeBrightnessIndicator />
        <SeekScrubOverlay />
        <PlayerControlsOverlay title={title} onBack={onBack} />
      </GestureLayer>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    width,
    height,
    position: 'absolute',
  },
});
