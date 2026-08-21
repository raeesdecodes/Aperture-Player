import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../../../store/usePlayerStore';

interface AudioMoreOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenEqualizer: () => void;
}

const SLEEP_TIMER_OPTIONS = ['Off', '15m', '30m', '45m', '60m', '90m', 'End of Track'];
const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0];

export default function AudioMoreOptionsModal({
  visible,
  onClose,
  onOpenEqualizer,
}: AudioMoreOptionsModalProps) {
  const { playbackRate, setPlaybackRate } = usePlayerStore();
  const [selectedTimer, setSelectedTimer] = useState('Off');
  const [volumeBoost, setVolumeBoost] = useState(false);

  const handleSelectTimer = (timer: string) => {
    setSelectedTimer(timer);
    if (timer !== 'Off') {
      Alert.alert('Sleep Timer Set', `Playback will pause in ${timer} with smooth volume fade-out.`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Audio Options & Enhancements</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Playback Speed */}
            <Text style={styles.sectionTitle}>Audio Tempo / Speed</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {SPEED_OPTIONS.map((rate) => {
                const isActive = playbackRate === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => setPlaybackRate(rate)}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {rate}x
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.divider} />

            {/* Sleep Timer */}
            <Text style={styles.sectionTitle}>Fade-Out Sleep Timer</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {SLEEP_TIMER_OPTIONS.map((timer) => {
                const isActive = selectedTimer === timer;
                return (
                  <TouchableOpacity
                    key={timer}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => handleSelectTimer(timer)}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {timer}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.divider} />

            {/* Enhancements */}
            <Text style={styles.sectionTitle}>Sound Enhancements</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.rowTitle}>Volume Gain Boost</Text>
                <Text style={styles.rowSubtitle}>Digital sound normalizer for quiet recordings</Text>
              </View>
              <Switch
                value={volumeBoost}
                onValueChange={setVolumeBoost}
                thumbColor={volumeBoost ? '#5B8CFF' : '#A0A0A8'}
              />
            </View>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                onClose();
                onOpenEqualizer();
              }}
            >
              <Ionicons name="options-outline" size={22} color="#5B8CFF" style={styles.rowIcon} />
              <View style={styles.switchTextContainer}>
                <Text style={styles.rowTitle}>10-Band Audio Equalizer</Text>
                <Text style={styles.rowSubtitle}>Bass boost, vocal, rock, jazz presets</Text>
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#161619',
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
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#0E0E10',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipActive: {
    backgroundColor: '#5B8CFF',
    borderColor: '#5B8CFF',
  },
  chipText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  rowIcon: {
    marginRight: 14,
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
