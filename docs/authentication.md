# Authentication & Role-Based Access Control

## Overview

The system features two tailored authentication paradigms sharing one unified Supabase user directory:

1. **Parent Mobile Application**: Secure Phone Number + SMS OTP Authentication.
2. **Admin & Teacher Web Dashboard**: Email and Password Authentication with verified database role enforcement.

---

## Parent Phone OTP Workflow

1. Parent opens the mobile application.
2. Enters their 10-digit registered mobile number (India `+91` default).
3. The app invokes `supabase.auth.signInWithOtp({ phone: '+919884011223' })`.
4. Supabase sends a 6-digit SMS OTP code through the configured SMS gateway.
5. Parent enters the 6-digit code on the verification screen.
6. Supabase validates the token and issues a persistent JWT session.
7. The application queries the `parent_students` table to load all linked student records (supporting multiple children per parent).

### Configuring SMS Provider in Supabase
1. Go to **Authentication > Providers > Phone** in the Supabase Dashboard.
2. Enable Phone Provider.
3. Select an SMS Provider:
   - **Twilio**: Account SID, Auth Token, and Message Service SID
   - **MessageBird**, **Vonage**, or **AWS SNS**
4. Set OTP length to 6 digits and expiry to 300 seconds.

---

## Admin & Teacher Authentication

1. Staff member enters their official school email and password.
2. Authenticates via `supabase.auth.signInWithPassword({ email, password })`.
3. Client loads the user's role from the `user_roles` table.
4. If role is `school_admin` or `super_admin`, full access is granted.
5. If role is `teacher`, financial modules are hidden and academic views are restricted to assigned sections.
6. If role is `accountant`, access is restricted to fee categories, payment collection, and receipts.

