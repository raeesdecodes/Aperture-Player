import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLibraryStore } from '../../../store/useLibraryStore';
import MediaGridTile from '../components/MediaGridTile';
import ContinueWatchingRow from '../components/ContinueWatchingRow';
import QuickToolsBar from '../components/QuickToolsBar';
import PrivateVaultModal from '../../vault/components/PrivateVaultModal';
import NetworkStreamModal from '../../network/components/NetworkStreamModal';
import PlaylistManagerModal from '../../playlists/components/PlaylistManagerModal';
import StatusSaverModal from '../../statusSaver/components/StatusSaverModal';
import RecycleBinModal from '../../recycleBin/components/RecycleBinModal';
import { MediaItemSchema } from '../../../data/db/schema/mediaItems';

interface LibraryHomeScreenProps {
  onSelectMedia?: (mediaItem: MediaItemSchema) => void;
  onOpenSettings?: () => void;
  onOpenMusic?: () => void;
}

type SortBy = 'date' | 'name' | 'duration';

export default function LibraryHomeScreen({
  onSelectMedia,
  onOpenSettings,
  onOpenMusic,
}: LibraryHomeScreenProps) {
  const {
    mediaItemsList,
    continueWatchingList,
    isScanning,
    permissionGranted,
    fetchLibrary,
    scanMedia,
  } = useLibraryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  const [privateVaultVisible, setPrivateVaultVisible] = useState(false);
  const [urlStreamVisible, setUrlStreamVisible] = useState(false);
  const [playlistsVisible, setPlaylistsVisible] = useState(false);
  const [statusSaverVisible, setStatusSaverVisible] = useState(false);
  const [recycleBinVisible, setRecycleBinVisible] = useState(false);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const filteredAndSortedMedia = useMemo(() => {
    let result = [...mediaItemsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) || item.filename.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return (a.title || a.filename).localeCompare(b.title || b.filename);
      }
      if (sortBy === 'duration') {
        return (b.durationMs || 0) - (a.durationMs || 0);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return result;
  }, [mediaItemsList, searchQuery, sortBy]);

  const handlePressMedia = (item: MediaItemSchema) => {
    const index = filteredAndSortedMedia.findIndex((m) => m.id === item.id);
    useLibraryStore.getState().setQueue(filteredAndSortedMedia, index >= 0 ? index : 0);
    if (onSelectMedia) {
      onSelectMedia(item);
    }
  };

  const handlePlayNetworkStream = (url: string) => {
    const streamItem: MediaItemSchema = {
      id: `stream-${Date.now()}`,
      uri: url,
      filename: url,
      title: 'Network Stream',
      durationMs: 0,
      sizeBytes: 0,
      mimeType: 'video/*',
      thumbnailPath: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    if (onSelectMedia) {
      onSelectMedia(streamItem);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Aperture Player</Text>
          <Text style={styles.headerSubtitle}>
            {filteredAndSortedMedia.length} {filteredAndSortedMedia.length === 1 ? 'file' : 'files'} in library
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          {onOpenSettings && (
            <TouchableOpacity style={styles.settingsIconButton} onPress={onOpenSettings} testID="settings-button">
              <Ionicons name="settings-outline" size={22} color="#F5F5F7" />
            </TouchableOpacity>
          )}

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
      </View>

      {!permissionGranted && (
        <View style={styles.permissionWarning}>
          <Ionicons name="alert-circle-outline" size={20} color="#FF7A59" />
          <Text style={styles.permissionText}>
            Media storage permission is required to list files.
          </Text>
        </View>
      )}

      {/* Top Quick Tools Bar */}
      <QuickToolsBar
        onOpenMusic={onOpenMusic || (() => {})}
        onOpenPrivateVault={() => setPrivateVaultVisible(true)}
        onOpenUrlStream={() => setUrlStreamVisible(true)}
        onOpenPlaylists={() => setPlaylistsVisible(true)}
        onOpenStatusSaver={() => setStatusSaverVisible(true)}
        onOpenRecycleBin={() => setRecycleBinVisible(true)}
        onOpenFileBrowser={() => Alert.alert('Folders View', 'Showing local device folders.')}
        onOpenCloudDrive={() => Alert.alert('Cloud Drive', 'Connect your Cloud Drive account.')}
      />

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#A0A0A8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search media files..."
          placeholderTextColor="#A0A0A8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#A0A0A8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Chips */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['date', 'name', 'duration'] as SortBy[]).map((mode) => {
          const isSelected = sortBy === mode;
          return (
            <TouchableOpacity
              key={mode}
              style={[styles.sortChip, isSelected && styles.sortChipActive]}
              onPress={() => setSortBy(mode)}
            >
              <Text style={[styles.sortChipText, isSelected && styles.sortChipTextActive]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {continueWatchingList.length > 0 && (
        <ContinueWatchingRow
          items={continueWatchingList}
          onPressItem={(row) => handlePressMedia(row.mediaItem)}
        />
      )}

      {filteredAndSortedMedia.length > 0 && <Text style={styles.allMediaTitle}>All Media</Text>}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="film-outline" size={64} color="rgba(255, 255, 255, 0.2)" />
      <Text style={styles.emptyTitle}>No Media Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'No files matched your search filter.'
          : 'Tap the Scan button to search your device for videos and audio files.'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.scanCtaButton} onPress={() => scanMedia()}>
          <Text style={styles.scanCtaText}>Scan Device Media</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />
      <FlatList
        data={filteredAndSortedMedia}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isScanning ? renderEmptyState : null}
        columnWrapperStyle={filteredAndSortedMedia.length > 0 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <MediaGridTile item={item} onPress={handlePressMedia} />}
      />

      {/* Tool Modals */}
      <PrivateVaultModal
        visible={privateVaultVisible}
        onClose={() => setPrivateVaultVisible(false)}
      />

      <NetworkStreamModal
        visible={urlStreamVisible}
        onClose={() => setUrlStreamVisible(false)}
        onPlayStream={handlePlayNetworkStream}
      />

      <PlaylistManagerModal
        visible={playlistsVisible}
        onClose={() => setPlaylistsVisible(false)}
      />

      <StatusSaverModal
        visible={statusSaverVisible}
        onClose={() => setStatusSaverVisible(false)}
      />

      <RecycleBinModal
        visible={recycleBinVisible}
        onClose={() => setRecycleBinVisible(false)}
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
    paddingBottom: 10,
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
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIconButton: {
    padding: 8,
    marginRight: 8,
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
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  permissionText: {
    color: '#FF7A59',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1D',
    marginHorizontal: 16,
    marginBottom: 10,
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    color: '#A0A0A8',
    fontSize: 12,
    marginRight: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1A1A1D',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sortChipActive: {
    backgroundColor: 'rgba(91, 140, 255, 0.2)',
    borderColor: '#5B8CFF',
  },
  sortChipText: {
    color: '#A0A0A8',
    fontSize: 12,
  },
  sortChipTextActive: {
    color: '#5B8CFF',
    fontWeight: '700',
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
