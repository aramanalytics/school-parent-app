import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, getRoleDashboardPath } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GraduationCap, Eye, EyeOff, ShieldCheck, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@sunriseschool.edu.in',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const { error, role } = await signIn(data.email, data.password);
    if (error) {
      setError(error.message);
    } else {
      const targetRole = role || 'school_admin';
      navigate(getRoleDashboardPath(targetRole));
    }
  };

  const handleQuickFill = (role: 'super_admin' | 'admin' | 'teacher' | 'accountant') => {
    if (role === 'super_admin') {
      setValue('email', 'superadmin@sunriseschool.edu.in');
      setValue('password', 'password123');
    } else if (role === 'admin') {
      setValue('email', 'admin@sunriseschool.edu.in');
      setValue('password', 'password123');
    } else if (role === 'teacher') {
      setValue('email', 'saravanan.m@sunriseschool.edu.in');
      setValue('password', 'password123');
    } else {
      setValue('email', 'accountant@sunriseschool.edu.in');
      setValue('password', 'password123');
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage: "url('/school-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle light/blur overlay to enhance readability and soften the background */}
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#172554] rounded-2xl mb-3 shadow-xl ring-4 ring-white/20">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
            Sunrise School Management
          </h1>
          <p className="text-xs text-white/90 mt-1 font-medium drop-shadow-sm">
            Admin & Teacher Web Portal
          </p>
        </div>

        {/* Login Box with Subtle White Glass Effect */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-[#E03131] font-semibold">
                {error}
              </div>
            )}

            <Input
              label="Official Email Address"
              type="email"
              placeholder="admin@sunriseschool.edu.in"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Account Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8.5 text-[#94A3B8] hover:text-[#172033] cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" loading={isSubmitting}>
              Sign In to Portal
            </Button>
          </form>

          {/* Quick Demo Credentials Fill */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
              Quick Test Credentials by Role:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('super_admin')}
                className="px-2 py-1.5 rounded-lg border border-[#3B5BDB]/40 bg-[#3B5BDB]/5 hover:bg-[#3B5BDB]/15 text-[11px] font-semibold text-[#3B5BDB] text-center cursor-pointer transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF2F6] text-[11px] font-medium text-[#172033] text-center cursor-pointer transition-colors"
              >
                School Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('teacher')}
                className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF2F6] text-[11px] font-medium text-[#172033] text-center cursor-pointer transition-colors"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('accountant')}
                className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF2F6] text-[11px] font-medium text-[#172033] text-center cursor-pointer transition-colors"
              >
                Accountant
              </button>
            </div>
          </div>

          {/* Dedicated Parent Portal Entry Banner */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
            <Link
              to="/parent/login"
              className="flex items-center justify-between p-3.5 rounded-xl border border-[#3B5BDB]/30 bg-[#DBE4FF]/40 hover:bg-[#DBE4FF]/70 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3B5BDB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <UserCheck size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#172554] group-hover:text-[#3B5BDB] transition-colors">
                    Access Parent Mobile & Web Portal
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Sign in with registered mobile number & OTP
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#3B5BDB] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-white/90 drop-shadow-sm font-medium">
          <ShieldCheck size={14} className="text-[#16A36A]" />
          <span>Role-Based Access Protected by PostgreSQL RLS</span>
        </div>
      </div>
    </div>
  );
}

