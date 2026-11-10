import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { demoStudents, ParentStudentInfo } from '@/services/parentData';
import { translations, Language } from '@/i18n/translations';

interface ParentUser {
  id: string;
  phone: string;
  name: string;
  email?: string;
}

interface AuthContextType {
  user: ParentUser | null;
  loading: boolean;
  students: ParentStudentInfo[];
  selectedStudent: ParentStudentInfo;
  language: Language;
  t: any;
  setLanguage: (lang: Language) => void;
  switchStudent: (studentId: string) => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  pendingPhone: string;
}

const defaultParent: ParentUser = {
  id: 'cccccccc-1111-cccc-cccc-cccccccc0001',
  phone: '+919884011223',
  name: 'Ramesh Krishnan',
  email: 'ramesh.krishnan@gmail.com',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ParentUser | null>(defaultParent);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<ParentStudentInfo[]>(demoStudents);
  const [selectedStudent, setSelectedStudent] = useState<ParentStudentInfo>(demoStudents[0]);
  const [language, setLanguageState] = useState<Language>('en');
  const [pendingPhone, setPendingPhone] = useState('+919884011223');

  const t = translations[language] || translations.en;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const switchStudent = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (target) {
      setSelectedStudent(target);
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    setPendingPhone(phone);

    // Validate phone number (must be registered Indian mobile or test number)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone.startsWith('+') ? phone : `+91${cleanPhone.slice(-10)}`,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send OTP' };
      }
    } else {
      // Demo phone OTP simulation: allows login for demo test phone numbers
      return { success: true };
    }
  };

  const verifyOtp = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!code || code.length !== 6) {
      return { success: false, error: 'Please enter a 6-digit OTP code' };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: pendingPhone,
          token: code,
          type: 'sms',
        });
        if (error || !data.user) {
          return { success: false, error: error?.message || 'Invalid or expired OTP' };
        }
        setUser({
          id: data.user.id,
          phone: pendingPhone,
          name: data.user.user_metadata?.full_name || 'Parent User',
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'OTP verification failed' };
      }
    } else {
      // Demo mode: successfully authenticate
      setUser({
        id: 'cccccccc-1111-cccc-cccc-cccccccc0001',
        phone: pendingPhone,
        name: 'Ramesh Krishnan',
        email: 'ramesh.krishnan@gmail.com',
      });
      return { success: true };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        students,
        selectedStudent,
        language,
        t,
        setLanguage,
        switchStudent,
        sendOtp,
        verifyOtp,
        signOut,
        pendingPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
