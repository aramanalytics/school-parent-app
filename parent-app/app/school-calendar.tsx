import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getSchoolEvents } from '../src/services/parentData';
import { Calendar as CalendarIcon, Award, Flag } from 'lucide-react-native';

export default function SchoolCalendarScreen() {
  const events = getSchoolEvents();

  const getBadge = (type: string) => {
    switch (type) {
      case 'holiday':
        return { label: 'HOLIDAY', bg: '#FFE3E3', text: '#E03131' };
      case 'exam':
        return { label: 'EXAM', bg: '#FFF3BF', text: '#D97706' };
      default:
        return { label: 'EVENT', bg: '#DBE4FF', text: '#3B5BDB' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>School Academic Calendar 2026-2027</Text>

      {events.map((evt) => {
        const badge = getBadge(evt.type);
        return (
          <View key={evt.id} style={styles.card}>
            <View style={styles.iconBox}>
              <CalendarIcon size={18} color="#3B5BDB" />
            </View>

            <View style={styles.info}>
              <View style={styles.topRow}>
                <View style={[styles.pill, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.pillText, { color: badge.text }]}>
                    {badge.label}
                  </Text>
                </View>
                <Text style={styles.dates}>
                  {evt.start_date} {evt.end_date !== evt.start_date && `to ${evt.end_date}`}
                </Text>
              </View>

              <Text style={styles.title}>{evt.title}</Text>
              <Text style={styles.desc}>{evt.description}</Text>
            </View>
          </View>
        );
      })}
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
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 11,
    color: '#3B5BDB',
    fontWeight: '600',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 3,
  },
  desc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
});

