import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';
import Slider from '@react-native-community/slider';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { vlcPlayerService } from '../../../data/services/vlcPlayerService';

interface PlayerScreenProps {
  uri?: string;
}

const DEFAULT_SAMPLE_URI =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlayerScreen({ uri = DEFAULT_SAMPLE_URI }: PlayerScreenProps) {
  const vlcRef = useRef<any>(null);
  const { playbackState, play, pause, open } = usePlayerStore();
  const { positionMs, durationMs, isPlaying, isBuffering } = playbackState;

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
    // VLCPlayer event: currentTime & duration are in seconds (or ms depending on version)
    const currentMs = (event.currentTime || 0) * 1000;
    const durMs = (event.duration || 0) * 1000;
    vlcPlayerService.updateState({
      positionMs: currentMs,
      durationMs: durMs > 0 ? durMs : durationMs,
      isBuffering: false,
    });
  };

  const handlePlaying = (event: any) => {
    const durMs = (event.duration || 0) * 1000;
    vlcPlayerService.updateState({
      isPlaying: true,
      isBuffering: false,
      durationMs: durMs > 0 ? durMs : durationMs,
    });
  };

  const handlePaused = () => {
    vlcPlayerService.updateState({ isPlaying: false });
  };

  const handleBuffering = () => {
    vlcPlayerService.updateState({ isBuffering: true });
  };

  const handleSlidingComplete = async (valueMs: number) => {
    await vlcPlayerService.seek(valueMs);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.controlsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            testID="play-pause-button"
          >
            <Text style={styles.buttonText}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
          </TouchableOpacity>

          <Text style={styles.timeText}>
            {formatTime(positionMs)} / {formatTime(durationMs)}
          </Text>

          {isBuffering && <Text style={styles.bufferingText}>Buffering...</Text>}
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMs > 0 ? durationMs : 1}
          value={positionMs}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#555555"
          thumbTintColor="#FFFFFF"
          onSlidingComplete={handleSlidingComplete}
        />
      </View>
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
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(14, 14, 16, 0.85)',
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeText: {
    color: '#F5F5F7',
    fontSize: 14,
  },
  bufferingText: {
    color: '#FFCC00',
    fontSize: 12,
    marginLeft: 'auto',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
