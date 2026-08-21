import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { AppTheme } from '../../../domain/types/settings';

interface SettingsScreenProps {
  onBack?: () => void;
}

const THEME_OPTIONS: Array<{ id: AppTheme; label: string; color: string }> = [
  { id: 'dark', label: 'Dark', color: '#0E0E10' },
  { id: 'amoled', label: 'AMOLED', color: '#000000' },
  { id: 'light', label: 'Light', color: '#F5F5F7' },
  { id: 'system', label: 'System', color: '#1A1A1D' },
];

const SUBTITLE_LANGUAGES = [
  { label: 'English', code: 'en' },
  { label: 'Spanish', code: 'es' },
  { label: 'French', code: 'fr' },
  { label: 'German', code: 'de' },
  { label: 'Japanese', code: 'ja' },
];

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const {
    theme,
    gestureSensitivity,
    defaultSubtitleLanguage,
    autoAdvanceFolder,
    setTheme,
    setGestureSensitivity,
    setDefaultSubtitleLanguage,
    toggleAutoAdvanceFolder,
    clearThumbnailCache,
  } = useSettingsStore();

  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearThumbnailCache();
      Alert.alert('Cache Cleared', 'Thumbnail cache cleared successfully.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} testID="settings-back">
              <Ionicons name="arrow-back" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Appearance & Theme */}
        <Text style={styles.sectionHeader}>Appearance</Text>
        <View style={styles.card}>
          <Text style={styles.settingLabel}>Theme Mode</Text>
          <View style={styles.themeGrid}>
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.themeChip, isSelected && styles.themeChipSelected]}
                  onPress={() => setTheme(opt.id)}
                  testID={`theme-${opt.id}`}
                >
                  <View style={[styles.colorPreview, { backgroundColor: opt.color }]} />
                  <Text style={[styles.themeText, isSelected && styles.themeTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Gestures & Playback */}
        <Text style={styles.sectionHeader}>Playback & Gestures</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Gesture Sensitivity</Text>
              <Text style={styles.settingSubtext}>Adjust brightness and volume swipe speed</Text>
            </View>
            <Text style={styles.valueReadout}>{gestureSensitivity.toFixed(1)}x</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={gestureSensitivity}
            onValueChange={setGestureSensitivity}
            minimumTrackTintColor="#5B8CFF"
            maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
            thumbTintColor="#FFFFFF"
            testID="gesture-sensitivity-slider"
          />

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Folder Auto-Advance</Text>
              <Text style={styles.settingSubtext}>Automatically play next file in folder</Text>
            </View>
            <Switch
              value={autoAdvanceFolder}
              onValueChange={toggleAutoAdvanceFolder}
              trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#5B8CFF' }}
              thumbColor="#FFFFFF"
              testID="auto-advance-switch"
            />
          </View>
        </View>

        {/* Section 3: Subtitles */}
        <Text style={styles.sectionHeader}>Subtitles</Text>
        <View style={styles.card}>
          <Text style={styles.settingLabel}>Default Subtitle Language</Text>
          <View style={styles.langRow}>
            {SUBTITLE_LANGUAGES.map((lang) => {
              const isSelected = defaultSubtitleLanguage === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langChip, isSelected && styles.langChipSelected]}
                  onPress={() => setDefaultSubtitleLanguage(lang.code)}
                  testID={`sub-lang-${lang.code}`}
                >
                  <Text style={[styles.langChipText, isSelected && styles.langChipTextSelected]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 4: Cache Management */}
        <Text style={styles.sectionHeader}>Storage & Cache</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Thumbnail Cache</Text>
              <Text style={styles.settingSubtext}>Clear generated video frame thumbnails</Text>
            </View>
            <TouchableOpacity
              style={styles.clearCacheButton}
              onPress={handleClearCache}
              disabled={isClearing}
              testID="clear-cache-button"
            >
              {isClearing ? (
                <ActivityIndicator size="small" color="#FF7A59" />
              ) : (
                <Text style={styles.clearCacheText}>Clear Cache</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 5: About & License */}
        <Text style={styles.sectionHeader}>About</Text>
        <View style={styles.card}>
          <Text style={styles.appTitle}>Aperture Player</Text>
          <Text style={styles.appMeta}>Version 1.0.0 (Build 1)</Text>
          <Text style={styles.licenseText}>License: GNU General Public License v3.0 (GPLv3)</Text>
          <Text style={styles.footerNote}>
            Free and open-source forever. No ads, no analytics, no tracking.
          </Text>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: '#5B8CFF',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#1A1A1D',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextGroup: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    color: '#F5F5F7',
    fontSize: 15,
    fontWeight: '600',
  },
  settingSubtext: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 2,
  },
  valueReadout: {
    color: '#5B8CFF',
    fontSize: 14,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 14,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#0E0E10',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  themeChipSelected: {
    borderColor: '#5B8CFF',
    backgroundColor: 'rgba(91, 140, 255, 0.15)',
  },
  colorPreview: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '500',
  },
  themeTextSelected: {
    color: '#5B8CFF',
    fontWeight: '700',
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0E0E10',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  langChipSelected: {
    backgroundColor: '#5B8CFF',
    borderColor: '#5B8CFF',
  },
  langChipText: {
    color: '#A0A0A8',
    fontSize: 13,
  },
  langChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  clearCacheButton: {
    backgroundColor: 'rgba(255, 122, 89, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 89, 0.3)',
  },
  clearCacheText: {
    color: '#FF7A59',
    fontSize: 13,
    fontWeight: '600',
  },
  appTitle: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '800',
  },
  appMeta: {
    color: '#A0A0A8',
    fontSize: 13,
    marginTop: 2,
  },
  licenseText: {
    color: '#5B8CFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  footerNote: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
