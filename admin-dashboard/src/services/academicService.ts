import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AcademicSession {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: 'active' | 'upcoming' | 'archived' | 'inactive';
  description?: string;
  created_at?: string;
}

export interface SchoolClass {
  id: string;
  school_id: string;
  academic_year_id: string;
  name: string;
  code?: string;
  numeric_order: number;
  status: 'active' | 'archived' | 'inactive';
  description?: string;
  created_at?: string;
  // Computed helpers
  sections_count?: number;
  students_count?: number;
  class_teacher_name?: string;
}

export interface ClassSection {
  id: string;
  class_id: string;
  name: string;
  max_capacity: number;
  class_teacher_id?: string;
  status: 'active' | 'archived' | 'inactive';
  description?: string;
  created_at?: string;
  // Computed helpers
  class_name?: string;
  teacher_name?: string;
  students_count?: number;
}

export interface AcademicSubject {
  id: string;
  school_id: string;
  name: string;
  code?: string;
  description?: string;
  created_at?: string;
  assigned_classes?: string[];
  assigned_teachers?: string[];
}

export interface TeacherAssignmentRecord {
  id: string;
  teacher_id: string;
  section_id: string;
  subject_id: string;
  academic_year_id: string;
  created_at?: string;
  teacher_name?: string;
  class_name?: string;
  section_name?: string;
  subject_name?: string;
}

export interface PromotionRecord {
  id: string;
  student_id: string;
  student_name: string;
  admission_number: string;
  from_session: string;
  to_session: string;
  from_class: string;
  to_class: string;
  from_section: string;
  to_section: string;
  promotion_date: string;
  remarks?: string;
}

// ----------------------------------------------------------------------------
// Local In-Memory Fallback Store (for offline demo mode & instant responsiveness)
// ----------------------------------------------------------------------------
let mockSessions: AcademicSession[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: '2026–2027',
    start_date: '2026-06-01',
    end_date: '2027-04-30',
    is_current: true,
    status: 'active',
    description: 'Current active academic year for all school branches.',
  },
  {
    id: '22222222-2222-2222-2222-222222222221',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: '2025–2026',
    start_date: '2025-06-01',
    end_date: '2026-04-30',
    is_current: false,
    status: 'archived',
    description: 'Completed previous academic cycle. Archived with full historical records.',
  },
  {
    id: '22222222-2222-2222-2222-222222222223',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: '2027–2028',
    start_date: '2027-06-01',
    end_date: '2028-04-30',
    is_current: false,
    status: 'upcoming',
    description: 'Upcoming admissions and class planning cycle.',
  },
];

let mockClasses: SchoolClass[] = [
  {
    id: '55555555-5555-5555-5555-555555555555',
    school_id: '11111111-1111-1111-1111-111111111111',
    academic_year_id: '22222222-2222-2222-2222-222222222222',
    name: 'Class 5',
    code: 'CLS-05',
    numeric_order: 5,
    status: 'active',
    description: 'Middle Primary standard curriculum',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    school_id: '11111111-1111-1111-1111-111111111111',
    academic_year_id: '22222222-2222-2222-2222-222222222222',
    name: 'Class 6',
    code: 'CLS-06',
    numeric_order: 6,
    status: 'active',
    description: 'Secondary foundation grade',
  },
];

let mockSections: ClassSection[] = [
  {
    id: '55555555-aaaa-5555-5555-555555555555',
    class_id: '55555555-5555-5555-5555-555555555555',
    name: 'Section A',
    max_capacity: 40,
    class_teacher_id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001',
    status: 'active',
    description: 'Room 204 • Class Teacher: M. Saravanan',
  },
  {
    id: '55555555-bbbb-5555-5555-555555555555',
    class_id: '55555555-5555-5555-5555-555555555555',
    name: 'Section B',
    max_capacity: 40,
    class_teacher_id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0002',
    status: 'active',
    description: 'Room 205 • Class Teacher: K. Malathi',
  },
  {
    id: '66666666-aaaa-6666-6666-666666666666',
    class_id: '66666666-6666-6666-6666-666666666666',
    name: 'Section A',
    max_capacity: 40,
    class_teacher_id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001',
    status: 'active',
    description: 'Room 302',
  },
];

let mockSubjects: AcademicSubject[] = [
  {
    id: '77777777-0001-7777-7777-777777777777',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: 'English Language & Literature',
    code: 'ENG-01',
    description: 'Core English grammar, prose, poetry and composition.',
  },
  {
    id: '77777777-0002-7777-7777-777777777777',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: 'Mathematics',
    code: 'MAT-02',
    description: 'Arithmetic, Fractions, Geometry and Problem Solving.',
  },
  {
    id: '77777777-0003-7777-7777-777777777777',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: 'General Science',
    code: 'SCI-03',
    description: 'Physics, Chemistry fundamentals, Botany and Zoology.',
  },
  {
    id: '77777777-0004-7777-7777-777777777777',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: 'Social Studies',
    code: 'SOC-04',
    description: 'History, Civics, Geography and Indian Heritage.',
  },
  {
    id: '77777777-0005-7777-7777-777777777777',
    school_id: '11111111-1111-1111-1111-111111111111',
    name: 'Tamil Language',
    code: 'TAM-05',
    description: 'Tamil grammar, literature, poetry and reading fluency.',
  },
];

let mockTeacherAssignments: TeacherAssignmentRecord[] = [
  {
    id: 'ta-001',
    teacher_id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001',
    section_id: '55555555-aaaa-5555-5555-555555555555',
    subject_id: '77777777-0002-7777-7777-777777777777',
    academic_year_id: '22222222-2222-2222-2222-222222222222',
    teacher_name: 'M. Saravanan',
    class_name: 'Class 5',
    section_name: 'Section A',
    subject_name: 'Mathematics',
  },
  {
    id: 'ta-002',
    teacher_id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001',
    section_id: '55555555-aaaa-5555-5555-555555555555',
    subject_id: '77777777-0003-7777-7777-777777777777',
    academic_year_id: '22222222-2222-2222-2222-222222222222',
    teacher_name: 'M. Saravanan',
    class_name: 'Class 5',
    section_name: 'Section A',
    subject_name: 'General Science',
  },
  {
    id: 'ta-003',
    teacher_id: 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0002',
    section_id: '55555555-aaaa-5555-5555-555555555555',
    subject_id: '77777777-0001-7777-7777-777777777777',
    academic_year_id: '22222222-2222-2222-2222-222222222222',
    teacher_name: 'K. Malathi',
    class_name: 'Class 5',
    section_name: 'Section A',
    subject_name: 'English Language & Literature',
  },
];

let mockPromotions: PromotionRecord[] = [
  {
    id: 'prom-001',
    student_id: '88888888-0001-8888-8888-888888888888',
    student_name: 'Aarav Krishnan',
    admission_number: 'ADM2026-0501',
    from_session: '2025–2026',
    to_session: '2026–2027',
    from_class: 'Class 4',
    to_class: 'Class 5',
    from_section: 'Section A',
    to_section: 'Section A',
    promotion_date: '2026-05-28',
    remarks: 'Promoted with Distinction (Grade A+)',
  },
];

// ============================================================================
// SERVICE API METHODS
// ============================================================================

export const academicService = {
  // 1. Sessions
  async getSessions(): Promise<AcademicSession[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });
      if (!error && data) return data as AcademicSession[];
    }
    return [...mockSessions];
  },

  async createSession(session: Omit<AcademicSession, 'id'>): Promise<AcademicSession> {
    const newSession: AcademicSession = {
      ...session,
      id: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('academic_years')
        .insert([newSession])
        .select()
        .single();
      if (!error && data) return data as AcademicSession;
    }

    // If set as active, deactivate other mock sessions
    if (newSession.is_current) {
      mockSessions = mockSessions.map((s) => ({
        ...s,
        is_current: false,
        status: s.status === 'active' ? 'archived' : s.status,
      }));
    }
    mockSessions.unshift(newSession);
    return newSession;
  },

  async setActiveSession(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      await supabase.from('academic_years').update({ is_current: false, status: 'archived' }).neq('id', id);
      const { error } = await supabase.from('academic_years').update({ is_current: true, status: 'active' }).eq('id', id);
      return !error;
    }

    mockSessions = mockSessions.map((s) => ({
      ...s,
      is_current: s.id === id,
      status: s.id === id ? 'active' : s.status === 'active' ? 'archived' : s.status,
    }));
    return true;
  },

  // 2. Classes
  async getClasses(sessionId?: string): Promise<SchoolClass[]> {
    if (isSupabaseConfigured) {
      let query = supabase.from('classes').select('*').order('numeric_order');
      if (sessionId) query = query.eq('academic_year_id', sessionId);
      const { data, error } = await query;
      if (!error && data) return data as SchoolClass[];
    }

    let result = [...mockClasses];
    if (sessionId) {
      result = result.filter((c) => c.academic_year_id === sessionId);
    }
    return result;
  },

  async createClass(cls: Omit<SchoolClass, 'id'>): Promise<SchoolClass> {
    const newClass: SchoolClass = {
      ...cls,
      id: crypto.randomUUID ? crypto.randomUUID() : `cls-${Date.now()}`,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('classes').insert([newClass]).select().single();
      if (!error && data) return data as SchoolClass;
    }

    mockClasses.push(newClass);
    return newClass;
  },

  // 3. Sections
  async getSections(classId?: string): Promise<ClassSection[]> {
    if (isSupabaseConfigured) {
      let query = supabase.from('sections').select('*').order('name');
      if (classId) query = query.eq('class_id', classId);
      const { data, error } = await query;
      if (!error && data) return data as ClassSection[];
    }

    let result = [...mockSections];
    if (classId) {
      result = result.filter((s) => s.class_id === classId);
    }
    return result;
  },

  async createSection(sec: Omit<ClassSection, 'id'>): Promise<ClassSection> {
    const newSection: ClassSection = {
      ...sec,
      id: crypto.randomUUID ? crypto.randomUUID() : `sec-${Date.now()}`,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('sections').insert([newSection]).select().single();
      if (!error && data) return data as ClassSection;
    }

    mockSections.push(newSection);
    return newSection;
  },

  // 4. Subjects
  async getSubjects(): Promise<AcademicSubject[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('subjects').select('*').order('name');
      if (!error && data) return data as AcademicSubject[];
    }
    return [...mockSubjects];
  },

  async createSubject(sub: Omit<AcademicSubject, 'id'>): Promise<AcademicSubject> {
    const newSubject: AcademicSubject = {
      ...sub,
      id: crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('subjects').insert([newSubject]).select().single();
      if (!error && data) return data as AcademicSubject;
    }

    mockSubjects.push(newSubject);
    return newSubject;
  },

  // 5. Teacher Assignments
  async getTeacherAssignments(sessionId?: string): Promise<TeacherAssignmentRecord[]> {
    if (isSupabaseConfigured) {
      let query = supabase.from('teacher_assignments').select('*');
      if (sessionId) query = query.eq('academic_year_id', sessionId);
      const { data, error } = await query;
      if (!error && data) return data as TeacherAssignmentRecord[];
    }

    let result = [...mockTeacherAssignments];
    if (sessionId) {
      result = result.filter((a) => a.academic_year_id === sessionId);
    }
    return result;
  },

  async assignTeacher(
    assignment: Omit<TeacherAssignmentRecord, 'id'>
  ): Promise<TeacherAssignmentRecord> {
    const newAssignment: TeacherAssignmentRecord = {
      ...assignment,
      id: crypto.randomUUID ? crypto.randomUUID() : `ta-${Date.now()}`,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('teacher_assignments')
        .insert([newAssignment])
        .select()
        .single();
      if (!error && data) return data as TeacherAssignmentRecord;
    }

    mockTeacherAssignments.push(newAssignment);
    return newAssignment;
  },

  // 6. Promotions
  async getPromotionHistory(): Promise<PromotionRecord[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('student_promotions')
        .select('*')
        .order('promotion_date', { ascending: false });
      if (!error && data) return data as PromotionRecord[];
    }
    return [...mockPromotions];
  },

  async promoteStudents(
    students: { id: string; name: string; admissionNumber: string }[],
    fromSession: string,
    toSession: string,
    fromClass: string,
    toClass: string,
    fromSection: string,
    toSection: string,
    remarks?: string
  ): Promise<number> {
    const newRecords: PromotionRecord[] = students.map((std) => ({
      id: crypto.randomUUID ? crypto.randomUUID() : `prom-${Date.now()}-${std.id}`,
      student_id: std.id,
      student_name: std.name,
      admission_number: std.admissionNumber,
      from_session: fromSession,
      to_session: toSession,
      from_class: fromClass,
      to_class: toClass,
      from_section: fromSection,
      to_section: toSection,
      promotion_date: new Date().toISOString().split('T')[0],
      remarks: remarks || 'Promoted to next academic session',
    }));

    if (isSupabaseConfigured) {
      await supabase.from('student_promotions').insert(newRecords);
    }

    mockPromotions.unshift(...newRecords);
    return students.length;
  },
};

