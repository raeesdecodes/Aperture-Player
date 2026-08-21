import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../src/App';

jest.mock('react-native-vlc-media-player', () => ({
  VLCPlayer: 'VLCPlayer',
}));

jest.mock('@react-native-community/slider', () => 'Slider');

describe('App Component', () => {
  it('renders root App correctly without crashing', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(<App />);
    });
    expect(tree.toJSON()).not.toBeNull();
  });
});
