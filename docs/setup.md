# School Management & Parent App - Setup Guide

## Prerequisites
- **Node.js**: >= 18.0.0 (Tested on Node v20/v24)
- **npm** or **pnpm**
- **Expo CLI** (for mobile application)
- **Supabase Account** (for cloud database & storage)

---

## 1. Supabase Backend Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql` (Creates 32 relational tables, enums, triggers)
   - `supabase/migrations/002_rls_policies.sql` (Applies Row Level Security policies)
   - `supabase/migrations/003_functions.sql` (Creates auth hooks, grading logic, stats functions)
   - `supabase/migrations/004_storage.sql` (Initializes 6 storage buckets & access rules)
   - `supabase/migrations/005_seed_data.sql` (Populates development test data)
4. Go to **Authentication > Providers > Phone** and enable Phone OTP (configure SMS provider such as Twilio or MessageBird for live SMS delivery).
5. Copy your **Project URL** and **anon/public API key** from **Project Settings > API**.

---

## 2. Environment Variables Configuration

Copy `.env.example` in the project root to `.env` in both application directories:

### For `admin-dashboard/.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### For `parent-app/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 3. Running the Admin & Teacher Web Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

### Demo Login Accounts:
- **School Admin**: `admin@sunriseschool.edu.in` / `password123`
- **Teacher**: `saravanan.m@sunriseschool.edu.in` / `password123`
- **Accountant**: `accountant@sunriseschool.edu.in` / `password123`

---

## 4. Running the Parent Mobile Application

```bash
cd parent-app
npm install
npm start
```

Press:
- `a` to launch on Android Emulator
- `i` to launch on iOS Simulator
- `w` to run on Web Browser for testing

### Demo Parent Login:
- Enter registered parent mobile number: `+91 98840 11223` (Linked to 2 students: Aarav & Diya)
- Or: `+91 98840 22334` (Linked to Karthik)
- Enter any 6-digit OTP code (e.g. `123456`) in demo mode.

