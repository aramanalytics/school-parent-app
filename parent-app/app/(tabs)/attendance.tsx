import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { getStudentAttendance } from '../../src/services/parentData';
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon } from 'lucide-react-native';

export default function AttendanceScreen() {
  const { selectedStudent, t } = useAuth();
  const attendance = getStudentAttendance(selectedStudent.id);
  const [selectedMonth, setSelectedMonth] = useState('November 2026');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#16A36A';
      case 'absent':
        return '#E03131';
      case 'late':
        return '#F2A93B';
      default:
        return '#94A3B8';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return { label: t.attendance.present, bg: '#D3F9D8', text: '#16A36A' };
      case 'absent':
        return { label: t.attendance.absent, bg: '#FFE3E3', text: '#E03131' };
      case 'late':
        return { label: t.attendance.late, bg: '#FFF3BF', text: '#D97706' };
      default:
        return { label: t.attendance.holiday, bg: '#F1F5F9', text: '#64748B' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Banner */}
      <View style={styles.studentHeader}>
        <Text style={styles.studentName}>{selectedStudent.name}</Text>
        <Text style={styles.studentClass}>
          {selectedStudent.class_name} • {selectedStudent.section_name} • Roll No: {selectedStudent.roll_number}
        </Text>
      </View>

      {/* Monthly Rate KPI Card */}
      <View style={styles.rateCard}>
        <View style={styles.rateHeader}>
          <Text style={styles.rateTitle}>{t.attendance.monthlyPercentage}</Text>
          <Text style={styles.monthBadge}>{selectedMonth}</Text>
        </View>

        <View style={styles.rateRow}>
          <Text style={styles.ratePercent}>{attendance.summary.percentage}%</Text>
          <View style={styles.rateBreakdown}>
            <Text style={styles.breakdownItem}>
              • Total School Days: {attendance.summary.total_working_days}
            </Text>
            <Text style={[styles.breakdownItem, { color: '#16A36A' }]}>
              • Days Present: {attendance.summary.present_days}
            </Text>
            <Text style={[styles.breakdownItem, { color: '#E03131' }]}>
              • Days Absent: {attendance.summary.absent_days}
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#16A36A' }]} />
            <Text style={styles.legendText}>{t.attendance.present}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#E03131' }]} />
            <Text style={styles.legendText}>{t.attendance.absent}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#F2A93B' }]} />
            <Text style={styles.legendText}>{t.attendance.late}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#94A3B8' }]} />
            <Text style={styles.legendText}>{t.attendance.holiday}</Text>
          </View>
        </View>
      </View>

      {/* Attendance History List */}
      <Text style={styles.sectionHeading}>Daily Attendance Register</Text>
      <View style={styles.listCard}>
        {attendance.records.map((rec, idx) => {
          const badge = getStatusBadge(rec.status);
          return (
            <View
              key={idx}
              style={[
                styles.recordRow,
                idx === attendance.records.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.recordLeft}>
                <View
                  style={[
                    styles.statusPillIndicator,
                    { backgroundColor: getStatusColor(rec.status) },
                  ]}
                />
                <View>
                  <Text style={styles.dateText}>{rec.date}</Text>
                  <Text style={styles.dayText}>{rec.day}</Text>
                  {Boolean(rec.remarks) && (
                    <Text style={styles.remarksText}>Note: {rec.remarks}</Text>
                  )}
                </View>
              </View>

              <View style={[styles.badgePill, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>
                  {badge.label}
                </Text>
              </View>
            </View>
          );
        })}
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
  studentHeader: {
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
  rateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rateTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  monthBadge: {
    fontSize: 11,
    color: '#3B5BDB',
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '700',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 8,
  },
  ratePercent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#16A36A',
  },
  rateBreakdown: {
    flex: 1,
    gap: 4,
  },
  breakdownItem: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  statusPillIndicator: {
    width: 4,
    height: 34,
    borderRadius: 2,
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  dayText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  remarksText: {
    fontSize: 11,
    color: '#D97706',
    marginTop: 2,
    fontStyle: 'italic',
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

