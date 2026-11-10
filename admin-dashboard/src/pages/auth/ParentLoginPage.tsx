import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useParentAuth } from '@/contexts/ParentAuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  GraduationCap,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RotateCw,
  Info,
} from 'lucide-react';

export function ParentLoginPage() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, parent, isLiveSupabase } = useParentAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9884011223');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

  // If already authenticated as parent, redirect to dashboard
  useEffect(() => {
    if (parent) {
      navigate('/parent/dashboard');
    }
  }, [parent, navigate]);

  // Resend countdown timer
  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const res = await sendOtp(clean);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      setTimer(30);
    } else {
      setError(res.error || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyOtp(phone, otp);
    setLoading(false);

    if (res.success) {
      navigate('/parent/dashboard');
    } else {
      setError(res.error || 'Invalid OTP code.');
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setError(null);
    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);
    if (res.success) {
      setTimer(30);
    } else {
      setError(res.error || 'Could not resend OTP.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Portal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#172554] rounded-2xl mb-3 shadow-md">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            Sunrise School Parent Portal
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Monitor attendance, exams, fees, diary & circulars for your wards
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-[#E03131] font-semibold">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden bg-[#F8FAFC] focus-within:border-[#3B5BDB] focus-within:ring-2 focus-within:ring-[#3B5BDB]/20">
                  <div className="px-3 py-2.5 bg-[#EEF2F6] border-r border-[#E2E8F0] text-xs font-bold text-[#172033] flex items-center gap-1.5 shrink-0">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98840 11223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-transparent outline-none font-medium text-[#172033]"
                    required
                  />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1.5">
                  Only phone numbers registered with the school can receive OTP.
                </p>
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
                <span>Send 6-Digit OTP</span>
                <ArrowRight size={16} />
              </Button>

              {/* Sample Registered Numbers for Browser Testing */}
              <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Test Parent Profiles (Seed Data):
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setPhone('9884011223')}
                    className="w-full text-left p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#EEF2F6] transition-colors cursor-pointer text-xs"
                  >
                    <p className="font-semibold text-[#172033]">Ramesh Krishnan (+91 98840 11223)</p>
                    <p className="text-[10px] text-[#64748B]">2 Wards: Aarav (Class 5-A) & Diya (Class 5-B)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhone('9884022334')}
                    className="w-full text-left p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#EEF2F6] transition-colors cursor-pointer text-xs"
                  >
                    <p className="font-semibold text-[#172033]">Anitha Senthil (+91 98840 22334)</p>
                    <p className="text-[10px] text-[#64748B]">1 Ward: Karthik Senthil (Class 5-A)</p>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs font-semibold text-[#3B5BDB] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ArrowLeft size={14} /> Change Number
                </button>
                <span className="text-xs font-mono font-bold text-[#172033]">
                  +91 {phone}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••••"
                  className="w-full py-3 text-center text-2xl font-bold tracking-widest font-mono border-2 border-[#3B5BDB] rounded-xl outline-none bg-[#F8FAFC] focus:bg-white text-[#172033]"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
                <span>Verify OTP & Enter Portal</span>
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                {timer > 0 ? (
                  <span className="text-[#94A3B8]">Resend available in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="font-semibold text-[#3B5BDB] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw size={13} /> Resend OTP Code
                  </button>
                )}
                <span className="text-[10px] text-[#64748B]">Any 6 digits in demo mode</span>
              </div>
            </form>
          )}

          {/* Switch to Admin/Teacher Portal */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <p className="text-xs text-[#64748B]">Are you a teacher or school administrator?</p>
            <Link
              to="/login"
              className="inline-block mt-1.5 text-xs font-bold text-[#3B5BDB] hover:underline"
            >
              ← Switch to Staff & Admin Login
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
          <ShieldCheck size={14} className="text-[#16A36A]" />
          <span>Parent Phone OTP Access Protected by Row Level Security</span>
        </div>
      </div>
    </div>
  );
}

