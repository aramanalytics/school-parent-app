import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  User,
  Clock,
  FileSpreadsheet,
  BookOpen,
  ClipboardList,
  Calendar,
  MessageSquare,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Megaphone,
} from 'lucide-react-native';

export default function MoreScreen() {
  const router = useRouter();
  const { user, selectedStudent, signOut, t } = useAuth();

  const menuItems = [
    {
      label: t.more.studentProfile,
      icon: User,
      route: '/student-profile',
      color: '#3B5BDB',
      bg: '#DBE4FF',
    },
    {
      label: 'School Circulars & Notices',
      icon: Megaphone,
      route: '/notices',
      color: '#7E22CE',
      bg: '#F3E8FF',
    },
    {
      label: t.more.timetable,
      icon: Clock,
      route: '/timetable',
      color: '#D97706',
      bg: '#FFF3BF',
    },
    {
      label: t.more.examResults,
      icon: FileSpreadsheet,
      route: '/exam-results',
      color: '#16A36A',
      bg: '#D3F9D8',
    },
    {
      label: t.more.learningMaterials,
      icon: BookOpen,
      route: '/learning-materials',
      color: '#2563EB',
      bg: '#DBEAFE',
    },
    {
      label: t.more.onlineTests,
      icon: ClipboardList,
      route: '/online-tests',
      color: '#EA580C',
      bg: '#FFEDD5',
    },
    {
      label: t.more.schoolCalendar,
      icon: Calendar,
      route: '/school-calendar',
      color: '#4F46E5',
      bg: '#E0E7FF',
    },
    {
      label: t.more.parentFeedback,
      icon: MessageSquare,
      route: '/feedback',
      color: '#0D9488',
      bg: '#CCFBF1',
    },
    {
      label: t.more.notifications,
      icon: Bell,
      route: '/notifications',
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    {
      label: t.more.settings,
      icon: SettingsIcon,
      route: '/settings',
      color: '#475569',
      bg: '#F1F5F9',
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Parent Card Header */}
      <View style={styles.parentCard}>
        <View style={styles.parentAvatar}>
          <Text style={styles.parentInitial}>{user?.name?.[0] || 'P'}</Text>
        </View>
        <View style={styles.parentInfo}>
          <Text style={styles.parentName}>{user?.name || 'Ramesh Krishnan'}</Text>
          <Text style={styles.parentPhone}>{user?.phone || '+91 98840 11223'}</Text>
          <Text style={styles.parentChild}>
            Monitoring: {selectedStudent.name} ({selectedStudent.class_name} • {selectedStudent.section_name})
          </Text>
        </View>
      </View>

      {/* Menu Navigation List */}
      <Text style={styles.menuHeader}>All School Modules & Services</Text>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                <Icon size={18} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={16} color="#E03131" />
        <Text style={styles.logoutText}>{t.more.logout}</Text>
      </TouchableOpacity>

      <Text style={styles.versionFooter}>
        Sunrise School Parent Portal • Version 1.0.0
      </Text>
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
  parentCard: {
    backgroundColor: '#172554',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  parentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B5BDB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentInitial: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  parentInfo: {
    flex: 1,
  },
  parentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  parentPhone: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  parentChild: {
    color: '#5C7CFA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  menuHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
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
  },
  logoutText: {
    color: '#E03131',
    fontSize: 13,
    fontWeight: 'bold',
  },
  versionFooter: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 16,
  },
});

