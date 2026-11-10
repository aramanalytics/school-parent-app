import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { Globe, Bell, Shield, LogOut, Check } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage, signOut, t } = useAuth();

  const [attendanceNotif, setAttendanceNotif] = useState(true);
  const [homeworkNotif, setHomeworkNotif] = useState(true);
  const [feeNotif, setFeeNotif] = useState(true);
  const [circularNotif, setCircularNotif] = useState(true);

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Language Section */}
      <Text style={styles.sectionTitle}>Language / மொழித் தேர்வு</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.langRow}
          onPress={() => setLanguage('en')}
        >
          <View>
            <Text style={styles.langMain}>English</Text>
            <Text style={styles.langSub}>Default system language</Text>
          </View>
          {language === 'en' && <Check size={18} color="#3B5BDB" />}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.langRow}
          onPress={() => setLanguage('ta')}
        >
          <View>
            <Text style={styles.langMain}>தமிழ் (Tamil)</Text>
            <Text style={styles.langSub}>தமிழ் இடைமுகம்</Text>
          </View>
          {language === 'ta' && <Check size={18} color="#3B5BDB" />}
        </TouchableOpacity>
      </View>

      {/* Notification Preferences */}
      <Text style={styles.sectionTitle}>Notification Preferences</Text>
      <View style={styles.card}>
        <View style={styles.prefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.prefTitle}>Daily Attendance SMS & Push</Text>
            <Text style={styles.prefDesc}>Instant alert when morning roll call is taken</Text>
          </View>
          <Switch
            value={attendanceNotif}
            onValueChange={setAttendanceNotif}
            trackColor={{ false: '#E2E8F0', true: '#3B5BDB' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.prefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.prefTitle}>Daily Diary & Homework Tasks</Text>
            <Text style={styles.prefDesc}>Alert when teacher assigns homework</Text>
          </View>
          <Switch
            value={homeworkNotif}
            onValueChange={setHomeworkNotif}
            trackColor={{ false: '#E2E8F0', true: '#3B5BDB' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.prefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.prefTitle}>Fee Reminders & Receipts</Text>
            <Text style={styles.prefDesc}>Due date alerts and payment receipts</Text>
          </View>
          <Switch
            value={feeNotif}
            onValueChange={setFeeNotif}
            trackColor={{ false: '#E2E8F0', true: '#3B5BDB' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.prefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.prefTitle}>Official School Circulars</Text>
            <Text style={styles.prefDesc}>Principal announcements and event dates</Text>
          </View>
          <Switch
            value={circularNotif}
            onValueChange={setCircularNotif}
            trackColor={{ false: '#E2E8F0', true: '#3B5BDB' }}
          />
        </View>
      </View>

      {/* App Info Card */}
      <Text style={styles.sectionTitle}>About Application</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>School</Text>
          <Text style={styles.infoValue}>Sunrise International School</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Application Version</Text>
          <Text style={styles.infoValue}>v1.0.0 (Production Release)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Backend Platform</Text>
          <Text style={styles.infoValue}>Supabase PostgreSQL with RLS</Text>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={16} color="#E03131" />
        <Text style={styles.logoutText}>{t.more.logout}</Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  langMain: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
  },
  langSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  prefDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#172033',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFE3E3',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFC9C9',
    marginTop: 8,
  },
  logoutText: {
    color: '#E03131',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

