import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  History,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BarChart2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const UserSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, user, familyMembers } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasFamily = familyMembers && familyMembers.length > 1;

  const menuItems = [
    { path: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/user/mark-attendance', icon: CalendarCheck, label: 'Mark Attendance' },
    { path: '/user/add-gatha', icon: BookOpen, label: 'Add Gatha' },
    { path: '/user/my-history', icon: History, label: 'My History' },
    { path: '/user/analytics', icon: BarChart2, label: 'Analytics' },
    ...(hasFamily ? [{ path: '/user/family-history', icon: Users, label: 'Family History' }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => setIsMobileOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
          ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white shadow-lg shadow-primary-500/30'
          : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap">{item.label}</span>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 
          flex flex-col z-40 transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">જ</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">Jain Pathshala</h1>
                <p className="text-xs text-gray-500">Student Portal</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                {hasFamily && (
                  <p className="text-xs text-gray-500 truncate">
                    Family: {familyMembers.length} members
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-red-600 hover:bg-red-50 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;