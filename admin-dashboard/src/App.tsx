import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth, RoleType, getRoleDashboardPath } from '@/contexts/AuthContext';
import { ParentAuthProvider, useParentAuth } from '@/contexts/ParentAuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WelcomeLandingPage } from '@/pages/landing/WelcomeLandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ParentLoginPage } from '@/pages/auth/ParentLoginPage';
import { ParentDashboardPage } from '@/pages/parent/ParentDashboardPage';
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
import { AcademicOverviewDashboardPage } from '@/pages/academic/AcademicOverviewDashboardPage';
import { AcademicSessionsPage } from '@/pages/academic/AcademicSessionsPage';
import { ClassesPage } from '@/pages/academic/ClassesPage';
import { TeacherAssignmentsPage } from '@/pages/academic/TeacherAssignmentsPage';
import { StudentPromotionsPage } from '@/pages/academic/StudentPromotionsPage';

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

/**
 * Root Route Handler ("/")
 * If a staff user is logged in -> redirect to their role dashboard.
 * If a parent user is logged in -> redirect to /parent/dashboard.
 * Otherwise -> show the animated Welcome Landing Page.
 */
function RootIndexRoute() {
  const { user, userRole, loading: staffLoading } = useAuth();
  const { parent, loading: parentLoading } = useParentAuth();

  if (staffLoading || parentLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B5BDB]"></div>
      </div>
    );
  }

  // Restore authenticated staff session
  if (user && userRole) {
    return <Navigate to={getRoleDashboardPath(userRole.role)} replace />;
  }

  // Restore authenticated parent session
  if (parent) {
    return <Navigate to="/parent/dashboard" replace />;
  }

  // First time visitor or logged out user
  return <WelcomeLandingPage />;
}

function AppRoutes() {
  const { user, userRole, loading } = useAuth();
  const { parent } = useParentAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B5BDB]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 1. Animated Welcome Landing Page */}
      <Route path="/" element={<RootIndexRoute />} />

      {/* 2. Parent Portal Routes */}
      <Route
        path="/parent/login"
        element={parent ? <Navigate to="/parent/dashboard" replace /> : <ParentLoginPage />}
      />
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedParentRoute>
            <ParentDashboardPage />
          </ProtectedParentRoute>
        }
      />

      {/* 3. Staff & Admin Login */}
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

      {/* 4. Staff & Admin Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dedicated Role Dashboards */}
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <SchoolAdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'teacher']}>
              <TeacherDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accountant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'accountant']}>
              <AccountantDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Academic Central Modules */}
        <Route
          path="/academic/overview"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <AcademicOverviewDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/sessions"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <AcademicSessionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/classes"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <ClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/teachers"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <TeacherAssignmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic/promotions"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <StudentPromotionsPage />
            </ProtectedRoute>
          }
        />

        {/* Operational Modules with Role Safeguards */}
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

        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/examinations"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <ExaminationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fees"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'accountant']}>
              <FeesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/timetable"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <TimetablePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notices"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'accountant']}>
              <NoticesPage />
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/diary"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
              <DiaryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'accountant']}>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'accountant']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
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
