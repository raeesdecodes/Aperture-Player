import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import PlayerScreen from './src/features/player/screens/PlayerScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <PlayerScreen />
      <StatusBar style="light" hidden />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
