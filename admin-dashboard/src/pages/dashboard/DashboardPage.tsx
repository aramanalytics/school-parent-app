import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminDashboardPage } from './SuperAdminDashboardPage';
import { SchoolAdminDashboardPage } from './SchoolAdminDashboardPage';
import { TeacherDashboardPage } from './TeacherDashboardPage';
import { AccountantDashboardPage } from './AccountantDashboardPage';

/**
 * Smart Dashboard Router
 * Detects the active authenticated user role and routes to the dedicated dashboard.
 */
export function DashboardPage() {
  const { userRole } = useAuth();
  const role = userRole?.role || 'school_admin';

  switch (role) {
    case 'super_admin':
      return <SuperAdminDashboardPage />;
    case 'school_admin':
      return <SchoolAdminDashboardPage />;
    case 'teacher':
      return <TeacherDashboardPage />;
    case 'accountant':
      return <AccountantDashboardPage />;
    default:
      return <SchoolAdminDashboardPage />;
  }
}
