import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import { getTimetableSchedule, TimetableSlot } from '../src/services/parentData';
import { Clock, Coffee, BookOpen } from 'lucide-react-native';

export default function TimetableScreen() {
  const { selectedStudent } = useAuth();
  const schedule = getTimetableSchedule();
  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday'>('Monday');

  const days: ('Monday' | 'Tuesday' | 'Wednesday')[] = ['Monday', 'Tuesday', 'Wednesday'];
  const daySlots: TimetableSlot[] = schedule[activeDay] || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Banner */}
      <View style={styles.studentBanner}>
        <Text style={styles.studentName}>{selectedStudent.name}</Text>
        <Text style={styles.studentClass}>
          {selectedStudent.class_name} • {selectedStudent.section_name}
        </Text>
      </View>

      {/* Day Tabs */}
      <View style={styles.dayTabsRow}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayTab, activeDay === day && styles.dayTabActive]}
            onPress={() => setActiveDay(day)}
          >
            <Text
              style={[
                styles.dayTabText,
                activeDay === day && styles.dayTabTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Slots List */}
      <View style={styles.slotsList}>
        {daySlots.map((slot, index) => {
          if (slot.is_break) {
            return (
              <View key={index} style={styles.breakCard}>
                <View style={styles.breakLeft}>
                  <Coffee size={16} color="#D97706" />
                  <Text style={styles.breakText}>{slot.subject}</Text>
                </View>
                <Text style={styles.breakTime}>{slot.time}</Text>
              </View>
            );
          }

          return (
            <View key={index} style={styles.periodCard}>
              <View style={styles.periodBadge}>
                <Text style={styles.periodNum}>P{slot.period}</Text>
              </View>

              <View style={styles.periodInfo}>
                <Text style={styles.subjectName}>{slot.subject}</Text>
                <Text style={styles.teacherName}>Faculty: {slot.teacher}</Text>
              </View>

              <View style={styles.timeBadge}>
                <Clock size={12} color="#64748B" />
                <Text style={styles.timeText}>{slot.time}</Text>
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
  dayTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  dayTabActive: {
    backgroundColor: '#3B5BDB',
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  slotsList: {
    gap: 10,
  },
  breakCard: {
    backgroundColor: '#FFF3BF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  breakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D97706',
  },
  breakTime: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  periodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  periodBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DBE4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B5BDB',
  },
  periodInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
  },
  teacherName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});

