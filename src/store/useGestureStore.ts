import { makeMutable, SharedValue } from 'react-native-reanimated';

export type GestureType =
  | 'none'
  | 'brightness'
  | 'volume'
  | 'seek'
  | 'zoom'
  | 'doubleTapLeft'
  | 'doubleTapRight'
  | 'doubleTapCenter';

export interface GestureState {
  activeGesture: SharedValue<GestureType>;
  gestureValue: SharedValue<number>;
  seekDeltaPreviewMs: SharedValue<number>;
  areControlsVisible: SharedValue<boolean>;
  isLocked: SharedValue<boolean>;
}

export const gestureState: GestureState = {
  activeGesture: makeMutable<GestureType>('none'),
  gestureValue: makeMutable<number>(0),
  seekDeltaPreviewMs: makeMutable<number>(0),
  areControlsVisible: makeMutable<boolean>(true),
  isLocked: makeMutable<boolean>(false),
};

export const resetGestureState = () => {
  'worklet';
  gestureState.activeGesture.value = 'none';
  gestureState.gestureValue.value = 0;
  gestureState.seekDeltaPreviewMs.value = 0;
  gestureState.areControlsVisible.value = true;
  gestureState.isLocked.value = false;
};
