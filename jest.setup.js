/* eslint-disable no-undef */
jest.mock('react-native-reanimated', () => {
  return {
    makeMutable: (initialValue: any) => ({
      value: initialValue,
    }),
    useSharedValue: (initialValue: any) => ({
      value: initialValue,
    }),
    runOnJS: (fn: any) => fn,
    runOnUI: (fn: any) => fn,
    createAnimatedComponent: (comp: any) => comp,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    GestureDetector: ({ children }: any) => children || React.createElement(View),
    GestureHandlerRootView: ({ children }: any) => children || React.createElement(View),
    Gesture: {
      Pan: () => ({
        onStart: function () {
          return this;
        },
        onUpdate: function () {
          return this;
        },
        onFinalize: function () {
          return this;
        },
        onEnd: function () {
          return this;
        },
      }),
      Tap: () => ({
        numberOfTaps: function () {
          return this;
        },
        onEnd: function () {
          return this;
        },
      }),
      Pinch: () => ({
        onStart: function () {
          return this;
        },
        onUpdate: function () {
          return this;
        },
        onFinalize: function () {
          return this;
        },
        onEnd: function () {
          return this;
        },
      }),
      Simultaneous: (...args: any[]) => args,
      Exclusive: (...args: any[]) => args,
      Race: (...args: any[]) => args,
    },
  };
});
