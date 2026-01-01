import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Import pages
import { LoadingPage } from '../pages/LoadingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/LoginPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminStudents } from '../pages/admin/AdminStudents';
import { AdminFamilies } from '../pages/admin/AdminFamilies';
import { AdminAttendance } from '../pages/admin/AdminAttendance';
import { AdminGatha } from '../pages/admin/AdminGatha';
import { AdminApprovals } from '../pages/admin/AdminApprovals';
import { AdminReports } from '../pages/admin/AdminReports';

// User Pages - from single file
import { UserDashboard, UserAttendance, UserGatha, UserReports } from '../pages/user/UserPages';

// ============================================
// PROTECTED ROUTES
// ============================================

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useApp();
  
  if (loading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/user/dashboard" replace />;
  
  return <>{children}</>;
}

function UserRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useApp();
  
  if (loading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  
  return <>{children}</>;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useApp();
  
  if (loading) return <LoadingPage />;
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }
  
  return <>{children}</>;
}

// ============================================
// APP ROUTES
// ============================================

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      
      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/students" element={<AdminRoute><AdminStudents /></AdminRoute>} />
      <Route path="/admin/families" element={<AdminRoute><AdminFamilies /></AdminRoute>} />
      <Route path="/admin/attendance" element={<AdminRoute><AdminAttendance /></AdminRoute>} />
      <Route path="/admin/gatha" element={<AdminRoute><AdminGatha /></AdminRoute>} />
      <Route path="/admin/approvals" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* User */}
      <Route path="/user/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
      <Route path="/user/attendance" element={<UserRoute><UserAttendance /></UserRoute>} />
      <Route path="/user/gatha" element={<UserRoute><UserGatha /></UserRoute>} />
      <Route path="/user/reports" element={<UserRoute><UserReports /></UserRoute>} />
      <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;