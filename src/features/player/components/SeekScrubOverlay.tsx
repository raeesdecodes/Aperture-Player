import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { gestureState } from '../../../store/useGestureStore';

function formatDeltaTime(deltaMs: number): string {
  const absSeconds = Math.floor(Math.abs(deltaMs) / 1000);
  const minutes = Math.floor(absSeconds / 60);
  const seconds = Math.floor(absSeconds % 60);
  const sign = deltaMs >= 0 ? '+' : '−';
  return `${sign}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function SeekScrubOverlay() {
  const activeGesture = gestureState.activeGesture;
  const seekDeltaPreviewMs = gestureState.seekDeltaPreviewMs;
  const [formattedText, setFormattedText] = useState('+00:00');
  const [isForward, setIsForward] = useState(true);

  const isSeeking = useDerivedValue(() => {
    return activeGesture.value === 'seek';
  });

  const opacity = useDerivedValue(() => {
    return isSeeking.value ? withTiming(1, { duration: 150 }) : withTiming(0, { duration: 200 });
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: isSeeking.value ? withTiming(1) : withTiming(0.9) }],
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = seekDeltaPreviewMs.value;
      setFormattedText(formatDeltaTime(delta));
      setIsForward(delta >= 0);
    }, 40);
    return () => clearInterval(interval);
  }, [seekDeltaPreviewMs]);

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <View style={styles.scrim}>
        <Ionicons
          name={isForward ? 'play-forward-sharp' : 'play-back-sharp'}
          size={28}
          color="#5B8CFF"
          style={styles.icon}
        />
        <Text style={styles.label}>{formattedText}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  scrim: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 14, 16, 0.85)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    color: '#F5F5F7',
    fontSize: 22,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
