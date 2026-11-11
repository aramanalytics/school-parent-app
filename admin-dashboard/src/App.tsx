import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth, RoleType, getRoleDashboardPath } from '@/contexts/AuthContext';
import { ParentAuthProvider, useParentAuth } from '@/contexts/ParentAuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ParentLoginPage } from '@/pages/auth/ParentLoginPage';
import { ParentDashboardPage } from '@/pages/parent/ParentDashboardPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { SuperAdminDashboardPage } from '@/pages/dashboard/SuperAdminDashboardPage';
import { SchoolAdminDashboardPage } from '@/pages/dashboard/SchoolAdminDashboardPage';
import { TeacherDashboardPage } from '@/pages/dashboard/TeacherDashboardPage';
import { AccountantDashboardPage } from '@/pages/dashboard/AccountantDashboardPage';
import { StudentsPage } from '@/pages/students/StudentsPage';
import { ParentsPage } from '@/pages/parents/ParentsPage';
import { TeachersPage } from '@/pages/teachers/TeachersPage';
import { AttendancePage } from '@/pages/attendance/AttendancePage';
import { ExaminationsPage } from '@/pages/examinations/ExaminationsPage';
import { FeesPage } from '@/pages/fees/FeesPage';
import { TimetablePage } from '@/pages/timetable/TimetablePage';
import { NoticesPage } from '@/pages/notices/NoticesPage';
import { MaterialsPage } from '@/pages/materials/MaterialsPage';
import { TestsPage } from '@/pages/tests/TestsPage';
import { DiaryPage } from '@/pages/diary/DiaryPage';
import { CalendarPage } from '@/pages/calendar/CalendarPage';
import { FeedbackPage } from '@/pages/feedback/FeedbackPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
}) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B5BDB]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole.role)) {
    // Redirect to the user's authorized role dashboard
    return <Navigate to={getRoleDashboardPath(userRole.role)} replace />;
  }

  return <>{children}</>;
}

function ProtectedParentRoute({ children }: { children: React.ReactNode }) {
  const { parent, loading } = useParentAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B5BDB]"></div>
      </div>
    );
  }

  if (!parent) {
    return <Navigate to="/parent/login" replace />;
  }

  return <>{children}</>;
}

function RoleDefaultRedirect() {
  const { userRole, loading } = useAuth();
  if (loading) return null;
  const target = userRole ? getRoleDashboardPath(userRole.role) : '/login';
  return <Navigate to={target} replace />;
}

function AppRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B5BDB]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Staff Login */}
      <Route
        path="/login"
        element={
          user && userRole ? (
            <Navigate to={getRoleDashboardPath(userRole.role)} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Parent Portal Routes */}
      <Route path="/parent/login" element={<ParentLoginPage />} />
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedParentRoute>
            <ParentDashboardPage />
          </ProtectedParentRoute>
        }
      />

      {/* Staff & Admin Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Universal default router: routes to appropriate role dashboard */}
        <Route path="/" element={<RoleDefaultRedirect />} />

        {/* 1. Super Admin Dashboard Route */}
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 2. School Admin Dashboard Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <SchoolAdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 3. Teacher Dashboard Route */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'teacher']}>
              <TeacherDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 4. Accountant Dashboard Route */}
        <Route
          path="/accountant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'accountant']}>
              <AccountantDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Operational Modules with Role Safeguards */}
        {/* People Management: Super Admin & School Admin, Teacher sees scoped list */}
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parents"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <ParentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <TeachersPage />
            </ProtectedRoute>
          }
        />

        {/* Attendance: Super Admin, School Admin, Teacher */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        {/* Examinations & Marks: Super Admin, School Admin, Teacher */}
        <Route
          path="/examinations"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <ExaminationsPage />
            </ProtectedRoute>
          }
        />

        {/* Fee Management: Restricted to Super Admin, School Admin, Accountant. Teachers blocked! */}
        <Route
          path="/fees"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'accountant']}>
              <FeesPage />
            </ProtectedRoute>
          }
        />

        {/* Timetable: Super Admin, School Admin, Teacher */}
        <Route
          path="/timetable"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <TimetablePage />
            </ProtectedRoute>
          }
        />

        {/* Notices: All staff roles */}
        <Route
          path="/notices"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'accountant']}>
              <NoticesPage />
            </ProtectedRoute>
          }
        />

        {/* Study Materials & Tests: Super Admin, School Admin, Teacher */}
        <Route
          path="/materials"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <MaterialsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <TestsPage />
            </ProtectedRoute>
          }
        />

        {/* Diary & Homework: Super Admin, School Admin, Teacher */}
        <Route
          path="/diary"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <DiaryPage />
            </ProtectedRoute>
          }
        />

        {/* Calendar: All staff roles */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'accountant']}>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        {/* Feedback: Super Admin & School Admin */}
        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />

        {/* Notifications: All staff */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'accountant']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings: Super Admin & School Admin only */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<RoleDefaultRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ParentAuthProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </ParentAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
