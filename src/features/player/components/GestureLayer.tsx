import React, { useState } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import { gestureState } from '../../../store/useGestureStore';
import { usePlayerStore } from '../../../store/usePlayerStore';

interface GestureLayerProps {
  children?: React.ReactNode;
}

const triggerSeek = (deltaMs: number) => {
  usePlayerStore.getState().seekRelative(deltaMs);
  gestureState.seekDeltaPreviewMs.value = 0;
};

export default function GestureLayer({ children }: GestureLayerProps) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const startGestureValue = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const width = layout.width || 1;
  const height = layout.height || 1;

  // Two-Finger Tap Gesture (Toggles lock mode)
  const twoFingerTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .minPointers(2)
    .onEnd(() => {
      'worklet';
      gestureState.isLocked.value = !gestureState.isLocked.value;
      if (!gestureState.isLocked.value) {
        gestureState.areControlsVisible.value = true;
      }
    });

  // Left 25% Pan (Brightness)
  const leftPanGesture = Gesture.Pan()
    .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      if (e.x <= width * 0.25) {
        startGestureValue.value = gestureState.gestureValue.value;
        gestureState.activeGesture.value = 'brightness';
      }
    })
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      const startX = e.x - e.translationX;
      if (startX <= width * 0.25) {
        const deltaYRatio = -e.translationY / height;
        const nextValue = Math.max(0, Math.min(1, startGestureValue.value + deltaYRatio));
        gestureState.gestureValue.value = nextValue;
      }
    })
    .onFinalize(() => {
      'worklet';
      if (gestureState.activeGesture.value === 'brightness') {
        gestureState.activeGesture.value = 'none';
      }
    });

  // Right 25% Pan (Volume)
  const rightPanGesture = Gesture.Pan()
    .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      if (e.x >= width * 0.75) {
        startGestureValue.value = gestureState.gestureValue.value;
        gestureState.activeGesture.value = 'volume';
      }
    })
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      const startX = e.x - e.translationX;
      if (startX >= width * 0.75) {
        const deltaYRatio = -e.translationY / height;
        const nextValue = Math.max(0, Math.min(1, startGestureValue.value + deltaYRatio));
        gestureState.gestureValue.value = nextValue;
      }
    })
    .onFinalize(() => {
      'worklet';
      if (gestureState.activeGesture.value === 'volume') {
        gestureState.activeGesture.value = 'none';
      }
    });

  // Center Pan (Seek)
  const centerPanGesture = Gesture.Pan()
    .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      if (e.x > width * 0.25 && e.x < width * 0.75) {
        gestureState.activeGesture.value = 'seek';
        gestureState.seekDeltaPreviewMs.value = 0;
      }
    })
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      const startX = e.x - e.translationX;
      if (startX > width * 0.25 && startX < width * 0.75) {
        gestureState.seekDeltaPreviewMs.value = e.translationX * 200;
      }
    })
    .onFinalize(() => {
      'worklet';
      if (gestureState.activeGesture.value === 'seek') {
        const finalDeltaMs = gestureState.seekDeltaPreviewMs.value;
        if (finalDeltaMs !== 0) {
          runOnJS(triggerSeek)(finalDeltaMs);
        }
        gestureState.activeGesture.value = 'none';
      }
    });

  // Composed Pan Gesture
  const panGesture = Gesture.Simultaneous(leftPanGesture, rightPanGesture, centerPanGesture);

  // Single Tap Gesture
  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      'worklet';
      if (gestureState.isLocked.value) return;
      gestureState.areControlsVisible.value = !gestureState.areControlsVisible.value;
    });

  // Double Tap Gesture
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      const x = e.x;
      if (x < width / 3) {
        gestureState.activeGesture.value = 'doubleTapLeft';
      } else if (x > (width * 2) / 3) {
        gestureState.activeGesture.value = 'doubleTapRight';
      } else {
        gestureState.activeGesture.value = 'doubleTapCenter';
      }
    });

  // Pinch Zoom Gesture
  const pinchGesture = Gesture.Pinch()
    .onStart((e: GestureStateChangeEvent<PinchGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      gestureState.activeGesture.value = 'zoom';
      gestureState.gestureValue.value = e.scale;
    })
    .onUpdate((e: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureState.isLocked.value) return;
      gestureState.gestureValue.value = e.scale;
    })
    .onFinalize(() => {
      'worklet';
      if (gestureState.activeGesture.value === 'zoom') {
        gestureState.activeGesture.value = 'none';
      }
    });

  // Composed Gestures: TwoFingerTap takes priority, Pinch simultaneous with Pan; Taps exclusive with Pan
  const composedGestures = Gesture.Race(
    twoFingerTapGesture,
    Gesture.Race(
      pinchGesture,
      Gesture.Exclusive(doubleTapGesture, singleTapGesture, panGesture),
    ),
  );

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <GestureDetector gesture={composedGestures}>
        <View style={styles.flexOne}>{children}</View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
});
