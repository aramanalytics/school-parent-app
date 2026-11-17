import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useParentAuth } from '@/contexts/ParentAuthContext';
import {
  Bus,
  Navigation,
  Radio,
  Bell,
  ArrowLeft,
  ChevronDown,
  Check,
  LogOut,
  Clock,
  Shield,
  UserCheck,
} from 'lucide-react';
import { getStudentBusAssignment } from '@/lib/transportData';

interface ParentBusLayoutProps {
  children: React.ReactNode;
}

export function ParentBusLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { parent, linkedStudents, activeStudent, setActiveStudent, signOut } = useParentAuth();
  const [showChildPicker, setShowChildPicker] = useState(false);

  const { bus, route, assignment } = getStudentBusAssignment(activeStudent?.id);

  const handleSignOut = async () => {
    await signOut();
    navigate('/parent/login');
  };

  const navTabs = [
    { href: '/parent/bus', label: 'Bus Overview', icon: Bus },
    { href: '/parent/bus/route', label: 'My Bus Route', icon: Navigation },
    { href: '/parent/bus/tracking', label: 'Live Bus Tracking', icon: Radio },
    { href: '/parent/bus/notifications', label: 'Bus Notifications', icon: Bell },
  ];

  if (!parent || !activeStudent) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-md">
          <p className="text-sm font-bold text-[#172033]">Session Expired</p>
          <p className="text-xs text-[#64748B] mt-1 mb-4">Please log in to your Parent Portal.</p>
          <button
            onClick={() => navigate('/parent/login')}
            className="px-4 py-2 bg-[#3B5BDB] text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Go to Parent Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#172554] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <Link to="/parent/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center">
                <img
                  src="/avk-logo.svg"
                  alt="AVK Logo"
                  className="w-full h-full object-contain aspect-square"
                />
              </div>
              <div>
                <p
                  className="font-black text-xs sm:text-sm tracking-tight leading-tight uppercase"
                  title="AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL"
                >
                  AVK Senior Secondary School
                </p>
                <p className="text-[10px] text-amber-300 font-semibold tracking-wide">
                  Affiliated to CBSE New-Delhi &bull; 1930319
                </p>
              </div>
            </Link>
          </div>

          {/* Child Switcher & Parent Profile */}
          <div className="flex items-center gap-3">
            {/* Multi-child Switcher Dropdown */}
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

            {/* Back to Parent Dashboard Button */}
            <Link
              to="/parent/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* School Bus Navigation Sub-tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-white/10 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.href;
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#3B5BDB] text-white font-bold bg-white/5'
                    : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Child & Transport Quick Badge */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={activeStudent.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&fit=crop'}
              alt={activeStudent.first_name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-[#3B5BDB]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#172033]">
                  {activeStudent.first_name} {activeStudent.last_name}
                </h2>
                <span className="text-[10px] font-semibold bg-[#DBE4FF] text-[#3B5BDB] px-2 py-0.5 rounded-full">
                  {activeStudent.class_name} • {activeStudent.section_name}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Adm No: <span className="font-mono text-[#172033] font-semibold">{activeStudent.admission_number}</span>
                {bus ? (
                  <> &bull; Assigned: <strong className="text-[#172033]">{bus.busNumber}</strong> ({route?.name})</>
                ) : (
                  <span className="text-amber-600 font-semibold"> &bull; No Bus Allocated</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/parent/dashboard"
              className="sm:hidden text-xs text-[#3B5BDB] font-semibold flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Dashboard
            </Link>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-[#64748B]">
        <p>AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL &bull; CBSE Affiliation No: 1930319</p>
      </footer>
    </div>
  );
}
