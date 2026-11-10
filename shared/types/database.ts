// ============================================
// Shared TypeScript types for School Parent App
// Used by both parent-app and admin-dashboard
// ============================================

export type UUID = string;

// ---- Enums ----

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'accountant' | 'parent';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';

export type Gender = 'male' | 'female' | 'other';

export type FeePaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';

export type NoticeTargetType = 'all' | 'class' | 'section' | 'individual';

export type FeedbackCategory = 'query' | 'suggestion' | 'complaint' | 'general';

export type FeedbackStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

export type TestStatus = 'draft' | 'published' | 'active' | 'completed';

export type EventType = 'holiday' | 'exam' | 'event' | 'activity';

export type MaterialType = 'pdf' | 'image' | 'video' | 'audio';

export type NoticeStatus = 'draft' | 'published' | 'archived';

// ---- Database Models ----

export interface School {
  id: UUID;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: UUID;
  email: string | null;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  school_id: UUID;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: UUID;
  profile_id: UUID;
  role: UserRole;
  school_id: UUID;
  is_active: boolean;
  created_at: string;
}

export interface AcademicYear {
  id: UUID;
  school_id: UUID;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
}

export interface Class {
  id: UUID;
  school_id: UUID;
  name: string;
  numeric_order: number;
  academic_year_id: UUID;
  created_at: string;
}

export interface Section {
  id: UUID;
  class_id: UUID;
  name: string;
  class_teacher_id: UUID | null;
  created_at: string;
}

export interface Subject {
  id: UUID;
  school_id: UUID;
  name: string;
  code: string | null;
  created_at: string;
}

export interface Student {
  id: UUID;
  school_id: UUID;
  admission_number: string;
  roll_number: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: Gender | null;
  photo_url: string | null;
  section_id: UUID;
  academic_year_id: UUID;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Parent {
  id: UUID;
  profile_id: UUID;
  school_id: UUID;
  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParentStudent {
  id: UUID;
  parent_id: UUID;
  student_id: UUID;
  relationship: string;
  created_at: string;
}

export interface Teacher {
  id: UUID;
  profile_id: UUID;
  school_id: UUID;
  employee_id: string | null;
  qualification: string | null;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeacherAssignment {
  id: UUID;
  teacher_id: UUID;
  section_id: UUID;
  subject_id: UUID;
  academic_year_id: UUID;
  created_at: string;
}

export interface Attendance {
  id: UUID;
  student_id: UUID;
  section_id: UUID;
  school_id: UUID;
  date: string;
  status: AttendanceStatus;
  marked_by: UUID;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface Examination {
  id: UUID;
  school_id: UUID;
  academic_year_id: UUID;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_published: boolean;
  created_at: string;
}

export interface ExamSubject {
  id: UUID;
  examination_id: UUID;
  subject_id: UUID;
  section_id: UUID;
  max_marks: number;
  passing_marks: number;
  exam_date: string | null;
  created_at: string;
}

export interface ExamResult {
  id: UUID;
  exam_subject_id: UUID;
  student_id: UUID;
  marks_obtained: number | null;
  grade: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeeCategory {
  id: UUID;
  school_id: UUID;
  name: string;
  description: string | null;
  academic_year_id: UUID;
  created_at: string;
}

export interface StudentFee {
  id: UUID;
  student_id: UUID;
  fee_category_id: UUID;
  amount: number;
  due_date: string;
  status: FeePaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface FeePayment {
  id: UUID;
  student_fee_id: UUID;
  amount_paid: number;
  payment_date: string;
  payment_method: string | null;
  receipt_number: string | null;
  receipt_url: string | null;
  recorded_by: UUID;
  created_at: string;
}

export interface Timetable {
  id: UUID;
  section_id: UUID;
  subject_id: UUID;
  teacher_id: UUID;
  day_of_week: number; // 0=Sunday, 1=Monday...6=Saturday
  start_time: string;
  end_time: string;
  is_break: boolean;
  created_at: string;
}

export interface Notice {
  id: UUID;
  school_id: UUID;
  title: string;
  content: string;
  target_type: NoticeTargetType;
  target_id: UUID | null; // class_id or section_id if targeted
  status: NoticeStatus;
  published_at: string | null;
  created_by: UUID;
  created_at: string;
  updated_at: string;
}

export interface NoticeAttachment {
  id: UUID;
  notice_id: UUID;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface LearningMaterial {
  id: UUID;
  school_id: UUID;
  title: string;
  description: string | null;
  material_type: MaterialType;
  file_url: string;
  subject_id: UUID;
  section_id: UUID | null;
  class_id: UUID | null;
  uploaded_by: UUID;
  created_at: string;
}

export interface OnlineTest {
  id: UUID;
  school_id: UUID;
  title: string;
  description: string | null;
  subject_id: UUID;
  section_id: UUID;
  duration_minutes: number;
  status: TestStatus;
  start_time: string | null;
  end_time: string | null;
  created_by: UUID;
  created_at: string;
}

export interface TestQuestion {
  id: UUID;
  test_id: UUID;
  question_text: string;
  question_order: number;
  marks: number;
  created_at: string;
}

export interface TestOption {
  id: UUID;
  question_id: UUID;
  option_text: string;
  is_correct: boolean;
  option_order: number;
}

export interface TestSubmission {
  id: UUID;
  test_id: UUID;
  student_id: UUID;
  answers: Record<string, string>; // question_id -> selected_option_id
  score: number | null;
  submitted_at: string;
  created_at: string;
}

export interface Homework {
  id: UUID;
  school_id: UUID;
  section_id: UUID;
  subject_id: UUID;
  title: string;
  description: string;
  due_date: string;
  attachment_url: string | null;
  assigned_by: UUID;
  created_at: string;
  updated_at: string;
}

export interface HomeworkSubmission {
  id: UUID;
  homework_id: UUID;
  student_id: UUID;
  submission_url: string | null;
  remarks: string | null;
  submitted_at: string;
  created_at: string;
}

export interface SchoolEvent {
  id: UUID;
  school_id: UUID;
  title: string;
  description: string | null;
  event_type: EventType;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface Feedback {
  id: UUID;
  school_id: UUID;
  parent_id: UUID;
  student_id: UUID | null;
  category: FeedbackCategory;
  subject: string;
  message: string;
  status: FeedbackStatus;
  response: string | null;
  responded_by: UUID | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: UUID;
  school_id: UUID;
  title: string;
  message: string;
  target_type: NoticeTargetType;
  target_id: UUID | null;
  sent_by: UUID;
  is_read: boolean;
  recipient_id: UUID | null;
  created_at: string;
}

