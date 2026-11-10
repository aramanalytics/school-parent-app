# Database Architecture & RLS Documentation

## Schema Overview

The database is built on Supabase PostgreSQL with **32 relational tables**, comprehensive foreign keys, indexes, and automated timestamp triggers. Every table includes `school_id` for multi-school enterprise expansion.

### Tables Index

1. `schools`: Central tenant record
2. `profiles`: Extends `auth.users` with user details
3. `user_roles`: Multi-role assignment (`super_admin`, `school_admin`, `teacher`, `accountant`, `parent`)
4. `academic_years`: School sessions (e.g. 2026-2027)
5. `classes`: Grade levels (Class 1 to Class 12)
6. `sections`: Section divisions (Section A, B, C)
7. `subjects`: Academic subjects
8. `students`: Enrolled student bio-profiles
9. `parents`: Guardian profile records
10. `parent_students`: Many-to-many relationship linking parents to one or more children
11. `teachers`: Faculty records
12. `teacher_assignments`: Assigns teachers to subjects and class sections
13. `attendance`: Daily roll call records per student
14. `examinations`: Scheduled evaluation sessions
15. `exam_subjects`: Max marks, pass criteria, and dates per subject
16. `exam_results`: Marks obtained, auto-calculated grades, and teacher remarks
17. `fee_categories`: Tuition, transport, activity categories
18. `student_fees`: Assigned student fee bills
19. `fee_payments`: Payment receipts and transactions
20. `timetables`: Weekly class periods, faculty assignments, breaks
21. `notices`: Circular announcements with audience targeting
22. `notice_attachments`: Document & media attachments
23. `learning_materials`: Study PDFs, videos, and audio notes
24. `online_tests`: Multiple-choice quizzes
25. `test_questions`: Question stems and points
26. `test_options`: Multiple-choice options
27. `test_submissions`: Student submission answers and auto scores
28. `homework`: Daily diary tasks
29. `homework_submissions`: Student work uploads
30. `school_events`: Calendar holidays, events, and exams
31. `feedback`: Parent queries, suggestions, complaints, and responses
32. `notifications`: Real-time push broadcast alerts

---

## Row Level Security (RLS) Policy Matrix

| Table | Super/School Admin | Teacher | Accountant | Parent |
|---|:---:|:---:|:---:|:---:|
| `schools` | Full Access | Read Own | Read Own | Read Own |
| `students` | Full CRUD | Assigned Classes | No Access | Linked Children Only |
| `attendance` | Full CRUD | Mark & Read Assigned | No Access | Linked Children Only |
| `examinations` | Full CRUD | Enter Marks (Assigned) | No Access | View Published Only |
| `student_fees` | Full CRUD | No Access | Full CRUD | Linked Children Only |
| `fee_payments` | Full CRUD | No Access | Full CRUD | Linked Children Receipts |
| `notices` | Full CRUD | Create / Read | Read | Targeted Circulars |
| `homework` | Full CRUD | Manage Assigned | No Access | Linked Children Only |
| `feedback` | View & Respond | No Access | No Access | Own Submissions Only |

