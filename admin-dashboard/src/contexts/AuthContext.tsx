import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type RoleType = 'super_admin' | 'school_admin' | 'teacher' | 'accountant';

export interface UserRoleInfo {
  role: RoleType;
  school_id: string;
  full_name: string;
  email: string;
  teacher_id?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRoleInfo | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; role?: RoleType }>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: RoleType) => void;
  getRoleDashboardPath: (role: RoleType) => string;
}

export const getRoleDashboardPath = (role: RoleType): string => {
  switch (role) {
    case 'super_admin':
      return '/super-admin/dashboard';
    case 'school_admin':
      return '/admin/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'accountant':
      return '/accountant/dashboard';
    default:
      return '/admin/dashboard';
  }
};

const defaultSchoolAdminRole: UserRoleInfo = {
  role: 'school_admin',
  school_id: '11111111-1111-1111-1111-111111111111',
  full_name: 'Dr. K. Sundararajan (Principal)',
  email: 'admin@sunriseschool.edu.in',
};

const roleProfiles: Record<RoleType, UserRoleInfo> = {
  super_admin: {
    role: 'super_admin',
    school_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Chief Admin (System Director)',
    email: 'superadmin@sunriseschool.edu.in',
  },
  school_admin: {
    role: 'school_admin',
    school_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Dr. K. Sundararajan (Principal)',
    email: 'admin@sunriseschool.edu.in',
  },
  teacher: {
    role: 'teacher',
    school_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'M. Saravanan (Senior Teacher)',
    email: 'saravanan.m@sunriseschool.edu.in',
    teacher_id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001',
  },
  accountant: {
    role: 'accountant',
    school_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'R. Venkat (Senior Accountant)',
    email: 'accountant@sunriseschool.edu.in',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRoleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Check initial session
  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadRole(session.user.id, session.user.email ?? '');
          }
        } catch (err) {
          console.error('Session retrieval error:', err);
        }
      } else {
        // Local demo mode check
        const storedRole = localStorage.getItem('demo_role') as RoleType | null;
        const storedAuth = localStorage.getItem('demo_auth');
        if (storedAuth === 'true') {
          const role: RoleType = storedRole || 'school_admin';
          const info = roleProfiles[role] || roleProfiles.school_admin;
          setUser({
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            email: info.email,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User);
          setUserRole(info);
        }
      }
      setLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadRole(session.user.id, session.user.email ?? '');
          } else {
            setUserRole(null);
          }
          setLoading(false);
        }
      );
      return () => subscription.unsubscribe();
    }
  }, []);

  const loadRole = async (userId: string, email: string): Promise<RoleType> => {
    try {
      // 1. Fetch role from user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, school_id')
        .eq('profile_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let detectedRole: RoleType = 'school_admin';
      let schoolId = '11111111-1111-1111-1111-111111111111';

      if (data && !error && data.role) {
        detectedRole = data.role as RoleType;
        schoolId = data.school_id || schoolId;
      } else {
        // Fallback check: check email heuristics if user_roles record not yet created
        if (email.includes('superadmin')) detectedRole = 'super_admin';
        else if (email.includes('teacher') || email.includes('saravanan')) detectedRole = 'teacher';
        else if (email.includes('accountant') || email.includes('accounts')) detectedRole = 'accountant';
        else detectedRole = 'school_admin';
      }

      // 2. Fetch full profile name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      // 3. If teacher, get teacher record id
      let teacherId: string | undefined;
      if (detectedRole === 'teacher') {
        const { data: teacherData } = await supabase
          .from('teachers')
          .select('id')
          .eq('profile_id', userId)
          .single();
        teacherId = teacherData?.id;
      }

      const roleInfo: UserRoleInfo = {
        role: detectedRole,
        school_id: schoolId,
        full_name: profileData?.full_name || email.split('@')[0],
        email,
        teacher_id: teacherId,
      };

      setUserRole(roleInfo);
      return detectedRole;
    } catch {
      setUserRole(defaultSchoolAdminRole);
      return 'school_admin';
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null; role?: RoleType }> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error as Error };
      }
      if (data.user) {
        const role = await loadRole(data.user.id, data.user.email ?? email);
        return { error: null, role };
      }
      return { error: null, role: 'school_admin' };
    } else {
      // Demo authentication: determine role from email
      if (password.length >= 6) {
        let role: RoleType = 'school_admin';
        if (email.includes('superadmin')) {
          role = 'super_admin';
        } else if (email.includes('teacher') || email.includes('saravanan')) {
          role = 'teacher';
        } else if (email.includes('accountant')) {
          role = 'accountant';
        } else {
          role = 'school_admin';
        }

        const info = roleProfiles[role];
        localStorage.setItem('demo_auth', 'true');
        localStorage.setItem('demo_role', role);

        setUser({
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User);

        setUserRole(info);
        return { error: null, role };
      } else {
        return { error: new Error('Password must be at least 6 characters') };
      }
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('demo_auth');
    localStorage.removeItem('demo_role');
    setUser(null);
    setSession(null);
    setUserRole(null);
    window.location.href = '/';
  };

  const switchDemoRole = (role: RoleType) => {
    localStorage.setItem('demo_role', role);
    const info = roleProfiles[role] || roleProfiles.school_admin;
    setUserRole(info);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        loading,
        signIn,
        signOut,
        switchDemoRole,
        getRoleDashboardPath,
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


