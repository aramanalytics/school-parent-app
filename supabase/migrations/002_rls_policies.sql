-- ============================================================================
-- Migration 002: Row Level Security (RLS) Policies
-- ============================================================================
-- This migration enables RLS on every table and creates granular access
-- policies based on user roles (super_admin, school_admin, teacher,
-- accountant, parent).
--
-- Helper functions are created first so policies can reference them.
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Returns the role of a user within their school
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS user_role_enum AS $$
  SELECT role
  FROM user_roles
  WHERE profile_id = p_user_id
    AND is_active = TRUE
  ORDER BY created_at DESC
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns the school_id associated with a user
CREATE OR REPLACE FUNCTION get_user_school_id(p_user_id UUID)
RETURNS UUID AS $$
  SELECT school_id
  FROM profiles
  WHERE id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Checks if a user (via their parent profile) is the parent of a given student
CREATE OR REPLACE FUNCTION is_parent_of_student(p_user_id UUID, p_student_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM parents p
    JOIN parent_students ps ON ps.parent_id = p.id
    WHERE p.profile_id = p_user_id
      AND ps.student_id = p_student_id
      AND p.is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Checks if a user (via their teacher profile) is assigned to a given section
CREATE OR REPLACE FUNCTION is_teacher_of_section(p_user_id UUID, p_section_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM teachers t
    JOIN teacher_assignments ta ON ta.teacher_id = t.id
    WHERE t.profile_id = p_user_id
      AND ta.section_id = p_section_id
      AND t.is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: returns all student IDs linked to a parent user
CREATE OR REPLACE FUNCTION get_parent_student_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT ps.student_id
  FROM parents p
  JOIN parent_students ps ON ps.parent_id = p.id
  WHERE p.profile_id = p_user_id
    AND p.is_active = TRUE;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: returns all section IDs assigned to a teacher user
CREATE OR REPLACE FUNCTION get_teacher_section_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT DISTINCT ta.section_id
  FROM teachers t
  JOIN teacher_assignments ta ON ta.teacher_id = t.id
  WHERE t.profile_id = p_user_id
    AND t.is_active = TRUE;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if user is an admin (school_admin or super_admin)
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE profile_id = p_user_id
      AND role IN ('school_admin', 'super_admin')
      AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if user is an accountant
CREATE OR REPLACE FUNCTION is_accountant(p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE profile_id = p_user_id
      AND role = 'accountant'
      AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE schools             ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years      ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections            ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE students            ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students     ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance          ENABLE ROW LEVEL SECURITY;
ALTER TABLE examinations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_subjects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results        ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees        ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices             ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_attachments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_tests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_options        ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework            ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- POLICIES: schools
-- Users can read their own school's data.
-- ============================================================================
CREATE POLICY "schools_select_own"
  ON schools FOR SELECT
  USING (id = get_user_school_id(auth.uid()));

CREATE POLICY "schools_admin_all"
  ON schools FOR ALL
  USING (is_admin(auth.uid()) AND id = get_user_school_id(auth.uid()));


-- ============================================================================
-- POLICIES: profiles
-- Users can read/update their own profile.
-- Admins can read all profiles in their school.
-- ============================================================================
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (
    id = auth.uid()
    OR school_id = get_user_school_id(auth.uid())
  );

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());


-- ============================================================================
-- POLICIES: user_roles
-- Users can read their own roles. Admins can manage all roles in their school.
-- ============================================================================
CREATE POLICY "user_roles_select_own"
  ON user_roles FOR SELECT
  USING (
    profile_id = auth.uid()
    OR (is_admin(auth.uid()) AND school_id = get_user_school_id(auth.uid()))
  );

CREATE POLICY "user_roles_admin_manage"
  ON user_roles FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: academic_years
-- All authenticated users in the same school can read.
-- Admins can manage.
-- ============================================================================
CREATE POLICY "academic_years_select"
  ON academic_years FOR SELECT
  USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "academic_years_admin_manage"
  ON academic_years FOR ALL
  USING (is_admin(auth.uid()) AND school_id = get_user_school_id(auth.uid()));


-- ============================================================================
-- POLICIES: classes
-- All authenticated users in the same school can read.
-- Admins can manage.
-- ============================================================================
CREATE POLICY "classes_select"
  ON classes FOR SELECT
  USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "classes_admin_manage"
  ON classes FOR ALL
  USING (is_admin(auth.uid()) AND school_id = get_user_school_id(auth.uid()));


-- ============================================================================
-- POLICIES: sections
-- All authenticated users can read sections belonging to their school's classes.
-- Admins can manage.
-- ============================================================================
CREATE POLICY "sections_select"
  ON sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = sections.class_id
        AND c.school_id = get_user_school_id(auth.uid())
    )
  );

CREATE POLICY "sections_admin_manage"
  ON sections FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = sections.class_id
        AND c.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: subjects
-- All authenticated users in the same school can read.
-- Admins can manage.
-- ============================================================================
CREATE POLICY "subjects_select"
  ON subjects FOR SELECT
  USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "subjects_admin_manage"
  ON subjects FOR ALL
  USING (is_admin(auth.uid()) AND school_id = get_user_school_id(auth.uid()));


-- ============================================================================
-- POLICIES: students
-- Parents can see only their linked students.
-- Teachers can see students in their assigned sections.
-- Admins can CRUD all students in their school.
-- ============================================================================
CREATE POLICY "students_parent_select"
  ON students FOR SELECT
  USING (
    id IN (SELECT get_parent_student_ids(auth.uid()))
  );

CREATE POLICY "students_teacher_select"
  ON students FOR SELECT
  USING (
    section_id IN (SELECT get_teacher_section_ids(auth.uid()))
  );

CREATE POLICY "students_admin_all"
  ON students FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: parents
-- Parents can read their own record. Admins can CRUD.
-- ============================================================================
CREATE POLICY "parents_select_own"
  ON parents FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "parents_admin_all"
  ON parents FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: parent_students
-- Parents can see their own links. Admins can manage.
-- ============================================================================
CREATE POLICY "parent_students_parent_select"
  ON parent_students FOR SELECT
  USING (
    parent_id IN (
      SELECT id FROM parents WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "parent_students_admin_all"
  ON parent_students FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM parents p
      WHERE p.id = parent_students.parent_id
        AND p.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: teachers
-- Teachers can see their own record. Admins can CRUD.
-- ============================================================================
CREATE POLICY "teachers_select_own"
  ON teachers FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "teachers_admin_all"
  ON teachers FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: teacher_assignments
-- Teachers can see their own assignments. Admins can manage.
-- ============================================================================
CREATE POLICY "teacher_assignments_teacher_select"
  ON teacher_assignments FOR SELECT
  USING (
    teacher_id IN (
      SELECT id FROM teachers WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "teacher_assignments_admin_all"
  ON teacher_assignments FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM teachers t
      WHERE t.id = teacher_assignments.teacher_id
        AND t.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: attendance
-- Parents see their students' attendance.
-- Teachers can mark attendance for assigned sections.
-- Admins can manage all.
-- ============================================================================
CREATE POLICY "attendance_parent_select"
  ON attendance FOR SELECT
  USING (student_id IN (SELECT get_parent_student_ids(auth.uid())));

CREATE POLICY "attendance_teacher_select"
  ON attendance FOR SELECT
  USING (section_id IN (SELECT get_teacher_section_ids(auth.uid())));

CREATE POLICY "attendance_teacher_insert"
  ON attendance FOR INSERT
  WITH CHECK (
    is_teacher_of_section(auth.uid(), section_id)
  );

CREATE POLICY "attendance_teacher_update"
  ON attendance FOR UPDATE
  USING (is_teacher_of_section(auth.uid(), section_id))
  WITH CHECK (is_teacher_of_section(auth.uid(), section_id));

CREATE POLICY "attendance_admin_all"
  ON attendance FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: examinations
-- All users in the school can read published exams.
-- Admins can manage.
-- ============================================================================
CREATE POLICY "examinations_select_published"
  ON examinations FOR SELECT
  USING (
    school_id = get_user_school_id(auth.uid())
    AND (is_published = TRUE OR is_admin(auth.uid()))
  );

CREATE POLICY "examinations_admin_all"
  ON examinations FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: exam_subjects
-- Readable by school users for published exams. Teachers can manage for their sections.
-- Admins can manage all.
-- ============================================================================
CREATE POLICY "exam_subjects_select"
  ON exam_subjects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM examinations e
      WHERE e.id = exam_subjects.examination_id
        AND e.school_id = get_user_school_id(auth.uid())
        AND (e.is_published = TRUE OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "exam_subjects_teacher_manage"
  ON exam_subjects FOR ALL
  USING (
    is_teacher_of_section(auth.uid(), section_id)
  );

CREATE POLICY "exam_subjects_admin_all"
  ON exam_subjects FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM examinations e
      WHERE e.id = exam_subjects.examination_id
        AND e.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: exam_results
-- Parents see their students' results (when published).
-- Teachers can enter marks for assigned sections.
-- Admins can manage.
-- ============================================================================
CREATE POLICY "exam_results_parent_select"
  ON exam_results FOR SELECT
  USING (
    student_id IN (SELECT get_parent_student_ids(auth.uid()))
    AND EXISTS (
      SELECT 1 FROM exam_subjects es
      JOIN examinations e ON e.id = es.examination_id
      WHERE es.id = exam_results.exam_subject_id
        AND e.is_published = TRUE
    )
  );

CREATE POLICY "exam_results_teacher_manage"
  ON exam_results FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM exam_subjects es
      WHERE es.id = exam_results.exam_subject_id
        AND is_teacher_of_section(auth.uid(), es.section_id)
    )
  );

CREATE POLICY "exam_results_admin_all"
  ON exam_results FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM exam_subjects es
      JOIN examinations e ON e.id = es.examination_id
      WHERE es.id = exam_results.exam_subject_id
        AND e.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: fee_categories
-- All school users can read. Admins can manage.
-- ============================================================================
CREATE POLICY "fee_categories_select"
  ON fee_categories FOR SELECT
  USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "fee_categories_admin_manage"
  ON fee_categories FOR ALL
  USING (is_admin(auth.uid()) AND school_id = get_user_school_id(auth.uid()));


-- ============================================================================
-- POLICIES: student_fees
-- Parents see their students' fees. Accountants and admins can manage.
-- ============================================================================
CREATE POLICY "student_fees_parent_select"
  ON student_fees FOR SELECT
  USING (student_id IN (SELECT get_parent_student_ids(auth.uid())));

CREATE POLICY "student_fees_accountant_manage"
  ON student_fees FOR ALL
  USING (
    is_accountant(auth.uid())
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_fees.student_id
        AND s.school_id = get_user_school_id(auth.uid())
    )
  );

CREATE POLICY "student_fees_admin_manage"
  ON student_fees FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_fees.student_id
        AND s.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: fee_payments
-- Parents see payments for their students' fees. Accountants and admins can manage.
-- ============================================================================
CREATE POLICY "fee_payments_parent_select"
  ON fee_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM student_fees sf
      WHERE sf.id = fee_payments.student_fee_id
        AND sf.student_id IN (SELECT get_parent_student_ids(auth.uid()))
    )
  );

CREATE POLICY "fee_payments_accountant_manage"
  ON fee_payments FOR ALL
  USING (
    is_accountant(auth.uid())
    AND EXISTS (
      SELECT 1 FROM student_fees sf
      JOIN students s ON s.id = sf.student_id
      WHERE sf.id = fee_payments.student_fee_id
        AND s.school_id = get_user_school_id(auth.uid())
    )
  );

CREATE POLICY "fee_payments_admin_manage"
  ON fee_payments FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM student_fees sf
      JOIN students s ON s.id = sf.student_id
      WHERE sf.id = fee_payments.student_fee_id
        AND s.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: timetables
-- All school users can read. Admins can manage.
-- ============================================================================
CREATE POLICY "timetables_select"
  ON timetables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sections sec
      JOIN classes c ON c.id = sec.class_id
      WHERE sec.id = timetables.section_id
        AND c.school_id = get_user_school_id(auth.uid())
    )
  );

CREATE POLICY "timetables_admin_manage"
  ON timetables FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM sections sec
      JOIN classes c ON c.id = sec.class_id
      WHERE sec.id = timetables.section_id
        AND c.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: notices
-- Published notices visible to their targets. Admins/teachers can create.
-- ============================================================================
CREATE POLICY "notices_select_published"
  ON notices FOR SELECT
  USING (
    school_id = get_user_school_id(auth.uid())
    AND (
      status = 'published'
      OR created_by = auth.uid()
      OR is_admin(auth.uid())
    )
  );

CREATE POLICY "notices_teacher_insert"
  ON notices FOR INSERT
  WITH CHECK (
    school_id = get_user_school_id(auth.uid())
    AND (
      get_user_role(auth.uid()) = 'teacher'
      OR is_admin(auth.uid())
    )
  );

CREATE POLICY "notices_admin_all"
  ON notices FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );

CREATE POLICY "notices_teacher_update_own"
  ON notices FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());


-- ============================================================================
-- POLICIES: notice_attachments
-- Readable if the parent notice is readable. Admins/teachers can manage.
-- ============================================================================
CREATE POLICY "notice_attachments_select"
  ON notice_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM notices n
      WHERE n.id = notice_attachments.notice_id
        AND n.school_id = get_user_school_id(auth.uid())
        AND (n.status = 'published' OR n.created_by = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "notice_attachments_admin_all"
  ON notice_attachments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM notices n
      WHERE n.id = notice_attachments.notice_id
        AND n.school_id = get_user_school_id(auth.uid())
        AND (is_admin(auth.uid()) OR n.created_by = auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: learning_materials
-- All school users can read. Teachers/admins can manage.
-- ============================================================================
CREATE POLICY "learning_materials_select"
  ON learning_materials FOR SELECT
  USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "learning_materials_teacher_insert"
  ON learning_materials FOR INSERT
  WITH CHECK (
    school_id = get_user_school_id(auth.uid())
    AND (
      get_user_role(auth.uid()) = 'teacher'
      OR is_admin(auth.uid())
    )
  );

CREATE POLICY "learning_materials_admin_all"
  ON learning_materials FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );

CREATE POLICY "learning_materials_teacher_update_own"
  ON learning_materials FOR UPDATE
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "learning_materials_teacher_delete_own"
  ON learning_materials FOR DELETE
  USING (uploaded_by = auth.uid());


-- ============================================================================
-- POLICIES: online_tests
-- Published tests visible to school users. Teachers/admins can manage.
-- ============================================================================
CREATE POLICY "online_tests_select"
  ON online_tests FOR SELECT
  USING (
    school_id = get_user_school_id(auth.uid())
    AND (
      status IN ('published', 'active', 'completed')
      OR created_by = auth.uid()
      OR is_admin(auth.uid())
    )
  );

CREATE POLICY "online_tests_teacher_manage"
  ON online_tests FOR ALL
  USING (
    created_by = auth.uid()
    OR (is_admin(auth.uid()) AND school_id = get_user_school_id(auth.uid()))
  );


-- ============================================================================
-- POLICIES: test_questions / test_options
-- Readable if the parent test is readable. Managed by test creator/admin.
-- ============================================================================
CREATE POLICY "test_questions_select"
  ON test_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM online_tests t
      WHERE t.id = test_questions.test_id
        AND t.school_id = get_user_school_id(auth.uid())
    )
  );

CREATE POLICY "test_questions_manage"
  ON test_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM online_tests t
      WHERE t.id = test_questions.test_id
        AND (t.created_by = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "test_options_select"
  ON test_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM test_questions tq
      JOIN online_tests t ON t.id = tq.test_id
      WHERE tq.id = test_options.question_id
        AND t.school_id = get_user_school_id(auth.uid())
    )
  );

CREATE POLICY "test_options_manage"
  ON test_options FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM test_questions tq
      JOIN online_tests t ON t.id = tq.test_id
      WHERE tq.id = test_options.question_id
        AND (t.created_by = auth.uid() OR is_admin(auth.uid()))
    )
  );


-- ============================================================================
-- POLICIES: test_submissions
-- Students can see their own submissions. Teachers/admins can see all for their tests.
-- ============================================================================
CREATE POLICY "test_submissions_student_select"
  ON test_submissions FOR SELECT
  USING (student_id IN (SELECT get_parent_student_ids(auth.uid())));

CREATE POLICY "test_submissions_student_insert"
  ON test_submissions FOR INSERT
  WITH CHECK (student_id IN (SELECT get_parent_student_ids(auth.uid())));

CREATE POLICY "test_submissions_teacher_select"
  ON test_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM online_tests t
      WHERE t.id = test_submissions.test_id
        AND (t.created_by = auth.uid() OR is_teacher_of_section(auth.uid(), t.section_id))
    )
  );

CREATE POLICY "test_submissions_admin_all"
  ON test_submissions FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM online_tests t
      WHERE t.id = test_submissions.test_id
        AND t.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: homework
-- Parents see their students' homework. Teachers manage their sections'.
-- Admins can manage all.
-- ============================================================================
CREATE POLICY "homework_parent_select"
  ON homework FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.section_id = homework.section_id
        AND s.id IN (SELECT get_parent_student_ids(auth.uid()))
    )
  );

CREATE POLICY "homework_teacher_select"
  ON homework FOR SELECT
  USING (section_id IN (SELECT get_teacher_section_ids(auth.uid())));

CREATE POLICY "homework_teacher_manage"
  ON homework FOR ALL
  USING (
    assigned_by = auth.uid()
    AND section_id IN (SELECT get_teacher_section_ids(auth.uid()))
  );

CREATE POLICY "homework_admin_all"
  ON homework FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: homework_submissions
-- Parents see their students' submissions. Teachers see submissions in their sections.
-- Admins can manage all.
-- ============================================================================
CREATE POLICY "homework_submissions_parent_select"
  ON homework_submissions FOR SELECT
  USING (student_id IN (SELECT get_parent_student_ids(auth.uid())));

CREATE POLICY "homework_submissions_student_insert"
  ON homework_submissions FOR INSERT
  WITH CHECK (student_id IN (SELECT get_parent_student_ids(auth.uid())));

CREATE POLICY "homework_submissions_teacher_select"
  ON homework_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM homework h
      WHERE h.id = homework_submissions.homework_id
        AND h.section_id IN (SELECT get_teacher_section_ids(auth.uid()))
    )
  );

CREATE POLICY "homework_submissions_admin_all"
  ON homework_submissions FOR ALL
  USING (
    is_admin(auth.uid())
    AND EXISTS (
      SELECT 1 FROM homework h
      WHERE h.id = homework_submissions.homework_id
        AND h.school_id = get_user_school_id(auth.uid())
    )
  );


-- ============================================================================
-- POLICIES: school_events
-- All school users can read events. Admins can manage.
-- ============================================================================
CREATE POLICY "school_events_select"
  ON school_events FOR SELECT
  USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "school_events_admin_all"
  ON school_events FOR ALL
  USING (is_admin(auth.uid()) AND school_id = get_user_school_id(auth.uid()));


-- ============================================================================
-- POLICIES: feedback
-- Parents see their own feedback. Admins can read all and respond.
-- ============================================================================
CREATE POLICY "feedback_parent_select"
  ON feedback FOR SELECT
  USING (
    parent_id IN (
      SELECT id FROM parents WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "feedback_parent_insert"
  ON feedback FOR INSERT
  WITH CHECK (
    parent_id IN (
      SELECT id FROM parents WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "feedback_admin_all"
  ON feedback FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- POLICIES: notifications
-- Recipients can read their own. Admins can send.
-- ============================================================================
CREATE POLICY "notifications_recipient_select"
  ON notifications FOR SELECT
  USING (
    recipient_id = auth.uid()
    OR (
      target_type = 'all'
      AND school_id = get_user_school_id(auth.uid())
    )
  );

CREATE POLICY "notifications_recipient_update"
  ON notifications FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "notifications_admin_all"
  ON notifications FOR ALL
  USING (
    is_admin(auth.uid())
    AND school_id = get_user_school_id(auth.uid())
  );


-- ============================================================================
-- End of Migration 002
-- ============================================================================
