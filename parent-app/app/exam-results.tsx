import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import { getExamResults } from '../src/services/parentData';
import { Award, BookOpen, CheckCircle } from 'lucide-react-native';

export default function ExamResultsScreen() {
  const { selectedStudent } = useAuth();
  const results = getExamResults(selectedStudent.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Details */}
      <View style={styles.studentBanner}>
        <Text style={styles.studentName}>{selectedStudent.name}</Text>
        <Text style={styles.studentClass}>
          {selectedStudent.class_name} • {selectedStudent.section_name} • Adm: {selectedStudent.admission_number}
        </Text>
      </View>

      {results.map((res) => (
        <View key={res.id} style={styles.examCard}>
          <View style={styles.examHeader}>
            <View>
              <Text style={styles.examName}>{res.exam_name}</Text>
              <Text style={styles.examYear}>Academic Year {res.academic_year}</Text>
            </View>
            <View style={styles.overallGradeBadge}>
              <Text style={styles.overallGradeText}>{res.overall_grade}</Text>
              <Text style={styles.overallGradeLabel}>Overall</Text>
            </View>
          </View>

          {/* Aggregate KPI */}
          <View style={styles.summaryStrip}>
            <View style={styles.summaryCell}>
              <Text style={styles.summaryLabel}>Total Scored</Text>
              <Text style={styles.summaryValue}>
                {res.obtained_marks} / {res.total_marks}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCell}>
              <Text style={styles.summaryLabel}>Percentage</Text>
              <Text style={[styles.summaryValue, { color: '#16A36A' }]}>
                {res.percentage}%
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCell}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={[styles.summaryValue, { color: '#3B5BDB' }]}>Passed</Text>
            </View>
          </View>

          {/* Subject Breakdown Table */}
          <Text style={styles.tableTitle}>Subject Marks Breakdown</Text>
          <View style={styles.table}>
            {res.subjects.map((sub, idx) => (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  idx === res.subjects.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectTitle}>{sub.subject}</Text>
                  <Text style={styles.subjectRemarks}>{sub.remarks}</Text>
                </View>

                <View style={styles.scoreCol}>
                  <Text style={styles.marksText}>
                    {sub.obtained_marks} / {sub.max_marks}
                  </Text>
                  <View style={styles.gradePill}>
                    <Text style={styles.gradeText}>{sub.grade}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
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
  studentBanner: {
    backgroundColor: '#172554',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentClass: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  examName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172033',
  },
  examYear: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  overallGradeBadge: {
    backgroundColor: '#D3F9D8',
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B2F2BB',
  },
  overallGradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A36A',
  },
  overallGradeLabel: {
    fontSize: 8,
    color: '#16A36A',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginTop: 2,
  },
  tableTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  subjectTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  subjectRemarks: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scoreCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  marksText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#172033',
    fontFamily: 'monospace',
  },
  gradePill: {
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B5BDB',
  },
});

