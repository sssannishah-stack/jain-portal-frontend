import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UsersRound,
  ClipboardCheck,
  FileBarChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, admin } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.dashboard') },
    { path: '/admin/users', icon: Users, label: t('admin.users') },
    { path: '/admin/groups', icon: UsersRound, label: t('admin.groups') },
    { path: '/admin/approvals', icon: ClipboardCheck, label: t('admin.approvals') },
    { path: '/admin/add-attendance', icon: UserPlus, label: t('admin.addAttendanceForStudent') },
    { path: '/admin/add-gatha', icon: BookOpen, label: t('admin.addGathaForStudent') },
    { path: '/admin/reports', icon: FileBarChart, label: t('admin.reports') }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onMobileClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
          : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200
          flex flex-col z-50 transition-all duration-300 flex-shrink-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-72
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-14 md:h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">જ</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">{t('common.appName')}</h1>
                <p className="text-xs text-gray-500">{t('admin.panel')}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile close button */}
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Desktop collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-3 mb-3 px-2 py-2 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {admin?.email || 'admin'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
              text-red-600 hover:bg-red-50 transition-colors text-sm font-medium
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>{t('common.logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;