-- ============================================================================
-- Migration 004: Supabase Storage Buckets and Policies
-- ============================================================================
-- Buckets:
-- 1. student-photos      (Student profile pictures)
-- 2. school-logos        (School branding & logos)
-- 3. notice-attachments  (PDFs, images, circulars, audio, video)
-- 4. study-materials     (Classroom resources, chapters, assignments)
-- 5. homework-attachments(Teacher tasks & student submission proofs)
-- 6. fee-receipts        (Generated payment receipts)
-- ============================================================================

-- Enable storage extensions if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('student-photos', 'student-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('school-logos', 'school-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('notice-attachments', 'notice-attachments', true, 52428800, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'audio/mpeg', 'audio/wav']),
  ('study-materials', 'study-materials', true, 52428800, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'audio/mpeg']),
  ('homework-attachments', 'homework-attachments', true, 20971520, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('fee-receipts', 'fee-receipts', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies

-- School Logos: Public can read, authenticated staff/admins can upload/modify
CREATE POLICY "Public Read for School Logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'school-logos');

CREATE POLICY "Admin Upload School Logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'school-logos' AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.profile_id = auth.uid()
        AND ur.role IN ('super_admin', 'school_admin')
        AND ur.is_active = true
    )
  );

-- Student Photos: Authenticated users can view; Admins and teachers can upload
CREATE POLICY "Authenticated Read Student Photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'student-photos');

CREATE POLICY "Admin/Teacher Upload Student Photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'student-photos' AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.profile_id = auth.uid()
        AND ur.role IN ('super_admin', 'school_admin', 'teacher')
        AND ur.is_active = true
    )
  );

-- Notice Attachments: Authenticated users can read; Admin & Teachers can manage
CREATE POLICY "Authenticated Read Notice Attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'notice-attachments');

CREATE POLICY "Staff Upload Notice Attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'notice-attachments' AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.profile_id = auth.uid()
        AND ur.role IN ('super_admin', 'school_admin', 'teacher')
        AND ur.is_active = true
    )
  );

-- Study Materials: Authenticated users can read; Teachers & Admins can upload
CREATE POLICY "Authenticated Read Study Materials"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'study-materials');

CREATE POLICY "Staff Upload Study Materials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'study-materials' AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.profile_id = auth.uid()
        AND ur.role IN ('super_admin', 'school_admin', 'teacher')
        AND ur.is_active = true
    )
  );

-- Homework Attachments: Authenticated users can read; Parents can upload homework submissions, staff can upload assignments
CREATE POLICY "Authenticated Read Homework"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'homework-attachments');

CREATE POLICY "Authenticated Insert Homework"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'homework-attachments');

-- Fee Receipts: Authenticated users can view their receipts, admins & accountants can upload
CREATE POLICY "Authenticated Access Fee Receipts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'fee-receipts' AND (
      EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.profile_id = auth.uid()
          AND ur.role IN ('super_admin', 'school_admin', 'accountant')
          AND ur.is_active = true
      ) OR
      (storage.foldername(name))[1] = auth.uid()::text
    )
  );

CREATE POLICY "Staff Upload Fee Receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'fee-receipts' AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.profile_id = auth.uid()
        AND ur.role IN ('super_admin', 'school_admin', 'accountant')
        AND ur.is_active = true
    )
  );

-- ============================================================================
-- End of Migration 004
-- ============================================================================

