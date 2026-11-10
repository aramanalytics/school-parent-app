-- ============================================================================
-- Migration 001: Initial Schema for School Parent App
-- ============================================================================
-- This migration creates all 32 tables, custom enum types, indexes, and
-- triggers required for a multi-school management application.
--
-- Key design decisions:
--   • UUIDs for all primary keys (using gen_random_uuid())
--   • Every table includes school_id for multi-school/tenant isolation
--   • Proper foreign keys with ON DELETE CASCADE where appropriate
--   • Indexes on frequently queried columns (school_id, student_id, etc.)
--   • Automatic updated_at timestamps via trigger
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'school_admin',
  'teacher',
  'accountant',
  'parent'
);

CREATE TYPE gender_enum AS ENUM (
  'male',
  'female',
  'other'
);

CREATE TYPE attendance_status_enum AS ENUM (
  'present',
  'absent',
  'late',
  'holiday'
);

CREATE TYPE fee_status_enum AS ENUM (
  'paid',
  'partial',
  'pending',
  'overdue'
);

CREATE TYPE notice_target_enum AS ENUM (
  'all',
  'class',
  'section',
  'individual'
);

CREATE TYPE notice_status_enum AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE material_type_enum AS ENUM (
  'pdf',
  'image',
  'video',
  'audio'
);

CREATE TYPE test_status_enum AS ENUM (
  'draft',
  'published',
  'active',
  'completed'
);

CREATE TYPE event_type_enum AS ENUM (
  'holiday',
  'exam',
  'event',
  'activity'
);

CREATE TYPE feedback_category_enum AS ENUM (
  'query',
  'suggestion',
  'complaint',
  'general'
);

CREATE TYPE feedback_status_enum AS ENUM (
  'pending',
  'in_progress',
  'resolved',
  'closed'
);

CREATE TYPE notification_target_enum AS ENUM (
  'all',
  'class',
  'section',
  'individual',
  'role'
);

-- ============================================================================
-- 1. schools
-- Central table for multi-school support. Every other entity references this.
-- ============================================================================
CREATE TABLE schools (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  address     TEXT,
  phone       TEXT,
  email       TEXT,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. profiles
-- Extends Supabase auth.users with application-specific fields.
-- The id column directly references auth.users(id).
-- ============================================================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  phone       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  school_id   UUID REFERENCES schools(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================================
-- 3. user_roles
-- Maps profiles to roles within a school. A user can have one role per school.
-- ============================================================================
CREATE TABLE user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role        user_role_enum NOT NULL,
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_roles_profile_id ON user_roles(profile_id);
CREATE INDEX idx_user_roles_school_id ON user_roles(school_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- ============================================================================
-- 4. academic_years
-- Defines academic year periods. Only one should be is_current per school.
-- ============================================================================
CREATE TABLE academic_years (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  is_current  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_academic_year_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_academic_years_is_current ON academic_years(school_id, is_current) WHERE is_current = TRUE;

-- ============================================================================
-- 5. classes
-- Represents grade levels (e.g., Class 1, Class 2).
-- numeric_order is used for sorting.
-- ============================================================================
CREATE TABLE classes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  numeric_order     INT NOT NULL DEFAULT 0,
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_academic_year_id ON classes(academic_year_id);

-- ============================================================================
-- 6. sections
-- Subdivisions within a class (e.g., Section A, Section B).
-- ============================================================================
CREATE TABLE sections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id          UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  class_teacher_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sections_class_id ON sections(class_id);
CREATE INDEX idx_sections_class_teacher_id ON sections(class_teacher_id);

-- ============================================================================
-- 7. subjects
-- School-wide subject catalog.
-- ============================================================================
CREATE TABLE subjects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  code        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subjects_school_id ON subjects(school_id);

-- ============================================================================
-- 8. students
-- Core student records. Each student belongs to a section and academic year.
-- ============================================================================
CREATE TABLE students (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  admission_number  TEXT NOT NULL,
  roll_number       TEXT,
  first_name        TEXT NOT NULL,
  last_name         TEXT,
  date_of_birth     DATE,
  gender            gender_enum,
  photo_url         TEXT,
  section_id        UUID REFERENCES sections(id) ON DELETE SET NULL,
  academic_year_id  UUID REFERENCES academic_years(id) ON DELETE SET NULL,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_students_admission_number UNIQUE (school_id, admission_number)
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_section_id ON students(section_id);
CREATE INDEX idx_students_academic_year_id ON students(academic_year_id);
CREATE INDEX idx_students_is_active ON students(is_active);

-- ============================================================================
-- 9. parents
-- Parent/guardian records linked to a user profile.
-- ============================================================================
CREATE TABLE parents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  father_name     TEXT,
  mother_name     TEXT,
  guardian_name   TEXT,
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parents_profile_id ON parents(profile_id);
CREATE INDEX idx_parents_school_id ON parents(school_id);

-- ============================================================================
-- 10. parent_students
-- Many-to-many link between parents and students.
-- ============================================================================
CREATE TABLE parent_students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship  TEXT,  -- e.g., 'father', 'mother', 'guardian'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_parent_student UNIQUE (parent_id, student_id)
);

CREATE INDEX idx_parent_students_parent_id ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student_id ON parent_students(student_id);

-- ============================================================================
-- 11. teachers
-- Teacher records linked to a user profile.
-- ============================================================================
CREATE TABLE teachers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  employee_id     TEXT,
  qualification   TEXT,
  phone           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teachers_profile_id ON teachers(profile_id);
CREATE INDEX idx_teachers_school_id ON teachers(school_id);

-- ============================================================================
-- 12. teacher_assignments
-- Maps teachers to sections and subjects for a given academic year.
-- ============================================================================
CREATE TABLE teacher_assignments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id        UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  section_id        UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id        UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_teacher_assignment UNIQUE (teacher_id, section_id, subject_id, academic_year_id)
);

CREATE INDEX idx_teacher_assignments_teacher_id ON teacher_assignments(teacher_id);
CREATE INDEX idx_teacher_assignments_section_id ON teacher_assignments(section_id);

-- ============================================================================
-- 13. attendance
-- Daily attendance records per student.
-- ============================================================================
CREATE TABLE attendance (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  section_id  UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      attendance_status_enum NOT NULL DEFAULT 'present',
  marked_by   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  remarks     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_attendance_student_date UNIQUE (student_id, date)
);

CREATE INDEX idx_attendance_school_id ON attendance(school_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_section_id ON attendance(section_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);

-- ============================================================================
-- 14. examinations
-- Exam sessions (e.g., Mid-Term, Final).
-- ============================================================================
CREATE TABLE examinations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  start_date        DATE,
  end_date          DATE,
  is_published      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_examinations_school_id ON examinations(school_id);
CREATE INDEX idx_examinations_academic_year_id ON examinations(academic_year_id);

-- ============================================================================
-- 15. exam_subjects
-- Individual subject exams within an examination, scoped to a section.
-- ============================================================================
CREATE TABLE exam_subjects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  examination_id  UUID NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  section_id      UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  max_marks       NUMERIC(5,2) NOT NULL DEFAULT 100,
  passing_marks   NUMERIC(5,2) NOT NULL DEFAULT 35,
  exam_date       DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exam_subjects_examination_id ON exam_subjects(examination_id);
CREATE INDEX idx_exam_subjects_section_id ON exam_subjects(section_id);

-- ============================================================================
-- 16. exam_results
-- Individual student results for each exam subject.
-- ============================================================================
CREATE TABLE exam_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_subject_id UUID NOT NULL REFERENCES exam_subjects(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained  NUMERIC(5,2),
  grade           TEXT,
  remarks         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_exam_result UNIQUE (exam_subject_id, student_id)
);

CREATE INDEX idx_exam_results_student_id ON exam_results(student_id);

-- ============================================================================
-- 17. fee_categories
-- Types of fees (e.g., Tuition, Transport, Lab).
-- ============================================================================
CREATE TABLE fee_categories (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  academic_year_id  UUID REFERENCES academic_years(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_categories_school_id ON fee_categories(school_id);

-- ============================================================================
-- 18. student_fees
-- Fee line items assigned to individual students.
-- ============================================================================
CREATE TABLE student_fees (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_category_id   UUID NOT NULL REFERENCES fee_categories(id) ON DELETE CASCADE,
  amount            DECIMAL(12,2) NOT NULL DEFAULT 0,
  due_date          DATE,
  status            fee_status_enum NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_student_fees_student_id ON student_fees(student_id);
CREATE INDEX idx_student_fees_status ON student_fees(status);

-- ============================================================================
-- 19. fee_payments
-- Payment transactions against student fee line items.
-- ============================================================================
CREATE TABLE fee_payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_fee_id  UUID NOT NULL REFERENCES student_fees(id) ON DELETE CASCADE,
  amount_paid     DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method  TEXT,   -- e.g., 'cash', 'online', 'cheque'
  receipt_number  TEXT,
  receipt_url     TEXT,
  recorded_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_payments_student_fee_id ON fee_payments(student_fee_id);

-- ============================================================================
-- 20. timetables
-- Weekly timetable entries for each section. Supports breaks (null teacher/subject).
-- ============================================================================
CREATE TABLE timetables (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id    UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id    UUID REFERENCES subjects(id) ON DELETE SET NULL,   -- NULL for breaks
  teacher_id    UUID REFERENCES teachers(id) ON DELETE SET NULL,   -- NULL for breaks
  day_of_week   INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  is_break      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_timetable_times CHECK (end_time > start_time)
);

CREATE INDEX idx_timetables_section_id ON timetables(section_id);

-- ============================================================================
-- 21. notices
-- School announcements targeted to all, a class, a section, or an individual.
-- ============================================================================
CREATE TABLE notices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content       TEXT,
  target_type   notice_target_enum NOT NULL DEFAULT 'all',
  target_id     UUID,   -- references class_id, section_id, or profile_id depending on target_type
  status        notice_status_enum NOT NULL DEFAULT 'draft',
  published_at  TIMESTAMPTZ,
  created_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notices_school_id ON notices(school_id);
CREATE INDEX idx_notices_status ON notices(status);
CREATE INDEX idx_notices_target ON notices(target_type, target_id);

-- ============================================================================
-- 22. notice_attachments
-- Files attached to notices.
-- ============================================================================
CREATE TABLE notice_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id   UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
  file_url    TEXT NOT NULL,
  file_name   TEXT,
  file_type   TEXT,
  file_size   BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notice_attachments_notice_id ON notice_attachments(notice_id);

-- ============================================================================
-- 23. learning_materials
-- Study materials uploaded by teachers, optionally scoped to section or class.
-- ============================================================================
CREATE TABLE learning_materials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  material_type   material_type_enum NOT NULL DEFAULT 'pdf',
  file_url        TEXT NOT NULL,
  subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  section_id      UUID REFERENCES sections(id) ON DELETE SET NULL,
  class_id        UUID REFERENCES classes(id) ON DELETE SET NULL,
  uploaded_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_learning_materials_school_id ON learning_materials(school_id);
CREATE INDEX idx_learning_materials_subject_id ON learning_materials(subject_id);

-- ============================================================================
-- 24. online_tests
-- Online assessments created by teachers.
-- ============================================================================
CREATE TABLE online_tests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  subject_id        UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  section_id        UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  duration_minutes  INT NOT NULL DEFAULT 30,
  status            test_status_enum NOT NULL DEFAULT 'draft',
  start_time        TIMESTAMPTZ,
  end_time          TIMESTAMPTZ,
  created_by        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_online_tests_school_id ON online_tests(school_id);
CREATE INDEX idx_online_tests_section_id ON online_tests(section_id);
CREATE INDEX idx_online_tests_status ON online_tests(status);

-- ============================================================================
-- 25. test_questions
-- Questions within an online test.
-- ============================================================================
CREATE TABLE test_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id         UUID NOT NULL REFERENCES online_tests(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  question_order  INT NOT NULL DEFAULT 1,
  marks           INT NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_test_questions_test_id ON test_questions(test_id);

-- ============================================================================
-- 26. test_options
-- Answer options for each test question (MCQ style).
-- ============================================================================
CREATE TABLE test_options (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
  option_text   TEXT NOT NULL,
  is_correct    BOOLEAN NOT NULL DEFAULT FALSE,
  option_order  INT NOT NULL DEFAULT 1
);

CREATE INDEX idx_test_options_question_id ON test_options(question_id);

-- ============================================================================
-- 27. test_submissions
-- Student responses to online tests.
-- ============================================================================
CREATE TABLE test_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id       UUID NOT NULL REFERENCES online_tests(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  answers       JSONB,   -- stores { question_id: selected_option_id, ... }
  score         INT,
  submitted_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_test_submission UNIQUE (test_id, student_id)
);

CREATE INDEX idx_test_submissions_student_id ON test_submissions(student_id);

-- ============================================================================
-- 28. homework
-- Homework assignments given by teachers to a section for a subject.
-- ============================================================================
CREATE TABLE homework (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  section_id      UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  due_date        DATE,
  attachment_url  TEXT,
  assigned_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_homework_school_id ON homework(school_id);
CREATE INDEX idx_homework_section_id ON homework(section_id);

-- ============================================================================
-- 29. homework_submissions
-- Student submissions for homework.
-- ============================================================================
CREATE TABLE homework_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id     UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submission_url  TEXT,
  remarks         TEXT,
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_homework_submission UNIQUE (homework_id, student_id)
);

CREATE INDEX idx_homework_submissions_student_id ON homework_submissions(student_id);

-- ============================================================================
-- 30. school_events
-- Calendar events for the school (holidays, exams, activities).
-- ============================================================================
CREATE TABLE school_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  event_type    event_type_enum NOT NULL DEFAULT 'event',
  start_date    DATE NOT NULL,
  end_date      DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_school_events_school_id ON school_events(school_id);
CREATE INDEX idx_school_events_start_date ON school_events(start_date);

-- ============================================================================
-- 31. feedback
-- Parent feedback, complaints, and queries directed to the school.
-- ============================================================================
CREATE TABLE feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  parent_id       UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id      UUID REFERENCES students(id) ON DELETE SET NULL,
  category        feedback_category_enum NOT NULL DEFAULT 'general',
  subject         TEXT,
  message         TEXT NOT NULL,
  status          feedback_status_enum NOT NULL DEFAULT 'pending',
  response        TEXT,
  responded_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_school_id ON feedback(school_id);
CREATE INDEX idx_feedback_parent_id ON feedback(parent_id);
CREATE INDEX idx_feedback_status ON feedback(status);

-- ============================================================================
-- 32. notifications
-- In-app notification messages sent to users.
-- ============================================================================
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  message       TEXT,
  target_type   notification_target_enum NOT NULL DEFAULT 'all',
  target_id     UUID,
  sent_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  recipient_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_school_id ON notifications(school_id);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================================
-- TRIGGER: Automatic updated_at timestamp
-- Applied to all tables that have an updated_at column.
-- ============================================================================

-- The trigger function itself (defined here; also referenced in 003_functions.sql)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to every table with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'schools', 'profiles', 'students', 'parents', 'teachers',
      'attendance', 'exam_results', 'student_fees', 'notices',
      'homework', 'feedback'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at();',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ============================================================================
-- End of Migration 001
-- ============================================================================
