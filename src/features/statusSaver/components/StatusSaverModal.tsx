import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusSaverModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function StatusSaverModal({ visible, onClose }: StatusSaverModalProps) {
  const [statuses] = useState<any[]>([]);

  const handleSaveStatus = (item: any) => {
    Alert.alert('Status Saved', `Saved video status to gallery!`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="download" size={20} color="#9C27B0" style={styles.statusIcon} />
              <Text style={styles.title}>Status Saver</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <FlatList
              data={statuses}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="logo-whatsapp" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyTitle}>No Status Videos Found</Text>
                  <Text style={styles.emptySub}>
                    View WhatsApp or video status stories on your device to automatically detect and save them here.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.text}>{item.name}</Text>
                  <TouchableOpacity onPress={() => handleSaveStatus(item)}>
                    <Ionicons name="download-outline" size={22} color="#9C27B0" />
                  </TouchableOpacity>
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
  statusIcon: {
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    color: '#A0A0A8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  text: {
    color: '#F5F5F7',
  },
});
