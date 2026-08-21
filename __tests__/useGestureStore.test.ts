import { gestureState, resetGestureState } from '../src/store/useGestureStore';

describe('useGestureStore', () => {
  beforeEach(() => {
    resetGestureState();
  });

  it('initializes with default shared values', () => {
    expect(gestureState.activeGesture.value).toBe('none');
    expect(gestureState.gestureValue.value).toBe(0);
    expect(gestureState.seekDeltaPreviewMs.value).toBe(0);
  });

  it('updates gesture values correctly', () => {
    gestureState.activeGesture.value = 'brightness';
    gestureState.gestureValue.value = 0.75;
    gestureState.seekDeltaPreviewMs.value = 5000;

    expect(gestureState.activeGesture.value).toBe('brightness');
    expect(gestureState.gestureValue.value).toBe(0.75);
    expect(gestureState.seekDeltaPreviewMs.value).toBe(5000);
  });

  it('resets gesture state back to default', () => {
    gestureState.activeGesture.value = 'volume';
    gestureState.gestureValue.value = 0.5;
    gestureState.seekDeltaPreviewMs.value = -10000;

    resetGestureState();

    expect(gestureState.activeGesture.value).toBe('none');
    expect(gestureState.gestureValue.value).toBe(0);
    expect(gestureState.seekDeltaPreviewMs.value).toBe(0);
  });
});
