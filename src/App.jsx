import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './locales/i18n';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Auth Pages
import SelectLoginType from './pages/auth/SelectLoginType';
import AdminLogin from './pages/auth/AdminLogin';
import UserLogin from './pages/auth/UserLogin';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import GroupManagement from './pages/admin/GroupManagement';
import PendingApprovals from './pages/admin/PendingApprovals';
import Reports from './pages/admin/Reports';
import StudentReport from './pages/admin/StudentReport';
import GroupReport from './pages/admin/GroupReport';
import AddAttendanceForUser from './pages/admin/AddAttendanceForUser';
import AddGathaForUser from './pages/admin/AddGathaForUser';
import AdminAnalytics from './pages/admin/Analytics';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import MarkAttendance from './pages/user/MarkAttendance';
import AddGatha from './pages/user/AddGatha';
import MyHistory from './pages/user/MyHistory';
import FamilyHistory from './pages/user/FamilyHistory';
import UserAnalytics from './pages/user/Analytics';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<SelectLoginType />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route path="approvals" element={<PendingApprovals />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/student/:id" element={<StudentReport />} />
            <Route path="reports/group/:id" element={<GroupReport />} />
            <Route path="add-attendance" element={<AddAttendanceForUser />} />
            <Route path="add-gatha" element={<AddGathaForUser />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="mark-attendance" element={<MarkAttendance />} />
            <Route path="add-gatha" element={<AddGatha />} />
            <Route path="my-history" element={<MyHistory />} />
            <Route path="family-history" element={<FamilyHistory />} />
            <Route path="analytics" element={<UserAnalytics />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px'
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' }
            }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;