import React from 'react';
import { render } from '@testing-library/react-native';
import VolumeBrightnessIndicator from '../src/features/player/components/VolumeBrightnessIndicator';
import { gestureState } from '../src/store/useGestureStore';

describe('VolumeBrightnessIndicator', () => {
  beforeEach(() => {
    gestureState.activeGesture.value = 'none';
    gestureState.gestureValue.value = 0.5;
  });

  it('renders correctly', async () => {
    const { getByTestId } = await render(<VolumeBrightnessIndicator />);
    expect(getByTestId('volume-brightness-indicator')).toBeTruthy();
  });
});
