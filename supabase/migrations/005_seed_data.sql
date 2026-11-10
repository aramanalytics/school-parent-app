-- ============================================================================
-- Migration 005: Realistic Seed Data for Development & Testing
-- ============================================================================
-- NOTE: All data herein is sample/mock data intended strictly for local development
-- and staging environments. No real student or parent personal data is included.
-- ============================================================================

-- Deterministic UUIDs for easy referencing across relational tables
DO $$
DECLARE
  v_school_id UUID := '11111111-1111-1111-1111-111111111111';
  v_acad_year_id UUID := '22222222-2222-2222-2222-222222222222';
  
  -- Admin Profile
  v_admin_profile_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  
  -- Teacher Profiles
  v_teacher1_profile_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0001';
  v_teacher2_profile_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbb0002';
  v_teacher1_id UUID := 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0001';
  v_teacher2_id UUID := 'bbbbbbbb-1111-bbbb-bbbb-bbbbbbbb0002';

  -- Parent Profiles
  v_parent1_profile_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccc0001';
  v_parent2_profile_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccc0002';
  v_parent1_id UUID := 'cccccccc-1111-cccc-cccc-cccccccc0001';
  v_parent2_id UUID := 'cccccccc-1111-cccc-cccc-cccccccc0002';

  -- Classes & Sections
  v_class5_id UUID := '55555555-5555-5555-5555-555555555555';
  v_class6_id UUID := '66666666-6666-6666-6666-666666666666';
  v_sec5a_id UUID := '55555555-aaaa-5555-5555-555555555555';
  v_sec5b_id UUID := '55555555-bbbb-5555-5555-555555555555';
  v_sec6a_id UUID := '66666666-aaaa-6666-6666-666666666666';

  -- Subjects
  v_sub_eng UUID := '77777777-0001-7777-7777-777777777777';
  v_sub_mat UUID := '77777777-0002-7777-7777-777777777777';
  v_sub_sci UUID := '77777777-0003-7777-7777-777777777777';
  v_sub_soc UUID := '77777777-0004-7777-7777-777777777777';
  v_sub_tam UUID := '77777777-0005-7777-7777-777777777777';

  -- Students
  v_std1_id UUID := '88888888-0001-8888-8888-888888888888';
  v_std2_id UUID := '88888888-0002-8888-8888-888888888888';
  v_std3_id UUID := '88888888-0003-8888-8888-888888888888';

  -- Fees
  v_fee_cat1 UUID := '99999999-0001-9999-9999-999999999999';
  v_fee_cat2 UUID := '99999999-0002-9999-9999-999999999999';
  v_std_fee1 UUID := '99999999-aaaa-9999-9999-999999999999';
  v_std_fee2 UUID := '99999999-bbbb-9999-9999-999999999999';

  -- Exam
  v_exam_id UUID := 'eeeeeeee-1111-eeee-eeee-eeeeeeeeeeee';
  v_exam_sub1 UUID := 'eeeeeeee-2222-eeee-eeee-eeeeeeee0001';
  v_exam_sub2 UUID := 'eeeeeeee-2222-eeee-eeee-eeeeeeee0002';

BEGIN
  -- 1. School
  INSERT INTO schools (id, name, address, phone, email, logo_url)
  VALUES (
    v_school_id,
    'Sunrise International Matriculation Higher Secondary School',
    '142, Anna Salai, Chennai, Tamil Nadu 600002',
    '+91 44 2852 9000',
    'info@sunriseschool.edu.in',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&h=200&fit=crop'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Academic Year
  INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current)
  VALUES (
    v_acad_year_id,
    v_school_id,
    '2026 - 2027',
    '2026-06-01',
    '2027-04-30',
    true
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Profiles (Mock auth-linked records)
  -- Note: In production Supabase, profiles link to auth.users. Here we create dummy user records if needed or mock profiles
  -- Admin
  INSERT INTO profiles (id, email, phone, full_name, avatar_url, school_id)
  VALUES (
    v_admin_profile_id,
    'admin@sunriseschool.edu.in',
    '+919876543210',
    'Dr. K. Sundararajan (Principal)',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    v_school_id
  ) ON CONFLICT (id) DO NOTHING;

  -- Teachers
  INSERT INTO profiles (id, email, phone, full_name, avatar_url, school_id)
  VALUES 
    (v_teacher1_profile_id, 'saravanan.m@sunriseschool.edu.in', '+919841023456', 'M. Saravanan (M.Sc, B.Ed)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', v_school_id),
    (v_teacher2_profile_id, 'malathi.k@sunriseschool.edu.in', '+919841034567', 'K. Malathi (M.A, M.Ed)', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', v_school_id)
  ON CONFLICT (id) DO NOTHING;

  -- Parents
  INSERT INTO profiles (id, email, phone, full_name, avatar_url, school_id)
  VALUES 
    (v_parent1_profile_id, 'ramesh.krishnan@gmail.com', '+919884011223', 'Ramesh Krishnan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', v_school_id),
    (v_parent2_profile_id, 'anitha.s@gmail.com', '+919884022334', 'Anitha Senthil', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', v_school_id)
  ON CONFLICT (id) DO NOTHING;

  -- 4. User Roles
  INSERT INTO user_roles (profile_id, role, school_id, is_active)
  VALUES 
    (v_admin_profile_id, 'school_admin', v_school_id, true),
    (v_teacher1_profile_id, 'teacher', v_school_id, true),
    (v_teacher2_profile_id, 'teacher', v_school_id, true),
    (v_parent1_profile_id, 'parent', v_school_id, true),
    (v_parent2_profile_id, 'parent', v_school_id, true)
  ON CONFLICT DO NOTHING;

  -- 5. Teachers Table
  INSERT INTO teachers (id, profile_id, school_id, employee_id, qualification, phone)
  VALUES 
    (v_teacher1_id, v_teacher1_profile_id, v_school_id, 'EMP0104', 'M.Sc Mathematics, B.Ed', '+919841023456'),
    (v_teacher2_id, v_teacher2_profile_id, v_school_id, 'EMP0108', 'M.A English Literature, M.Ed', '+919841034567')
  ON CONFLICT (id) DO NOTHING;

  -- 6. Classes
  INSERT INTO classes (id, school_id, name, numeric_order, academic_year_id)
  VALUES 
    (v_class5_id, v_school_id, 'Class 5', 5, v_acad_year_id),
    (v_class6_id, v_school_id, 'Class 6', 6, v_acad_year_id)
  ON CONFLICT (id) DO NOTHING;

  -- 7. Sections
  INSERT INTO sections (id, class_id, name, class_teacher_id)
  VALUES 
    (v_sec5a_id, v_class5_id, 'Section A', v_teacher1_profile_id),
    (v_sec5b_id, v_class5_id, 'Section B', v_teacher2_profile_id),
    (v_sec6a_id, v_class6_id, 'Section A', v_teacher1_profile_id)
  ON CONFLICT (id) DO NOTHING;

  -- 8. Subjects
  INSERT INTO subjects (id, school_id, name, code)
  VALUES 
    (v_sub_eng, v_school_id, 'English', 'ENG-01'),
    (v_sub_mat, v_school_id, 'Mathematics', 'MAT-02'),
    (v_sub_sci, v_school_id, 'Science', 'SCI-03'),
    (v_sub_soc, v_school_id, 'Social Science', 'SOC-04'),
    (v_sub_tam, v_school_id, 'Tamil', 'TAM-05')
  ON CONFLICT (id) DO NOTHING;

  -- 9. Teacher Assignments
  INSERT INTO teacher_assignments (teacher_id, section_id, subject_id, academic_year_id)
  VALUES 
    (v_teacher1_id, v_sec5a_id, v_sub_mat, v_acad_year_id),
    (v_teacher1_id, v_sec5a_id, v_sub_sci, v_acad_year_id),
    (v_teacher2_id, v_sec5a_id, v_sub_eng, v_acad_year_id),
    (v_teacher2_id, v_sec5a_id, v_sub_tam, v_acad_year_id)
  ON CONFLICT DO NOTHING;

  -- 10. Students
  INSERT INTO students (id, school_id, admission_number, roll_number, first_name, last_name, date_of_birth, gender, photo_url, section_id, academic_year_id)
  VALUES 
    (v_std1_id, v_school_id, 'ADM2026-0501', '01', 'Aarav', 'Krishnan', '2016-04-12', 'male', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop', v_sec5a_id, v_acad_year_id),
    (v_std2_id, v_school_id, 'ADM2026-0502', '02', 'Diya', 'Krishnan', '2018-08-25', 'female', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop', v_sec5b_id, v_acad_year_id),
    (v_std3_id, v_school_id, 'ADM2026-0503', '03', 'Karthik', 'Senthil', '2016-02-18', 'male', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop', v_sec5a_id, v_acad_year_id)
  ON CONFLICT (id) DO NOTHING;

  -- 11. Parents
  INSERT INTO parents (id, profile_id, school_id, father_name, mother_name, phone, email, address)
  VALUES 
    (v_parent1_id, v_parent1_profile_id, v_school_id, 'Ramesh Krishnan', 'Deepa Ramesh', '+919884011223', 'ramesh.krishnan@gmail.com', 'Plot 45, Gandhi Nagar, Adyar, Chennai'),
    (v_parent2_id, v_parent2_profile_id, v_school_id, 'Senthil Nathan', 'Anitha Senthil', '+919884022334', 'anitha.s@gmail.com', 'Flat 3B, Sunshine Apts, Mylapore, Chennai')
  ON CONFLICT (id) DO NOTHING;

  -- 12. Parent-Students Link (Supports multiple children per parent!)
  INSERT INTO parent_students (parent_id, student_id, relationship)
  VALUES 
    (v_parent1_id, v_std1_id, 'father'),
    (v_parent1_id, v_std2_id, 'father'),  -- Second child of same parent!
    (v_parent2_id, v_std3_id, 'mother')
  ON CONFLICT DO NOTHING;

  -- 13. Attendance (Sample month data for Aarav and Diya)
  INSERT INTO attendance (student_id, section_id, school_id, date, status, marked_by, remarks)
  VALUES 
    (v_std1_id, v_sec5a_id, v_school_id, CURRENT_DATE - INTERVAL '4 days', 'present', v_teacher1_profile_id, 'Attentive in class'),
    (v_std1_id, v_sec5a_id, v_school_id, CURRENT_DATE - INTERVAL '3 days', 'present', v_teacher1_profile_id, NULL),
    (v_std1_id, v_sec5a_id, v_school_id, CURRENT_DATE - INTERVAL '2 days', 'late', v_teacher1_profile_id, 'Late by 15 mins (traffic)'),
    (v_std1_id, v_sec5a_id, v_school_id, CURRENT_DATE - INTERVAL '1 day', 'present', v_teacher1_profile_id, NULL),
    (v_std1_id, v_sec5a_id, v_school_id, CURRENT_DATE, 'present', v_teacher1_profile_id, NULL),
    (v_std2_id, v_sec5b_id, v_school_id, CURRENT_DATE - INTERVAL '4 days', 'present', v_teacher2_profile_id, NULL),
    (v_std2_id, v_sec5b_id, v_school_id, CURRENT_DATE - INTERVAL '3 days', 'absent', v_teacher2_profile_id, 'Medical leave notified'),
    (v_std2_id, v_sec5b_id, v_school_id, CURRENT_DATE - INTERVAL '2 days', 'present', v_teacher2_profile_id, NULL),
    (v_std2_id, v_sec5b_id, v_school_id, CURRENT_DATE - INTERVAL '1 day', 'present', v_teacher2_profile_id, NULL),
    (v_std2_id, v_sec5b_id, v_school_id, CURRENT_DATE, 'present', v_teacher2_profile_id, NULL)
  ON CONFLICT DO NOTHING;

  -- 14. Fee Categories & Student Fees
  INSERT INTO fee_categories (id, school_id, name, description, academic_year_id)
  VALUES 
    (v_fee_cat1, v_school_id, 'Term 1 Tuition Fee', 'Covers core academic tuition & lab amenities', v_acad_year_id),
    (v_fee_cat2, v_school_id, 'Special Activities & Transport', 'Annual sports, arts and school bus pass', v_acad_year_id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO student_fees (id, student_id, fee_category_id, amount, due_date, status)
  VALUES 
    (v_std_fee1, v_std1_id, v_fee_cat1, 28000.00, CURRENT_DATE + INTERVAL '15 days', 'paid'),
    (v_std_fee2, v_std1_id, v_fee_cat2, 12500.00, CURRENT_DATE + INTERVAL '30 days', 'pending')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO fee_payments (student_fee_id, amount_paid, payment_date, payment_method, receipt_number, recorded_by)
  VALUES 
    (v_std_fee1, 28000.00, CURRENT_DATE - INTERVAL '10 days', 'online', 'REC-2026-08912', v_admin_profile_id)
  ON CONFLICT DO NOTHING;

  -- 15. Timetable (Class 5 Section A)
  INSERT INTO timetables (section_id, subject_id, teacher_id, day_of_week, start_time, end_time, is_break)
  VALUES 
    (v_sec5a_id, v_sub_eng, v_teacher2_id, 1, '09:00', '09:45', false),
    (v_sec5a_id, v_sub_mat, v_teacher1_id, 1, '09:45', '10:30', false),
    (v_sec5a_id, NULL, NULL, 1, '10:30', '10:45', true),
    (v_sec5a_id, v_sub_sci, v_teacher1_id, 1, '10:45', '11:30', false),
    (v_sec5a_id, v_sub_tam, v_teacher2_id, 1, '11:30', '12:15', false),
    (v_sec5a_id, NULL, NULL, 1, '12:15', '13:00', true),
    (v_sec5a_id, v_sub_soc, v_teacher2_id, 1, '13:00', '13:45', false)
  ON CONFLICT DO NOTHING;

  -- 16. Notices
  INSERT INTO notices (school_id, title, content, target_type, status, published_at, created_by)
  VALUES 
    (v_school_id, 'Annual Sports Meet 2026 - Registrations Open', 'We are delighted to announce that our 18th Annual Sports Meet will take place on December 12th, 2026 at the Nehru Stadium. Parents are cordially invited to encourage the students.', 'all', 'published', NOW() - INTERVAL '2 days', v_admin_profile_id),
    (v_school_id, 'Class 5 Field Trip to Regional Science City', 'All Class 5 students will be visiting the Birla Planetarium & Regional Science Centre on Friday. Consent slips must be submitted via Diary by Wednesday.', 'class', 'published', NOW() - INTERVAL '1 day', v_admin_profile_id)
  ON CONFLICT DO NOTHING;

  -- 17. Homework
  INSERT INTO homework (school_id, section_id, subject_id, title, description, due_date, assigned_by)
  VALUES 
    (v_school_id, v_sec5a_id, v_sub_mat, 'Fractions Worksheet Chapter 4', 'Complete exercises 4.1 to 4.3 on pages 58-61 in your homework notebook.', CURRENT_DATE + INTERVAL '2 days', v_teacher1_profile_id),
    (v_school_id, v_sec5a_id, v_sub_eng, 'Poem Memorization & Stanza Summary', 'Read and memorize the first three stanzas of "The Road Not Taken". Write a 5-sentence reflection.', CURRENT_DATE + INTERVAL '1 day', v_teacher2_profile_id)
  ON CONFLICT DO NOTHING;

  -- 18. School Events / Calendar
  INSERT INTO school_events (school_id, title, description, event_type, start_date, end_date)
  VALUES 
    (v_school_id, 'Mid-Term Examinations', 'Quarterly summative assessments for Grades 1 through 12.', 'exam', CURRENT_DATE + INTERVAL '20 days', CURRENT_DATE + INTERVAL '27 days'),
    (v_school_id, 'Gandhi Jayanti Holiday', 'National holiday observed.', 'holiday', '2026-10-02', '2026-10-02'),
    (v_school_id, 'Science & Robotics Exhibition', 'Annual inter-school innovation challenge and showcase.', 'event', CURRENT_DATE + INTERVAL '45 days', CURRENT_DATE + INTERVAL '46 days')
  ON CONFLICT DO NOTHING;

  -- 19. Exam & Results
  INSERT INTO examinations (id, school_id, academic_year_id, name, start_date, end_date, is_published)
  VALUES 
    (v_exam_id, v_school_id, v_acad_year_id, 'First Term Summative Assessment', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '22 days', true)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO exam_subjects (id, examination_id, subject_id, section_id, max_marks, passing_marks, exam_date)
  VALUES 
    (v_exam_sub1, v_exam_id, v_sub_mat, v_sec5a_id, 100, 35, CURRENT_DATE - INTERVAL '28 days'),
    (v_exam_sub2, v_exam_id, v_sub_eng, v_sec5a_id, 100, 35, CURRENT_DATE - INTERVAL '26 days')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO exam_results (exam_subject_id, student_id, marks_obtained, grade, remarks)
  VALUES 
    (v_exam_sub1, v_std1_id, 94.50, 'A+', 'Outstanding problem solving and arithmetic skills.'),
    (v_exam_sub2, v_std1_id, 88.00, 'A', 'Very good grasp of grammar and creative writing.')
  ON CONFLICT DO NOTHING;

  -- 20. Feedback
  INSERT INTO feedback (school_id, parent_id, student_id, category, subject, message, status, response, responded_by, responded_at)
  VALUES 
    (v_school_id, v_parent1_id, v_std1_id, 'suggestion', 'Bus Route Timing Adjustment', 'Could the bus stop arrival time at Adyar Depot be reviewed? Usually delays by 10 minutes.', 'resolved', 'The transport coordinator has adjusted route 14 schedule accordingly. Thank you for notifying us.', v_admin_profile_id, NOW() - INTERVAL '1 day')
  ON CONFLICT DO NOTHING;

  -- 21. Notifications
  INSERT INTO notifications (school_id, title, message, target_type, sent_by, is_read, recipient_id)
  VALUES 
    (v_school_id, 'Term 1 Fee Payment Confirmed', 'Tuition fee for Aarav Krishnan (ADM2026-0501) of ₹28,000 has been verified.', 'individual', v_admin_profile_id, false, v_parent1_profile_id),
    (v_school_id, 'Sports Day Selection Tomorrow', 'Students interested in sprint and relay events are advised to bring physical education kits.', 'all', v_admin_profile_id, true, NULL)
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- End of Migration 005
-- ============================================================================

