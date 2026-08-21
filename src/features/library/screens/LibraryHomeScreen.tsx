import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLibraryStore } from '../../../store/useLibraryStore';
import MediaGridTile from '../components/MediaGridTile';
import ContinueWatchingRow from '../components/ContinueWatchingRow';
import { MediaItemSchema } from '../../../data/db/schema/mediaItems';

interface LibraryHomeScreenProps {
  onSelectMedia?: (mediaItem: MediaItemSchema) => void;
}

export default function LibraryHomeScreen({ onSelectMedia }: LibraryHomeScreenProps) {
  const {
    mediaItemsList,
    continueWatchingList,
    isScanning,
    permissionGranted,
    fetchLibrary,
    scanMedia,
  } = useLibraryStore();

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const handlePressMedia = (item: MediaItemSchema) => {
    if (onSelectMedia) {
      onSelectMedia(item);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Aperture Player</Text>
          <Text style={styles.headerSubtitle}>
            {mediaItemsList.length} {mediaItemsList.length === 1 ? 'file' : 'files'} in library
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => scanMedia()}
          disabled={isScanning}
          testID="scan-button"
        >
          {isScanning ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" style={styles.scanIcon} />
              <Text style={styles.scanButtonText}>Scan</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {!permissionGranted && (
        <View style={styles.permissionWarning}>
          <Ionicons name="alert-circle-outline" size={20} color="#FF7A59" />
          <Text style={styles.permissionText}>
            Media storage permission is required to list files.
          </Text>
        </View>
      )}

      {continueWatchingList.length > 0 && (
        <ContinueWatchingRow
          items={continueWatchingList}
          onPressItem={(row) => handlePressMedia(row.mediaItem)}
        />
      )}

      {mediaItemsList.length > 0 && <Text style={styles.allMediaTitle}>All Media</Text>}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="film-outline" size={64} color="rgba(255, 255, 255, 0.2)" />
      <Text style={styles.emptyTitle}>No Media Found</Text>
      <Text style={styles.emptySubtitle}>
        Tap the Scan button to search your device for videos and audio files.
      </Text>
      <TouchableOpacity style={styles.scanCtaButton} onPress={() => scanMedia()}>
        <Text style={styles.scanCtaText}>Scan Device Media</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />
      <FlatList
        data={mediaItemsList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isScanning ? renderEmptyState : null}
        columnWrapperStyle={mediaItemsList.length > 0 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MediaGridTile item={item} onPress={handlePressMedia} />
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
  listContent: {
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#F5F5F7',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
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
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 122, 89, 0.15)',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  permissionText: {
    color: '#FF7A59',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  allMediaTitle: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#A0A0A8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  scanCtaButton: {
    marginTop: 24,
    backgroundColor: '#5B8CFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  scanCtaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
