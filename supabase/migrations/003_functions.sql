-- ============================================================================
-- Migration 003: Database Functions & Triggers
-- ============================================================================
-- This migration creates application-level database functions used by the
-- School Parent App, including auth triggers, computed stats, and utilities.
-- ============================================================================

-- ============================================================================
-- FUNCTION: handle_new_user()
-- Trigger function that automatically creates a profile row when a new user
-- signs up via Supabase Auth. Extracts metadata from the auth.users record.
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the trigger to auth.users
-- This fires after every new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ============================================================================
-- FUNCTION: update_updated_at()
-- Generic trigger function to automatically set updated_at = NOW() on UPDATE.
-- (Also defined in 001 to keep migrations self-contained; CREATE OR REPLACE
--  makes this idempotent.)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- FUNCTION: calculate_attendance_percentage()
-- Calculates attendance statistics for a given student in a given month/year.
--
-- Returns a JSON object:
--   {
--     "total_days": 22,
--     "present_days": 20,
--     "absent_days": 1,
--     "late_days": 1,
--     "holiday_days": 0,
--     "percentage": 90.91
--   }
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_attendance_percentage(
  p_student_id UUID,
  p_month INT,
  p_year INT
)
RETURNS JSONB AS $$
DECLARE
  v_total       INT;
  v_present     INT;
  v_absent      INT;
  v_late        INT;
  v_holiday     INT;
  v_percentage  NUMERIC(5,2);
BEGIN
  -- Count total attendance records for the month
  SELECT COUNT(*) INTO v_total
  FROM attendance
  WHERE student_id = p_student_id
    AND EXTRACT(MONTH FROM date) = p_month
    AND EXTRACT(YEAR FROM date) = p_year;

  -- Count by status
  SELECT
    COALESCE(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'absent'  THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'late'    THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'holiday' THEN 1 ELSE 0 END), 0)
  INTO v_present, v_absent, v_late, v_holiday
  FROM attendance
  WHERE student_id = p_student_id
    AND EXTRACT(MONTH FROM date) = p_month
    AND EXTRACT(YEAR FROM date) = p_year;

  -- Calculate percentage (present + late count as "attended")
  IF v_total - v_holiday > 0 THEN
    v_percentage := ROUND(
      ((v_present + v_late)::NUMERIC / (v_total - v_holiday)::NUMERIC) * 100,
      2
    );
  ELSE
    v_percentage := 0;
  END IF;

  RETURN jsonb_build_object(
    'total_days',    v_total,
    'present_days',  v_present,
    'absent_days',   v_absent,
    'late_days',     v_late,
    'holiday_days',  v_holiday,
    'percentage',    v_percentage
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================================
-- FUNCTION: get_student_fee_summary()
-- Calculates a comprehensive fee summary for a student.
--
-- Returns a JSON object:
--   {
--     "total_fees": 50000.00,
--     "total_paid": 30000.00,
--     "total_pending": 20000.00,
--     "overdue_amount": 5000.00,
--     "categories": [
--       { "name": "Tuition", "amount": 30000, "paid": 20000, "status": "partial" },
--       ...
--     ]
--   }
-- ============================================================================
CREATE OR REPLACE FUNCTION get_student_fee_summary(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_fees     DECIMAL(12,2);
  v_total_paid     DECIMAL(12,2);
  v_total_pending  DECIMAL(12,2);
  v_overdue_amount DECIMAL(12,2);
  v_categories     JSONB;
BEGIN
  -- Total fees assigned to the student
  SELECT COALESCE(SUM(amount), 0) INTO v_total_fees
  FROM student_fees
  WHERE student_id = p_student_id;

  -- Total amount paid across all fee line items
  SELECT COALESCE(SUM(fp.amount_paid), 0) INTO v_total_paid
  FROM fee_payments fp
  JOIN student_fees sf ON sf.id = fp.student_fee_id
  WHERE sf.student_id = p_student_id;

  -- Pending = total - paid
  v_total_pending := v_total_fees - v_total_paid;

  -- Overdue: sum of amounts for fees past due that aren't fully paid
  SELECT COALESCE(SUM(
    sf.amount - COALESCE(paid.total_paid, 0)
  ), 0) INTO v_overdue_amount
  FROM student_fees sf
  LEFT JOIN (
    SELECT student_fee_id, SUM(amount_paid) AS total_paid
    FROM fee_payments
    GROUP BY student_fee_id
  ) paid ON paid.student_fee_id = sf.id
  WHERE sf.student_id = p_student_id
    AND sf.due_date < CURRENT_DATE
    AND sf.status != 'paid';

  -- Build category breakdown
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'name',    fc.name,
      'amount',  sf.amount,
      'paid',    COALESCE(paid.total_paid, 0),
      'status',  sf.status
    )
  ), '[]'::jsonb) INTO v_categories
  FROM student_fees sf
  JOIN fee_categories fc ON fc.id = sf.fee_category_id
  LEFT JOIN (
    SELECT student_fee_id, SUM(amount_paid) AS total_paid
    FROM fee_payments
    GROUP BY student_fee_id
  ) paid ON paid.student_fee_id = sf.id
  WHERE sf.student_id = p_student_id;

  RETURN jsonb_build_object(
    'total_fees',     v_total_fees,
    'total_paid',     v_total_paid,
    'total_pending',  v_total_pending,
    'overdue_amount', v_overdue_amount,
    'categories',     v_categories
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================================
-- FUNCTION: calculate_exam_grade()
-- Converts numeric marks into a letter grade based on percentage.
--
-- Grading scale:
--   A+  = 90-100%
--   A   = 80-89%
--   B+  = 70-79%
--   B   = 60-69%
--   C+  = 50-59%
--   C   = 40-49%
--   D   = 35-39%
--   F   = below 35%
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_exam_grade(
  p_marks    NUMERIC,
  p_max_marks NUMERIC
)
RETURNS TEXT AS $$
DECLARE
  v_percentage NUMERIC;
BEGIN
  -- Guard against division by zero
  IF p_max_marks IS NULL OR p_max_marks = 0 THEN
    RETURN 'N/A';
  END IF;

  IF p_marks IS NULL THEN
    RETURN 'N/A';
  END IF;

  v_percentage := (p_marks / p_max_marks) * 100;

  RETURN CASE
    WHEN v_percentage >= 90 THEN 'A+'
    WHEN v_percentage >= 80 THEN 'A'
    WHEN v_percentage >= 70 THEN 'B+'
    WHEN v_percentage >= 60 THEN 'B'
    WHEN v_percentage >= 50 THEN 'C+'
    WHEN v_percentage >= 40 THEN 'C'
    WHEN v_percentage >= 35 THEN 'D'
    ELSE 'F'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ============================================================================
-- FUNCTION: get_class_attendance_summary()
-- Utility function to get attendance summary for an entire section on a date.
-- Useful for teacher dashboards.
--
-- Returns a JSON object:
--   {
--     "total_students": 30,
--     "present": 27,
--     "absent": 2,
--     "late": 1,
--     "attendance_rate": 93.33
--   }
-- ============================================================================
CREATE OR REPLACE FUNCTION get_class_attendance_summary(
  p_section_id UUID,
  p_date DATE
)
RETURNS JSONB AS $$
DECLARE
  v_total   INT;
  v_present INT;
  v_absent  INT;
  v_late    INT;
  v_rate    NUMERIC(5,2);
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM students
  WHERE section_id = p_section_id AND is_active = TRUE;

  SELECT
    COALESCE(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'absent'  THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'late'    THEN 1 ELSE 0 END), 0)
  INTO v_present, v_absent, v_late
  FROM attendance
  WHERE section_id = p_section_id AND date = p_date;

  IF v_total > 0 THEN
    v_rate := ROUND(((v_present + v_late)::NUMERIC / v_total::NUMERIC) * 100, 2);
  ELSE
    v_rate := 0;
  END IF;

  RETURN jsonb_build_object(
    'total_students',  v_total,
    'present',         v_present,
    'absent',          v_absent,
    'late',            v_late,
    'attendance_rate', v_rate
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================================
-- FUNCTION: get_student_report_card()
-- Generates a report card for a student for a given examination.
-- Returns exam results with grades for all subjects.
-- ============================================================================
CREATE OR REPLACE FUNCTION get_student_report_card(
  p_student_id     UUID,
  p_examination_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_results  JSONB;
  v_total    NUMERIC;
  v_obtained NUMERIC;
BEGIN
  SELECT
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'subject',        subj.name,
        'max_marks',      es.max_marks,
        'marks_obtained', er.marks_obtained,
        'grade',          calculate_exam_grade(er.marks_obtained, es.max_marks),
        'remarks',        er.remarks
      ) ORDER BY subj.name
    ), '[]'::jsonb),
    COALESCE(SUM(es.max_marks), 0),
    COALESCE(SUM(er.marks_obtained), 0)
  INTO v_results, v_total, v_obtained
  FROM exam_results er
  JOIN exam_subjects es ON es.id = er.exam_subject_id
  JOIN subjects subj ON subj.id = es.subject_id
  WHERE er.student_id = p_student_id
    AND es.examination_id = p_examination_id;

  RETURN jsonb_build_object(
    'student_id',      p_student_id,
    'examination_id',  p_examination_id,
    'subjects',        v_results,
    'total_marks',     v_total,
    'marks_obtained',  v_obtained,
    'overall_grade',   calculate_exam_grade(v_obtained, v_total),
    'percentage',      CASE WHEN v_total > 0
                         THEN ROUND((v_obtained / v_total) * 100, 2)
                         ELSE 0
                       END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================================
-- End of Migration 003
-- ============================================================================
