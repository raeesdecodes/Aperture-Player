import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecycleBinModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RecycleBinModal({ visible, onClose }: RecycleBinModalProps) {
  const [deletedItems] = useState<any[]>([]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="trash-bin" size={20} color="#FF7043" style={styles.trashIcon} />
              <Text style={styles.title}>Recycle Bin</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <FlatList
              data={deletedItems}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="trash-outline" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyTitle}>Recycle Bin is Empty</Text>
                  <Text style={styles.emptySub}>
                    Deleted videos will remain in the Recycle Bin for 30 days before permanent removal.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.text}>{item.name}</Text>
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
  trashIcon: {
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  text: {
    color: '#F5F5F7',
  },
});
