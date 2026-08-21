import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { gestureState } from '../../../store/useGestureStore';

interface PlayerControlsOverlayProps {
  title?: string;
  onBack?: () => void;
  onMoreOptions?: () => void;
  onLockToggle?: () => void;
  isLocked?: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlayerControlsOverlay({
  title = 'Big Buck Bunny (Sample)',
  onBack,
  onMoreOptions,
  onLockToggle,
  isLocked = false,
}: PlayerControlsOverlayProps) {
  const { playbackState, play, pause, seekRelative, service } = usePlayerStore();
  const { positionMs, durationMs, isPlaying, isBuffering } = playbackState;
  const [isVisibleState, setIsVisibleState] = useState(true);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const areControlsVisible = gestureState.areControlsVisible;
  const isLockedShared = gestureState.isLocked;

  const opacity = useDerivedValue(() => {
    if (isLockedShared.value) {
      return withTiming(0, { duration: 200 });
    }
    return areControlsVisible.value ? withTiming(1, { duration: 150 }) : withTiming(0, { duration: 200 });
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      pointerEvents: !isLockedShared.value && areControlsVisible.value ? 'auto' : 'none',
    };
  });

  // Handle auto-hide after 3 seconds of inactivity
  const resetAutoHideTimer = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    if (isPlaying && areControlsVisible.value) {
      autoHideTimerRef.current = setTimeout(() => {
        gestureState.areControlsVisible.value = false;
      }, 3000);
    }
  };

  useEffect(() => {
    resetAutoHideTimer();
    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, [isPlaying, areControlsVisible.value]);

  const togglePlayPause = () => {
    resetAutoHideTimer();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSlidingComplete = async (valueMs: number) => {
    resetAutoHideTimer();
    await service.seek(valueMs);
  };

  return (
    <Animated.View style={[styles.overlayContainer, animatedStyle]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack} testID="back-button">
          <Ionicons name="arrow-back" size={24} color="#F5F5F7" />
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMoreOptions}
          testID="more-options-button"
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#F5F5F7" />
        </TouchableOpacity>
      </View>

      {/* Center Buffering / Play Indicator */}
      {isBuffering && (
        <View style={styles.centerContainer}>
          <Text style={styles.bufferingLabel}>Buffering...</Text>
        </View>
      )}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            {formatTime(positionMs)} / {formatTime(durationMs)}
          </Text>
          <TouchableOpacity
            style={styles.lockButton}
            onPress={() => {
              gestureState.isLocked.value = true;
            }}
            testID="lock-button"
          >
            <Ionicons name="lock-open-outline" size={20} color="#F5F5F7" />
          </TouchableOpacity>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMs > 0 ? durationMs : 1}
          value={positionMs}
          minimumTrackTintColor="#5B8CFF"
          maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
          thumbTintColor="#FFFFFF"
          onSlidingComplete={handleSlidingComplete}
          onValueChange={() => resetAutoHideTimer()}
        />

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.seekButton}
            onPress={() => {
              resetAutoHideTimer();
              seekRelative(-10000);
            }}
          >
            <Ionicons name="play-back-outline" size={24} color="#F5F5F7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={togglePlayPause}
            testID="play-pause-button"
          >
            <Ionicons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={48}
              color="#5B8CFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.seekButton}
            onPress={() => {
              resetAutoHideTimer();
              seekRelative(10000);
            }}
          >
            <Ionicons name="play-forward-outline" size={24} color="#F5F5F7" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    zIndex: 15,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(14, 14, 16, 0.75)',
  },
  titleText: {
    flex: 1,
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  centerContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(14, 14, 16, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bufferingLabel: {
    color: '#FFCC00',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(14, 14, 16, 0.75)',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  lockButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  seekButton: {
    padding: 8,
    marginHorizontal: 20,
  },
  playPauseButton: {
    padding: 4,
  },
});
