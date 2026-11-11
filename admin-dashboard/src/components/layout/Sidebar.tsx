import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Clock,
  Megaphone,
  BookOpen,
  ClipboardList,
  NotebookPen,
  Calendar,
  MessageSquare,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Settings,
  ShieldCheck,
  UserCheck,
  Building2,
  SlidersHorizontal,
  FileText,
  BadgeCheck,
  FileCheck,
  Receipt,
  Layers,
  Award,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, RoleType } from '@/contexts/AuthContext';

export interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

/**
 * 1. Super Admin Navigation:
 * Full system and multi-school governance:
 * Dashboard, User Management, Role Management, School Management, Academic Setup, Reports, Settings.
 */
export const superAdminNavItems: NavItem[] = [
  { label: 'Super Admin Dashboard', icon: LayoutDashboard, href: '/super-admin/dashboard' },
  { label: 'User Management', icon: Users, href: '/students' },
  { label: 'Role & Permissions', icon: ShieldCheck, href: '/teachers' },
  { label: 'School Management', icon: Building2, href: '/settings' },
  {
    label: 'Academic Setup',
    icon: Layers,
    href: '/timetable',
    children: [
      { label: 'Classes & Sections', href: '/students' },
      { label: 'Subject Directory', href: '/materials' },
      { label: 'Academic Years', href: '/calendar' },
    ],
  },
  {
    label: 'Financial Governance',
    icon: Wallet,
    href: '/fees',
    children: [
      { label: 'Fee Structures', href: '/fees' },
      { label: 'Revenue Overview', href: '/fees' },
    ],
  },
  { label: 'Reports & Analytics', icon: TrendingUp, href: '/attendance' },
  { label: 'System Settings', icon: Settings, href: '/settings' },
];

/**
 * 2. School Admin Navigation:
 * Daily operations and academic management:
 * Dashboard, Students, Parents, Teachers, Classes, Attendance, Academics, Examinations, Timetable, Notice Board, Learning Materials, Calendar, Feedback.
 */
export const schoolAdminNavItems: NavItem[] = [
  { label: 'School Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  {
    label: 'People',
    icon: Users,
    href: '/students',
    children: [
      { label: 'Students', href: '/students' },
      { label: 'Parents', href: '/parents' },
      { label: 'Teachers', href: '/teachers' },
    ],
  },
  { label: 'Attendance', icon: CalendarCheck, href: '/attendance' },
  {
    label: 'Academics',
    icon: GraduationCap,
    href: '/timetable',
    children: [
      { label: 'Timetable', href: '/timetable' },
      { label: 'Examinations', href: '/examinations' },
      { label: 'Study Materials', href: '/materials' },
      { label: 'Online Tests', href: '/tests' },
    ],
  },
  { label: 'Diary & Homework', icon: NotebookPen, href: '/diary' },
  { label: 'Notice Board', icon: Megaphone, href: '/notices' },
  { label: 'School Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Parent Feedback', icon: MessageSquare, href: '/feedback', badge: '1' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'School Settings', icon: Settings, href: '/settings' },
];

/**
 * 3. Teacher Navigation:
 * Dedicated to assigned classes, student evaluation, and classroom delivery:
 * Dashboard, My Classes, My Students, Mark Attendance, My Timetable, Homework & Diary, Exams, Marks Entry, Study Materials, Notices.
 */
export const teacherNavItems: NavItem[] = [
  { label: 'My Dashboard', icon: LayoutDashboard, href: '/teacher/dashboard' },
  { label: 'My Assigned Classes', icon: GraduationCap, href: '/students' },
  { label: 'My Students', icon: Users, href: '/students' },
  { label: 'Mark Attendance', icon: CalendarCheck, href: '/attendance' },
  { label: 'My Timetable', icon: Clock, href: '/timetable' },
  { label: 'Homework & Diary', icon: NotebookPen, href: '/diary' },
  { label: 'Online Tests', icon: ClipboardList, href: '/tests' },
  { label: 'Examinations & Marks', icon: Award, href: '/examinations' },
  { label: 'Learning Materials', icon: BookOpen, href: '/materials' },
  { label: 'Staff Notices', icon: Megaphone, href: '/notices' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
];

/**
 * 4. Accountant Navigation:
 * Dedicated to collections, invoices, fee structures, receipts, and financial reconciliation:
 * Finance Dashboard, Fee Categories, Student Fee Records, Record Payments, Receipts, Pending Fees, Financial Reports.
 */
export const accountantNavItems: NavItem[] = [
  { label: 'Finance Dashboard', icon: LayoutDashboard, href: '/accountant/dashboard' },
  { label: 'Fee Management', icon: CreditCard, href: '/fees' },
  {
    label: 'Fee Setup & Invoices',
    icon: Receipt,
    href: '/fees',
    children: [
      { label: 'Fee Categories', href: '/fees' },
      { label: 'Student Fee Invoices', href: '/fees' },
      { label: 'Payment Records', href: '/fees' },
    ],
  },
  { label: 'Pending & Overdue Fees', icon: Clock, href: '/fees', badge: 'Alert' },
  { label: 'Fee Receipts', icon: FileCheck, href: '/fees' },
  { label: 'School Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Finance Notices', icon: Megaphone, href: '/notices' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
];

export function getNavItemsForRole(role: RoleType): NavItem[] {
  switch (role) {
    case 'super_admin':
      return superAdminNavItems;
    case 'school_admin':
      return schoolAdminNavItems;
    case 'teacher':
      return teacherNavItems;
    case 'accountant':
      return accountantNavItems;
    default:
      return schoolAdminNavItems;
  }
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { userRole } = useAuth();
  const currentRole: RoleType = userRole?.role || 'school_admin';
  const roleNavItems = getNavItemsForRole(currentRole);

  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'People',
    'Academics',
    'Academic Setup',
    'Fee Setup & Invoices',
  ]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const roleMeta: Record<RoleType, { label: string; badgeColor: string }> = {
    super_admin: { label: 'Super Admin', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
    school_admin: { label: 'School Admin', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
    teacher: { label: 'Teacher Portal', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    accountant: { label: 'Accountant', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-[#172554] text-white flex flex-col z-50 transition-all duration-300 shadow-xl select-none',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#3B5BDB] to-[#4C6EF5] rounded-xl flex items-center justify-center shrink-0 shadow-sm ring-1 ring-white/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-bold text-sm text-white tracking-tight block truncate">
                Sunrise School
              </span>
              <span className="text-[10px] text-white/60 tracking-wider uppercase block">
                {roleMeta[currentRole].label}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Role Pill */}
      {!collapsed && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px]">
            <span className="text-white/60">Active Role</span>
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold border', roleMeta[currentRole].badgeColor)}>
              {roleMeta[currentRole].label}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        {roleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const isGroupOpen = expandedGroups.includes(item.label);
          const hasChildren = item.children && item.children.length > 0;
          const isChildActive = item.children?.some((c) => location.pathname === c.href);

          if (hasChildren) {
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer',
                    isChildActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={18} className="shrink-0 text-white/80" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <div className="shrink-0">
                      {isGroupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  )}
                </button>

                {!collapsed && isGroupOpen && (
                  <div className="pl-9 pr-1 space-y-1">
                    {item.children?.map((child) => {
                      const isSubActive = location.pathname === child.href;
                      return (
                        <Link
                          key={child.label}
                          to={child.href}
                          className={cn(
                            'block px-3 py-1.5 rounded-lg text-xs transition-colors',
                            isSubActive
                              ? 'bg-[#3B5BDB] text-white font-semibold shadow-xs'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#3B5BDB] text-white font-semibold shadow-sm'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon size={18} className="shrink-0 text-white/80" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E03131] text-white shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between px-2 py-1 text-[11px] text-white/60">
            <span>Sunrise Edu v2.4</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
}
