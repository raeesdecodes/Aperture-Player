import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MediaItemSchema } from '../../../data/db/schema/mediaItems';

interface MediaGridTileProps {
  item: MediaItemSchema;
  onPress: (item: MediaItemSchema) => void;
}

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const windowWidth = Dimensions.get('window').width;
const TILE_WIDTH = (windowWidth - 36) / 2;

export default function MediaGridTile({ item, onPress }: MediaGridTileProps) {
  const durationText = formatDuration(item.durationMs);
  const label = `Play video ${item.title || item.filename}, duration ${durationText}`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      testID="media-grid-tile"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Double tap to start video playback"
    >
      <View style={styles.thumbnailContainer}>
        {item.thumbnailPath ? (
          <Image source={{ uri: item.thumbnailPath }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="film-outline" size={36} color="#5B8CFF" />
          </View>
        )}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(item.durationMs)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title || item.filename}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TILE_WIDTH,
    marginBottom: 16,
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  thumbnailContainer: {
    width: '100%',
    height: TILE_WIDTH * 0.58,
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
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(14, 14, 16, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#F5F5F7',
    fontSize: 11,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  title: {
    color: '#F5F5F7',
    fontSize: 13,
    fontWeight: '500',
    padding: 10,
    lineHeight: 18,
  },
});
