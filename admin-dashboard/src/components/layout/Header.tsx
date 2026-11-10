import React, { useState } from 'react';
import { Search, Bell, LogOut, User, ChevronDown, Check } from 'lucide-react';
import { useAuth, RoleType } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  const { user, userRole, signOut, switchDemoRole } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    school_admin: 'School Administrator',
    teacher: 'Teacher (Staff)',
    accountant: 'Accountant',
  };

  const availableRoles: { role: RoleType; label: string }[] = [
    { role: 'school_admin', label: 'School Admin (Full Access)' },
    { role: 'teacher', label: 'Teacher (Classroom & Marks)' },
    { role: 'accountant', label: 'Accountant (Fees & Receipts)' },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-40 shadow-xs">
      {/* Global Search */}
      <div className="flex items-center gap-2.5 bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 w-72 md:w-96">
        <Search size={16} className="text-[#64748B] shrink-0" />
        <input
          type="text"
          placeholder="Search students, admission no., circulars..."
          className="bg-transparent border-none outline-none text-xs text-[#172033] placeholder:text-[#94A3B8] w-full"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Quick Switcher (Demo helper for easy testing) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#172033] transition-colors cursor-pointer"
            title="Switch demo role to test role-based access"
          >
            <span className="text-[#64748B] font-normal">Role:</span>
            <span>{userRole ? roleLabels[userRole.role] : 'Admin'}</span>
            <ChevronDown size={14} className="text-[#64748B]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-[#F1F5F9]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Switch Role Persona
                </p>
              </div>
              {availableRoles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchDemoRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-[#172033] hover:bg-[#F5F7FB] transition-colors cursor-pointer"
                >
                  <span className={userRole?.role === r.role ? 'font-bold text-[#3B5BDB]' : ''}>
                    {r.label}
                  </span>
                  {userRole?.role === r.role && <Check size={14} className="text-[#3B5BDB]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors text-[#64748B] hover:text-[#172033] cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E03131] rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 hover:bg-[#F5F7FB] rounded-xl px-2.5 py-1.5 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-[#3B5BDB] rounded-full flex items-center justify-center shadow-xs">
              <User size={16} className="text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#172033] leading-tight">
                {userRole?.full_name || 'Admin User'}
              </p>
              <p className="text-[10px] text-[#64748B] truncate max-w-[140px]">
                {user?.email || 'admin@sunriseschool.edu.in'}
              </p>
            </div>
            <ChevronDown size={14} className="text-[#64748B]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-[#F1F5F9]">
                <p className="text-xs font-bold text-[#172033]">{userRole?.full_name}</p>
                <p className="text-[10px] text-[#64748B]">{userRole?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#E03131] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

