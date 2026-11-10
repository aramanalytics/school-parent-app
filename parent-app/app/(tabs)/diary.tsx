import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { getStudentHomework } from '../../src/services/parentData';
import { Clock, User, CheckCircle2 } from 'lucide-react-native';

export default function DiaryScreen() {
  const { selectedStudent, t } = useAuth();
  const homework = getStudentHomework(selectedStudent.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Profile Strip */}
      <View style={styles.studentStrip}>
        <Text style={styles.studentTitle}>{selectedStudent.name}</Text>
        <Text style={styles.studentMeta}>
          {selectedStudent.class_name} • {selectedStudent.section_name} • Academic Year 2026-2027
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Assigned Daily Tasks & Homework</Text>

      {homework.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t.diary.noHomework}</Text>
        </View>
      ) : (
        homework.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.subjectBadge}>
                <Text style={styles.subjectText}>{item.subject}</Text>
              </View>
              <View style={styles.dueRow}>
                <Clock size={12} color="#E03131" />
                <Text style={styles.dueText}>
                  {t.diary.due}: {item.due_date}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>

            <View style={styles.footer}>
              <View style={styles.teacherRow}>
                <User size={13} color="#3B5BDB" />
                <Text style={styles.teacherText}>
                  {t.diary.assignedBy}: {item.assigned_by}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending Review</Text>
              </View>
            </View>
          </View>
        ))
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
  studentStrip: {
    backgroundColor: '#172554',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  studentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentMeta: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectBadge: {
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectText: {
    color: '#3B5BDB',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    color: '#E03131',
    fontSize: 11,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 6,
  },
  desc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teacherText: {
    fontSize: 11,
    color: '#64748B',
  },
  statusBadge: {
    backgroundColor: '#FFF3BF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});

