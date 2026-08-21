import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NetworkStreamModalProps {
  visible: boolean;
  onClose: () => void;
  onPlayStream: (url: string) => void;
}

export default function NetworkStreamModal({
  visible,
  onClose,
  onPlayStream,
}: NetworkStreamModalProps) {
  const [streamUrl, setStreamUrl] = useState('');

  const handlePlay = () => {
    if (!streamUrl.trim()) {
      Alert.alert('Invalid URL', 'Please enter a valid video stream URL.');
      return;
    }
    onPlayStream(streamUrl.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="link" size={20} color="#00E676" style={styles.linkIcon} />
              <Text style={styles.title}>Network URL Stream</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.instruction}>Enter HTTP, HLS (.m3u8), or RTSP stream link:</Text>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com/live/stream.m3u8"
              placeholderTextColor="#A0A0A8"
              value={streamUrl}
              onChangeText={setStreamUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
              <Ionicons name="play" size={18} color="#000000" style={styles.playIcon} />
              <Text style={styles.playButtonText}>Start Network Playback</Text>
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
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#161619',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
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
  },
  linkIcon: {
    marginRight: 8,
  },
  title: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingVertical: 20,
  },
  instruction: {
    color: '#A0A0A8',
    fontSize: 13,
    marginBottom: 12,
  },
  urlInput: {
    backgroundColor: '#0E0E10',
    color: '#F5F5F7',
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#00E676',
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    marginRight: 6,
  },
  playButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 15,
  },
});
