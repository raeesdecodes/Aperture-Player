import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { useSubtitleStore } from '../../../store/useSubtitleStore';

interface PlayerMoreOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSubtitlesSearch: () => void;
  onOpenEqualizer: () => void;
  onOpenAudioDelay: () => void;
}

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0];

export default function PlayerMoreOptionsModal({
  visible,
  onClose,
  onOpenSubtitlesSearch,
  onOpenEqualizer,
  onOpenAudioDelay,
}: PlayerMoreOptionsModalProps) {
  const { playbackRate, setPlaybackRate } = usePlayerStore();
  const { setActiveSubtitleTrack } = useSubtitleStore();

  const handlePickLocalSubtitle = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setActiveSubtitleTrack({
          id: `custom-file-${Date.now()}`,
          name: file.name,
          type: 'local',
          uri: file.uri,
        });
        Alert.alert('Subtitle Loaded', `Applied subtitle: ${file.name}`);
        onClose();
      }
    } catch (err) {
      console.warn('Failed picking subtitle document:', err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Player Options</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-more-options">
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Playback Speed Section */}
            <Text style={styles.sectionTitle}>Playback Speed</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speedRow}>
              {SPEED_OPTIONS.map((rate) => {
                const isActive = playbackRate === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    style={[styles.speedChip, isActive && styles.speedChipActive]}
                    onPress={() => setPlaybackRate(rate)}
                    testID={`speed-${rate}`}
                  >
                    <Text style={[styles.speedText, isActive && styles.speedTextActive]}>
                      {rate}x
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.divider} />

            {/* Quick Feature Action Items */}
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                onClose();
                onOpenSubtitlesSearch();
              }}
              testID="option-subtitle-search"
            >
              <Ionicons name="search-outline" size={22} color="#5B8CFF" style={styles.rowIcon} />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Online Subtitles</Text>
                <Text style={styles.rowSubtitle}>Search & download from OpenSubtitles</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0A0A8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={handlePickLocalSubtitle} testID="option-pick-subtitle">
              <Ionicons name="document-text-outline" size={22} color="#5B8CFF" style={styles.rowIcon} />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Open Local Subtitle File</Text>
                <Text style={styles.rowSubtitle}>Pick .srt, .ass or .vtt from storage</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0A0A8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                onClose();
                onOpenEqualizer();
              }}
              testID="option-equalizer"
            >
              <Ionicons name="options-outline" size={22} color="#5B8CFF" style={styles.rowIcon} />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>10-Band Equalizer</Text>
                <Text style={styles.rowSubtitle}>Audio presets and frequency curves</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0A0A8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                onClose();
                onOpenAudioDelay();
              }}
              testID="option-audio-delay"
            >
              <Ionicons name="time-outline" size={22} color="#5B8CFF" style={styles.rowIcon} />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Audio Sync / Delay</Text>
                <Text style={styles.rowSubtitle}>Adjust audio timing ±5000ms</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0A0A8" />
            </TouchableOpacity>
          </ScrollView>
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
  sheetContent: {
    backgroundColor: '#1A1A1D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  sectionTitle: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  speedRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  speedChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#0E0E10',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  speedChipActive: {
    backgroundColor: '#5B8CFF',
    borderColor: '#5B8CFF',
  },
  speedText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '600',
  },
  speedTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  rowIcon: {
    marginRight: 14,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowTitle: {
    color: '#F5F5F7',
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 2,
  },
});
