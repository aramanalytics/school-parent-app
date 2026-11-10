import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import { User, Phone, MapPin, Calendar, Award } from 'lucide-react-native';

export default function StudentProfileScreen() {
  const { selectedStudent } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Badge Card */}
      <View style={styles.profileHero}>
        <Image source={{ uri: selectedStudent.photo_url }} style={styles.avatarLarge} />
        <Text style={styles.heroName}>{selectedStudent.name}</Text>
        <Text style={styles.heroAdm}>Adm No: {selectedStudent.admission_number}</Text>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>
            {selectedStudent.class_name} • {selectedStudent.section_name} • Roll: {selectedStudent.roll_number}
          </Text>
        </View>
      </View>

      {/* Academic Details */}
      <Text style={styles.sectionHeader}>Academic & Personal Details</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>{selectedStudent.date_of_birth}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{selectedStudent.gender}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Enrolled Grade</Text>
          <Text style={styles.infoValue}>{selectedStudent.class_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assigned Section</Text>
          <Text style={styles.infoValue}>{selectedStudent.section_name}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Academic Session</Text>
          <Text style={styles.infoValue}>2026 - 2027</Text>
        </View>
      </View>

      {/* Parent & Contact Information */}
      <Text style={styles.sectionHeader}>Guardian & Residential Address</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Father / Guardian</Text>
          <Text style={styles.infoValue}>{selectedStudent.father_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mother's Name</Text>
          <Text style={styles.infoValue}>{selectedStudent.mother_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Registered Mobile</Text>
          <Text style={styles.infoValue}>{selectedStudent.phone}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Home Address</Text>
          <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]}>
            {selectedStudent.address}
          </Text>
        </View>
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
  profileHero: {
    backgroundColor: '#172554',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#3B5BDB',
    marginBottom: 12,
  },
  heroName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroAdm: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#172033',
  },
});

