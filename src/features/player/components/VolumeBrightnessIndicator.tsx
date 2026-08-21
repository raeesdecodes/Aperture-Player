import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  useDerivedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { gestureState } from '../../../store/useGestureStore';

export default function VolumeBrightnessIndicator() {
  const activeGesture = gestureState.activeGesture;
  const gestureValue = gestureState.gestureValue;

  const isVolumeOrBrightness = useDerivedValue(() => {
    return activeGesture.value === 'brightness' || activeGesture.value === 'volume';
  });

  const opacity = useDerivedValue(() => {
    if (isVolumeOrBrightness.value) {
      return withTiming(1, { duration: 150 });
    }
    return withDelay(600, withTiming(0, { duration: 200 }));
  });

  const containerStyle = useAnimatedStyle(() => {
    const isBrightness = activeGesture.value === 'brightness';
    return {
      opacity: opacity.value,
      left: isBrightness ? 24 : undefined,
      right: !isBrightness ? 24 : undefined,
    };
  });

  const animatedFillStyle = useAnimatedStyle(() => {
    const clampedValue = Math.max(0, Math.min(1, gestureValue.value));
    return {
      height: withSpring(`${clampedValue * 100}%`, {
        damping: 18,
        stiffness: 140,
      }),
    };
  });

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    const val = gestureValue.value;
    if (activeGesture.value === 'brightness') {
      return val < 0.3 ? 'sunny-outline' : 'sunny';
    }
    if (val <= 0) return 'volume-mute';
    if (val < 0.5) return 'volume-low';
    return 'volume-high';
  };

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      pointerEvents="none"
      testID="volume-brightness-indicator"
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName()} size={20} color="#F5F5F7" />
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedFillStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    marginBottom: 8,
    backgroundColor: 'rgba(14, 14, 16, 0.6)',
    padding: 6,
    borderRadius: 16,
  },
  track: {
    width: 8,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
    backgroundColor: '#5B8CFF',
    borderRadius: 4,
  },
});
