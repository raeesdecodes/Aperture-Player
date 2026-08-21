import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaylistManagerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PlaylistManagerModal({ visible, onClose }: PlaylistManagerModalProps) {
  const [playlists, setPlaylists] = useState<{ id: string; name: string; count: number }[]>([
    { id: '1', name: 'Favorites', count: 0 },
    { id: '2', name: 'Watch Later', count: 0 },
  ]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    setPlaylists([
      ...playlists,
      { id: Date.now().toString(), name: newPlaylistName.trim(), count: 0 },
    ]);
    setNewPlaylistName('');
    setIsCreating(false);
    Alert.alert('Playlist Created', `Created playlist "${newPlaylistName.trim()}"`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="list" size={20} color="#FFB300" style={styles.listIcon} />
              <Text style={styles.title}>My Playlists</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isCreating ? (
              <View style={styles.createRow}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Playlist name..."
                  placeholderTextColor="#A0A0A8"
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                />
                <TouchableOpacity style={styles.addSaveButton} onPress={handleCreatePlaylist}>
                  <Text style={styles.addSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.createCta} onPress={() => setIsCreating(true)}>
                <Ionicons name="add-circle-outline" size={20} color="#FFB300" style={styles.addIcon} />
                <Text style={styles.createCtaText}>Create New Playlist</Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <View style={styles.playlistRow}>
                  <Ionicons name="musical-notes-outline" size={22} color="#FFB300" style={styles.rowIcon} />
                  <View style={styles.playlistTextContainer}>
                    <Text style={styles.playlistName}>{item.name}</Text>
                    <Text style={styles.playlistCount}>{item.count} items</Text>
                  </View>
                  <Ionicons name="play-circle-outline" size={24} color="#5B8CFF" />
                </View>
              )}
            />
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
    height: '75%',
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
  listIcon: {
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
    flex: 1,
    paddingTop: 16,
  },
  createCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  addIcon: {
    marginRight: 8,
  },
  createCtaText: {
    color: '#FFB300',
    fontWeight: '700',
    fontSize: 14,
  },
  createRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#0E0E10',
    color: '#F5F5F7',
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    fontSize: 14,
  },
  addSaveButton: {
    backgroundColor: '#FFB300',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },
  addSaveText: {
    color: '#000000',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 16,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E10',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  rowIcon: {
    marginRight: 12,
  },
  playlistTextContainer: {
    flex: 1,
  },
  playlistName: {
    color: '#F5F5F7',
    fontSize: 15,
    fontWeight: '600',
  },
  playlistCount: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 2,
  },
});
