import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { initialStudents, MockStudent } from '@/lib/mockData';

export interface ParentProfile {
  id: string;
  phone: string;
  full_name: string;
  email: string | null;
  relationship: string;
}

interface ParentAuthContextType {
  parent: ParentProfile | null;
  loading: boolean;
  linkedStudents: MockStudent[];
  activeStudent: MockStudent | null;
  setActiveStudent: (student: MockStudent) => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isLiveSupabase: boolean;
}

const ParentAuthContext = createContext<ParentAuthContextType | undefined>(undefined);

// Known registered parent mock profiles for browser testing fallback when Supabase SMS is not configured
const mockParentProfiles: Record<string, { parent: ParentProfile; studentIds: string[] }> = {
  '+919884011223': {
    parent: {
      id: 'cccccccc-1111-cccc-cccc-cccccccc0001',
      phone: '+919884011223',
      full_name: 'Ramesh Krishnan',
      email: 'ramesh.krishnan@gmail.com',
      relationship: 'Father',
    },
    // Links to Aarav (5-A) and Diya (5-B)
    studentIds: [
      '88888888-0001-8888-8888-888888888888',
      '88888888-0002-8888-8888-888888888888',
    ],
  },
  '+919884022334': {
    parent: {
      id: 'cccccccc-1111-cccc-cccc-cccccccc0002',
      phone: '+919884022334',
      full_name: 'Anitha Senthil',
      email: 'anitha.s@gmail.com',
      relationship: 'Mother',
    },
    // Links to Karthik (5-A)
    studentIds: ['88888888-0003-8888-8888-888888888888'],
  },
};

export function ParentAuthProvider({ children }: { children: React.ReactNode }) {
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedStudents, setLinkedStudents] = useState<MockStudent[]>([]);
  const [activeStudent, setActiveStudent] = useState<MockStudent | null>(null);

  // Check saved session on mount
  useEffect(() => {
    const initParentSession = async () => {
      const savedParentJson = localStorage.getItem('school_parent_profile');
      if (savedParentJson) {
        try {
          const parsedParent: ParentProfile = JSON.parse(savedParentJson);
          setParent(parsedParent);
          await loadLinkedStudents(parsedParent.phone, parsedParent.id);
        } catch (e) {
          localStorage.removeItem('school_parent_profile');
        }
      }
      setLoading(false);
    };

    initParentSession();
  }, []);

  const loadLinkedStudents = async (phone: string, parentProfileId?: string) => {
    if (isSupabaseConfigured) {
      try {
        // Query Supabase directly using parent-student link
        const { data, error } = await supabase
          .from('parent_students')
          .select(`
            student:students(
              id, admission_number, roll_number, first_name, last_name, 
              date_of_birth, gender, photo_url, is_active,
              section:sections(name, class:classes(name))
            )
          `)
          .eq('parent_id', parentProfileId);

        if (!error && data && data.length > 0) {
          const mappedStudents: MockStudent[] = data.map((item: any) => ({
            id: item.student.id,
            admission_number: item.student.admission_number,
            roll_number: item.student.roll_number || '01',
            first_name: item.student.first_name,
            last_name: item.student.last_name,
            gender: item.student.gender || 'male',
            date_of_birth: item.student.date_of_birth || '2016-01-01',
            class_name: item.student.section?.class?.name || 'Class 5',
            section_name: item.student.section?.name || 'Section A',
            is_active: item.student.is_active ?? true,
            parent_name: parent?.full_name || 'Parent',
            parent_phone: phone,
            photo_url: item.student.photo_url,
          }));

          setLinkedStudents(mappedStudents);
          setActiveStudent(mappedStudents[0] || null);
          return;
        }
      } catch (err) {
        console.warn('Falling back to local linked student lookup', err);
      }
    }

    // Fallback: load strictly linked children for this specific phone number
    const parentRecord = mockParentProfiles[phone];
    if (parentRecord) {
      const allowed = initialStudents.filter((s) => parentRecord.studentIds.includes(s.id));
      setLinkedStudents(allowed);
      setActiveStudent(allowed[0] || null);
    } else {
      setLinkedStudents([]);
      setActiveStudent(null);
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/[^0-9]/g, '').slice(-10)}`;

    if (isSupabaseConfigured) {
      // Connect to genuine Supabase Phone Auth
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } else {
      // Offline / Pre-configured validation: verify phone is registered with school
      if (!mockParentProfiles[formattedPhone]) {
        return {
          success: false,
          error: `Phone number ${formattedPhone} is not registered in the school records. Please contact school administration.`,
        };
      }
      return { success: true };
    }
  };

  const verifyOtp = async (phone: string, token: string): Promise<{ success: boolean; error?: string }> => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/[^0-9]/g, '').slice(-10)}`;

    if (token.length !== 6) {
      return { success: false, error: 'Please enter a complete 6-digit OTP code.' };
    }

    if (isSupabaseConfigured) {
      // Actual Supabase OTP verification
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid or expired OTP token.' };
      }

      // Load parent profile linked to auth user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('id', data.user.id)
        .single();

      const profile: ParentProfile = {
        id: data.user.id,
        phone: formattedPhone,
        full_name: profileData?.full_name || 'Registered Parent',
        email: profileData?.email || null,
        relationship: 'Guardian',
      };

      setParent(profile);
      localStorage.setItem('school_parent_profile', JSON.stringify(profile));
      await loadLinkedStudents(formattedPhone, profile.id);
      return { success: true };
    } else {
      // For development when Supabase SMS gateway is pending configuration:
      // Validates against registered mock parent profiles
      const profileInfo = mockParentProfiles[formattedPhone];
      if (!profileInfo) {
        return { success: false, error: 'No student is linked to this phone number.' };
      }

      setParent(profileInfo.parent);
      localStorage.setItem('school_parent_profile', JSON.stringify(profileInfo.parent));
      await loadLinkedStudents(formattedPhone, profileInfo.parent.id);
      return { success: true };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('school_parent_profile');
    setParent(null);
    setLinkedStudents([]);
    setActiveStudent(null);
    window.location.href = '/';
  };

  return (
    <ParentAuthContext.Provider
      value={{
        parent,
        loading,
        linkedStudents,
        activeStudent,
        setActiveStudent,
        sendOtp,
        verifyOtp,
        signOut,
        isLiveSupabase: isSupabaseConfigured,
      }}
    >
      {children}
    </ParentAuthContext.Provider>
  );
}

export function useParentAuth() {
  const context = useContext(ParentAuthContext);
  if (!context) {
    throw new Error('useParentAuth must be used within ParentAuthProvider');
  }
  return context;
}

