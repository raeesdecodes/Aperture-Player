/* eslint-disable no-undef */
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');

  const AnimatedView = React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }),
  );

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: (comp) => comp,
    },
    makeMutable: (initialValue) => ({
      value: initialValue,
    }),
    useSharedValue: (initialValue) => ({
      value: initialValue,
    }),
    useDerivedValue: (fn) => ({
      get value() {
        return fn();
      },
    }),
    useAnimatedStyle: (fn) => fn(),
    withSpring: (val) => val,
    withTiming: (val) => val,
    withDelay: (_delay, val) => val,
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    createAnimatedComponent: (comp) => comp,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    GestureDetector: ({ children }) => children || React.createElement(View),
    GestureHandlerRootView: ({ children }) => children || React.createElement(View),
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
        minPointers: function () {
          return this;
        },
        maxPointers: function () {
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
      LongPress: () => ({
        minDuration: function () {
          return this;
        },
        onStart: function () {
          return this;
        },
        onFinalize: function () {
          return this;
        },
      }),
      Simultaneous: (...args) => args,
      Exclusive: (...args) => args,
      Race: (...args) => args,
    },
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: (props) => React.createElement(Text, props, props.name),
  };
});

jest.mock(
  'expo-sqlite',
  () => ({
    openDatabaseSync: jest.fn(() => ({
      execAsync: jest.fn(),
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      getAllAsync: jest.fn(),
    })),
  }),
  { virtual: true },
);

jest.mock(
  'expo-media-library',
  () => ({
    getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
    requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
    getAssetsAsync: jest.fn(async () => ({ assets: [], endCursor: '', hasNextPage: false })),
    MediaType: { VIDEO: 'video', AUDIO: 'audio' },
  }),
  { virtual: true },
);

jest.mock(
  'expo-file-system/legacy',
  () => ({
    cacheDirectory: '/mock/cache/',
    documentDirectory: '/mock/doc/',
    getInfoAsync: jest.fn(async () => ({ exists: true })),
    makeDirectoryAsync: jest.fn(async () => {}),
    copyAsync: jest.fn(async () => {}),
    downloadAsync: jest.fn(async () => {}),
    deleteAsync: jest.fn(async () => {}),
  }),
  { virtual: true },
);
