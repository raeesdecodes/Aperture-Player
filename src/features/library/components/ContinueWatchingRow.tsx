import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WatchProgressItem } from '../../../store/useLibraryStore';

interface ContinueWatchingRowProps {
  items: WatchProgressItem[];
  onPressItem: (item: WatchProgressItem) => void;
}

export default function ContinueWatchingRow({ items, onPressItem }: ContinueWatchingRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Continue Watching</Text>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.mediaItem.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const progressLabel = `Resume watching ${item.mediaItem.title || item.mediaItem.filename}, ${Math.round(item.progressPercent)}% watched`;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onPressItem(item)}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={progressLabel}
              accessibilityHint="Double tap to resume video"
            >
            <View style={styles.thumbnailContainer}>
              {item.mediaItem.thumbnailPath ? (
                <Image source={{ uri: item.mediaItem.thumbnailPath }} style={styles.thumbnail} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="play-circle-outline" size={32} color="#5B8CFF" />
                </View>
              )}
              {/* Progress bar line */}
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${item.progressPercent}%` }]} />
              </View>
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {item.mediaItem.title || item.mediaItem.filename}
            </Text>
          </TouchableOpacity>
        );
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#1A1A1D',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  thumbnailContainer: {
    width: 160,
    height: 90,
    backgroundColor: '#0E0E10',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 140, 255, 0.1)',
  },
  progressBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B8CFF',
  },
  title: {
    color: '#F5F5F7',
    fontSize: 12,
    fontWeight: '500',
    padding: 8,
  },
});
