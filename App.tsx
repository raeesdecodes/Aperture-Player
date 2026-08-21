import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import BottomTabBar, { TabType } from './src/features/navigation/BottomTabBar';
import LibraryHomeScreen from './src/features/library/screens/LibraryHomeScreen';
import MusicHomeScreen from './src/features/library/screens/MusicHomeScreen';
import MeScreen from './src/features/settings/screens/MeScreen';
import SettingsScreen from './src/features/settings/screens/SettingsScreen';
import PlayerScreen from './src/features/player/screens/PlayerScreen';
import AudioPlayerScreen from './src/features/audioPlayer/screens/AudioPlayerScreen';
import EqualizerScreen from './src/features/equalizer/screens/EqualizerScreen';
import { MediaItemSchema } from './src/data/db/schema/mediaItems';

type ViewMode = 'main' | 'player' | 'audioPlayer' | 'settings' | 'equalizer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('local');
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedMedia, setSelectedMedia] = useState<MediaItemSchema | null>(null);

  const handleSelectMedia = (item: MediaItemSchema) => {
    setSelectedMedia(item);
    if (
      item.mimeType?.startsWith('audio') ||
      item.filename.match(/\.(mp3|aac|flac|wav|ogg|m4a)$/i)
    ) {
      setViewMode('audioPlayer');
    } else {
      setViewMode('player');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {viewMode === 'main' && (
        <View style={styles.flexOne}>
          <View style={styles.flexOne}>
            {activeTab === 'local' && (
              <LibraryHomeScreen
                onSelectMedia={handleSelectMedia}
                onOpenSettings={() => setViewMode('settings')}
                onOpenMusic={() => setActiveTab('music')}
              />
            )}
            {activeTab === 'music' && (
              <MusicHomeScreen onSelectMedia={handleSelectMedia} />
            )}
            {activeTab === 'me' && (
              <MeScreen
                onOpenSettings={() => setViewMode('settings')}
                onOpenEqualizer={() => setViewMode('equalizer')}
              />
            )}
          </View>

          <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
        </View>
      )}

      {viewMode === 'player' && (
        <PlayerScreen
          uri={selectedMedia?.uri}
          title={selectedMedia?.title || selectedMedia?.filename}
          onBack={() => setViewMode('main')}
        />
      )}

      {viewMode === 'audioPlayer' && (
        <AudioPlayerScreen
          title={selectedMedia?.title || selectedMedia?.filename}
          artist="Local Storage Track"
          onBack={() => setViewMode('main')}
        />
      )}

      {viewMode === 'settings' && (
        <SettingsScreen onBack={() => setViewMode('main')} />
      )}

      {viewMode === 'equalizer' && (
        <EqualizerScreen onBack={() => setViewMode('main')} />
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
  flexOne: {
    flex: 1,
  },
});
