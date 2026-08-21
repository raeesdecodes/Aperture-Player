import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import PlayerScreen from './src/features/player/screens/PlayerScreen';
import LibraryHomeScreen from './src/features/library/screens/LibraryHomeScreen';
import SettingsScreen from './src/features/settings/screens/SettingsScreen';
import { MediaItemSchema } from './src/data/db/schema/mediaItems';

type Screen = 'library' | 'player' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('library');
  const [selectedMedia, setSelectedMedia] = useState<MediaItemSchema | null>(null);

  const handleSelectMedia = (item: MediaItemSchema) => {
    setSelectedMedia(item);
    setCurrentScreen('player');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {currentScreen === 'library' && (
        <LibraryHomeScreen
          onSelectMedia={handleSelectMedia}
          onOpenSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'player' && (
        <PlayerScreen
          uri={selectedMedia?.uri}
          title={selectedMedia?.title || selectedMedia?.filename}
          onBack={() => setCurrentScreen('library')}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => setCurrentScreen('library')} />
      )}

      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
  },
});
