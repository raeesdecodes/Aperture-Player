import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { gestureState } from '../../../store/useGestureStore';

export default function LockScreenButton() {
  const isLocked = gestureState.isLocked;
  const areControlsVisible = gestureState.areControlsVisible;

  const opacity = useDerivedValue(() => {
    if (isLocked.value) {
      return 0.4;
    }
    return areControlsVisible.value ? 1 : 0;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      pointerEvents: isLocked.value || areControlsVisible.value ? 'auto' : 'none',
    };
  });

  const handlePress = () => {
    gestureState.isLocked.value = !gestureState.isLocked.value;
    if (!gestureState.isLocked.value) {
      gestureState.areControlsVisible.value = true;
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.7}
        testID="lock-screen-button"
      >
        <Ionicons
          name={isLocked.value ? 'lock-closed' : 'lock-open'}
          size={22}
          color={isLocked.value ? '#FF7A59' : '#F5F5F7'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    zIndex: 30,
  },
  button: {
    backgroundColor: 'rgba(14, 14, 16, 0.8)',
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
