import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ViewFilterMode = 'all' | 'files' | 'folders';
export type LayoutType = 'grid' | 'list';
export type SortField = 'name' | 'date' | 'duration' | 'size' | 'resolution';

interface MediaViewOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  viewFilterMode: ViewFilterMode;
  setViewFilterMode: (mode: ViewFilterMode) => void;
  layoutType: LayoutType;
  setLayoutType: (layout: LayoutType) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortAscending: boolean;
  setSortAscending: (asc: boolean) => void;
  showHiddenFiles: boolean;
  setShowHiddenFiles: (show: boolean) => void;
  displayLengthOnThumbnail: boolean;
  setDisplayLengthOnThumbnail: (display: boolean) => void;
}

export default function MediaViewOptionsModal({
  visible,
  onClose,
  viewFilterMode,
  setViewFilterMode,
  layoutType,
  setLayoutType,
  sortField,
  setSortField,
  sortAscending,
  setSortAscending,
  showHiddenFiles,
  setShowHiddenFiles,
  displayLengthOnThumbnail,
  setDisplayLengthOnThumbnail,
}: MediaViewOptionsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>View & Sort Options</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#F5F5F7" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* View Mode Section */}
            <Text style={styles.sectionTitle}>View Mode</Text>
            <View style={styles.chipRow}>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'files', label: 'Files Only' },
                { id: 'folders', label: 'Folders Only' },
              ].map((item) => {
                const active = viewFilterMode === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setViewFilterMode(item.id as ViewFilterMode)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Layout Style */}
            <Text style={styles.sectionTitle}>Layout Style</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.chip, layoutType === 'grid' && styles.chipActive]}
                onPress={() => setLayoutType('grid')}
              >
                <Ionicons
                  name="grid-outline"
                  size={16}
                  color={layoutType === 'grid' ? '#FFFFFF' : '#A0A0A8'}
                  style={styles.chipIcon}
                />
                <Text style={[styles.chipText, layoutType === 'grid' && styles.chipTextActive]}>
                  Grid View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, layoutType === 'list' && styles.chipActive]}
                onPress={() => setLayoutType('list')}
              >
                <Ionicons
                  name="list-outline"
                  size={16}
                  color={layoutType === 'list' ? '#FFFFFF' : '#A0A0A8'}
                  style={styles.chipIcon}
                />
                <Text style={[styles.chipText, layoutType === 'list' && styles.chipTextActive]}>
                  List View
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Sort Criteria */}
            <Text style={styles.sectionTitle}>Sort Criteria</Text>
            {[
              { id: 'name', label: 'Title / Name (A–Z)' },
              { id: 'date', label: 'Date Added' },
              { id: 'duration', label: 'Duration / Length' },
              { id: 'size', label: 'File Size' },
              { id: 'resolution', label: 'Resolution' },
            ].map((item) => {
              const active = sortField === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionRow}
                  onPress={() => setSortField(item.id as SortField)}
                >
                  <Text style={styles.rowTitle}>{item.label}</Text>
                  {active && <Ionicons name="checkmark" size={20} color="#5B8CFF" />}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => setSortAscending(!sortAscending)}
            >
              <Text style={styles.rowTitle}>Sort Direction</Text>
              <Text style={styles.directionText}>
                {sortAscending ? 'Ascending (A → Z)' : 'Descending (Z → A)'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Advanced Display Toggles */}
            <Text style={styles.sectionTitle}>Advanced Settings</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.rowTitle}>Display Length Over Thumbnail</Text>
                <Text style={styles.rowSubtitle}>Show video duration badge on media tile</Text>
              </View>
              <Switch
                value={displayLengthOnThumbnail}
                onValueChange={setDisplayLengthOnThumbnail}
                thumbColor={displayLengthOnThumbnail ? '#5B8CFF' : '#A0A0A8'}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.rowTitle}>Show Hidden Files & Folders</Text>
                <Text style={styles.rowSubtitle}>Scan hidden .nomedia files & folders</Text>
              </View>
              <Switch
                value={showHiddenFiles}
                onValueChange={setShowHiddenFiles}
                thumbColor={showHiddenFiles ? '#5B8CFF' : '#A0A0A8'}
              />
            </View>
          </ScrollView>
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
    maxHeight: '82%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    color: '#F5F5F7',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  sectionTitle: {
    color: '#A0A0A8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#0E0E10',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipActive: {
    backgroundColor: '#5B8CFF',
    borderColor: '#5B8CFF',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    color: '#A0A0A8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  rowTitle: {
    color: '#F5F5F7',
    fontSize: 14,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: '#A0A0A8',
    fontSize: 12,
    marginTop: 2,
  },
  directionText: {
    color: '#5B8CFF',
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 10,
  },
});
