import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useEqualizerStore } from '../../../store/useEqualizerStore';
import { EQUALIZER_FREQUENCIES, PRESET_LIST } from '../../../domain/types/equalizerPreset';

interface EqualizerScreenProps {
  onBack?: () => void;
}

export default function EqualizerScreen({ onBack }: EqualizerScreenProps) {
  const {
    isEnabled,
    bands,
    selectedPresetId,
    toggleEnabled,
    setBandGain,
    applyPreset,
    resetEqualizer,
  } = useEqualizerStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} testID="equalizer-back">
              <Ionicons name="arrow-back" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Audio Equalizer</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.enableLabel}>{isEnabled ? 'On' : 'Off'}</Text>
          <Switch
            value={isEnabled}
            onValueChange={toggleEnabled}
            trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#5B8CFF' }}
            thumbColor="#FFFFFF"
            testID="equalizer-enable-switch"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Preset Selector Chips */}
        <Text style={styles.sectionTitle}>Presets</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetChipRow}
        >
          {PRESET_LIST.map((preset) => {
            const isActive = selectedPresetId === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                style={[styles.presetChip, isActive && styles.presetChipActive]}
                onPress={() => applyPreset(preset.id)}
                disabled={!isEnabled}
                testID={`preset-${preset.id}`}
              >
                <Text style={[styles.presetChipText, isActive && styles.presetChipTextActive]}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          {selectedPresetId === 'custom' && (
            <View style={[styles.presetChip, styles.presetChipActive]}>
              <Text style={[styles.presetChipText, styles.presetChipTextActive]}>Custom</Text>
            </View>
          )}
        </ScrollView>

        {/* Reset Action */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetEqualizer}
            disabled={!isEnabled}
            testID="reset-equalizer-button"
          >
            <Ionicons name="refresh-outline" size={16} color="#5B8CFF" style={styles.resetIcon} />
            <Text style={styles.resetText}>Reset Bands</Text>
          </TouchableOpacity>
        </View>

        {/* 10-Band Sliders Grid */}
        <Text style={styles.sectionTitle}>Frequency Bands</Text>
        <View style={[styles.bandsContainer, !isEnabled && styles.disabledOpacity]}>
          {EQUALIZER_FREQUENCIES.map((freq, index) => {
            const gain = bands[index] ?? 0;
            const formattedGain = gain > 0 ? `+${gain}dB` : `${gain}dB`;

            return (
              <View key={freq} style={styles.bandColumn}>
                <Text style={styles.gainText}>{formattedGain}</Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={-12}
                    maximumValue={12}
                    step={1}
                    value={gain}
                    onValueChange={(val) => setBandGain(index, val)}
                    disabled={!isEnabled}
                    minimumTrackTintColor="#5B8CFF"
                    maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                    thumbTintColor="#FFFFFF"
                  />
                </View>
                <Text style={styles.freqText}>{freq}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#F5F5F7',
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  enableLabel: {
    color: '#A0A0A8',
    fontSize: 14,
    marginRight: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  presetChipRow: {
    paddingHorizontal: 20,
  },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1D',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetChipActive: {
    backgroundColor: '#5B8CFF',
    borderColor: '#5B8CFF',
  },
  presetChipText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '500',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(91, 140, 255, 0.12)',
  },
  resetIcon: {
    marginRight: 4,
  },
  resetText: {
    color: '#5B8CFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bandsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  disabledOpacity: {
    opacity: 0.4,
  },
  bandColumn: {
    marginBottom: 16,
    backgroundColor: '#1A1A1D',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  gainText: {
    color: '#5B8CFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  freqText: {
    color: '#F5F5F7',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
