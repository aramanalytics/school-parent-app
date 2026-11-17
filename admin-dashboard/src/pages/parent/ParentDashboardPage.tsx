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
  Bus,
  Radio,
  Navigation,
  Shirt,
  Printer,
  Download,
  Eye,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getStudentBusAssignment } from '@/lib/transportData';
import {
  getStudentBookUniformFees,
  StudentBookUniformFee,
  FeePaymentRecord,
} from '@/lib/bookUniformFeeData';

export function ParentDashboardPage() {
  const navigate = useNavigate();
  const { parent, linkedStudents, activeStudent, setActiveStudent, signOut } = useParentAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'diary' | 'fees' | 'exams' | 'timetable' | 'bus' | 'notices'>('overview');
  const [feeSubTab, setFeeSubTab] = useState<'tuition' | 'books_uniform'>('tuition');
  const [parentReceiptModal, setParentReceiptModal] = useState<{
    fee: StudentBookUniformFee;
    payment: FeePaymentRecord;
  } | null>(null);

  // Bus assignment for active child
  const busData = getStudentBusAssignment(activeStudent?.id);
  // Book & Uniform fees for active child
  const bookUniformData = getStudentBookUniformFees(activeStudent?.id);
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
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center">
              <img
                src="/avk-logo.svg"
                alt="AVK Emblem"
                className="w-full h-full object-contain aspect-square"
              />
            </div>
            <div>
              <p className="font-black text-xs sm:text-sm tracking-tight leading-tight uppercase" title="AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL">
                AVK Senior Secondary School
              </p>
              <p className="text-[10px] text-amber-300 font-semibold tracking-wide">
                Affiliated to CBSE New-Delhi &bull; 1930319
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
            { id: 'bus', label: 'My School Bus', icon: Bus },
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

            {/* School Bus Information Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-4">
                <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                  <Bus size={16} className="text-[#3B5BDB]" />
                  School Bus Information
                </h3>
                <Link
                  to="/parent/bus"
                  className="text-xs font-bold text-[#3B5BDB] hover:underline"
                >
                  View Details →
                </Link>
              </div>

              {busData.bus && busData.assignment ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Bus Number</p>
                      <p className="text-sm font-bold text-[#172033] mt-0.5">{busData.bus.busNumber}</p>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Route</p>
                      <p className="text-sm font-bold text-[#172033] mt-0.5">{busData.route?.name || busData.bus.routeName}</p>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Driver Contact</p>
                      <p className="text-sm font-bold text-[#172033] mt-0.5">{busData.driver?.phone || '—'}</p>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Pickup Time</p>
                      <p className="text-sm font-bold text-[#172033] mt-0.5">{busData.assignment.pickupTime}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link
                      to="/parent/bus"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#3B5BDB] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#2B4BC9] transition-colors"
                    >
                      <Bus size={14} />
                      View Bus Details
                    </Link>
                    <Link
                      to="/parent/bus/tracking"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#3B5BDB] text-xs font-bold rounded-lg border border-[#3B5BDB] hover:bg-[#EDF2FF] transition-colors"
                    >
                      <Radio size={14} />
                      Track Bus
                    </Link>
                    <Link
                      to="/parent/bus/route"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#64748B] text-xs font-bold rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <Navigation size={14} />
                      View Route
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Bus size={24} />
                  </div>
                  <p className="text-sm font-semibold text-[#B45309]">
                    No school bus has been assigned to this student yet.
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">
                    Contact the AVK Transport Coordinator for bus allocation.
                  </p>
                </div>
              )}
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
          <div className="space-y-4">
            {/* Sub-navigation Switcher between Tuition Fees and Books & Uniform Fees */}
            <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
              <button
                onClick={() => setFeeSubTab('tuition')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  feeSubTab === 'tuition'
                    ? 'bg-[#172554] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
                }`}
              >
                <CreditCard size={14} />
                <span>Tuition & Academic Invoices</span>
              </button>
              <button
                onClick={() => setFeeSubTab('books_uniform')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  feeSubTab === 'books_uniform'
                    ? 'bg-[#172554] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
                }`}
              >
                <BookOpen size={14} />
                <span>Books & Uniform Fees</span>
                {bookUniformData.totalPending > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E03131] text-white font-extrabold">
                    Due
                  </span>
                )}
              </button>
            </div>

            {/* Sub-view A: Tuition Fees */}
            {feeSubTab === 'tuition' && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                  <div>
                    <h3 className="text-base font-bold text-[#172033]">Fee Assessment & Invoices</h3>
                    <p className="text-xs text-[#64748B]">Assessed term tuition fees and receipts for {activeStudent.first_name}</p>
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

            {/* Sub-view B: Books & Uniform Fees */}
            {feeSubTab === 'books_uniform' && (
              <div className="space-y-5">
                {/* Parent Notifications Banner */}
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#DBE4FF] text-[#1D4ED8] flex items-center justify-center shrink-0 mt-0.5">
                    <Bell size={16} />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1E40AF]">Books & Uniform Notification</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#DBE4FF] text-[#1E40AF]">
                        AY 2026-2027
                      </span>
                    </div>
                    <p className="text-[#1E3A8A] mt-0.5 leading-relaxed">
                      Prescribed textbooks, activity notebooks, sports uniforms, and accessories for{' '}
                      <strong>{activeStudent.first_name} {activeStudent.last_name} ({activeStudent.class_name} • {activeStudent.section_name})</strong>{' '}
                      can be collected from the AVK School Store upon clearing due invoices.
                    </p>
                  </div>
                </div>

                {/* Combined Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Book Fee</p>
                    <p className="text-base font-bold text-[#0369A1] mt-0.5">
                      {formatCurrency(bookUniformData.bookFee?.totalAmount || 0)}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      {bookUniformData.bookFee ? (bookUniformData.bookFee.balanceAmount === 0 ? '✓ Cleared' : `Bal: ${formatCurrency(bookUniformData.bookFee.balanceAmount)}`) : 'Not Assigned'}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Uniform Fee</p>
                    <p className="text-base font-bold text-[#7E22CE] mt-0.5">
                      {formatCurrency(bookUniformData.uniformFee?.totalAmount || 0)}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      {bookUniformData.uniformFee ? (bookUniformData.uniformFee.balanceAmount === 0 ? '✓ Cleared' : `Bal: ${formatCurrency(bookUniformData.uniformFee.balanceAmount)}`) : 'Not Assigned'}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Assigned</p>
                    <p className="text-base font-bold text-[#172033] mt-0.5">
                      {formatCurrency(bookUniformData.totalAssigned)}
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">AY 2026-2027</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <p className="text-[10px] font-bold text-[#16A36A] uppercase tracking-wider">Total Paid</p>
                    <p className="text-base font-bold text-[#16A36A] mt-0.5">
                      {formatCurrency(bookUniformData.totalReceived)}
                    </p>
                    <p className="text-[10px] text-[#16A36A]">Verified Collections</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-bold text-[#E03131] uppercase tracking-wider">Pending Balance</p>
                    <p className="text-base font-bold text-[#E03131] mt-0.5">
                      {formatCurrency(bookUniformData.totalPending)}
                    </p>
                    <p className="text-[10px] text-[#E03131]">Outstanding Amount</p>
                  </div>
                </div>

                {/* Two Distinct Cards: BOOK FEE and UNIFORM FEE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* CARD 1: BOOK FEE */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#172033]">Book Fee Details</h4>
                            <p className="text-[11px] text-[#64748B]">Textbooks, notebooks & study kits</p>
                          </div>
                        </div>

                        {bookUniformData.bookFee && (
                          <div>
                            {bookUniformData.bookFee.status === 'paid' && (
                              <Badge variant="success">PAID</Badge>
                            )}
                            {bookUniformData.bookFee.status === 'partial' && (
                              <Badge variant="warning">PARTIALLY PAID</Badge>
                            )}
                            {bookUniformData.bookFee.status === 'pending' && (
                              <Badge variant="default">PENDING</Badge>
                            )}
                            {bookUniformData.bookFee.status === 'overdue' && (
                              <Badge variant="error">OVERDUE</Badge>
                            )}
                            {bookUniformData.bookFee.status === 'waived' && (
                              <Badge variant="purple">WAIVED</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {bookUniformData.bookFee ? (
                        <div className="mt-4 space-y-4 text-xs">
                          {/* Financial KPI Row */}
                          <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-center">
                            <div>
                              <p className="text-[10px] text-[#64748B]">Total Fee</p>
                              <p className="font-bold text-[#172033] mt-0.5">
                                {formatCurrency(bookUniformData.bookFee.totalAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#16A36A]">Received</p>
                              <p className="font-bold text-[#16A36A] mt-0.5">
                                {formatCurrency(bookUniformData.bookFee.amountReceived)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#E03131]">Pending Balance</p>
                              <p
                                className={`font-bold mt-0.5 ${
                                  bookUniformData.bookFee.balanceAmount > 0
                                    ? 'text-[#E03131]'
                                    : 'text-[#64748B]'
                                }`}
                              >
                                {formatCurrency(bookUniformData.bookFee.balanceAmount)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-[#64748B]">Payment Due Date:</span>
                            <span className="font-bold text-[#172033]">
                              {bookUniformData.bookFee.dueDate}
                            </span>
                          </div>

                          {/* Itemized Breakdown */}
                          <div>
                            <p className="font-bold text-[#172033] text-[11px] uppercase tracking-wider mb-2">
                              Package Items Included:
                            </p>
                            <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#FAFCFF]">
                              {bookUniformData.bookFee.items.map((item, i) => (
                                <div key={i} className="p-2.5 flex items-center justify-between">
                                  <span className="text-[#172033] font-medium">{item.name}</span>
                                  <span className="font-mono text-[#64748B]">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment History & Receipts */}
                          <div>
                            <p className="font-bold text-[#172033] text-[11px] uppercase tracking-wider mb-2">
                              Payment History & Receipts:
                            </p>
                            {bookUniformData.bookFee.payments.length > 0 ? (
                              <div className="space-y-2">
                                {bookUniformData.bookFee.payments.map((pay) => (
                                  <div
                                    key={pay.id}
                                    className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between"
                                  >
                                    <div>
                                      <p className="font-mono font-bold text-[#3B5BDB]">
                                        {pay.receiptNumber}
                                      </p>
                                      <p className="text-[10px] text-[#64748B] mt-0.5">
                                        {pay.paymentDate} &bull; Mode: <strong>{pay.paymentMode}</strong>
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-[#16A36A]">{formatCurrency(pay.amount)}</p>
                                      <button
                                        onClick={() =>
                                          setParentReceiptModal({
                                            fee: bookUniformData.bookFee!,
                                            payment: pay,
                                          })
                                        }
                                        className="text-[10px] font-bold text-[#3B5BDB] hover:underline mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <Eye size={10} /> View Receipt
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] text-center text-[#94A3B8]">
                                No payment has been processed yet for this fee.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-[#64748B]">
                          <BookOpen size={28} className="mx-auto text-[#94A3B8] mb-2 opacity-50" />
                          <p className="font-semibold text-sm">No Book Fee record assigned</p>
                          <p className="text-[11px] text-[#94A3B8] mt-1">
                            Contact AVK Administration if books allocation is required.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CARD 2: UNIFORM FEE */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center">
                            <Shirt size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#172033]">Uniform Fee Details</h4>
                            <p className="text-[11px] text-[#64748B]">Regular uniform, sports kit, shoes & belt</p>
                          </div>
                        </div>

                        {bookUniformData.uniformFee && (
                          <div>
                            {bookUniformData.uniformFee.status === 'paid' && (
                              <Badge variant="success">PAID</Badge>
                            )}
                            {bookUniformData.uniformFee.status === 'partial' && (
                              <Badge variant="warning">PARTIALLY PAID</Badge>
                            )}
                            {bookUniformData.uniformFee.status === 'pending' && (
                              <Badge variant="default">PENDING</Badge>
                            )}
                            {bookUniformData.uniformFee.status === 'overdue' && (
                              <Badge variant="error">OVERDUE</Badge>
                            )}
                            {bookUniformData.uniformFee.status === 'waived' && (
                              <Badge variant="purple">WAIVED</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {bookUniformData.uniformFee ? (
                        <div className="mt-4 space-y-4 text-xs">
                          {/* Financial KPI Row */}
                          <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-center">
                            <div>
                              <p className="text-[10px] text-[#64748B]">Total Fee</p>
                              <p className="font-bold text-[#172033] mt-0.5">
                                {formatCurrency(bookUniformData.uniformFee.totalAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#16A36A]">Received</p>
                              <p className="font-bold text-[#16A36A] mt-0.5">
                                {formatCurrency(bookUniformData.uniformFee.amountReceived)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#E03131]">Pending Balance</p>
                              <p
                                className={`font-bold mt-0.5 ${
                                  bookUniformData.uniformFee.balanceAmount > 0
                                    ? 'text-[#E03131]'
                                    : 'text-[#64748B]'
                                }`}
                              >
                                {formatCurrency(bookUniformData.uniformFee.balanceAmount)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-[#64748B]">Payment Due Date:</span>
                            <span className="font-bold text-[#172033]">
                              {bookUniformData.uniformFee.dueDate}
                            </span>
                          </div>

                          {/* Itemized Breakdown */}
                          <div>
                            <p className="font-bold text-[#172033] text-[11px] uppercase tracking-wider mb-2">
                              Package Items Included:
                            </p>
                            <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#FAFCFF]">
                              {bookUniformData.uniformFee.items.map((item, i) => (
                                <div key={i} className="p-2.5 flex items-center justify-between">
                                  <span className="text-[#172033] font-medium">{item.name}</span>
                                  <span className="font-mono text-[#64748B]">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment History & Receipts */}
                          <div>
                            <p className="font-bold text-[#172033] text-[11px] uppercase tracking-wider mb-2">
                              Payment History & Receipts:
                            </p>
                            {bookUniformData.uniformFee.payments.length > 0 ? (
                              <div className="space-y-2">
                                {bookUniformData.uniformFee.payments.map((pay) => (
                                  <div
                                    key={pay.id}
                                    className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between"
                                  >
                                    <div>
                                      <p className="font-mono font-bold text-[#3B5BDB]">
                                        {pay.receiptNumber}
                                      </p>
                                      <p className="text-[10px] text-[#64748B] mt-0.5">
                                        {pay.paymentDate} &bull; Mode: <strong>{pay.paymentMode}</strong>
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-[#16A36A]">{formatCurrency(pay.amount)}</p>
                                      <button
                                        onClick={() =>
                                          setParentReceiptModal({
                                            fee: bookUniformData.uniformFee!,
                                            payment: pay,
                                          })
                                        }
                                        className="text-[10px] font-bold text-[#3B5BDB] hover:underline mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <Eye size={10} /> View Receipt
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] text-center text-[#94A3B8]">
                                No payment has been processed yet for this fee.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-[#64748B]">
                          <Shirt size={28} className="mx-auto text-[#94A3B8] mb-2 opacity-50" />
                          <p className="font-semibold text-sm">No Uniform Fee record assigned</p>
                          <p className="text-[11px] text-[#94A3B8] mt-1">
                            Contact AVK Administration if uniform allocation is required.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
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

        {/* My School Bus Tab */}
        {activeTab === 'bus' && (
          <div className="space-y-6">
            {busData.bus && busData.assignment ? (
              <>
                {/* Bus Hero Card */}
                <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#3B5BDB] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0">
                        🚌
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-black tracking-tight">{busData.bus.busNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              busData.bus.status === 'on_route'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                : busData.bus.status === 'at_school'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                                : 'bg-white/10 text-white/80 border-white/20'
                            }`}
                          >
                            {busData.bus.status === 'on_route'
                              ? '● On Route'
                              : busData.bus.status === 'at_school'
                              ? '● At School'
                              : 'Not in Service'}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 font-mono">
                          Reg: <span className="font-bold text-white">{busData.bus.registrationNo}</span>
                        </p>
                        <p className="text-xs text-white/70 mt-0.5">{busData.bus.model}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/parent/bus"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
                      >
                        <Bus size={14} />
                        Full Details
                      </Link>
                      <Link
                        to="/parent/bus/tracking"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
                      >
                        <Radio size={14} />
                        Track Bus
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Route Name</p>
                    <p className="text-sm font-bold text-[#172033]">{busData.route?.name || busData.bus.routeName}</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Pickup Stop</p>
                    <p className="text-sm font-bold text-[#172033]">{busData.assignment.pickupStopName}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{busData.assignment.pickupTime}</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Drop-off Stop</p>
                    <p className="text-sm font-bold text-[#172033]">{busData.assignment.dropStopName}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{busData.assignment.dropTime}</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Capacity</p>
                    <p className="text-sm font-bold text-[#172033]">{busData.bus.occupiedSeats} / {busData.bus.capacity} Seats</p>
                  </div>
                </div>

                {/* Driver & Caretaker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {busData.driver && (
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
                      <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users size={14} className="text-[#3B5BDB]" />
                        Driver
                      </h4>
                      <p className="text-sm font-bold text-[#172033]">{busData.driver.name}</p>
                      <p className="text-xs text-[#64748B] font-mono mt-1">{busData.driver.phone}</p>
                      <a
                        href={`tel:${busData.driver.phone}`}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16A36A] text-white text-xs font-bold rounded-lg hover:bg-[#138A5A] transition-colors"
                      >
                        <Phone size={12} />
                        Call Driver
                      </a>
                    </div>
                  )}
                  {busData.caretaker && (
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
                      <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users size={14} className="text-[#16A36A]" />
                        Conductor / Caretaker
                      </h4>
                      <p className="text-sm font-bold text-[#172033]">{busData.caretaker.name}</p>
                      <p className="text-xs text-[#64748B] font-mono mt-1">{busData.caretaker.phone}</p>
                      <a
                        href={`tel:${busData.caretaker.phone}`}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3B5BDB] text-white text-xs font-bold rounded-lg hover:bg-[#2B4BC9] transition-colors"
                      >
                        <Phone size={12} />
                        Call Caretaker
                      </a>
                    </div>
                  )}
                </div>

                {/* Navigation Links to Sub-pages */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
                  <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3">Bus Section Pages</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Link
                      to="/parent/bus"
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#EDF2FF] text-[#3B5BDB] flex items-center justify-center shrink-0 group-hover:bg-[#3B5BDB] group-hover:text-white transition-colors">
                        <Bus size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#172033]">Bus Overview</p>
                        <p className="text-[10px] text-[#94A3B8]">Full bus details</p>
                      </div>
                    </Link>
                    <Link
                      to="/parent/bus/route"
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#EDF2FF] text-[#3B5BDB] flex items-center justify-center shrink-0 group-hover:bg-[#3B5BDB] group-hover:text-white transition-colors">
                        <Navigation size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#172033]">My Bus Route</p>
                        <p className="text-[10px] text-[#94A3B8]">Route & stop timings</p>
                      </div>
                    </Link>
                    <Link
                      to="/parent/bus/tracking"
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#EDF2FF] text-[#3B5BDB] flex items-center justify-center shrink-0 group-hover:bg-[#3B5BDB] group-hover:text-white transition-colors">
                        <Radio size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#172033]">Live Tracking</p>
                        <p className="text-[10px] text-[#94A3B8]">GPS bus location</p>
                      </div>
                    </Link>
                    <Link
                      to="/parent/bus/notifications"
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#EDF2FF] text-[#3B5BDB] flex items-center justify-center shrink-0 group-hover:bg-[#3B5BDB] group-hover:text-white transition-colors">
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#172033]">Notifications</p>
                        <p className="text-[10px] text-[#94A3B8]">Bus alerts & updates</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-xs max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Bus size={32} />
                </div>
                <h2 className="text-lg font-bold text-[#172033]">Transport Status</h2>
                <p className="text-sm font-semibold text-[#B45309] mt-2 mb-3">
                  No school bus has been assigned to this student yet.
                </p>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {activeStudent.first_name} does not have an active bus allocation. Please contact the AVK Transport Coordinator for bus enrolment.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Official AVK Receipt Modal for Parents */}
      <Modal
        isOpen={!!parentReceiptModal}
        onClose={() => setParentReceiptModal(null)}
        title="Official School Payment Receipt"
        description="AVK International Residential Senior Secondary School official receipt record."
        size="lg"
      >
        {parentReceiptModal && (
          <div className="space-y-4 text-xs">
            <div className="bg-white border-2 border-[#172554] rounded-2xl p-5 space-y-4">
              <div className="text-center border-b border-[#172554]/20 pb-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img
                      src="/avk-logo.svg"
                      alt="AVK Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#172554] tracking-tight uppercase">
                      AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
                    </h2>
                    <p className="text-[10px] font-bold text-amber-700">
                      Affiliated to CBSE New-Delhi &bull; Affiliation No: 1930319
                    </p>
                  </div>
                </div>
                <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#172554] text-white font-bold text-[9px] uppercase tracking-wider">
                  Payment Receipt Voucher
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <div>
                  <p className="text-[9px] text-[#64748B]">Receipt Number</p>
                  <p className="font-mono font-bold text-[#172033]">{parentReceiptModal.payment.receiptNumber}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">Payment Date</p>
                  <p className="font-semibold text-[#172033]">{parentReceiptModal.payment.paymentDate}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">Payment Mode</p>
                  <p className="font-semibold text-[#172033]">{parentReceiptModal.payment.paymentMode}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">Academic Year</p>
                  <p className="font-semibold text-[#172033]">{parentReceiptModal.fee.academicYear}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-white rounded-xl border border-[#E2E8F0]">
                <div>
                  <p className="text-[9px] text-[#64748B]">Student Name</p>
                  <p className="font-bold text-[#172033]">{parentReceiptModal.fee.studentName}</p>
                  <p className="text-[10px] text-[#64748B]">
                    Class: <strong>{parentReceiptModal.fee.className} • {parentReceiptModal.fee.sectionName}</strong>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">Admission Number</p>
                  <p className="font-mono font-bold text-[#3B5BDB]">{parentReceiptModal.fee.admissionNumber}</p>
                  {parentReceiptModal.payment.transactionReference && (
                    <p className="text-[9px] text-[#64748B] font-mono mt-0.5">
                      Ref: {parentReceiptModal.payment.transactionReference}
                    </p>
                  )}
                </div>
              </div>

              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="bg-[#F1F5F9] p-2 flex items-center justify-between font-bold text-[10px] text-[#64748B] uppercase">
                  <span>Fee Category Description</span>
                  <span>Amount Paid</span>
                </div>
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#172033]">{parentReceiptModal.fee.description}</p>
                    <p className="text-[10px] text-[#64748B]">
                      {parentReceiptModal.fee.items.map((i) => i.name).join(', ')}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#16A36A]">
                    {formatCurrency(parentReceiptModal.payment.amount)}
                  </span>
                </div>
                <div className="bg-[#F8FAFC] p-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#64748B]">Remaining Balance Outstanding:</span>
                  <span className="font-mono font-bold text-[#172033]">
                    {formatCurrency(parentReceiptModal.fee.balanceAmount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-[10px] text-[#64748B]">
                <span>Status: Verified Official Voucher</span>
                <span className="font-bold text-[#172033]">AVK Accounts Section</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setParentReceiptModal(null)}
              >
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-[#3B5BDB] hover:bg-[#2B4BC9] text-white font-bold"
                  onClick={() => window.print()}
                >
                  <Printer size={14} className="mr-1.5" />
                  Print Receipt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    alert(`Official receipt ${parentReceiptModal.payment.receiptNumber} downloaded.`);
                  }}
                >
                  <Download size={14} className="mr-1.5" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

