import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getLearningMaterials, LearningMaterialItem } from '../src/services/parentData';
import { FileText, Video, Music, Download } from 'lucide-react-native';

export default function LearningMaterialsScreen() {
  const materials = getLearningMaterials();
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = materials.filter((m) =>
    selectedType === 'all' ? true : m.type === selectedType
  );

  const handleDownload = (item: LearningMaterialItem) => {
    Alert.alert(
      'Download Resource',
      `Downloading "${item.file_name}" (${item.file_size}) to offline library.`,
      [{ text: 'OK' }]
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} color="#E03131" />;
      case 'video':
        return <Video size={20} color="#3B5BDB" />;
      case 'audio':
        return <Music size={20} color="#16A36A" />;
      default:
        return <FileText size={20} color="#64748B" />;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Subject Worksheets & Multimedia Lessons</Text>

      {/* Filter Tabs */}
      <View style={styles.filtersRow}>
        {['all', 'pdf', 'video', 'audio'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterChip, selectedType === t && styles.filterChipActive]}
            onPress={() => setSelectedType(t)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedType === t && styles.filterChipTextActive,
              ]}
            >
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.iconBox}>{getIcon(item.type)}</View>

            <View style={styles.info}>
              <Text style={styles.subjectTag}>{item.subject}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.file_size} • Uploaded by {item.uploaded_by} on {item.date}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => handleDownload(item)}
            >
              <Download size={16} color="#3B5BDB" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#3B5BDB',
    borderColor: '#3B5BDB',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  info: {
    flex: 1,
  },
  subjectTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B5BDB',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginTop: 2,
  },
  meta: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DBE4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

