import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import GestureLayer from '../src/features/player/components/GestureLayer';

describe('GestureLayer', () => {
  it('renders children correctly inside GestureLayer', async () => {
    const screen = await render(
      <GestureLayer>
        <Text>Video Stream Surface</Text>
      </GestureLayer>
    );

    expect(screen.getByText('Video Stream Surface')).toBeTruthy();
  });
});
