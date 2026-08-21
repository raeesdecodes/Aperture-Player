import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AudioLyricsModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export default function AudioLyricsModal({ visible, title, onClose }: AudioLyricsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="document-text" size={20} color="#00E676" style={styles.icon} />
              <Text style={styles.title} numberOfLines={1}>
                Lyrics & Transcript — {title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.lyricsHeader}>Live Lyrics Reader</Text>
            <Text style={styles.activeLine}>♪ Playing audio track... ♪</Text>
            <Text style={styles.normalLine}>Aperture Player — Ultra-fast, open-source audio engine</Text>
            <Text style={styles.normalLine}>Zero ads, zero tracking, GPLv3 licensed</Text>
            <Text style={styles.normalLine}>Enjoy high fidelity sound with 10-band equalizer</Text>
            <Text style={styles.normalLine}>Supports FLAC, MP3, AAC, OGG, Opus & WAV</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#161619',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    height: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  lyricsHeader: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  activeLine: {
    color: '#5B8CFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 12,
  },
  normalLine: {
    color: '#A0A0A8',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    lineHeight: 24,
  },
});
