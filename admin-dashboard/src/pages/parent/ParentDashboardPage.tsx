import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useParentAuth } from '@/contexts/ParentAuthContext';
import {
  initialFees,
  initialHomework,
  initialNotices,
  MockStudent,
} from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  CalendarCheck,
  CreditCard,
  NotebookPen,
  Megaphone,
  Clock,
  BookOpen,
  Award,
  Bell,
  LogOut,
  ChevronDown,
  CheckCircle2,
  FileText,
  User,
  Shield,
  Coffee,
  Check,
  X,
  Phone,
  Home,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function ParentDashboardPage() {
  const navigate = useNavigate();
  const { parent, linkedStudents, activeStudent, setActiveStudent, signOut } = useParentAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'diary' | 'fees' | 'exams' | 'timetable' | 'notices'>('overview');
  const [showChildPicker, setShowChildPicker] = useState(false);

  // Filter dynamic datasets for the active ward
  const studentFees = initialFees.filter(
    (f) =>
      f.student_name.toLowerCase().includes(activeStudent?.first_name.toLowerCase() || '') ||
      f.admission_number === activeStudent?.admission_number
  );

  const studentHomework = initialHomework.filter(
    (h) => !activeStudent || h.class_section.includes(activeStudent.class_name)
  );

  const totalFee = studentFees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = studentFees.reduce((sum, f) => sum + f.paid_amount, 0);
  const totalPending = totalFee - totalPaid;

  const handleSignOut = async () => {
    await signOut();
    navigate('/parent/login');
  };

  if (!parent || !activeStudent) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-md">
          <p className="text-sm font-bold text-[#172033]">Session Expired</p>
          <p className="text-xs text-[#64748B] mt-1 mb-4">Please log in to your Parent Portal.</p>
          <Button onClick={() => navigate('/parent/login')}>Go to Parent Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#172554] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B5BDB] flex items-center justify-center font-bold text-base shadow-sm">
              S
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight leading-tight">Sunrise International School</p>
              <p className="text-[10px] text-white/60 tracking-wider uppercase font-semibold">
                Parent Web Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Multi-Ward Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowChildPicker(!showChildPicker)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/15 transition-colors cursor-pointer text-xs"
              >
                <img
                  src={activeStudent.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&fit=crop'}
                  alt={activeStudent.first_name}
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                />
                <div className="text-left hidden sm:block">
                  <p className="font-bold text-white leading-tight">{activeStudent.first_name}</p>
                  <p className="text-[10px] text-white/60">{activeStudent.class_name} • {activeStudent.section_name}</p>
                </div>
                <ChevronDown size={14} className="text-white/60" />
              </button>

              {showChildPicker && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-[#F1F5F9]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Switch Child / Ward
                    </p>
                  </div>
                  {linkedStudents.map((std) => (
                    <button
                      key={std.id}
                      onClick={() => {
                        setActiveStudent(std);
                        setShowChildPicker(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.photo_url}
                          alt={std.first_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className={`text-xs font-semibold ${activeStudent.id === std.id ? 'text-[#3B5BDB]' : 'text-[#172033]'}`}>
                            {std.first_name} {std.last_name}
                          </p>
                          <p className="text-[10px] text-[#64748B]">
                            {std.class_name} • {std.section_name} • Adm: {std.admission_number}
                          </p>
                        </div>
                      </div>
                      {activeStudent.id === std.id && <Check size={14} className="text-[#3B5BDB]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Parent Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white">{parent.full_name}</p>
                <p className="text-[10px] text-white/60">{parent.phone}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-white/10 scrollbar-none">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Home },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'diary', label: 'Homework & Diary', icon: NotebookPen },
            { id: 'fees', label: 'Fees & Invoices', icon: CreditCard },
            { id: 'exams', label: 'Examinations', icon: Award },
            { id: 'timetable', label: 'Timetable', icon: Clock },
            { id: 'notices', label: 'Circulars', icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#3B5BDB] text-white font-bold bg-white/5'
                    : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Child Profile Banner */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeStudent.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&fit=crop'}
              alt={activeStudent.first_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#3B5BDB] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#172033]">
                  {activeStudent.first_name} {activeStudent.last_name}
                </h2>
                <Badge variant={activeStudent.is_active ? 'success' : 'default'}>
                  {activeStudent.is_active ? 'Enrolled Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">
                Class: <span className="text-[#172033] font-bold">{activeStudent.class_name} • {activeStudent.section_name}</span> • Roll No: <span className="font-mono text-[#172033] font-bold">{activeStudent.roll_number}</span>
              </p>
              <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                Admission No: {activeStudent.admission_number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs text-[#64748B]">
            <Shield size={16} className="text-[#16A36A] shrink-0" />
            <div>
              <p className="font-semibold text-[#172033]">RLS Data Isolation</p>
              <p className="text-[10px]">Restricted exclusively to {parent.full_name}'s verified wards</p>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-[#16A36A]">92%</p>
                <p className="text-[11px] text-[#64748B] mt-1">23 Present • 1 Absent • 1 Late</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  Pending Fees
                </p>
                <p className="text-2xl font-bold text-[#E03131]">{formatCurrency(totalPending)}</p>
                <p className="text-[11px] text-[#64748B] mt-1">Due Date: 20 Nov 2026</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  Active Homework
                </p>
                <p className="text-2xl font-bold text-[#3B5BDB]">{studentHomework.length} Tasks</p>
                <p className="text-[11px] text-[#64748B] mt-1">Mathematics & English</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  Exam Result
                </p>
                <p className="text-2xl font-bold text-[#16A36A]">Grade A+ (90.5%)</p>
                <p className="text-[11px] text-[#64748B] mt-1">First Term Summative</p>
              </div>
            </div>

            {/* Circulars & Homework Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notice Board */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-4">
                  <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                    <Megaphone size={16} className="text-[#3B5BDB]" />
                    Latest School Circulars
                  </h3>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs font-bold text-[#3B5BDB] hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {initialNotices.map((n) => (
                    <div key={n.id} className="p-3 rounded-lg border border-[#F1F5F9] hover:bg-[#F8FAFC]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <Badge variant="purple">{n.target_type === 'all' ? 'All School' : n.target_class}</Badge>
                        <span className="text-[#94A3B8]">{n.published_at}</span>
                      </div>
                      <p className="text-xs font-bold text-[#172033]">{n.title}</p>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diary Feed */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-4">
                  <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                    <NotebookPen size={16} className="text-[#16A36A]" />
                    Student Homework & Diary
                  </h3>
                  <button
                    onClick={() => setActiveTab('diary')}
                    className="text-xs font-bold text-[#3B5BDB] hover:underline"
                  >
                    Open Diary →
                  </button>
                </div>
                <div className="space-y-3">
                  {studentHomework.map((hw) => (
                    <div key={hw.id} className="p-3 rounded-lg border border-[#F1F5F9] hover:bg-[#F8FAFC]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#3B5BDB] uppercase tracking-wider">{hw.subject}</span>
                        <span className="text-[#E03131] font-semibold">Due: {hw.due_date}</span>
                      </div>
                      <p className="text-xs font-bold text-[#172033]">{hw.title}</p>
                      <p className="text-xs text-[#64748B] mt-1">{hw.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-base font-bold text-[#172033]">Monthly Attendance Record</h3>
                <p className="text-xs text-[#64748B]">Showing attendance status for {activeStudent.first_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">92% Present</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-[#D3F9D8] rounded-xl border border-[#B2F2BB]">
                <p className="text-xs text-[#16A36A] font-bold">Present Days</p>
                <p className="text-xl font-bold text-[#16A36A] mt-1">23</p>
              </div>
              <div className="p-3 bg-[#FFE3E3] rounded-xl border border-[#FFC9C9]">
                <p className="text-xs text-[#E03131] font-bold">Absent Days</p>
                <p className="text-xl font-bold text-[#E03131] mt-1">1</p>
              </div>
              <div className="p-3 bg-[#FFF3BF] rounded-xl border border-[#FFE066]">
                <p className="text-xs text-[#D97706] font-bold">Late Arrivals</p>
                <p className="text-xl font-bold text-[#D97706] mt-1">1</p>
              </div>
              <div className="p-3 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                <p className="text-xs text-[#64748B] font-bold">Total Days</p>
                <p className="text-xl font-bold text-[#172033] mt-1">25</p>
              </div>
            </div>

            <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden text-xs">
              {[
                { date: '06 Nov 2026', day: 'Friday', status: 'present' },
                { date: '05 Nov 2026', day: 'Thursday', status: 'present' },
                { date: '04 Nov 2026', day: 'Wednesday', status: 'late', note: 'Late by 15 mins (traffic)' },
                { date: '03 Nov 2026', day: 'Tuesday', status: 'present' },
                { date: '02 Nov 2026', day: 'Monday', status: 'present' },
              ].map((row, i) => (
                <div key={i} className="p-3 flex items-center justify-between hover:bg-[#F8FAFC]">
                  <div>
                    <span className="font-bold text-[#172033]">{row.date}</span> ({row.day})
                    {row.note && <span className="ml-2 text-[#D97706] italic">Note: {row.note}</span>}
                  </div>
                  <Badge variant={row.status === 'present' ? 'success' : row.status === 'late' ? 'warning' : 'error'}>
                    {row.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-base font-bold text-[#172033]">Fee Assessment & Invoices</h3>
                <p className="text-xs text-[#64748B]">Assessed fees and receipts for {activeStudent.first_name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#64748B]">Outstanding:</span>{' '}
                <span className="text-sm font-bold text-[#E03131]">{formatCurrency(totalPending)}</span>
              </div>
            </div>

            <div className="space-y-3">
              {studentFees.map((fee) => (
                <div key={fee.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#172033]">{fee.category}</p>
                      <Badge variant={fee.status === 'paid' ? 'success' : fee.status === 'partial' ? 'warning' : 'error'}>
                        {fee.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-[#64748B] mt-1">Due Date: {fee.due_date}</p>
                    {fee.receipt_number && (
                      <p className="text-[#3B5BDB] font-mono mt-0.5">Receipt: {fee.receipt_number} ({fee.payment_method})</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#64748B]">Assessed Amount: <span className="font-bold text-[#172033]">{formatCurrency(fee.amount)}</span></p>
                    <p className="text-xs text-[#16A36A]">Paid: <span className="font-bold">{formatCurrency(fee.paid_amount)}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diary Tab */}
        {activeTab === 'diary' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-base font-bold text-[#172033]">Student Diary & Assignments</h3>
              <p className="text-xs text-[#64748B]">Assignments posted by class faculty</p>
            </div>
            <div className="space-y-3">
              {studentHomework.map((hw) => (
                <div key={hw.id} className="p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="purple">{hw.subject}</Badge>
                    <span className="text-[#E03131] font-semibold">Due: {hw.due_date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#172033]">{hw.title}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
                    {hw.description}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">Assigned by: {hw.assigned_by}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-base font-bold text-[#172033]">Evaluation Results & Report Cards</h3>
              <p className="text-xs text-[#64748B]">Published summative assessment grades</p>
            </div>
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#172033]">First Term Summative Assessment</h4>
                  <p className="text-xs text-[#64748B]">Academic Year 2026-2027</p>
                </div>
                <Badge variant="success">Grade A+ (90.5%)</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-[#64748B]">Mathematics</p>
                  <p className="font-bold text-sm text-[#16A36A]">94.5 / 100</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-[#64748B]">English</p>
                  <p className="font-bold text-sm text-[#3B5BDB]">88.0 / 100</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-[#64748B]">Science</p>
                  <p className="font-bold text-sm text-[#16A36A]">91.5 / 100</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-[#64748B]">Tamil</p>
                  <p className="font-bold text-sm text-[#3B5BDB]">88.0 / 100</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timetable Tab */}
        {activeTab === 'timetable' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-base font-bold text-[#172033]">Class Weekly Timetable</h3>
              <p className="text-xs text-[#64748B]">{activeStudent.class_name} • {activeStudent.section_name}</p>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { period: 1, time: '09:00 - 09:45', subject: 'English', teacher: 'K. Malathi' },
                { period: 2, time: '09:45 - 10:30', subject: 'Mathematics', teacher: 'M. Saravanan' },
                { period: 0, time: '10:30 - 10:45', subject: 'Morning Interval', teacher: '', isBreak: true },
                { period: 3, time: '10:45 - 11:30', subject: 'Science', teacher: 'M. Saravanan' },
                { period: 4, time: '11:30 - 12:15', subject: 'Tamil', teacher: 'K. Malathi' },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    p.isBreak
                      ? 'bg-[#FFF3BF] border border-[#FFE066] text-[#D97706] font-semibold'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0]'
                  }`}
                >
                  <span className="font-bold">{p.isBreak ? p.subject : `Period ${p.period}: ${p.subject}`}</span>
                  <span className="font-mono text-[#64748B]">{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-base font-bold text-[#172033]">School Circulars & Official Notices</h3>
              <p className="text-xs text-[#64748B]">Announcements from Principal and Administration</p>
            </div>
            <div className="space-y-3">
              {initialNotices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="purple">{n.target_type === 'all' ? 'All Parents' : n.target_class}</Badge>
                    <span className="text-[#94A3B8]">{n.published_at}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#172033]">{n.title}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

