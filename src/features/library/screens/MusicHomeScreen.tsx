import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLibraryStore } from '../../../store/useLibraryStore';
import { MediaItemSchema } from '../../../data/db/schema/mediaItems';

interface MusicHomeScreenProps {
  onSelectMedia: (mediaItem: MediaItemSchema) => void;
}

export default function MusicHomeScreen({ onSelectMedia }: MusicHomeScreenProps) {
  const { mediaItemsList, scanMedia, isScanning } = useLibraryStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter audio items or fallback to all items if no explicit audio flag
  const audioItems = useMemo(() => {
    const list = mediaItemsList.filter(
      (item) =>
        item.mimeType?.startsWith('audio') || item.filename.match(/\.(mp3|aac|flac|wav|ogg|m4a)$/i),
    );
    const target = list.length > 0 ? list : mediaItemsList;

    if (!searchQuery.trim()) return target;
    const q = searchQuery.toLowerCase().trim();
    return target.filter(
      (item) => item.title?.toLowerCase().includes(q) || item.filename.toLowerCase().includes(q),
    );
  }, [mediaItemsList, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />

      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Music & Audio</Text>
          <Text style={styles.headerSubtitle}>{audioItems.length} audio tracks</Text>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => scanMedia()}
          disabled={isScanning}
        >
          <Ionicons name="musical-note" size={18} color="#FFFFFF" style={styles.scanIcon} />
          <Text style={styles.scanButtonText}>Scan Audio</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#A0A0A8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search audio tracks..."
          placeholderTextColor="#A0A0A8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Track List */}
      <FlatList
        data={audioItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.trackCard}
            onPress={() => {
              useLibraryStore.getState().setQueue(audioItems, index);
              onSelectMedia(item);
            }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="musical-notes-outline" size={24} color="#5B8CFF" />
            </View>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {item.title || item.filename}
              </Text>
              <Text style={styles.trackSubtitle} numberOfLines={1}>
                {item.uri}
              </Text>
            </View>
            <Ionicons name="play-circle-outline" size={26} color="#5B8CFF" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0E10',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#F5F5F7',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#A0A0A8',
    fontSize: 13,
    marginTop: 2,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B8CFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanIcon: {
    marginRight: 6,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1D',
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 42,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F5F5F7',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161619',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(91, 140, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackTitle: {
    color: '#F5F5F7',
    fontSize: 15,
    fontWeight: '600',
  },
  trackSubtitle: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 3,
  },
});
