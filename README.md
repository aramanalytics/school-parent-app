# School Management & Parent App Ecosystem

A complete, production-grade School Management Application comprising two interconnected applications sharing a unified Supabase PostgreSQL backend.

---

## 🏛️ Project Architecture

```
School-Parent app/
├── admin-dashboard/            # React + Vite + TypeScript Web Dashboard
│   ├── src/
│   │   ├── components/         # Reusable UI & Layout Components
│   │   ├── contexts/           # Role-Based Auth Context
│   │   ├── pages/              # 17 Modules (Students, Attendance, Fees, Exams, etc.)
│   │   └── lib/                # Supabase Client & Utilities
│   └── dist/                   # Production Build Bundle
│
├── parent-app/                 # React Native + Expo Mobile Application
│   ├── app/
│   │   ├── (auth)/             # Phone OTP Login & Verification
│   │   ├── (tabs)/             # 5 Core Bottom Tabs (Home, Attendance, Diary, Fees, More)
│   │   └── [features]          # Profile, Timetable, Exams, Materials, Tests, Feedback
│   └── src/
│       ├── contexts/           # Parent Auth & Multi-Child Switcher Context
│       ├── i18n/               # Dual-language localization (English & தமிழ்)
│       └── services/           # Data & Realtime Sync Layer
│
├── supabase/
│   └── migrations/             # 5 SQL Migration Files
│       ├── 001_initial_schema.sql  # 32 Relational Tables, Enums, Indexes
│       ├── 002_rls_policies.sql    # Row Level Security Policies
│       ├── 003_functions.sql       # Grading, Attendance & Trigger Functions
│       ├── 004_storage.sql         # 6 Storage Buckets & Policies
│       └── 005_seed_data.sql       # Comprehensive Development Seed Data
│
├── shared/
│   ├── types/database.ts       # Shared TypeScript Database Interfaces
│   └── constants/design-tokens.ts # Unified Brand Color Tokens
│
└── docs/                       # Technical Documentation
    ├── setup.md                # Environment & Running Guide
    ├── database.md             # Schema & RLS Matrix
    ├── authentication.md       # Phone OTP & Staff Auth
    ├── deployment.md           # Production Deployment Instructions
    └── api.md                  # Stored Functions & Storage Specs
```

---

## 📱 Application A: Parent Mobile Application
Built with **React Native**, **Expo SDK 52**, **TypeScript**, and **Expo Router**.

### Core Modules:
- **Authentication**: Phone Number + 6-digit SMS OTP verification (defaulting to India `+91`).
- **Dashboard**:
  - **Multi-Child Student Switcher**: Supports multiple children under one parent account (e.g. Ramesh Krishnan has Aarav in Class 5-A and Diya in Class 5-B). Switching active child dynamically updates all screens!
  - Monthly attendance percentage & attendance snapshot.
  - Quick action shortcuts (Timetable, Exams, Fees, Study Materials).
  - Circular previews, upcoming school events, and homework feed.
- **Student Profile**: Photo, admission number, roll number, class, section, date of birth, guardian details.
- **Attendance**: Monthly calendar visual indicators (Present, Absent, Late, Holiday) with daily roll logs.
- **Diary & Homework**: Daily assignments, subject tags, submission deadlines, teacher observations.
- **Fee Management**: Assessed total fees, paid amounts, outstanding balances, and downloadable official receipts.
- **Weekly Timetable**: Day-wise periods with teacher names, timings, and intervals.
- **Examinations & Report Cards**: Subject-wise scores, grades, overall percentage, and report card preview.
- **Learning Materials**: Subject-wise PDFs, animated video lessons, and audio recitation files.
- **Online Tests**: Interactive MCQ quiz engine with countdown duration and instant score calculation.
- **School Calendar**: Year-round events, sports days, and public holidays.
- **Parent Feedback**: Submit queries, complaints, suggestions, and receive official administration responses.
- **Push Notifications**: Real-time alerts for attendance, fee due reminders, and circulars.
- **Localization**: Dual language support (English and Tamil தமிழ்).

---

## 🖥️ Application B: Admin & Teacher Web Dashboard
Built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Lucide Icons**.

### Core Modules:
- **Staff Authentication**: Secure Email & Password login with verified PostgreSQL role checks.
- **Interactive Role Switcher**: Instant switching between Administrator, Teacher, and Accountant views.
- **Executive Dashboard**:
  - Total Students, Faculty, Present Today, Pending Fees KPI cards.
  - Monthly attendance trend bar chart.
  - Fee collection overview line chart.
  - Grade enrollment distribution donut chart.
  - Realtime school operations activity log.
- **Student Management**: Full CRUD operations, enrollment modal with validation, filter by grade, CSV export.
- **Parent Registry**: Manage guardian accounts, mobile numbers, and student linkages.
- **Faculty & Teachers**: Employee records, qualification details, subject and classroom allocations.
- **Daily Attendance Marking**: Bulk "All Present", "All Absent", individual status toggling with remarks.
- **Examinations**: Schedule assessments, subject marks entry, automated grade calculation (`A+`, `A`, `B`, `C`, `F`), and one-click publishing to parent apps.
- **Fees & Invoices**: Record fee payments (UPI / Bank Transfer / Cash), receipt number generation, and printable official receipt preview.
- **Timetable Allocations**: Day-wise schedule for class sections, period times, interval breaks, conflict management.
- **Notice Board**: Compose official circulars with target audience scoping (All School / Specific Grade) and attachment support.
- **Study Materials**: Upload subject PDFs, videos, and worksheets.
- **Online Test Builder**: Configure MCQ assessments, timer duration, question stems, and answer keys.
- **Diary & Tasks**: Assign daily homework per section with due date enforcement.
- **Event Scheduling**: Calendar management for holidays, cultural programs, and exams.
- **Parent Feedback Management**: Review incoming parent queries, categorize, and send official replies.
- **Broadcast Notifications**: Dispatch instant push notifications to parents.
- **School Settings**: Institution identity, board affiliations, and RLS security parameters.

---

## 🗄️ Supabase PostgreSQL Backend
- **32 Normalized Relational Tables** with foreign keys and cascade rules.
- **Strict Row Level Security (RLS)**: Parents are locked to their own children's records; teachers can only modify their assigned classes; financial tables are restricted to accountants and administrators.
- **6 Supabase Storage Buckets**: `student-photos`, `school-logos`, `notice-attachments`, `study-materials`, `homework-attachments`, `fee-receipts`.
- **Database Stored Procedures**: Automatic grade calculation, attendance percentages, fee balances, and auth user creation triggers.
- **Realistic Seed Data**: Pre-configured with Sunrise International School, classes, sections, students, parents, faculty, attendance logs, homework, and fees.

---

## 🚀 Quick Start Guide

### 1. Database Setup
Execute the 5 migration scripts in `supabase/migrations/` sequentially in your Supabase SQL editor.

### 2. Run Admin Web Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
```
Accessible at: `http://localhost:3000`

### 3. Run Parent Mobile App
```bash
cd parent-app
npm install
npm start
```
Run on Android Emulator, iOS Simulator, or Web.

---

## 🎨 Design System Palette
- **Primary Navy**: `#172554`
- **Royal Blue**: `#3B5BDB`
- **Background**: `#F5F7FB`
- **Card Background**: `#FFFFFF`
- **Success Green**: `#16A36A`
- **Warning Amber**: `#F2A93B`
- **Error Red**: `#E03131`
- **Text Primary**: `#172033`
- **Text Secondary**: `#64748B`
- **Border Default**: `#E2E8F0`

