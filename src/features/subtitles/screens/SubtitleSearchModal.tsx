import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubtitleStore } from '../../../store/useSubtitleStore';
import { OpenSubtitleResultItem } from '../../../data/remote/openSubtitles/openSubtitlesTypes';

interface SubtitleSearchModalProps {
  visible: boolean;
  initialQuery?: string;
  onClose: () => void;
}

const LANGUAGES = [
  { label: 'All', code: '' },
  { label: 'English', code: 'en' },
  { label: 'Spanish', code: 'es' },
  { label: 'French', code: 'fr' },
  { label: 'German', code: 'de' },
];

export default function SubtitleSearchModal({
  visible,
  initialQuery = '',
  onClose,
}: SubtitleSearchModalProps) {
  const [queryText, setQueryText] = useState(initialQuery);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { searchResults, isSearching, isDownloading, searchOnline, downloadAndApply } =
    useSubtitleStore();

  useEffect(() => {
    if (visible && initialQuery) {
      setQueryText(initialQuery);
      searchOnline({ filename: initialQuery, language: selectedLanguage });
    }
  }, [visible, initialQuery]);

  const handleSearch = () => {
    if (!queryText.trim()) return;
    searchOnline({ filename: queryText.trim(), language: selectedLanguage });
  };

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    if (queryText.trim()) {
      searchOnline({ filename: queryText.trim(), language: langCode });
    }
  };

  const handleDownload = async (item: OpenSubtitleResultItem) => {
    setDownloadingId(item.fileId);
    try {
      await downloadAndApply(item.fileId);
      onClose();
    } finally {
      setDownloadingId(null);
    }
  };

  const renderResultItem = ({ item }: { item: OpenSubtitleResultItem }) => {
    const isLoadingThis = downloadingId === item.fileId && isDownloading;

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultInfo}>
          <Text style={styles.resultFileName} numberOfLines={2}>
            {item.fileName}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.langBadge}>
              <Text style={styles.langText}>{item.language.toUpperCase()}</Text>
            </View>
            <Text style={styles.metaText}>📥 {item.downloadCount}</Text>
            {item.rating > 0 && <Text style={styles.metaText}>⭐ {item.rating.toFixed(1)}</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(item)}
          disabled={isDownloading}
          testID={`download-sub-${item.fileId}`}
        >
          {isLoadingThis ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Search Online Subtitles</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-sub-modal">
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          {/* Search Input Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#A0A0A8" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              value={queryText}
              onChangeText={setQueryText}
              placeholder="Search movie or episode..."
              placeholderTextColor="#A0A0A8"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {queryText.length > 0 && (
              <TouchableOpacity onPress={() => setQueryText('')}>
                <Ionicons name="close-circle" size={18} color="#A0A0A8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Language Selection Chips */}
          <View style={styles.langChipRow}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langChip, isSelected && styles.langChipActive]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <Text style={[styles.langChipText, isSelected && styles.langChipTextActive]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Results List / Loading / Empty */}
          {isSearching ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#5B8CFF" />
              <Text style={styles.loadingText}>Searching OpenSubtitles...</Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.centerContainer}>
              <Ionicons name="document-text-outline" size={48} color="rgba(255, 255, 255, 0.2)" />
              <Text style={styles.emptyTitle}>No Subtitles Found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search keywords or language filter.
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderResultItem}
              contentContainerStyle={styles.listContent}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    backgroundColor: '#1A1A1D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E10',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#F5F5F7',
    fontSize: 15,
  },
  langChipRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
  },
  langChipActive: {
    backgroundColor: '#5B8CFF',
  },
  langChipText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '500',
  },
  langChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E0E10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  resultInfo: {
    flex: 1,
    marginRight: 12,
  },
  resultFileName: {
    color: '#F5F5F7',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langBadge: {
    backgroundColor: 'rgba(91, 140, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  langText: {
    color: '#5B8CFF',
    fontSize: 11,
    fontWeight: '700',
  },
  metaText: {
    color: '#A0A0A8',
    fontSize: 12,
    marginRight: 12,
  },
  downloadButton: {
    backgroundColor: '#5B8CFF',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: '#A0A0A8',
    fontSize: 14,
    marginTop: 12,
  },
  emptyTitle: {
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyText: {
    color: '#A0A0A8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
