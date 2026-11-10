import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { getSchoolNotices, NoticeItem } from '../src/services/parentData';
import { Megaphone, Calendar, FileText, Download, X } from 'lucide-react-native';

export default function NoticesScreen() {
  const notices = getSchoolNotices();
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const handleDownload = (fileName: string) => {
    Alert.alert(
      'Attachment Download',
      `File ${fileName} downloaded successfully to device Downloads.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Official School Circulars</Text>

      {notices.map((notice) => (
        <TouchableOpacity
          key={notice.id}
          style={styles.card}
          onPress={() => setSelectedNotice(notice)}
        >
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{notice.category}</Text>
            </View>
            <View style={styles.dateRow}>
              <Calendar size={12} color="#94A3B8" />
              <Text style={styles.dateText}>{notice.date}</Text>
            </View>
          </View>

          <Text style={styles.title}>{notice.title}</Text>
          <Text style={styles.previewContent} numberOfLines={2}>
            {notice.content}
          </Text>

          {notice.attachment && (
            <View style={styles.attachmentStrip}>
              <FileText size={14} color="#3B5BDB" />
              <Text style={styles.attachmentName}>{notice.attachment.name}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Detail Modal */}
      {selectedNotice && (
        <Modal
          visible={Boolean(selectedNotice)}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedNotice(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{selectedNotice.category}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedNotice(null)}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>{selectedNotice.title}</Text>
              <Text style={styles.modalDate}>Published on: {selectedNotice.date}</Text>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalContent}>{selectedNotice.content}</Text>

                {selectedNotice.attachment && (
                  <TouchableOpacity
                    style={styles.modalAttachmentBox}
                    onPress={() => handleDownload(selectedNotice.attachment!.name)}
                  >
                    <View style={styles.attachmentLeft}>
                      <FileText size={18} color="#3B5BDB" />
                      <Text style={styles.attachmentTitle}>
                        {selectedNotice.attachment.name}
                      </Text>
                    </View>
                    <Download size={16} color="#3B5BDB" />
                  </TouchableOpacity>
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedNotice(null)}
              >
                <Text style={styles.closeBtnText}>Close Circular</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  pageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B5BDB',
    textTransform: 'uppercase',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 6,
  },
  previewContent: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  attachmentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attachmentName: {
    fontSize: 11,
    color: '#3B5BDB',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 12,
  },
  modalBody: {
    marginVertical: 10,
  },
  modalContent: {
    fontSize: 13,
    color: '#172033',
    lineHeight: 20,
  },
  modalAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DBE4FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  attachmentTitle: {
    fontSize: 12,
    color: '#3B5BDB',
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: '#172554',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

