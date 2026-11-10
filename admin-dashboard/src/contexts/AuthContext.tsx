import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type RoleType = 'super_admin' | 'school_admin' | 'teacher' | 'accountant';

export interface UserRoleInfo {
  role: RoleType;
  school_id: string;
  full_name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRoleInfo | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: RoleType) => void;
}

const defaultAdminRole: UserRoleInfo = {
  role: 'school_admin',
  school_id: '11111111-1111-1111-1111-111111111111',
  full_name: 'Dr. K. Sundararajan (Principal)',
  email: 'admin@sunriseschool.edu.in',
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
          const role = storedRole || 'school_admin';
          setUser({
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            email: role === 'teacher' ? 'saravanan.m@sunriseschool.edu.in' : 'admin@sunriseschool.edu.in',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User);
          setUserRole({
            role,
            school_id: '11111111-1111-1111-1111-111111111111',
            full_name: role === 'teacher' ? 'M. Saravanan (Senior Teacher)' : 'Dr. K. Sundararajan (Principal)',
            email: role === 'teacher' ? 'saravanan.m@sunriseschool.edu.in' : 'admin@sunriseschool.edu.in',
          });
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

  const loadRole = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, school_id')
        .eq('profile_id', userId)
        .eq('is_active', true)
        .single();

      if (data && !error) {
        setUserRole({
          role: data.role as RoleType,
          school_id: data.school_id,
          full_name: email.split('@')[0],
          email,
        });
      } else {
        // Fallback to school admin
        setUserRole({
          role: 'school_admin',
          school_id: '11111111-1111-1111-1111-111111111111',
          full_name: email,
          email,
        });
      }
    } catch {
      setUserRole(defaultAdminRole);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error as Error | null };
    } else {
      // Demo authentication: allow test logins
      if (password.length >= 6) {
        const isTeacher = email.includes('teacher') || email.includes('saravanan');
        const isAccountant = email.includes('accountant');
        const role: RoleType = isTeacher ? 'teacher' : isAccountant ? 'accountant' : 'school_admin';

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

        setUserRole({
          role,
          school_id: '11111111-1111-1111-1111-111111111111',
          full_name: isTeacher ? 'M. Saravanan (Senior Teacher)' : 'Dr. K. Sundararajan (Principal)',
          email,
        });

        return { error: null };
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
  };

  const switchDemoRole = (role: RoleType) => {
    localStorage.setItem('demo_role', role);
    setUserRole({
      role,
      school_id: '11111111-1111-1111-1111-111111111111',
      full_name: role === 'teacher' ? 'M. Saravanan (Teacher)' : role === 'accountant' ? 'R. Venkat (Accountant)' : 'Dr. K. Sundararajan (Principal)',
      email: `${role}@sunriseschool.edu.in`,
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signIn, signOut, switchDemoRole }}>
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

