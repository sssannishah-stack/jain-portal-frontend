import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  Home,
  Users,
  UserPlus,
  Calendar,
  BookOpen,
  FileText,
  CheckSquare,
  LogOut,
  ChevronDown,
  Globe,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';





// ============================================
// SPINNER / LOADER
// ============================================

export function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  return <Loader2 className={`${sizes[size]} animate-spin text-orange-500`} />;
}

// ============================================
// TOAST NOTIFICATION
// ============================================

export function Toast({ type, message }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[type] || bgColors.info}`}>
      {icons[type] || icons.info}
      <span className="text-gray-800">{message}</span>
    </div>
  );
}

// ============================================
// BUTTON
// ============================================

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = ''
}) {
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center space-x-2 font-semibold rounded-lg
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

// ============================================
// INPUT
// ============================================

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  min,
  max,
  className = ''
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-xl 
          focus:ring-2 focus:ring-orange-500 focus:border-transparent 
          outline-none transition-all bg-white
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ============================================
// SELECT
// ============================================

export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error,
  className = ''
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-xl 
          focus:ring-2 focus:ring-orange-500 focus:border-transparent 
          outline-none transition-all bg-white appearance-none cursor-pointer
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ============================================
// MULTI SELECT (Checkbox List)
// ============================================

export function MultiSelect({
  label,
  options = [],
  selected = [],
  onChange,
  className = ''
}) {
  const handleToggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-xl p-2 space-y-1 bg-white">
        {options.length === 0 ? (
          <p className="text-gray-400 text-sm p-2">No options available</p>
        ) : (
          options.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// DATE PICKER
// ============================================

export function DatePicker({
  label,
  value,
  onChange,
  required = false,
  min,
  max,
  disabled = false,
  className = ''
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-xl 
          focus:ring-2 focus:ring-orange-500 focus:border-transparent 
          outline-none transition-all bg-white
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
    </div>
  );
}

// ============================================
// MODAL
// ============================================

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} transform transition-all`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TABLE
// ============================================

export function Table({ columns, data, loading = false, emptyMessage = 'No data available' }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-sm text-gray-700">
                  {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// CARD
// ============================================

export function Card({ children, className = '', title, action }) {
  return (
    <div className={`bg-white rounded-xl shadow-md ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ============================================
// STAT CARD
// ============================================

export function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colors = {
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50',
    orange: 'border-orange-500 bg-orange-50',
    purple: 'border-purple-500 bg-purple-50',
    red: 'border-red-500 bg-red-50'
  };

  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
    red: 'text-red-500'
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// BADGE
// ============================================

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-orange-100 text-orange-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ============================================
// TABS
// ============================================

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ============================================
// QUICK ACTION BUTTON
// ============================================

export function QuickActionButton({ icon: Icon, label, onClick, color = 'primary' }) {
  const colors = {
    primary: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    success: 'bg-green-50 text-green-600 hover:bg-green-100',
    info: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${colors[color]}`}
    >
      <Icon className="w-8 h-8 mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// ============================================
// SIDEBAR
// ============================================

export function Sidebar({ isAdmin }) {
  const { t } = useTranslation();
  const { sidebarOpen, toggleSidebar, logout, user, pendingAttendance, pendingGatha } = useApp();

  const adminMenuItems = [
    { icon: Home, label: t('dashboard'), path: '/admin/dashboard' },
    { icon: Users, label: t('students'), path: '/admin/students' },
    { icon: UserPlus, label: t('families'), path: '/admin/families' },
    { icon: Calendar, label: t('attendance'), path: '/admin/attendance' },
    { icon: BookOpen, label: t('gatha'), path: '/admin/gatha' },
    { 
      icon: CheckSquare, 
      label: t('approvals'), 
      path: '/admin/approvals', 
      badge: (pendingAttendance?.length || 0) + (pendingGatha?.length || 0) 
    },
    { icon: FileText, label: t('reports'), path: '/admin/reports' }
  ];

  const userMenuItems = [
    { icon: Home, label: t('dashboard'), path: '/user/dashboard' },
    { icon: Calendar, label: t('attendance'), path: '/user/attendance' },
    { icon: BookOpen, label: t('gatha'), path: '/user/gatha' },
    { icon: FileText, label: t('reports'), path: '/user/reports' }
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const currentPath = window.location.pathname;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-30
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static w-64
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">જ</span>
            </div>
            <span className="font-bold text-gray-800 text-sm">{t('appName')}</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{isAdmin ? 'Admin' : 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <a
                key={index}
                href={item.path}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`
                      px-2 py-0.5 text-xs font-medium rounded-full
                      ${isActive ? 'bg-white text-orange-500' : 'bg-red-500 text-white'}
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ============================================
// HEADER
// ============================================

export function Header({ title }) {
  const { t, i18n } = useTranslation();
  const { toggleSidebar, user } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Globe className="w-5 h-5 text-gray-600" />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {langOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setLangOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-20">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50
                      ${lang.code === i18n.language ? 'bg-orange-50 text-orange-600' : ''}
                    `}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-orange-600 font-semibold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}

// ============================================
// LAYOUT
// ============================================

export function Layout({ children, title, isAdmin }) {
  const { toast } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header title={title} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

// ============================================
// EXPORT ALL COMPONENTS
// ============================================

export default {
  Spinner,
  Toast,
  Button,
  Input,
  Select,
  MultiSelect,
  DatePicker,
  Modal,
  Table,
  Card,
  StatCard,
  Badge,
  Tabs,
  QuickActionButton,
  Sidebar,
  Header,
  Layout
};