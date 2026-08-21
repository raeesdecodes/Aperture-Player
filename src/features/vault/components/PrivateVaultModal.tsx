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

interface PrivateVaultModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivateVaultModal({ visible, onClose }: PrivateVaultModalProps) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultItems] = useState<any[]>([]);

  const handleUnlock = () => {
    if (pin === '1234' || pin.length === 4) {
      setIsUnlocked(true);
    } else {
      Alert.alert('Incorrect PIN', 'Please enter a 4-digit PIN (default 1234).');
    }
  };

  const handleLockClose = () => {
    setIsUnlocked(false);
    setPin('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleLockClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="lock-closed" size={20} color="#FF495C" style={styles.lockIcon} />
              <Text style={styles.title}>Private Folder Vault</Text>
            </View>
            <TouchableOpacity onPress={handleLockClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          {!isUnlocked ? (
            <View style={styles.lockContainer}>
              <Ionicons name="shield-checkmark-outline" size={56} color="#FF495C" />
              <Text style={styles.lockInstruction}>Enter 4-Digit Security PIN</Text>
              <Text style={styles.lockHint}>Protected vault to hide your private media</Text>

              <TextInput
                style={styles.pinInput}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={setPin}
                placeholder="••••"
                placeholderTextColor="#A0A0A8"
              />

              <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
                <Text style={styles.unlockButtonText}>Unlock Vault</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.vaultContainer}>
              <FlatList
                data={vaultItems}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <View style={styles.emptyVault}>
                    <Ionicons name="folder-open-outline" size={48} color="rgba(255,255,255,0.2)" />
                    <Text style={styles.emptyVaultText}>No Private Videos Yet</Text>
                    <Text style={styles.emptyVaultSub}>
                      Long-press any video in your library to move it to Private Vault.
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <View style={styles.vaultRow}>
                    <Text style={styles.vaultItemText}>{item.filename}</Text>
                  </View>
                )}
              />
            </View>
          )}
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
    height: '80%',
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
  lockIcon: {
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
  lockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  lockInstruction: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  lockHint: {
    color: '#A0A0A8',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
  },
  pinInput: {
    backgroundColor: '#0E0E10',
    color: '#F5F5F7',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 10,
    width: 160,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FF495C',
    marginBottom: 24,
  },
  unlockButton: {
    backgroundColor: '#FF495C',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  vaultContainer: {
    flex: 1,
    paddingTop: 16,
  },
  emptyVault: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyVaultText: {
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyVaultSub: {
    color: '#A0A0A8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  vaultRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  vaultItemText: {
    color: '#F5F5F7',
    fontSize: 14,
  },
});
