import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../../store/useSettingsStore';

interface MeScreenProps {
  onOpenSettings: () => void;
  onOpenEqualizer: () => void;
}

export default function MeScreen({ onOpenSettings, onOpenEqualizer }: MeScreenProps) {
  const { theme, clearThumbnailCache } = useSettingsStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="film" size={32} color="#5B8CFF" />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>Aperture Player VIP</Text>
            <Text style={styles.profileStatus}>Open Source • Zero Ads • GPLv3</Text>
          </View>
        </View>

        {/* Feature Quick Controls */}
        <Text style={styles.sectionHeader}>Preferences & Tools</Text>

        <TouchableOpacity style={styles.menuRow} onPress={onOpenEqualizer}>
          <Ionicons name="options-outline" size={22} color="#5B8CFF" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>10-Band Equalizer</Text>
            <Text style={styles.menuSubtitle}>Custom audio presets & frequency gains</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0A0A8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={onOpenSettings}>
          <Ionicons name="settings-outline" size={22} color="#5B8CFF" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>App Settings</Text>
            <Text style={styles.menuSubtitle}>Theme: {theme.toUpperCase()} • Sensitivity</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0A0A8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={() => clearThumbnailCache()}>
          <Ionicons name="trash-outline" size={22} color="#FF7A59" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Clear Cache</Text>
            <Text style={styles.menuSubtitle}>Free up storage space</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#A0A0A8" />
        </TouchableOpacity>

        {/* About App */}
        <Text style={styles.sectionHeader}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Aperture Player v1.0.0</Text>
          <Text style={styles.aboutText}>
            Built with React Native, Expo, and VLC Media Engine. Licensed under GNU General Public
            License v3. No tracking, no ads, completely free forever.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0E10',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161619',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(91, 140, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '800',
  },
  profileStatus: {
    color: '#5B8CFF',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  sectionHeader: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161619',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#F5F5F7',
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 2,
  },
  aboutCard: {
    backgroundColor: '#161619',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  aboutTitle: {
    color: '#F5F5F7',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  aboutText: {
    color: '#A0A0A8',
    fontSize: 12,
    lineHeight: 18,
  },
});
