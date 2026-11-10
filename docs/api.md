# Database Functions, API, and Integration Workflows

## Key Database Functions & Triggers

All stored procedures and triggers are located in `supabase/migrations/003_functions.sql`.

### 1. `handle_new_user()`
- **Type**: Trigger on `auth.users` (AFTER INSERT)
- **Purpose**: Automatically provisions a corresponding row in `public.profiles` extracting name and metadata.

### 2. `calculate_attendance_percentage(p_student_id UUID, p_month INT, p_year INT)`
- **Parameters**: `student_id`, `month`, `year`
- **Returns**: JSON object with `present_days`, `absent_days`, `late_days`, `total_working_days`, and `attendance_percentage`.

### 3. `get_student_fee_summary(p_student_id UUID)`
- **Parameters**: `student_id`
- **Returns**: Aggregated record with `total_fees`, `paid_fees`, `pending_fees`, and payment status.

### 4. `calculate_exam_grade(p_marks NUMERIC, p_max_marks NUMERIC)`
- **Parameters**: `marks_obtained`, `max_marks`
- **Returns**: Letter grade (`A+`, `A`, `B`, `C`, `F`) based on normalized percentage score.

---

## Storage Buckets & Policies

Configured in `supabase/migrations/004_storage.sql`:

1. `student-photos`: Profile pictures of enrolled students (JPEG, PNG, WebP).
2. `school-logos`: Institutional emblem and logos.
3. `notice-attachments`: Official PDFs, circulars, and media attachments.
4. `study-materials`: Classroom worksheets, textbooks, and tutorial videos.
5. `homework-attachments`: Daily homework files and assignment submissions.
6. `fee-receipts`: Generated official payment receipts.

