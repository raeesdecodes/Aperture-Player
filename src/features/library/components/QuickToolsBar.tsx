import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickToolsBarProps {
  onOpenMusic: () => void;
  onOpenPrivateVault: () => void;
  onOpenUrlStream: () => void;
  onOpenPlaylists: () => void;
  onOpenStatusSaver: () => void;
  onOpenRecycleBin: () => void;
  onOpenFileBrowser: () => void;
  onOpenCloudDrive: () => void;
}

export default function QuickToolsBar({
  onOpenMusic,
  onOpenPrivateVault,
  onOpenUrlStream,
  onOpenPlaylists,
  onOpenStatusSaver,
  onOpenRecycleBin,
  onOpenFileBrowser,
  onOpenCloudDrive,
}: QuickToolsBarProps) {
  const tools = [
    {
      id: 'music',
      label: 'Music',
      icon: 'musical-notes-outline',
      color: '#5B8CFF',
      onPress: onOpenMusic,
    },
    {
      id: 'privacy',
      label: 'Private',
      icon: 'lock-closed-outline',
      color: '#FF495C',
      onPress: onOpenPrivateVault,
    },
    {
      id: 'stream',
      label: 'URL Stream',
      icon: 'link-outline',
      color: '#00E676',
      onPress: onOpenUrlStream,
    },
    {
      id: 'playlists',
      label: 'Playlists',
      icon: 'list-outline',
      color: '#FFB300',
      onPress: onOpenPlaylists,
    },
    {
      id: 'status',
      label: 'Status Saver',
      icon: 'download-outline',
      color: '#9C27B0',
      onPress: onOpenStatusSaver,
    },
    {
      id: 'recycle',
      label: 'Recycle Bin',
      icon: 'trash-bin-outline',
      color: '#FF7043',
      onPress: onOpenRecycleBin,
    },
    {
      id: 'files',
      label: 'Folders',
      icon: 'folder-open-outline',
      color: '#29B6F6',
      onPress: onOpenFileBrowser,
    },
    {
      id: 'cloud',
      label: 'Cloud Drive',
      icon: 'cloud-outline',
      color: '#AB47BC',
      onPress: onOpenCloudDrive,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolItem}
            onPress={tool.onPress}
            testID={`tool-${tool.id}`}
          >
            <View style={[styles.iconCircle, { backgroundColor: `${tool.color}1E` }]}>
              <Ionicons name={tool.icon as any} size={20} color={tool.color} />
            </View>
            <Text style={styles.toolLabel} numberOfLines={1}>
              {tool.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  toolItem: {
    alignItems: 'center',
    width: 68,
    marginHorizontal: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  toolLabel: {
    color: '#F5F5F7',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
