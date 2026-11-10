import React from 'react';
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
  CheckCircle2,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
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
  LineChart,
  Line,
  Legend,
} from 'recharts';

const attendanceData = [
  { month: 'Jul', present: 93, absent: 7 },
  { month: 'Aug', present: 91, absent: 9 },
  { month: 'Sep', present: 94, absent: 6 },
  { month: 'Oct', present: 90, absent: 10 },
  { month: 'Nov', present: 92, absent: 8 },
];

const classDistribution = [
  { name: 'Class 1', value: 120 },
  { name: 'Class 2', value: 115 },
  { name: 'Class 3', value: 108 },
  { name: 'Class 4', value: 95 },
  { name: 'Class 5', value: 90 },
  { name: 'Class 6', value: 72 },
];

const feeData = [
  { month: 'Jul', collected: 450000, pending: 120000 },
  { month: 'Aug', collected: 520000, pending: 98000 },
  { month: 'Sep', collected: 480000, pending: 140000 },
  { month: 'Oct', collected: 510000, pending: 110000 },
  { month: 'Nov', collected: 410000, pending: 165000 },
];

const PIE_COLORS = ['#3B5BDB', '#16A36A', '#F2A93B', '#E03131', '#845EC2', '#172554'];

const recentActivities = [
  {
    text: 'Attendance marked for Class 5 Section A',
    time: '12 min ago',
    type: 'attendance',
    user: 'M. Saravanan',
  },
  {
    text: 'Term 1 Fee Payment received for Aarav Krishnan (₹28,000)',
    time: '45 min ago',
    type: 'fee',
    user: 'R. Venkat',
  },
  {
    text: 'Circular published: Annual Sports Meet 2026',
    time: '2 hours ago',
    type: 'notice',
    user: 'Principal',
  },
  {
    text: 'Homework assigned: Mathematics Fractions Ch 4',
    time: '3 hours ago',
    type: 'homework',
    user: 'M. Saravanan',
  },
  {
    text: 'New student admission registered: Varun Chakravarthy',
    time: '5 hours ago',
    type: 'student',
    user: 'Admin',
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            School Overview Dashboard
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Academic Year 2026-2027 • Sunrise International School
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/attendance">
            <Button size="sm" variant="outline">
              <CalendarCheck size={15} /> Mark Attendance
            </Button>
          </Link>
          <Link to="/notices">
            <Button size="sm">
              <Plus size={15} /> Publish Notice
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Students"
          value="600"
          subtitle="Enrolled across 12 Sections"
          icon={Users}
          trend={{ value: 4.8, label: 'vs last year' }}
          color="blue"
        />
        <KPICard
          title="Faculty & Teachers"
          value="42"
          subtitle="Full-time teaching staff"
          icon={GraduationCap}
          trend={{ value: 2.1, label: 'active' }}
          color="navy"
        />
        <KPICard
          title="Present Today"
          value="552 (92%)"
          subtitle="48 Absent • 12 Late Arrivals"
          icon={CalendarCheck}
          trend={{ value: 1.2, label: 'vs yesterday' }}
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value="₹6,33,000"
          subtitle="Collection rate: 76%"
          icon={CreditCard}
          trend={{ value: -5.4, label: 'pending reduction' }}
          color="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Attendance Rate</CardTitle>
                <CardDescription>Present vs. Absent percentage comparison</CardDescription>
              </div>
              <Badge variant="success">92% Average</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    formatter={(val: number) => [`${val}%`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="present" fill="#16A36A" radius={[4, 4, 0, 0]} name="Present %" />
                  <Bar dataKey="absent" fill="#E03131" radius={[4, 4, 0, 0]} name="Absent %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fee Collection Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fee Collection Trends</CardTitle>
                <CardDescription>Collected amounts vs. outstanding dues (INR)</CardDescription>
              </div>
              <Badge variant="info">₹23.7 Lakhs YTD</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={feeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="collected" stroke="#16A36A" strokeWidth={2.5} name="Collected (₹)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pending" stroke="#F2A93B" strokeWidth={2.5} name="Pending (₹)" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution & Realtime Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Enrollment Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Enrollment by Grade</CardTitle>
            <CardDescription>Primary and middle wing distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {classDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    formatter={(val: number) => [`${val} Students`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live School Operations Log</CardTitle>
                <CardDescription>Realtime teacher entries, fees, circulars, and diary updates</CardDescription>
              </div>
              <span className="text-[11px] font-semibold text-[#3B5BDB] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
                Live Sync Active
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5">
              {recentActivities.map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#DBE4FF] flex items-center justify-center text-[#3B5BDB] shrink-0 font-bold text-xs">
                    {act.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#172033] leading-snug">{act.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#64748B] font-medium">By {act.user}</span>
                      <span className="text-[10px] text-[#94A3B8]">• {act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

