import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ParentAuthProvider, useParentAuth } from '@/contexts/ParentAuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ParentLoginPage } from '@/pages/auth/ParentLoginPage';
import { ParentDashboardPage } from '@/pages/parent/ParentDashboardPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

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

function AppRoutes() {
  const { user, loading } = useAuth();

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
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

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
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/parents" element={<ParentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/examinations" element={<ExaminationsPage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
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
