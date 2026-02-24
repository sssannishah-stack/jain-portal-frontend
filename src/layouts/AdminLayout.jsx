import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/admin';
import { LanguageSwitcher } from '../components/common';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const location = useLocation();
  const { isAdminAuthenticated, admin, adminToken } = useAuthStore();

  // Debug log
  useEffect(() => {
    console.log('AdminLayout - isAdminAuthenticated:', isAdminAuthenticated);
    console.log('AdminLayout - admin:', admin);
    console.log('AdminLayout - adminToken:', adminToken ? 'exists' : 'null');
  }, [isAdminAuthenticated, admin, adminToken]);

  // Check authentication
  if (!isAdminAuthenticated || !admin || !adminToken) {
    console.log('AdminLayout - Redirecting to admin login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 sticky top-0 z-30">
          <LanguageSwitcher variant="compact" />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;