import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { useLibraryStore } from '../../../store/useLibraryStore';
import { gestureState } from '../../../store/useGestureStore';

interface PlayerControlsOverlayProps {
  title?: string;
  onBack?: () => void;
  onMoreOptions?: () => void;
  onOpenAudioTracks?: () => void;
  onOpenSubtitles?: () => void;
  decoderMode?: 'HW' | 'HW+' | 'SW';
  onToggleDecoder?: () => void;
  fitMode?: string;
  onCycleFitMode?: () => void;
  onEnterPip?: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlayerControlsOverlay({
  title = 'Aperture Video Stream',
  onBack,
  onMoreOptions,
  onOpenAudioTracks,
  onOpenSubtitles,
  decoderMode = 'HW',
  onToggleDecoder,
  fitMode = 'Fit',
  onCycleFitMode,
  onEnterPip,
}: PlayerControlsOverlayProps) {
  const { playbackState, play, pause, seekRelative, service } = usePlayerStore();
  const { positionMs, durationMs, isPlaying, isBuffering } = playbackState;
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
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          testID="back-button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#F5F5F7" />
        </TouchableOpacity>

        <Text style={styles.titleText} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>

        <View style={styles.topRightActions}>
          {/* Audio Tracks Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenAudioTracks}
            testID="audio-tracks-button"
          >
            <Ionicons name="musical-notes-outline" size={20} color="#F5F5F7" />
          </TouchableOpacity>

          {/* Subtitles Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenSubtitles}
            testID="subtitles-button"
          >
            <Ionicons name="chatbox-ellipses-outline" size={20} color="#F5F5F7" />
          </TouchableOpacity>

          {/* HW/SW Decoder Mode Chip */}
          <TouchableOpacity
            style={styles.decoderChip}
            onPress={onToggleDecoder}
            testID="decoder-button"
          >
            <Text style={styles.decoderText}>{decoderMode}</Text>
          </TouchableOpacity>

          {/* Three Dots More Options */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMoreOptions}
            testID="more-options-button"
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#F5F5F7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Center Buffering Indicator */}
      {isBuffering && (
        <View style={styles.centerContainer}>
          <Text style={styles.bufferingLabel}>Buffering...</Text>
        </View>
      )}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.timeRow}>
          {/* Left Lock Button */}
          <TouchableOpacity
            style={styles.lockButton}
            onPress={() => {
              gestureState.isLocked.value = true;
            }}
            testID="lock-button"
          >
            <Ionicons name="lock-closed-outline" size={18} color="#F5F5F7" style={styles.lockIcon} />
            <Text style={styles.lockLabel}>Lock</Text>
          </TouchableOpacity>

          <Text style={styles.timeText}>
            {formatTime(positionMs)} / {formatTime(durationMs)}
          </Text>

          {/* Right Aspect Ratio Fit & PiP Controls */}
          <View style={styles.bottomRightActions}>
            <TouchableOpacity
              style={styles.fitModeButton}
              onPress={onCycleFitMode}
              testID="fit-mode-button"
            >
              <Ionicons name="expand-outline" size={16} color="#5B8CFF" style={styles.fitIcon} />
              <Text style={styles.fitModeText}>{fitMode}</Text>
            </TouchableOpacity>

            {onEnterPip && (
              <TouchableOpacity
                style={styles.pipButton}
                onPress={onEnterPip}
                testID="pip-button"
              >
                <Ionicons name="scan-outline" size={18} color="#F5F5F7" />
              </TouchableOpacity>
            )}
          </View>
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
              useLibraryStore.getState().playPrevious();
            }}
            testID="play-prev-button"
          >
            <Ionicons name="play-skip-back-outline" size={24} color="#F5F5F7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.seekButton}
            onPress={() => {
              resetAutoHideTimer();
              seekRelative(-10000);
            }}
            testID="seek-back-button"
          >
            <Ionicons name="play-back-outline" size={22} color="#F5F5F7" />
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
            testID="seek-forward-button"
          >
            <Ionicons name="play-forward-outline" size={22} color="#F5F5F7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.seekButton}
            onPress={() => {
              resetAutoHideTimer();
              useLibraryStore.getState().playNext();
            }}
            testID="play-next-button"
          >
            <Ionicons name="play-skip-forward-outline" size={24} color="#F5F5F7" />
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
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: 'rgba(14, 14, 16, 0.85)',
  },
  titleText: {
    flex: 1,
    color: '#F5F5F7',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 6,
  },
  decoderChip: {
    backgroundColor: '#5B8CFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
  },
  decoderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
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
    paddingTop: 14,
    backgroundColor: 'rgba(14, 14, 16, 0.85)',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 73, 92, 0.2)',
    borderWidth: 1,
    borderColor: '#FF495C',
  },
  lockIcon: {
    marginRight: 4,
  },
  lockLabel: {
    color: '#FF495C',
    fontSize: 12,
    fontWeight: '700',
  },
  timeText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  bottomRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fitModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(91, 140, 255, 0.2)',
    marginRight: 6,
  },
  fitIcon: {
    marginRight: 4,
  },
  fitModeText: {
    color: '#5B8CFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pipButton: {
    padding: 6,
    borderRadius: 14,
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
    marginTop: 2,
  },
  seekButton: {
    padding: 8,
    marginHorizontal: 16,
  },
  playPauseButton: {
    padding: 4,
  },
});
