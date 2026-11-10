import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  getStudentAttendance,
  getSchoolNotices,
  getSchoolEvents,
  getStudentHomework,
} from '../../src/services/parentData';
import {
  Bell,
  CalendarCheck,
  Clock,
  FileSpreadsheet,
  BookOpen,
  ChevronDown,
  ArrowRight,
  Calendar,
  AlertCircle,
  FileText,
  User,
  CheckCircle2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const { user, selectedStudent, students, switchStudent, t } = useAuth();
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  // Dynamic student-dependent datasets
  const attendance = getStudentAttendance(selectedStudent.id);
  const notices = getSchoolNotices();
  const events = getSchoolEvents();
  const homework = getStudentHomework(selectedStudent.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.schoolLogoSmall}>
            <Text style={styles.schoolLogoChar}>S</Text>
          </View>
          <View>
            <Text style={styles.greetingText}>
              {t.greeting} {user?.name?.split(' ')[0] || 'Parent'}
            </Text>
            <Text style={styles.schoolTitle}>Sunrise International School</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.push('/notifications')}
        >
          <Bell size={18} color="#FFFFFF" />
          <View style={styles.unreadBadge} />
        </TouchableOpacity>
      </View>

      {/* Student Switcher & Profile Card */}
      <View style={styles.studentCard}>
        <View style={styles.studentTopRow}>
          <TouchableOpacity
            style={styles.studentSwitcherPill}
            onPress={() => setShowStudentMenu(!showStudentMenu)}
          >
            <Text style={styles.switcherLabel}>Active Child:</Text>
            <Text style={styles.switcherName}>{selectedStudent.name}</Text>
            <ChevronDown size={14} color="#3B5BDB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/student-profile')}
            style={styles.profileBadgeBtn}
          >
            <Text style={styles.profileBadgeText}>Bio Profile →</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu for Multi-child selection */}
        {showStudentMenu && (
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownTitle}>{t.switchStudent}</Text>
            {students.map((std) => (
              <TouchableOpacity
                key={std.id}
                style={[
                  styles.dropdownItem,
                  selectedStudent.id === std.id && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  switchStudent(std.id);
                  setShowStudentMenu(false);
                }}
              >
                <Image source={{ uri: std.photo_url }} style={styles.avatarTiny} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dropdownStudentName}>{std.name}</Text>
                  <Text style={styles.dropdownStudentClass}>
                    {std.class_name} • {std.section_name} • Adm: {std.admission_number}
                  </Text>
                </View>
                {selectedStudent.id === std.id && (
                  <CheckCircle2 size={16} color="#3B5BDB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Student Snapshot */}
        <View style={styles.snapshotRow}>
          <Image source={{ uri: selectedStudent.photo_url }} style={styles.studentAvatar} />
          <View style={styles.snapshotInfo}>
            <Text style={styles.studentName}>{selectedStudent.name}</Text>
            <Text style={styles.classInfo}>
              {selectedStudent.class_name} • {selectedStudent.section_name} (Roll No: {selectedStudent.roll_number})
            </Text>
            <Text style={styles.admissionNumber}>
              Admission No: {selectedStudent.admission_number}
            </Text>
          </View>
        </View>
      </View>

      {/* Attendance Summary Widget */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>{t.dashboard.attendanceSummary}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/attendance')}>
            <Text style={styles.viewAllText}>{t.dashboard.viewAll} →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.attendanceBox}>
          <View style={styles.attendanceLeft}>
            <Text style={styles.percentageText}>{attendance.summary.percentage}%</Text>
            <Text style={styles.percentageSub}>Present Rate</Text>
          </View>
          <View style={styles.attendanceDivider} />
          <View style={styles.attendanceStatsGrid}>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: '#16A36A' }]}>
                {attendance.summary.present_days}
              </Text>
              <Text style={styles.statLabel}>{t.dashboard.presentDays}</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: '#E03131' }]}>
                {attendance.summary.absent_days}
              </Text>
              <Text style={styles.statLabel}>{t.dashboard.absentDays}</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: '#F2A93B' }]}>
                {attendance.summary.late_days}
              </Text>
              <Text style={styles.statLabel}>{t.dashboard.lateArrivals}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Navigation Action Grid */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionHeading}>{t.dashboard.quickActions}</Text>
        <View style={styles.quickActionGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/timetable')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#DBE4FF' }]}>
              <Clock size={20} color="#3B5BDB" />
            </View>
            <Text style={styles.quickTitle}>{t.dashboard.timetable}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/exam-results')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#D3F9D8' }]}>
              <FileSpreadsheet size={20} color="#16A36A" />
            </View>
            <Text style={styles.quickTitle}>{t.dashboard.examResults}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(tabs)/fees')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#FFF3BF' }]}>
              <Text style={{ fontWeight: 'bold', color: '#D97706', fontSize: 16 }}>₹</Text>
            </View>
            <Text style={styles.quickTitle}>{t.dashboard.feeDetails}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/learning-materials')}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#F3E8FF' }]}>
              <BookOpen size={20} color="#7E22CE" />
            </View>
            <Text style={styles.quickTitle}>{t.dashboard.learningMaterials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notice Board & Circulars Preview */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>{t.dashboard.noticeBoard}</Text>
          <TouchableOpacity onPress={() => router.push('/notices')}>
            <Text style={styles.viewAllText}>{t.dashboard.viewAll} →</Text>
          </TouchableOpacity>
        </View>

        {notices.slice(0, 2).map((notice) => (
          <TouchableOpacity
            key={notice.id}
            style={styles.noticeCard}
            onPress={() => router.push('/notices')}
          >
            <View style={styles.noticeTopRow}>
              <Text style={styles.noticeCategory}>{notice.category}</Text>
              <Text style={styles.noticeDate}>{notice.date}</Text>
            </View>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeContent} numberOfLines={2}>
              {notice.content}
            </Text>
            {notice.attachment && (
              <View style={styles.attachmentBadge}>
                <FileText size={12} color="#3B5BDB" />
                <Text style={styles.attachmentName}>{notice.attachment.name}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Events / Calendar Preview */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>{t.dashboard.upcomingEvents}</Text>
          <TouchableOpacity onPress={() => router.push('/school-calendar')}>
            <Text style={styles.viewAllText}>{t.dashboard.viewAll} →</Text>
          </TouchableOpacity>
        </View>

        {events.slice(0, 2).map((evt) => (
          <View key={evt.id} style={styles.eventCard}>
            <View style={styles.eventDateBadge}>
              <Calendar size={16} color="#3B5BDB" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{evt.title}</Text>
              <Text style={styles.eventDate}>
                {evt.start_date} {evt.end_date !== evt.start_date && `to ${evt.end_date}`}
              </Text>
              <Text style={styles.eventDesc}>{evt.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Homework & Class Updates */}
      <View style={[styles.sectionBlock, { marginBottom: 30 }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>{t.dashboard.recentActivities}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/diary')}>
            <Text style={styles.viewAllText}>{t.dashboard.viewAll} →</Text>
          </TouchableOpacity>
        </View>

        {homework.slice(0, 2).map((hw) => (
          <View key={hw.id} style={styles.homeworkCard}>
            <View style={styles.homeworkSubjectPill}>
              <Text style={styles.homeworkSubjectText}>{hw.subject}</Text>
            </View>
            <Text style={styles.homeworkTitle}>{hw.title}</Text>
            <Text style={styles.homeworkDesc} numberOfLines={2}>
              {hw.description}
            </Text>
            <View style={styles.homeworkFooter}>
              <Text style={styles.homeworkDue}>Due: {hw.due_date}</Text>
              <Text style={styles.homeworkTeacher}>By {hw.assigned_by}</Text>
            </View>
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
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#172554',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  schoolLogoSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3B5BDB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolLogoChar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  schoolTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E03131',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  studentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  studentSwitcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBE4FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  switcherLabel: {
    fontSize: 10,
    color: '#3B5BDB',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  switcherName: {
    fontSize: 12,
    color: '#172033',
    fontWeight: 'bold',
  },
  profileBadgeBtn: {
    paddingVertical: 4,
  },
  profileBadgeText: {
    fontSize: 11,
    color: '#3B5BDB',
    fontWeight: '700',
  },
  dropdownMenu: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#DBE4FF',
  },
  avatarTiny: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  dropdownStudentName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#172033',
  },
  dropdownStudentClass: {
    fontSize: 10,
    color: '#64748B',
  },
  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  studentAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#3B5BDB',
  },
  snapshotInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172033',
  },
  classInfo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  admissionNumber: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionBlock: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172033',
  },
  viewAllText: {
    fontSize: 12,
    color: '#3B5BDB',
    fontWeight: '700',
  },
  attendanceBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attendanceLeft: {
    alignItems: 'center',
    paddingRight: 16,
  },
  percentageText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#16A36A',
  },
  percentageSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  attendanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  attendanceStatsGrid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 8,
  },
  statCell: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  quickActionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#172033',
    textAlign: 'center',
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noticeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  noticeCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B5BDB',
    textTransform: 'uppercase',
  },
  noticeDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 4,
  },
  noticeContent: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'flex-start',
  },
  attachmentName: {
    fontSize: 10,
    color: '#3B5BDB',
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eventDateBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DBE4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
  },
  eventDate: {
    fontSize: 11,
    color: '#3B5BDB',
    fontWeight: '600',
    marginTop: 2,
  },
  eventDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  homeworkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  homeworkSubjectPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  homeworkSubjectText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B5BDB',
    textTransform: 'uppercase',
  },
  homeworkTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 4,
  },
  homeworkDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  homeworkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  homeworkDue: {
    fontSize: 11,
    color: '#E03131',
    fontWeight: '600',
  },
  homeworkTeacher: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
