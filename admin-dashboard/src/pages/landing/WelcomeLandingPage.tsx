import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Bell,
  BookOpen,
  ArrowRight,
  Sparkles,
  Heart,
  Award,
  Layers,
  ChevronRight,
  School,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function WelcomeLandingPage() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Floating background bubble configurations
  const floatingShapes = [
    { size: 'w-72 h-72', color: 'from-[#3B5BDB]/20 to-[#8B5CF6]/20', x: [0, 40, -20, 0], y: [0, -50, 30, 0], duration: 18, delay: 0, left: '5%', top: '10%' },
    { size: 'w-96 h-96', color: 'from-[#38BDF8]/20 to-[#3B5BDB]/15', x: [0, -60, 40, 0], y: [0, 60, -40, 0], duration: 22, delay: 2, right: '5%', top: '15%' },
    { size: 'w-80 h-80', color: 'from-[#F472B6]/15 to-[#8B5CF6]/15', x: [0, 50, -40, 0], y: [0, 40, -60, 0], duration: 20, delay: 1, left: '20%', bottom: '10%' },
    { size: 'w-64 h-64', color: 'from-[#16A36A]/15 to-[#38BDF8]/15', x: [0, -30, 30, 0], y: [0, -40, 50, 0], duration: 16, delay: 3, right: '15%', bottom: '15%' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F5F3FF] text-[#172033] flex flex-col justify-between overflow-x-hidden selection:bg-[#3B5BDB] selection:text-white">
      {/* 1. ANIMATED BACKGROUND LAYER */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingShapes.map((shape, idx) => (
          <motion.div
            key={idx}
            className={`absolute rounded-full bg-gradient-to-tr ${shape.color} ${shape.size} blur-3xl`}
            style={{
              left: shape.left,
              right: shape.right,
              top: shape.top,
              bottom: shape.bottom,
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: shape.x,
                    y: shape.y,
                    scale: [1, 1.08, 0.95, 1],
                  }
            }
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: shape.delay,
            }}
          />
        ))}

        {/* Subtle geometric dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#172554 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* TOP BRAND HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-[#172554] via-[#3B5BDB] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#3B5BDB]/25 ring-2 ring-white">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg text-[#172554] tracking-tight block leading-tight">
              Sunrise International School
            </span>
            <span className="text-[11px] font-semibold text-[#64748B] tracking-wider uppercase">
              Excellence in Education • Estd. 1998
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-xs text-xs font-semibold text-[#172554]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Academic Year 2026–2027 Portal Active</span>
        </div>
      </motion.header>

      {/* 2. ANIMATED HERO SECTION & CAMPUS ILLUSTRATION */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-10 flex-1 flex flex-col items-center justify-center">
        {/* Welcome Text Sequence */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#DBE4FF] via-[#EDE9FE] to-[#FCE7F3] border border-white/60 text-xs font-bold text-[#3B5BDB] shadow-xs"
          >
            <Sparkles size={14} className="text-[#8B5CF6] animate-spin" style={{ animationDuration: '8s' }} />
            <span>Unified Educational Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-[#172554] tracking-tight leading-[1.15]"
          >
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#172554] via-[#3B5BDB] to-[#8B5CF6]">
              Sunrise School
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-sm sm:text-lg text-[#475569] font-medium max-w-2xl mx-auto"
          >
            Connecting Parents, Teachers & Students through an intelligent, seamless and modern digital campus experience.
          </motion.p>
        </div>

        {/* 3D Modern Campus Floating Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="relative my-8 sm:my-10 w-full max-w-2xl"
        >
          {/* Decorative Floating Educational Icons around the school */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [-6, 8, -6], rotate: [-4, 6, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -left-4 sm:left-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white flex items-center justify-center text-[#8B5CF6]"
          >
            <BookOpen size={22} />
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [8, -8, 8], rotate: [6, -6, 6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-6 -right-2 sm:right-6 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white flex items-center justify-center text-[#3B5BDB]"
          >
            <Award size={22} />
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [-8, 6, -8], rotate: [-6, 4, -6] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-4 left-10 z-20 w-11 h-11 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white flex items-center justify-center text-[#16A36A]"
          >
            <Heart size={20} />
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [6, -6, 6], rotate: [4, -4, 4] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute -bottom-3 right-12 z-20 w-11 h-11 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white flex items-center justify-center text-[#38BDF8]"
          >
            <Sparkles size={20} />
          </motion.div>

          {/* Stylized Modern School Campus Centerpiece */}
          <div className="relative mx-auto rounded-3xl p-1 bg-gradient-to-r from-[#3B5BDB]/20 via-[#8B5CF6]/30 to-[#38BDF8]/20 shadow-2xl backdrop-blur-sm">
            <div className="relative rounded-[22px] bg-gradient-to-b from-white/95 to-[#F8FAFC]/95 p-6 sm:p-8 border border-white shadow-inner flex flex-col sm:flex-row items-center gap-6 overflow-hidden">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#172554] via-[#3B5BDB] to-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-xl ring-4 ring-[#DBE4FF]">
                <School size={56} className="text-white drop-shadow-md" />
              </div>

              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3B5BDB]/10 text-[#3B5BDB]">
                    State-of-the-Art Infrastructure
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#16A36A]/10 text-[#16A36A]">
                    CBSE & Matriculation
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#172554] leading-tight">
                  Sunrise Digital Campus Ecosystem
                </h2>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Real-time attendance registers, continuous academic assessments, secure fee invoicing, and transparent parent-teacher communications.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Heading: Choose Your Portal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-center mb-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#3B5BDB] block mb-1">
            Access Gateway
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554]">
            Choose Your Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Select your destination to access student records or school administration tools
          </p>
        </motion.div>

        {/* 3 & 4. TWO INTERACTIVE PORTAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
          {/* CARD 1: PARENT PORTAL */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.025, y: -4 }}
            className="group relative rounded-3xl p-1 bg-gradient-to-br from-[#3B5BDB]/40 via-[#8B5CF6]/40 to-[#F472B6]/30 shadow-xl hover:shadow-2xl hover:shadow-[#8B5CF6]/20 transition-all duration-300"
          >
            <div className="relative h-full rounded-[22px] bg-white/95 backdrop-blur-xl p-7 sm:p-8 flex flex-col justify-between border border-white/80 overflow-hidden">
              {/* Subtle top glow */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#8B5CF6]/15 via-[#3B5BDB]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B5BDB] to-[#8B5CF6] text-white flex items-center justify-center shadow-lg shadow-[#3B5BDB]/30 group-hover:rotate-3 transition-transform">
                    <Users size={28} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                    For Parents & Guardians
                  </span>
                </div>

                <h3 className="text-2xl font-black text-[#172554] tracking-tight">
                  Parent Portal
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                  Stay connected with your child's learning journey and school activities.
                </p>

                {/* Features Checklist */}
                <div className="mt-6 pt-5 border-t border-[#F1F5F9] space-y-2.5">
                  {[
                    { label: 'Real-time Daily Attendance', icon: CalendarCheck, color: 'text-[#3B5BDB]' },
                    { label: 'Academic Performance & Marks', icon: Award, color: 'text-[#8B5CF6]' },
                    { label: 'School Announcements & Circulars', icon: Bell, color: 'text-[#F472B6]' },
                    { label: 'Fee Invoices & Digital Receipts', icon: CreditCard, color: 'text-[#16A36A]' },
                  ].map((feat, idx) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                          <CheckCircle2 size={13} className={feat.color} />
                        </div>
                        <span>{feat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Button
                  onClick={() => navigate('/parent/login')}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#3B5BDB] via-[#4F46E5] to-[#8B5CF6] hover:from-[#314CB6] hover:to-[#7C3AED] text-white font-bold text-sm shadow-lg shadow-[#3B5BDB]/30 py-6 rounded-xl flex items-center justify-center gap-2 group-hover:gap-3 transition-all cursor-pointer"
                >
                  <span>Continue as Parent</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-[11px] text-center text-[#94A3B8] mt-2 font-medium">
                  Sign in with registered mobile number & OTP
                </p>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: ADMIN & STAFF PORTAL */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.025, y: -4 }}
            className="group relative rounded-3xl p-1 bg-gradient-to-br from-[#172554]/40 via-[#3B5BDB]/40 to-[#38BDF8]/40 shadow-xl hover:shadow-2xl hover:shadow-[#3B5BDB]/25 transition-all duration-300"
          >
            <div className="relative h-full rounded-[22px] bg-white/95 backdrop-blur-xl p-7 sm:p-8 flex flex-col justify-between border border-white/80 overflow-hidden">
              {/* Subtle top glow */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#38BDF8]/15 via-[#3B5BDB]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#172554] via-[#1E3A8A] to-[#3B5BDB] text-white flex items-center justify-center shadow-lg shadow-[#172554]/30 group-hover:rotate-3 transition-transform">
                    <ShieldCheck size={28} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DBE4FF] text-[#1E40AF] border border-[#BFDBFE]">
                    Staff & Administration
                  </span>
                </div>

                <h3 className="text-2xl font-black text-[#172554] tracking-tight">
                  Admin & Staff Portal
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                  Manage school activities with one unified, role-based platform.
                </p>

                {/* Features Checklist */}
                <div className="mt-6 pt-5 border-t border-[#F1F5F9] space-y-2.5">
                  {[
                    { label: 'Student, Parent & Teacher Rosters', icon: Users, color: 'text-[#172554]' },
                    { label: 'Role-Based Dashboards (Admin/Teacher/Accountant)', icon: Layers, color: 'text-[#3B5BDB]' },
                    { label: 'Timetable & Exam Marks Entry', icon: Award, color: 'text-[#8B5CF6]' },
                    { label: 'Fee Accounting & Ledger Receipts', icon: CreditCard, color: 'text-[#16A36A]' },
                  ].map((feat, idx) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                          <CheckCircle2 size={13} className={feat.color} />
                        </div>
                        <span>{feat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#3B5BDB] hover:from-[#0F172A] hover:to-[#2563EB] text-white font-bold text-sm shadow-lg shadow-[#172554]/25 py-6 rounded-xl flex items-center justify-center gap-2 group-hover:gap-3 transition-all cursor-pointer"
                >
                  <span>Continue to Staff Portal</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-[11px] text-center text-[#94A3B8] mt-2 font-medium">
                  Super Admin, School Admin, Teacher & Accountant login
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full border-t border-[#E2E8F0]/80 bg-white/40 backdrop-blur-md py-4 px-6 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Sunrise International School. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Lock size={12} className="text-emerald-600" />
              PostgreSQL Row Level Security
            </span>
            <span>•</span>
            <span>Supabase Realtime Cloud</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
