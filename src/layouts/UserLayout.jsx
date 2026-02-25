import React from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Users, LogOut, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

const UserLayout = () => {
  const location = useLocation();
  const { isUserAuthenticated, user, userToken, familyMembers, logout } = useAuthStore();
  const { t, i18n } = useTranslation();

  const hasFamily = familyMembers && familyMembers.length > 1;

  if (!isUserAuthenticated || !user || !userToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/user/dashboard', icon: LayoutDashboard, label: t('user.myDashboard') || 'Home' },
    { path: '/user/my-history', icon: History, label: t('user.myHistory') || 'History' },
    { path: '/user/analytics', icon: BarChart2, label: 'Analytics' },
    ...(hasFamily ? [{ path: '/user/family-history', icon: Users, label: t('user.familyHistory') || 'Family' }] : [])
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => logout();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* ───── Mobile Top Header ───── */}
      <header className="sticky top-0 z-40 md:hidden">
        {/* Gradient accent line at top */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-orange-400 to-amber-400" />
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          {/* App branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm shadow-primary-500/30">
              <span className="text-white font-bold text-base">જ</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">Jain Pathshala</h1>
              <p className="text-xs text-gray-400 leading-tight">{user?.name}</p>
            </div>
          </div>

          {/* Language switcher + logout */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {['en', 'hi', 'gu'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${i18n.language === lang
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-400'
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ───── Desktop Sidebar ───── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col z-40">
        {/* Header */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">જ</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Jain Pathshala</h1>
              <p className="text-xs text-gray-400">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${isActive
                  ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white shadow-md shadow-primary-500/25'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Language switcher */}
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 mb-2 px-1">Language</p>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[{ code: 'en', label: 'EN' }, { code: 'hi', label: 'हिं' }, { code: 'gu', label: 'ગુ' }].map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${i18n.language === lang.code
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">{user?.name}</p>
              {hasFamily && (
                <p className="text-xs text-gray-400">{familyMembers.length} family members</p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ───── Main Content ───── */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* ───── Mobile Bottom Navigation ───── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        {/* Frosted glass effect */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/80 px-2 py-1">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex-1"
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center gap-0.5 py-2 px-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-br from-primary-500 to-orange-500 shadow-md shadow-primary-500/30 scale-105'
                      : 'bg-transparent'
                      }`}>
                      <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-tight transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400'
                      }`}>
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserLayout;