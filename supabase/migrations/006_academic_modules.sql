-- ============================================================================
-- Migration 006: Enhanced Academic Configuration & Student Promotions
-- ============================================================================
-- Extends the academic schema to support:
-- 1. Academic Sessions (enhanced academic_years with status/archiving)
-- 2. Class code, status, description, unique constraints
-- 3. Section capacity, status, unique constraints
-- 4. Class-Subject mappings (class_subjects)
-- 5. Student Enrollment history across sessions (student_enrollments)
-- 6. Student Promotion tracking (student_promotions)
-- 7. Granular RLS policies for Super Admin, School Admin, Teacher, Accountant
-- ============================================================================

-- 1. Add status and metadata to academic_years (alias: academic_sessions)
ALTER TABLE academic_years 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'archived', 'inactive')),
  ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Add code, status, description, and unique constraint to classes
ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS code TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'inactive')),
  ADD COLUMN IF NOT EXISTS description TEXT;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_class_school_name_session'
  ) THEN
    ALTER TABLE classes ADD CONSTRAINT uq_class_school_name_session UNIQUE (school_id, academic_year_id, name);
  END IF;
END $$;

-- 3. Add max_capacity, status, description, and unique constraint to sections
ALTER TABLE sections
  ADD COLUMN IF NOT EXISTS max_capacity INT NOT NULL DEFAULT 40,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'inactive')),
  ADD COLUMN IF NOT EXISTS description TEXT;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_section_class_name'
  ) THEN
    ALTER TABLE sections ADD CONSTRAINT uq_section_class_name UNIQUE (class_id, name);
  END IF;
END $$;

-- 4. class_subjects: Maps catalog subjects to specific classes within an academic session
CREATE TABLE IF NOT EXISTS class_subjects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id          UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id        UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_class_subject UNIQUE (class_id, subject_id, academic_year_id)
);

CREATE INDEX IF NOT EXISTS idx_class_subjects_class_id ON class_subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_academic_year_id ON class_subjects(academic_year_id);

-- 5. student_enrollments: Historical ledger preserving student placement per academic session
CREATE TABLE IF NOT EXISTS student_enrollments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  class_id          UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_id        UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  roll_number       TEXT,
  enrollment_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  status            TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'promoted', 'graduated', 'transferred', 'withdrawn')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_student_session_enrollment UNIQUE (student_id, academic_year_id)
);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_session ON student_enrollments(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_class_sec ON student_enrollments(class_id, section_id);

-- 6. student_promotions: Audit log for batch and individual student progressions
CREATE TABLE IF NOT EXISTS student_promotions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id               UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id              UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  from_academic_year_id   UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  to_academic_year_id     UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  from_class_id           UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  to_class_id             UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  from_section_id         UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  to_section_id           UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  promoted_by             UUID REFERENCES profiles(id) ON DELETE SET NULL,
  promotion_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  remarks                 TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_promotions_student_id ON student_promotions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_promotions_sessions ON student_promotions(from_academic_year_id, to_academic_year_id);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_promotions ENABLE ROW LEVEL SECURITY;

-- class_subjects policies
CREATE POLICY "Admins full access on class_subjects"
  ON class_subjects FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Teachers can view class_subjects"
  ON class_subjects FOR SELECT
  TO authenticated
  USING (
    get_user_role(auth.uid()) = 'teacher'
    AND school_id = get_user_school_id(auth.uid())
  );

-- student_enrollments policies
CREATE POLICY "Admins full access on student_enrollments"
  ON student_enrollments FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Teachers can view assigned student_enrollments"
  ON student_enrollments FOR SELECT
  TO authenticated
  USING (
    get_user_role(auth.uid()) = 'teacher'
    AND section_id IN (SELECT get_teacher_section_ids(auth.uid()))
  );

CREATE POLICY "Parents can view linked child enrollments"
  ON student_enrollments FOR SELECT
  TO authenticated
  USING (
    get_user_role(auth.uid()) = 'parent'
    AND student_id IN (SELECT get_parent_student_ids(auth.uid()))
  );

-- student_promotions policies
CREATE POLICY "Admins full access on student_promotions"
  ON student_promotions FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Teachers can view promotion records"
  ON student_promotions FOR SELECT
  TO authenticated
  USING (
    get_user_role(auth.uid()) = 'teacher'
    AND school_id = get_user_school_id(auth.uid())
  );

