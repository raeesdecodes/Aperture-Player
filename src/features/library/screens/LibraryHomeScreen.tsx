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
import MediaViewOptionsModal, {
  ViewFilterMode,
  LayoutType,
  SortField,
} from '../components/MediaViewOptionsModal';
import ImageViewerModal from '../../imageViewer/screens/ImageViewerModal';
import { MediaItemSchema } from '../../../data/db/schema/mediaItems';

interface LibraryHomeScreenProps {
  onSelectMedia?: (mediaItem: MediaItemSchema) => void;
  onOpenSettings?: () => void;
  onOpenMusic?: () => void;
}

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
  const [showSearchBar, setShowSearchBar] = useState(false);

  // View Options state
  const [viewFilterMode, setViewFilterMode] = useState<ViewFilterMode>('all');
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAscending, setSortAscending] = useState(false);
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const [displayLengthOnThumbnail, setDisplayLengthOnThumbnail] = useState(true);

  // Modal states
  const [viewOptionsVisible, setViewOptionsVisible] = useState(false);
  const [privateVaultVisible, setPrivateVaultVisible] = useState(false);
  const [urlStreamVisible, setUrlStreamVisible] = useState(false);
  const [playlistsVisible, setPlaylistsVisible] = useState(false);
  const [statusSaverVisible, setStatusSaverVisible] = useState(false);
  const [recycleBinVisible, setRecycleBinVisible] = useState(false);

  // Image viewer state
  const [selectedImage, setSelectedImage] = useState<MediaItemSchema | null>(null);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const filteredAndSortedMedia = useMemo(() => {
    let result = [...mediaItemsList];

    // Hidden files filter
    if (!showHiddenFiles) {
      result = result.filter((item) => !item.filename.startsWith('.'));
    }

    // View filter mode
    if (viewFilterMode === 'files') {
      result = result.filter((item) => !item.mimeType?.includes('folder'));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) || item.filename.toLowerCase().includes(q),
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = (a.title || a.filename).localeCompare(b.title || b.filename);
      } else if (sortField === 'duration') {
        comparison = (a.durationMs || 0) - (b.durationMs || 0);
      } else if (sortField === 'size') {
        comparison = (a.sizeBytes || 0) - (b.sizeBytes || 0);
      } else {
        // date
        comparison = (a.createdAt || 0) - (b.createdAt || 0);
      }
      return sortAscending ? comparison : -comparison;
    });

    return result;
  }, [mediaItemsList, searchQuery, viewFilterMode, sortField, sortAscending, showHiddenFiles]);

  const handlePressMedia = (item: MediaItemSchema) => {
    if (item.mimeType?.startsWith('image/')) {
      setSelectedImage(item);
      return;
    }

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
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Aperture Player</Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowSearchBar(!showSearchBar)}
            testID="search-toggle-button"
          >
            <Ionicons name="search-outline" size={22} color="#F5F5F7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setViewOptionsVisible(true)}
            testID="view-options-button"
          >
            <Ionicons name="options-outline" size={22} color="#F5F5F7" />
          </TouchableOpacity>

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
      {showSearchBar && (
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#A0A0A8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search media files, photos, audio..."
            placeholderTextColor="#A0A0A8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#A0A0A8" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {continueWatchingList.length > 0 && (
        <ContinueWatchingRow
          items={continueWatchingList}
          onPressItem={(row) => handlePressMedia(row.mediaItem)}
        />
      )}

      {filteredAndSortedMedia.length > 0 && (
        <View style={styles.sectionTitleRow}>
          <Text style={styles.allMediaTitle}>All Media Files</Text>
          <Text style={styles.mediaCountBadge}>{filteredAndSortedMedia.length}</Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="film-outline" size={64} color="rgba(255, 255, 255, 0.2)" />
      <Text style={styles.emptyTitle}>No Media Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'No files matched your search filter.'
          : 'Tap the Scan button to search your device for videos, photos, and audio files.'}
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
        key={layoutType}
        data={filteredAndSortedMedia}
        numColumns={layoutType === 'grid' ? 2 : 1}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isScanning ? renderEmptyState : null}
        columnWrapperStyle={
          layoutType === 'grid' && filteredAndSortedMedia.length > 0
            ? styles.columnWrapper
            : undefined
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <MediaGridTile item={item} onPress={handlePressMedia} />}
      />

      {/* View Options Modal */}
      <MediaViewOptionsModal
        visible={viewOptionsVisible}
        onClose={() => setViewOptionsVisible(false)}
        viewFilterMode={viewFilterMode}
        setViewFilterMode={setViewFilterMode}
        layoutType={layoutType}
        setLayoutType={setLayoutType}
        sortField={sortField}
        setSortField={setSortField}
        sortAscending={sortAscending}
        setSortAscending={setSortAscending}
        showHiddenFiles={showHiddenFiles}
        setShowHiddenFiles={setShowHiddenFiles}
        displayLengthOnThumbnail={displayLengthOnThumbnail}
        setDisplayLengthOnThumbnail={setDisplayLengthOnThumbnail}
      />

      {/* Photo Viewer Modal */}
      <ImageViewerModal
        visible={!!selectedImage}
        imageUri={selectedImage?.uri || null}
        title={selectedImage?.title || selectedImage?.filename}
        onClose={() => setSelectedImage(null)}
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
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: 8,
    marginRight: 6,
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
    marginBottom: 12,
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
    marginTop: 6,
  },
  allMediaTitle: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  mediaCountBadge: {
    color: '#5B8CFF',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: 'rgba(91, 140, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
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
