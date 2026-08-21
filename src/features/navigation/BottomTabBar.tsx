import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TabType = 'local' | 'music' | 'me';

interface BottomTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export default function BottomTabBar({ activeTab, onSelectTab }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('local')}
        testID="tab-local"
      >
        <Ionicons
          name={activeTab === 'local' ? 'folder' : 'folder-outline'}
          size={22}
          color={activeTab === 'local' ? '#5B8CFF' : '#A0A0A8'}
        />
        <Text style={[styles.tabLabel, activeTab === 'local' && styles.tabLabelActive]}>
          Local
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('music')}
        testID="tab-music"
      >
        <Ionicons
          name={activeTab === 'music' ? 'musical-notes' : 'musical-notes-outline'}
          size={22}
          color={activeTab === 'music' ? '#5B8CFF' : '#A0A0A8'}
        />
        <Text style={[styles.tabLabel, activeTab === 'music' && styles.tabLabelActive]}>
          Music
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('me')}
        testID="tab-me"
      >
        <Ionicons
          name={activeTab === 'me' ? 'person' : 'person-outline'}
          size={22}
          color={activeTab === 'me' ? '#5B8CFF' : '#A0A0A8'}
        />
        <Text style={[styles.tabLabel, activeTab === 'me' && styles.tabLabelActive]}>
          Me
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#161619',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabLabel: {
    color: '#A0A0A8',
    fontSize: 11,
    marginTop: 3,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#5B8CFF',
    fontWeight: '700',
  },
});
