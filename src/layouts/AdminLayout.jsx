import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '../components/admin';
import { LanguageSwitcher } from '../components/common';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const location = useLocation();
  const { isAdminAuthenticated, admin, adminToken } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (!isAdminAuthenticated || !admin || !adminToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — receives mobile open state */}
      <Sidebar isMobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 w-0">
        {/* Top Header */}
        <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 flex-shrink-0">
          {/* Left: Hamburger (mobile) + App name (mobile) */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="lg:hidden">
              <span className="font-bold text-gray-900 text-sm">Jain Pathshala</span>
              <p className="text-xs text-gray-500 leading-none">{admin?.name}</p>
            </div>
          </div>

          {/* Right: Language switcher */}
          <LanguageSwitcher variant="compact" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;