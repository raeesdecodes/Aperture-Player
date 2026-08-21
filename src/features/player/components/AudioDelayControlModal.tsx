import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../../../store/usePlayerStore';

interface AudioDelayControlModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AudioDelayControlModal({
  visible,
  onClose,
}: AudioDelayControlModalProps) {
  const { audioDelayMs, setAudioDelay } = usePlayerStore();

  const formattedDelay =
    audioDelayMs === 0
      ? '0 ms (Synced)'
      : audioDelayMs > 0
      ? `+${audioDelayMs} ms (Audio Lags)`
      : `${audioDelayMs} ms (Audio Leads)`;

  const adjustStep = (deltaMs: number) => {
    setAudioDelay(audioDelayMs + deltaMs);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Audio Sync Adjustment</Text>
              <Text style={styles.subtitle}>Fine-tune audio/video synchronization</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-audio-delay">
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          {/* Delay Readout Display */}
          <View style={styles.readoutBox}>
            <Ionicons name="time-outline" size={28} color="#5B8CFF" style={styles.readoutIcon} />
            <Text style={styles.readoutText}>{formattedDelay}</Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderSection}>
            <View style={styles.sliderLabels}>
              <Text style={styles.boundLabel}>-5000 ms</Text>
              <Text style={styles.boundLabel}>+5000 ms</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={-5000}
              maximumValue={5000}
              step={10}
              value={audioDelayMs}
              onValueChange={setAudioDelay}
              minimumTrackTintColor="#5B8CFF"
              maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              thumbTintColor="#FFFFFF"
              testID="audio-delay-slider"
            />
          </View>

          {/* Quick-Step Button Controls */}
          <View style={styles.stepButtonRow}>
            <TouchableOpacity style={styles.stepButton} onPress={() => adjustStep(-500)}>
              <Text style={styles.stepText}>-500 ms</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stepButton} onPress={() => adjustStep(-50)}>
              <Text style={styles.stepText}>-50 ms</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepButton, styles.resetButton]}
              onPress={() => setAudioDelay(0)}
              testID="reset-audio-delay"
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stepButton} onPress={() => adjustStep(50)}>
              <Text style={styles.stepText}>+50 ms</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stepButton} onPress={() => adjustStep(500)}>
              <Text style={styles.stepText}>+500 ms</Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  readoutBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E0E10',
    borderRadius: 14,
    paddingVertical: 14,
    marginVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  readoutIcon: {
    marginRight: 10,
  },
  readoutText: {
    color: '#5B8CFF',
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  sliderSection: {
    marginBottom: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  boundLabel: {
    color: '#A0A0A8',
    fontSize: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  stepButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 62,
    alignItems: 'center',
  },
  stepText: {
    color: '#F5F5F7',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'rgba(91, 140, 255, 0.2)',
    borderColor: '#5B8CFF',
    borderWidth: 1,
  },
  resetText: {
    color: '#5B8CFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
