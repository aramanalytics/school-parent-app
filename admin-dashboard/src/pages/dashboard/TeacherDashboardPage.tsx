import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  NotebookPen,
  CalendarCheck,
  ClipboardList,
  BookOpen,
  Megaphone,
  Bell,
  ArrowRight,
  FileCheck,
  Plus,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function TeacherDashboardPage() {
  const { userRole } = useAuth();
  const [stats, setStats] = useState({
    assignedClasses: 2,
    totalAssignedStudents: 62,
    todaysClasses: 4,
    attendanceCompleted: 1,
    pendingAttendance: 1,
    homeworkAssigned: 2,
    upcomingExaminations: 2,
  });

  useEffect(() => {
    async function fetchTeacherData() {
      if (!isSupabaseConfigured) return;
      try {
        if (userRole?.teacher_id) {
          const { count: classesCount } = await supabase
            .from('teacher_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('teacher_id', userRole.teacher_id);

          setStats((prev) => ({
            ...prev,
            assignedClasses: classesCount || 2,
          }));
        }
      } catch (err) {
        console.error('Teacher stats load error:', err);
      }
    }

    fetchTeacherData();
  }, [userRole]);

  const teacherScheduleToday = [
    { period: 'Period 1 (09:00 - 09:45)', subject: 'Mathematics', classSection: 'Class 5-A', room: 'Room 204', status: 'Completed' },
    { period: 'Period 2 (09:45 - 10:30)', subject: 'Science', classSection: 'Class 5-A', room: 'Lab 1', status: 'Completed' },
    { period: 'Period 4 (10:45 - 11:30)', subject: 'Mathematics', classSection: 'Class 6-A', room: 'Room 302', status: 'Upcoming' },
    { period: 'Period 6 (13:00 - 13:45)', subject: 'Science Practical', classSection: 'Class 5-B', room: 'Lab 2', status: 'Upcoming' },
  ];

  const recentHomework = [
    { title: 'Fractions Worksheet Chapter 4', subject: 'Mathematics', classSection: 'Class 5-A', due: 'Tomorrow', submissions: '28/32' },
    { title: 'Plant Cells & Chloroplast Diagram', subject: 'Science', classSection: 'Class 5-A', due: 'Friday', submissions: '14/32' },
  ];

  const performanceBreakdown = [
    { subject: 'Class 5-A Math', avgMarks: 82, passRate: 96 },
    { subject: 'Class 5-A Science', avgMarks: 78, passRate: 92 },
    { subject: 'Class 6-A Math', avgMarks: 74, passRate: 88 },
  ];

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm mb-3">
              <GraduationCap size={14} className="text-emerald-400" />
              <span>Assigned Faculty Workspace • RLS Class-Scoped</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {userRole?.full_name || 'M. Saravanan (Teacher)'}
            </h1>
            <p className="text-xs text-white/80 mt-1">
              Class Teacher: Class 5 Section A • Subjects: Mathematics & Science • Sunrise Matriculation
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/attendance">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                <CalendarCheck size={14} className="mr-1.5" /> Mark Today's Attendance
              </Button>
            </Link>
            <Link to="/diary">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Plus size={14} className="mr-1.5" /> Assign Homework
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 7 Required Teacher KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard
          title="Assigned Classes"
          value={stats.assignedClasses}
          icon={GraduationCap}
          trend={{ value: 2, label: '5-A, 6-A' }}
          color="blue"
          subtitle="Your primary sections"
        />
        <KPICard
          title="Assigned Students"
          value={stats.totalAssignedStudents}
          icon={Users}
          trend={{ value: 62, label: 'Students' }}
          color="green"
          subtitle="Under your care"
        />
        <KPICard
          title="Today's Classes"
          value={stats.todaysClasses}
          icon={Clock}
          color="blue"
          subtitle="Periods scheduled"
        />
        <KPICard
          title="Attendance Completed"
          value={stats.attendanceCompleted}
          icon={CheckCircle2}
          trend={{ value: 100, label: 'Done' }}
          color="green"
          subtitle="Class 5-A marked"
        />
        <KPICard
          title="Pending Attendance"
          value={stats.pendingAttendance}
          icon={AlertCircle}
          trend={{ value: -1, label: 'Section 6-A' }}
          color="amber"
          subtitle="Action required"
        />
        <KPICard
          title="Homework Assigned"
          value={stats.homeworkAssigned}
          icon={NotebookPen}
          trend={{ value: 2, label: 'Active' }}
          color="navy"
          subtitle="Submissions open"
        />
        <KPICard
          title="Upcoming Examinations"
          value={stats.upcomingExaminations}
          icon={ClipboardList}
          trend={{ value: 2, label: 'Ready' }}
          color="blue"
          subtitle="Marks entry ready"
        />
      </div>

      {/* Teacher Timetable Today & Active Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Periods */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-[#172033]">
                Today's Teaching Schedule & Periods
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Your assigned periods for Wednesday
              </CardDescription>
            </div>
            <Link to="/timetable">
              <Button variant="ghost" size="sm" className="text-xs text-[#3B5BDB]">
                Full Week Timetable <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {teacherScheduleToday.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between hover:border-[#3B5BDB]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3B5BDB]/10 text-[#3B5BDB] flex items-center justify-center font-bold text-xs">
                    P{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#172033]">{item.subject}</span>
                      <Badge variant="default" className="text-[10px] bg-white">
                        {item.classSection}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {item.period} • {item.room}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={item.status === 'Completed' ? 'success' : 'info'}
                  className="text-[10px]"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Homework & Diary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-[#172033]">
                Assigned Homework & Submissions
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Real-time submission trackers
              </CardDescription>
            </div>
            <Link to="/diary" className="text-xs text-[#3B5BDB] font-semibold hover:underline">
              New
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentHomework.map((hw) => (
              <div
                key={hw.title}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="purple" className="text-[10px]">{hw.subject}</Badge>
                  <span className="text-[10px] font-semibold text-[#E03131]">Due: {hw.due}</span>
                </div>
                <p className="text-xs font-bold text-[#172033]">{hw.title}</p>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-[#EEF2F6]">
                  <span>{hw.classSection}</span>
                  <span className="font-semibold text-emerald-600">Submitted: {hw.submissions}</span>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link to="/examinations">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ClipboardList size={14} className="mr-1.5" /> Open Exam Marks Entry
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Academic Performance Averages (Recharts) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold text-[#172033]">
              Academic Subject Performance (Assigned Classes)
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Class average marks & pass percentages for latest formative assessments
            </CardDescription>
          </div>
          <Badge variant="default" className="text-xs bg-[#F8FAFC]">Term 1 Summative</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avgMarks" name="Average Marks (100)" fill="#3B5BDB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passRate" name="Pass Rate (%)" fill="#16A36A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
