import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  Bell,
  Megaphone,
  BookOpen,
  ClipboardList,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const PIE_COLORS = ['#3B5BDB', '#16A36A', '#F2A93B', '#E03131', '#845EC2', '#172554'];

export function SchoolAdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 3,
    totalTeachers: 2,
    totalParents: 2,
    studentsPresentToday: 2,
    studentsAbsentToday: 1,
    pendingFeesSummary: '₹12,500',
    upcomingExaminations: 2,
    recentSchoolAnnouncements: 2,
  });

  useEffect(() => {
    async function fetchSchoolAdminData() {
      if (!isSupabaseConfigured) return;
      try {
        const [
          { count: studentsCount },
          { count: teachersCount },
          { count: parentsCount },
          { count: noticesCount },
          { count: examsCount },
        ] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('teachers').select('*', { count: 'exact', head: true }),
          supabase.from('parents').select('*', { count: 'exact', head: true }),
          supabase.from('notices').select('*', { count: 'exact', head: true }),
          supabase.from('examinations').select('*', { count: 'exact', head: true }),
        ]);

        const { data: feesData } = await supabase
          .from('student_fees')
          .select('amount, status');

        let pendingSum = 0;
        if (feesData) {
          feesData.forEach((f) => {
            if (f.status === 'pending' || f.status === 'overdue') {
              pendingSum += Number(f.amount || 0);
            }
          });
        }

        // Attendance today
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: attData } = await supabase
          .from('attendance')
          .select('status')
          .eq('date', todayStr);

        let present = 0;
        let absent = 0;
        if (attData && attData.length > 0) {
          attData.forEach((a) => {
            if (a.status === 'present' || a.status === 'late') present++;
            if (a.status === 'absent') absent++;
          });
        } else {
          present = 2;
          absent = 1;
        }

        setStats({
          totalStudents: studentsCount || 3,
          totalTeachers: teachersCount || 2,
          totalParents: parentsCount || 2,
          studentsPresentToday: present,
          studentsAbsentToday: absent,
          pendingFeesSummary: `₹${pendingSum.toLocaleString('en-IN')}`,
          upcomingExaminations: examsCount || 2,
          recentSchoolAnnouncements: noticesCount || 2,
        });
      } catch (err) {
        console.error('School Admin stats error:', err);
      }
    }

    fetchSchoolAdminData();
  }, []);

  const attendanceData = [
    { month: 'Jul', present: 93, absent: 7 },
    { month: 'Aug', present: 91, absent: 9 },
    { month: 'Sep', present: 94, absent: 6 },
    { month: 'Oct', present: 90, absent: 10 },
    { month: 'Nov', present: 92, absent: 8 },
  ];

  const classDistribution = [
    { name: 'Class 5-A', value: 32 },
    { name: 'Class 5-B', value: 30 },
    { name: 'Class 6-A', value: 34 },
    { name: 'Class 6-B', value: 28 },
    { name: 'Class 7-A', value: 35 },
  ];

  const recentAnnouncements = [
    { title: 'Annual Sports Meet 2026 - Registrations Open', date: '2 days ago', target: 'School-wide', priority: 'High' },
    { title: 'Class 5 Field Trip to Regional Science City', date: 'Yesterday', target: 'Class 5', priority: 'Normal' },
    { title: 'Parent-Teacher Meeting (Term 1 Feedback)', date: '3 days ago', target: 'Classes 1-10', priority: 'Urgent' },
  ];

  return (
    <div className="space-y-6">
      {/* School Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
              School Academic Administration
            </h1>
            <Badge variant="info">Campus Operations</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Sunrise International Matriculation Higher Secondary School • Academic Year 2026-2027
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/attendance">
            <Button variant="secondary" size="sm">
              <CalendarCheck size={14} className="mr-1.5" />
              Daily Attendance Register
            </Button>
          </Link>
          <Link to="/notices">
            <Button size="sm">
              <Plus size={14} className="mr-1.5" />
              New Circular
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Required School Admin KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          trend={{ value: 12, label: 'Enrolled' }}
          color="blue"
          subtitle="All active batches"
        />
        <KPICard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          trend={{ value: 100, label: 'Faculty' }}
          color="green"
          subtitle="Assigned to sections"
        />
        <KPICard
          title="Total Parents"
          value={stats.totalParents}
          icon={UserCheck}
          trend={{ value: 95, label: 'App Synced' }}
          color="navy"
          subtitle="Parent portal accounts"
        />
        <KPICard
          title="Students Present Today"
          value={stats.studentsPresentToday}
          icon={CalendarCheck}
          trend={{ value: 92.4, label: 'Turnout' }}
          color="green"
          subtitle="Morning roll call"
        />
        <KPICard
          title="Students Absent Today"
          value={stats.studentsAbsentToday}
          icon={AlertCircle}
          trend={{ value: -1, label: 'Alert Sent' }}
          color="red"
          subtitle="Absence notified"
        />
        <KPICard
          title="Pending Fees Summary"
          value={stats.pendingFeesSummary}
          icon={CreditCard}
          trend={{ value: 0, label: 'Due Nov' }}
          color="amber"
          subtitle="Tuition & bus dues"
        />
        <KPICard
          title="Upcoming Examinations"
          value={stats.upcomingExaminations}
          icon={ClipboardList}
          trend={{ value: 12, label: 'Days Away' }}
          color="blue"
          subtitle="Mid-Term summative"
        />
        <KPICard
          title="Recent Announcements"
          value={stats.recentSchoolAnnouncements}
          icon={Megaphone}
          trend={{ value: 2, label: 'Circulars' }}
          color="navy"
          subtitle="Delivered to parents"
        />
      </div>

      {/* Analytics: Daily Attendance Trends & Class Strength */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-[#172033]">
                Daily Student Attendance Register Trends
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Monthly attendance percentages across classes
              </CardDescription>
            </div>
            <Badge variant="default" className="text-xs bg-[#F8FAFC]">
              Term 1
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
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
                  <Bar dataKey="present" name="% Present" fill="#3B5BDB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="% Absent" fill="#E03131" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section Strength */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#172033]">
              Section Enrolment Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Active students per section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px]">
              {classDistribution.map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5 text-[#64748B]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="truncate">{c.name}: {c.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements & Academic Management Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-[#172033]">
                Recent School Announcements & Circulars
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Published to staff and parent mobile portal
              </CardDescription>
            </div>
            <Link to="/notices" className="text-xs text-[#3B5BDB] font-semibold hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnnouncements.map((a) => (
              <div
                key={a.title}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs hover:border-[#3B5BDB]/50 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-[#172033] truncate">{a.title}</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">{a.date} • Target: {a.target}</p>
                </div>
                <Badge variant={a.priority === 'Urgent' ? 'error' : 'default'} className="text-[10px] shrink-0">
                  {a.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Operational Modules Shortcut Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#172033]">
              Daily Academic Management Modules
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Quick operational access for school admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { title: 'Student Roster', href: '/students', icon: GraduationCap },
                { title: 'Faculty Staff', href: '/teachers', icon: Users },
                { title: 'Parents Directory', href: '/parents', icon: UserCheck },
                { title: 'Weekly Timetable', href: '/timetable', icon: Calendar },
                { title: 'Exams & Marks', href: '/examinations', icon: ClipboardList },
                { title: 'Parent Feedback', href: '/feedback', icon: MessageSquare },
              ].map((m) => {
                const MIcon = m.icon;
                return (
                  <Link
                    key={m.title}
                    to={m.href}
                    className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#3B5BDB] transition-all flex flex-col items-center text-center group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#3B5BDB]/10 text-[#3B5BDB] group-hover:bg-[#3B5BDB] group-hover:text-white flex items-center justify-center transition-colors mb-1.5">
                      <MIcon size={16} />
                    </div>
                    <span className="text-[11px] font-semibold text-[#172033] group-hover:text-[#3B5BDB] transition-colors">
                      {m.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
