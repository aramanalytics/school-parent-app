import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  children?: { label: string; href: string }[];
  roles?: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
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
  {
    label: 'Fees & Finance',
    icon: CreditCard,
    href: '/fees',
    roles: ['super_admin', 'school_admin', 'accountant'],
  },
  { label: 'Diary & Tasks', icon: NotebookPen, href: '/diary' },
  { label: 'Notice Board', icon: Megaphone, href: '/notices' },
  { label: 'School Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Parent Feedback', icon: MessageSquare, href: '/feedback', badge: '1' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    roles: ['super_admin', 'school_admin'],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { userRole } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['People', 'Academics']);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return userRole && item.roles.includes(userRole.role);
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-[#172554] text-white transition-all duration-300 z-50 flex flex-col shadow-xl select-none',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#3B5BDB] rounded-xl flex items-center justify-center font-bold text-base shadow-sm">
              S
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight leading-tight">Sunrise School</p>
              <p className="text-[10px] text-white/60 tracking-wider uppercase font-semibold">
                Admin Portal
              </p>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 mx-auto bg-[#3B5BDB] rounded-xl flex items-center justify-center font-bold text-base shadow-sm">
            S
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          {collapsed ? <Menu size={20} /> : <X size={18} />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!collapsed && userRole && (
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2.5">
          <ShieldCheck size={16} className="text-[#3B5BDB] shrink-0" />
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-white/90 truncate uppercase tracking-wider">
              {userRole.role.replace('_', ' ')}
            </p>
            <p className="text-[10px] text-white/50 truncate">Verified Access</p>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {filteredItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            item.children?.some((c) => location.pathname === c.href);
          const isExpanded = expandedGroups.includes(item.label);
          const Icon = item.icon;

          if (item.children && !collapsed) {
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer',
                    isActive
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon size={18} className={isActive ? 'text-[#3B5BDB]' : 'text-white/60'} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isExpanded ? (
                    <ChevronDown size={15} className="text-white/50" />
                  ) : (
                    <ChevronRight size={15} className="text-white/50" />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-4 pl-3 border-l border-white/10 space-y-1 py-1">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={cn(
                            'block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            isChildActive
                              ? 'bg-[#3B5BDB] text-white font-semibold shadow-xs'
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
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
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all',
                isActive
                  ? 'bg-[#3B5BDB] text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon size={18} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E03131] text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* School Info Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">Academic Year 2026-2027</p>
        </div>
      )}
    </aside>
  );
}

