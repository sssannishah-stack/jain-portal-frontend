import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  Layout,
  Card,
  StatCard,
  Button,
  Input,
  Select,
  MultiSelect,
  DatePicker,
  DateRangePicker,
  Modal,
  ConfirmDialog,
  Table,
  Badge,
  StatusBadge,
  EmptyState,
  Tabs,
  ProgressBar,
  QuickActionButton,
  Spinner,
  exportToCSV,
  formatDate
} from '../components/Components';
import {
  Users,
  UserPlus,
  Calendar,
  BookOpen,
  CheckSquare,
  FileText,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Download,
  TrendingUp,
  Award,
  Target,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Home,
  Flame,
  User,
  Lock,
  LogIn,
  Loader2,
  Shield
} from 'lucide-react';

// ============================================
// HELPER FUNCTIONS
// ============================================

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const getMonthStartDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
};

const getMonthEndDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
};

// ============================================
// BEAUTIFUL LOGIN PAGE
// ============================================

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const { adminLogin, userLogin, error, clearError, loading } = useApp();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    clearError();
    setFormData({ username: '', name: '', password: '' });
  }, [isAdmin]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isAdmin) {
      result = await adminLogin(formData.username, formData.password);
    } else {
      result = await userLogin(formData.name, formData.password);
    }
    
    if (result.success) {
      window.location.href = isAdmin ? '/admin/dashboard' : '/user/dashboard';
    }
  };
  
  const languages = [
    { code: 'en', label: 'EN', fullLabel: 'English' },
    { code: 'hi', label: 'हि', fullLabel: 'हिंदी' },
    { code: 'gu', label: 'ગુ', fullLabel: 'ગુજરાતી' }
  ];
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Main content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Language selector - top right */}
        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full p-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i18n.language === lang.code
                  ? 'bg-white text-orange-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
              title={lang.fullLabel}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        {/* Login Card */}
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
              <span className="text-5xl">🙏</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('appName')}</h1>
            <p className="text-white/80">
              {isAdmin ? t('adminLogin') : t('studentLogin')}
            </p>
          </div>
          
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Toggle Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setIsAdmin(false)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all relative ${
                  !isAdmin 
                    ? 'text-orange-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{t('studentLogin')}</span>
                </div>
                {!isAdmin && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
              <button
                onClick={() => setIsAdmin(true)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all relative ${
                  isAdmin 
                    ? 'text-orange-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>{t('adminLogin')}</span>
                </div>
                {isAdmin && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Username/Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {isAdmin ? t('username') : t('name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={isAdmin ? formData.username : formData.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      [isAdmin ? 'username' : 'name']: e.target.value 
                    })}
                    placeholder={isAdmin ? t('username') : t('name')}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t('password')}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>{t('login')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/70 text-sm">
              © 2024 {t('appName')}
            </p>
            <p className="text-white/50 text-xs mt-1">
              {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ADMIN DASHBOARD
// ============================================

export function AdminDashboard() {
  const { t } = useTranslation();
  const { 
    fetchAdminDashboard, 
    dashboardData, 
    loading,
    fetchPendingAttendance,
    fetchPendingGatha,
    pendingAttendance,
    pendingGatha
  } = useApp();
  
  useEffect(() => {
    fetchAdminDashboard();
    fetchPendingAttendance();
    fetchPendingGatha();
  }, []);
  
  if (loading || !dashboardData) {
    return (
      <Layout title={t('dashboard')} isAdmin>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }
  
  const { today, monthly, pending, totals, weeklyTrend } = dashboardData;
  
  return (
    <Layout title={t('dashboard')} isAdmin>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-jain-primary to-orange-500 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{t('welcomeBack')}! 🙏</h2>
          <p className="opacity-90">{t('todayStats')}: {formatDate(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label={t('today') + ' ' + t('attendance')}
            value={today?.attendance || 0}
            color="orange"
          />
          <StatCard
            icon={BookOpen}
            label={t('today') + ' ' + t('gatha')}
            value={today?.gatha || 0}
            color="green"
          />
          <StatCard
            icon={Users}
            label={t('totalStudents')}
            value={totals?.students || 0}
            color="blue"
          />
          <StatCard
            icon={UserPlus}
            label={t('totalFamilies')}
            value={totals?.families || 0}
            color="purple"
          />
        </div>
        
        {/* Monthly Stats & Pending */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title={t('monthlyStats')}>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-jain-primary" />
                  <span className="text-gray-600">{t('totalAttendance')}</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  {monthly?.attendance || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">{t('newGatha')}</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {monthly?.newGatha || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">{t('revisionGatha')}</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {monthly?.revisionGatha || 0}
                </span>
              </div>
            </div>
          </Card>
          
          <Card title={t('pendingApprovals')}>
            {(pending?.attendance || 0) + (pending?.gatha || 0) > 0 ? (
              <div className="space-y-4">
                <a 
                  href="/admin/approvals" 
                  className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-200 rounded-lg">
                      <Calendar className="w-5 h-5 text-yellow-700" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('pendingAttendance')}</span>
                      <p className="text-sm text-gray-500">{t('reviewAndApprove')}</p>
                    </div>
                  </div>
                  <Badge variant="warning">{pending?.attendance || 0}</Badge>
                </a>
                <a 
                  href="/admin/approvals"
                  className="flex justify-between items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-200 rounded-lg">
                      <BookOpen className="w-5 h-5 text-orange-700" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('pendingGatha')}</span>
                      <p className="text-sm text-gray-500">{t('reviewAndApprove')}</p>
                    </div>
                  </div>
                  <Badge variant="warning">{pending?.gatha || 0}</Badge>
                </a>
              </div>
            ) : (
              <EmptyState
                icon={CheckSquare}
                title={t('noPending')}
                description={t('noData')}
              />
            )}
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card title={t('quickActions')}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={UserPlus}
              label={t('addStudent')}
              onClick={() => window.location.href = '/admin/students'}
            />
            <QuickActionButton
              icon={Users}
              label={t('addFamily')}
              onClick={() => window.location.href = '/admin/families'}
              color="info"
            />
            <QuickActionButton
              icon={Calendar}
              label={t('markAttendance')}
              onClick={() => window.location.href = '/admin/attendance'}
              color="success"
            />
            <QuickActionButton
              icon={FileText}
              label={t('reports')}
              onClick={() => window.location.href = '/admin/reports'}
            />
          </div>
        </Card>
        
        {/* Weekly Trend */}
        {weeklyTrend && weeklyTrend.length > 0 && (
          <Card title={t('weeklyTrend')}>
            <div className="flex items-end justify-between h-48 px-4 pt-4">
              {weeklyTrend.map((day, index) => {
                const maxCount = Math.max(...weeklyTrend.map(d => d.count), 1);
                const height = (day.count / maxCount) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1 mx-1">
                    <span className="text-sm font-medium text-gray-700 mb-2">{day.count}</span>
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-jain-primary to-orange-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {day._id?.slice(8, 10)}/{day._id?.slice(5, 7)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

// ============================================
// ADMIN STUDENTS MANAGEMENT
// ============================================

export function AdminStudents() {
  const { t } = useTranslation();
  const { 
    students, 
    families,
    fetchStudents, 
    fetchFamilies,
    addStudent, 
    updateStudent, 
    deleteStudent,
    loading 
  } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchStudents();
    fetchFamilies();
  }, []);
  
  const resetForm = () => {
    setFormData({ name: '', password: '' });
    setFormError('');
    setSelectedStudent(null);
    setShowModal(false);
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.password.trim()) {
      setFormError(t('error'));
      return;
    }
    
    setSubmitting(true);
    setFormError('');
    
    let result;
    if (selectedStudent) {
      result = await updateStudent(selectedStudent._id, formData);
    } else {
      result = await addStudent(formData);
    }
    
    setSubmitting(false);
    
    if (result.success) {
      resetForm();
    } else {
      setFormError(result.message || t('error'));
    }
  };
  
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({ name: student.name, password: student.password });
    setFormError('');
    setShowModal(true);
  };
  
  const handleDelete = async () => {
    if (selectedStudent) {
      await deleteStudent(selectedStudent._id);
      setSelectedStudent(null);
      setShowDeleteConfirm(false);
    }
  };
  
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.password.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    { 
      header: '#',
      render: (_, index) => index + 1
    },
    { header: t('name'), accessor: 'name' },
    { header: t('password'), accessor: 'password' },
    { 
      header: t('families'), 
      render: (row) => row.familyId?.name ? (
        <Badge variant="primary">{row.familyId.name}</Badge>
      ) : (
        <span className="text-gray-400 text-sm">{t('notAssigned')}</span>
      )
    },
    { 
      header: t('date'), 
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: t('actions'),
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t('edit')}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedStudent(row);
              setShowDeleteConfirm(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  
  return (
    <Layout title={t('students')} isAdmin>
      <Card
        title={`${t('students')} (${filteredStudents.length})`}
        action={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            {t('addStudent')}
          </Button>
        }
      >
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder={t('search') + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredStudents}
          loading={loading}
          emptyMessage={t('noStudents')}
        />
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={selectedStudent ? t('editStudent') : t('addStudent')}
      >
        <div className="space-y-4">
          <Input
            label={t('studentName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder={t('studentName')}
          />
          <Input
            label={t('studentPassword')}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder={t('studentPassword')}
          />
          
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {formError}
            </div>
          )}
          
          <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {t('duplicateError')}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={resetForm}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              {t('save')}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('delete')}
        message={`${t('confirmDelete')} "${selectedStudent?.name}"?`}
      />
    </Layout>
  );
}

// ============================================
// ADMIN FAMILIES MANAGEMENT
// ============================================

export function AdminFamilies() {
  const { t } = useTranslation();
  const { 
    students, 
    families,
    fetchStudents, 
    fetchFamilies,
    addFamily, 
    updateFamily, 
    deleteFamily,
    loading 
  } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    memberIds: [] 
  });
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchStudents();
    fetchFamilies();
  }, []);
  
  const resetForm = () => {
    setFormData({ name: '', description: '', memberIds: [] });
    setFormError('');
    setSelectedFamily(null);
    setShowModal(false);
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFormError(t('error'));
      return;
    }
    
    setSubmitting(true);
    setFormError('');
    
    let result;
    if (selectedFamily) {
      result = await updateFamily(selectedFamily._id, formData);
    } else {
      result = await addFamily(formData);
    }
    
    setSubmitting(false);
    
    if (result.success) {
      resetForm();
      fetchFamilies();
      fetchStudents();
    } else {
      setFormError(result.message || t('error'));
    }
  };
  
  const handleEdit = (family) => {
    setSelectedFamily(family);
    setFormData({
      name: family.name,
      description: family.description || '',
      memberIds: family.members?.map(m => m._id) || []
    });
    setFormError('');
    setShowModal(true);
  };
  
  const handleDelete = async () => {
    if (selectedFamily) {
      await deleteFamily(selectedFamily._id);
      setSelectedFamily(null);
      setShowDeleteConfirm(false);
    }
  };
  
  // Get students not in any family or in current family being edited
  const availableStudents = students.filter(s => 
    !s.familyId || 
    (selectedFamily && s.familyId._id === selectedFamily._id)
  );
  
  const filteredFamilies = families.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    { 
      header: '#',
      render: (_, index) => index + 1
    },
    { header: t('familyName'), accessor: 'name' },
    { header: t('description'), render: (row) => row.description || '-' },
    { 
      header: t('members'), 
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.members?.length > 0 ? (
            row.members.slice(0, 3).map((member, idx) => (
              <Badge key={idx} variant="info">{member.name}</Badge>
            ))
          ) : (
            <span className="text-gray-400 text-sm">{t('noMembers')}</span>
          )}
          {row.members?.length > 3 && (
            <Badge variant="default">+{row.members.length - 3}</Badge>
          )}
        </div>
      )
    },
    { 
      header: t('memberCount'), 
      render: (row) => (
        <Badge variant="primary">{row.members?.length || 0}</Badge>
      )
    },
    {
      header: t('actions'),
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t('edit')}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedFamily(row);
              setShowDeleteConfirm(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  
  return (
    <Layout title={t('families')} isAdmin>
      <Card
        title={`${t('families')} (${filteredFamilies.length})`}
        action={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            {t('addFamily')}
          </Button>
        }
      >
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder={t('search') + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredFamilies}
          loading={loading}
          emptyMessage={t('noFamilies')}
        />
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={selectedFamily ? t('editFamily') : t('addFamily')}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label={t('familyName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder={t('familyName')}
          />
          
          <Input
            label={t('description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('description')}
          />
          
          <MultiSelect
            label={t('selectMembers')}
            options={availableStudents.map(s => ({
              value: s._id,
              label: `${s.name} (${s.password})`
            }))}
            selected={formData.memberIds}
            onChange={(ids) => setFormData({ ...formData, memberIds: ids })}
          />
          
          {formData.memberIds.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <Check className="w-4 h-4 inline mr-2" />
                {formData.memberIds.length} {t('members')} {t('selected')}
              </p>
            </div>
          )}
          
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {formError}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={resetForm}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              {t('save')}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('delete')}
        message={`${t('confirmDelete')} "${selectedFamily?.name}"?`}
      />
    </Layout>
  );
}

// ============================================
// ADMIN ATTENDANCE PAGE
// ============================================

export function AdminAttendance() {
  const { t } = useTranslation();
  const { 
    students, 
    fetchStudents,
    adminMarkAttendance,
    loading 
  } = useApp();
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const handleMarkAttendance = async () => {
    if (!selectedStudent || !selectedDate) return;
    
    setSubmitting(true);
    const result = await adminMarkAttendance(selectedStudent, selectedDate);
    setSubmitting(false);
    
    if (result.success) {
      setSelectedStudent('');
    }
  };
  
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout title={t('attendance')} isAdmin>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mark Attendance Form */}
        <Card title={t('markAttendance')}>
          <div className="space-y-4">
            <DatePicker
              label={t('selectDate')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={getTodayDate()}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search')} {t('students')}
              </label>
              <Input
                placeholder={t('search') + '...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              label={t('selectMember')}
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              options={filteredStudents.map(s => ({
                value: s._id,
                label: `${s.name} ${s.familyId?.name ? `(${s.familyId.name})` : ''}`
              }))}
              placeholder={t('selectMember')}
              required
            />
            
            <Button
              onClick={handleMarkAttendance}
              loading={submitting}
              disabled={!selectedStudent || !selectedDate}
              className="w-full"
              icon={Check}
            >
              {t('markAttendance')}
            </Button>
          </div>
        </Card>
        
        {/* Quick Mark for Multiple Students */}
        <Card title={t('students')}>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    {student.familyId?.name && (
                      <p className="text-sm text-gray-500">{student.familyId.name}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student._id);
                      handleMarkAttendance();
                    }}
                  >
                    {t('markAttendance')}
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

// ============================================
// ADMIN GATHA PAGE
// ============================================

export function AdminGatha() {
  const { t } = useTranslation();
  const { 
    students, 
    fetchStudents,
    adminAddGatha,
    loading 
  } = useApp();
  
  const [formData, setFormData] = useState({
    userId: '',
    date: getTodayDate(),
    type: 'new',
    count: 1,
    gathaNames: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const handleSubmit = async () => {
    if (!formData.userId || !formData.date || !formData.count) return;
    
    setSubmitting(true);
    const result = await adminAddGatha({
      ...formData,
      gathaNames: formData.gathaNames.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSubmitting(false);
    
    if (result.success) {
      setFormData({
        ...formData,
        userId: '',
        count: 1,
        gathaNames: ''
      });
    }
  };
  
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout title={t('gatha')} isAdmin>
      <Card title={t('addGatha')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DatePicker
              label={t('selectDate')}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              max={getTodayDate()}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search')} {t('students')}
              </label>
              <Input
                placeholder={t('search') + '...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              label={t('selectMember')}
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              options={filteredStudents.map(s => ({
                value: s._id,
                label: `${s.name} ${s.familyId?.name ? `(${s.familyId.name})` : ''}`
              }))}
              placeholder={t('selectMember')}
              required
            />
          </div>
          
          <div className="space-y-4">
            <Select
              label={t('gathaType')}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'new', label: t('new') },
                { value: 'revision', label: t('revision') }
              ]}
              required
            />
            
            <Input
              label={t('count')}
              type="number"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
              min="1"
              required
            />
            
            <Input
              label={t('gathaNames')}
              value={formData.gathaNames}
              onChange={(e) => setFormData({ ...formData, gathaNames: e.target.value })}
              placeholder="गाथा 1, गाथा 2, गाथा 3"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!formData.userId || !formData.date || !formData.count}
            className="w-full md:w-auto"
            icon={Plus}
          >
            {t('addGatha')}
          </Button>
        </div>
      </Card>
    </Layout>
  );
}

// ============================================
// ADMIN APPROVALS PAGE
// ============================================

export function AdminApprovals() {
  const { t } = useTranslation();
  const {
    pendingAttendance,
    pendingGatha,
    fetchPendingAttendance,
    fetchPendingGatha,
    approveAttendance,
    approveGatha,
    bulkApproveAttendance,
    bulkApproveGatha,
    loading
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedIds, setSelectedIds] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    fetchPendingAttendance();
    fetchPendingGatha();
  }, []);
  
  const handleApprove = async (id, type) => {
    setProcessing(true);
    if (type === 'attendance') {
      await approveAttendance(id, 'approved');
    } else {
      await approveGatha(id, 'approved');
    }
    setProcessing(false);
  };
  
  const handleReject = async (id, type) => {
    setProcessing(true);
    if (type === 'attendance') {
      await approveAttendance(id, 'rejected');
    } else {
      await approveGatha(id, 'rejected');
    }
    setProcessing(false);
  };
  
  const handleBulkApprove = async (status) => {
    if (selectedIds.length === 0) return;
    
    setProcessing(true);
    if (activeTab === 'attendance') {
      await bulkApproveAttendance(selectedIds, status);
    } else {
      await bulkApproveGatha(selectedIds, status);
    }
    setSelectedIds([]);
    setProcessing(false);
  };
  
  const toggleSelectAll = (items) => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i._id));
    }
  };
  
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const tabs = [
    { id: 'attendance', label: t('pendingAttendance'), count: pendingAttendance.length },
    { id: 'gatha', label: t('pendingGatha'), count: pendingGatha.length }
  ];
  
  const currentItems = activeTab === 'attendance' ? pendingAttendance : pendingGatha;
  
  const attendanceColumns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === pendingAttendance.length && pendingAttendance.length > 0}
          onChange={() => toggleSelectAll(pendingAttendance)}
          className="w-4 h-4 text-jain-primary rounded"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row._id)}
          onChange={() => toggleSelect(row._id)}
          className="w-4 h-4 text-jain-primary rounded"
        />
      )
    },
    { header: t('name'), render: (row) => row.userId?.name },
    { header: t('date'), render: (row) => formatDate(row.date) },
    { header: t('markedBy'), render: (row) => row.markedBy?.name || '-' },
    { header: t('markedOn'), render: (row) => formatDate(row.createdAt) },
    {
      header: t('actions'),
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleApprove(row._id, 'attendance')}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            disabled={processing}
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleReject(row._id, 'attendance')}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            disabled={processing}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  
  const gathaColumns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === pendingGatha.length && pendingGatha.length > 0}
          onChange={() => toggleSelectAll(pendingGatha)}
          className="w-4 h-4 text-jain-primary rounded"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row._id)}
          onChange={() => toggleSelect(row._id)}
          className="w-4 h-4 text-jain-primary rounded"
        />
      )
    },
    { header: t('name'), render: (row) => row.userId?.name },
    { header: t('date'), render: (row) => formatDate(row.date) },
    { 
      header: t('gathaType'), 
      render: (row) => (
        <Badge variant={row.type === 'new' ? 'success' : 'info'}>
          {row.type === 'new' ? t('new') : t('revision')}
        </Badge>
      )
    },
    { header: t('count'), accessor: 'count' },
    { header: t('markedBy'), render: (row) => row.markedBy?.name || '-' },
    {
      header: t('actions'),
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleApprove(row._id, 'gatha')}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            disabled={processing}
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleReject(row._id, 'gatha')}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            disabled={processing}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  
  return (
    <Layout title={t('approvals')} isAdmin>
      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(tab) => {
          setActiveTab(tab);
          setSelectedIds([]);
        }} />
        
        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mt-4">
            <span className="text-blue-800">
              {selectedIds.length} {t('selected')}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleBulkApprove('approved')}
                loading={processing}
              >
                {t('approveSelected')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleBulkApprove('rejected')}
                loading={processing}
              >
                {t('rejectSelected')}
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          {currentItems.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title={t('noPending')}
              description={t('noData')}
            />
          ) : (
            <Table
              columns={activeTab === 'attendance' ? attendanceColumns : gathaColumns}
              data={currentItems}
              loading={loading}
            />
          )}
        </div>
      </Card>
    </Layout>
  );
}

// ============================================
// ADMIN REPORTS PAGE
// ============================================

export function AdminReports() {
  const { t } = useTranslation();
  const {
    fetchStudentReport,
    fetchFamilyReport,
    exportReport,
    reportData,
    loading
  } = useApp();
  
  const [reportType, setReportType] = useState('student');
  const [startDate, setStartDate] = useState(getMonthStartDate());
  const [endDate, setEndDate] = useState(getMonthEndDate());
  
  const handleGenerateReport = async () => {
    if (reportType === 'student') {
      await fetchStudentReport(startDate, endDate);
    } else {
      await fetchFamilyReport(startDate, endDate);
    }
  };
  
  const handleExport = async () => {
    const result = await exportReport(startDate, endDate);
    if (result.success) {
      const { attendance, gatha, reportName, dateRange } = result.data;
      
      // Combine data for export
      const exportData = [
        ...attendance.map(a => ({ ...a, recordType: 'Attendance' })),
        ...gatha.map(g => ({ ...g, recordType: 'Gatha' }))
      ];
      
      exportToCSV(exportData, `${reportName}_${dateRange.start}_${dateRange.end}`);
    }
  };
  
  const studentColumns = [
    { header: '#', render: (_, index) => index + 1 },
    { header: t('name'), accessor: 'name' },
    { header: t('totalAttendance'), accessor: 'totalAttendance' },
    { header: t('newGatha'), accessor: 'newGatha' },
    { header: t('revisionGatha'), accessor: 'revisionGatha' },
    { header: t('totalGatha'), accessor: 'totalGatha' }
  ];
  
  const familyColumns = [
    { header: '#', render: (_, index) => index + 1 },
    { header: t('name'), accessor: 'name' },
    { 
      header: t('type'), 
      render: (row) => (
        <Badge variant={row.type === 'family' ? 'primary' : 'info'}>
          {row.type === 'family' ? t('families') : t('students')}
        </Badge>
      )
    },
    { header: t('memberCount'), accessor: 'memberCount' },
    { header: t('totalAttendance'), accessor: 'totalAttendance' },
    { header: t('newGatha'), accessor: 'newGatha' },
    { header: t('revisionGatha'), accessor: 'revisionGatha' },
    { header: t('totalGatha'), accessor: 'totalGatha' }
  ];
  
  return (
    <Layout title={t('reports')} isAdmin>
      <div className="space-y-6">
        {/* Filters */}
        <Card title={t('generateReport')}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label={t('selectReportType')}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'student', label: t('byStudent') },
                { value: 'family', label: t('byFamily') }
              ]}
            />
            <DatePicker
              label={t('from')}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DatePicker
              label={t('to')}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
            <div className="flex items-end">
              <Button
                onClick={handleGenerateReport}
                loading={loading}
                className="w-full"
              >
                {t('generateReport')}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Report Results */}
        {reportData && (
          <Card
            title={`${t('reports')} (${reportData.dateRange?.start} - ${reportData.dateRange?.end})`}
            action={
              <Button variant="outline" icon={Download} onClick={handleExport}>
                {t('exportCSV')}
              </Button>
            }
          >
            {/* Summary Stats */}
            {reportData.totals && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-jain-light rounded-lg">
                  <p className="text-sm text-gray-600">{t('totalAttendance')}</p>
                  <p className="text-2xl font-bold text-jain-primary">
                    {reportData.totals.totalAttendance || reportData.grandTotals?.totalAttendance || 0}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">{t('newGatha')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.totals.totalNewGatha || reportData.grandTotals?.totalNewGatha || 0}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">{t('revisionGatha')}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reportData.totals.totalRevisionGatha || reportData.grandTotals?.totalRevisionGatha || 0}
                  </p>
                </div>
              </div>
            )}
            
            {/* Data Table */}
            <Table
              columns={reportType === 'student' ? studentColumns : familyColumns}
              data={reportData.report || []}
              loading={loading}
              emptyMessage={t('noReportData')}
            />
          </Card>
        )}
      </div>
    </Layout>
  );
}

// ============================================
// USER DASHBOARD
// ============================================

export function UserDashboard() {
  const { t } = useTranslation();
  const {
    user,
    familyMembers,
    fetchUserDashboard,
    dashboardData,
    loading
  } = useApp();
  
  useEffect(() => {
    fetchUserDashboard();
  }, []);
  
  if (loading || !dashboardData) {
    return (
      <Layout title={t('dashboard')} isAdmin={false}>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }
  
  const { today, monthly, pending, streak } = dashboardData;
  
  return (
    <Layout title={t('dashboard')} isAdmin={false}>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-jain-primary to-orange-500 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            {t('welcome')}, {user?.name}! 🙏
          </h2>
          <p className="opacity-90">
            {user?.familyName && `${t('myFamily')}: ${user.familyName}`}
          </p>
        </div>
        
        {/* Streak & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Flame}
            label={t('streak')}
            value={streak || 0}
            subValue={t('days')}
            color="orange"
          />
          <StatCard
            icon={Calendar}
            label={t('thisMonth') + ' ' + t('attendance')}
            value={monthly?.attendance || 0}
            color="green"
          />
          <StatCard
            icon={BookOpen}
            label={t('thisMonth') + ' ' + t('gatha')}
            value={(monthly?.newGatha || 0) + (monthly?.revisionGatha || 0)}
            color="blue"
          />
        </div>
        
        {/* Today's Status */}
        <Card title={t('todayStatus')}>
          {today?.attendance?.length > 0 ? (
            <div className="space-y-3">
              {today.attendance.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'approved' ? 'bg-green-100' : 
                      item.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {item.status === 'approved' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : item.status === 'pending' ? (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{t('attendance')}</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('notMarked')}</p>
              <Button
                className="mt-4"
                onClick={() => window.location.href = '/user/attendance'}
              >
                {t('markForToday')}
              </Button>
            </div>
          )}
        </Card>
        
        {/* Pending Items */}
        {(pending?.attendance > 0 || pending?.gatha > 0) && (
          <Card title={t('pending')}>
            <div className="space-y-2">
              {pending?.attendance > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700">{t('pendingAttendance')}</span>
                  <Badge variant="warning">{pending.attendance}</Badge>
                </div>
              )}
              {pending?.gatha > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700">{t('pendingGatha')}</span>
                  <Badge variant="warning">{pending.gatha}</Badge>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Family Members */}
        {familyMembers.length > 1 && (
          <Card title={t('familyMembers')}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {familyMembers.map((member) => (
                <div
                  key={member._id}
                  className={`p-3 rounded-lg border-2 ${
                    member._id === user?.id 
                      ? 'border-jain-primary bg-jain-light' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-jain-secondary rounded-full flex items-center justify-center">
                      <span className="text-jain-dark font-medium text-sm">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* Quick Actions */}
        <Card title={t('quickActions')}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <QuickActionButton
              icon={Calendar}
              label={t('markAttendance')}
              onClick={() => window.location.href = '/user/attendance'}
            />
            <QuickActionButton
              icon={BookOpen}
              label={t('addGatha')}
              onClick={() => window.location.href = '/user/gatha'}
              color="success"
            />
            <QuickActionButton
              icon={FileText}
              label={t('viewHistory')}
              onClick={() => window.location.href = '/user/reports'}
              color="info"
            />
          </div>
        </Card>
      </div>
    </Layout>
  );
}

// ============================================
// USER ATTENDANCE PAGE
// ============================================

export function UserAttendance() {
  const { t } = useTranslation();
  const {
    user,
    familyMembers,
    markAttendance,
    loading
  } = useApp();
  
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (familyMembers.length === 1) {
      setSelectedMember(familyMembers[0]._id);
    }
  }, [familyMembers]);
  
  const handleMarkAttendance = async () => {
    if (!selectedMember || !selectedDate) return;
    
    setSubmitting(true);
    const result = await markAttendance(selectedMember, selectedDate);
    setSubmitting(false);
    
    if (result.success) {
      // Keep member selected for quick consecutive marking
    }
  };
  
  const handleMarkAll = async () => {
    setSubmitting(true);
    for (const member of familyMembers) {
      await markAttendance(member._id, selectedDate);
    }
    setSubmitting(false);
  };
  
  return (
    <Layout title={t('attendance')} isAdmin={false}>
      <div className="max-w-lg mx-auto space-y-6">
        <Card title={t('markAttendance')}>
          <div className="space-y-4">
            <DatePicker
              label={t('selectDate')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={getTodayDate()}
              required
            />
            
            {familyMembers.length > 1 ? (
              <>
                <Select
                  label={t('selectMember')}
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  options={familyMembers.map(m => ({
                    value: m._id,
                    label: m.name
                  }))}
                  placeholder={t('selectMember')}
                  required
                />
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handleMarkAttendance}
                    loading={submitting}
                    disabled={!selectedMember}
                    className="flex-1"
                    icon={Check}
                  >
                    {t('markAttendance')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMarkAll}
                    loading={submitting}
                    className="flex-1"
                  >
                    {t('all')}
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={handleMarkAttendance}
                loading={submitting}
                className="w-full"
                icon={Check}
              >
                {t('markAttendance')}
              </Button>
            )}
          </div>
        </Card>
        
        {/* Quick Mark for Family */}
        {familyMembers.length > 1 && (
          <Card title={t('familyMembers')}>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-jain-secondary rounded-full flex items-center justify-center">
                      <span className="text-jain-dark font-semibold">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">{member.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setSubmitting(true);
                      await markAttendance(member._id, selectedDate);
                      setSubmitting(false);
                    }}
                    loading={submitting}
                  >
                    {t('mark')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {t('attendancePending')}
          </p>
        </div>
      </div>
    </Layout>
  );
}

// ============================================
// USER GATHA PAGE
// ============================================

export function UserGatha() {
  const { t } = useTranslation();
  const {
    user,
    familyMembers,
    addGatha,
    loading
  } = useApp();
  
  const [formData, setFormData] = useState({
    userId: '',
    date: getTodayDate(),
    type: 'new',
    count: 1,
    gathaNames: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (familyMembers.length === 1) {
      setFormData(prev => ({ ...prev, userId: familyMembers[0]._id }));
    }
  }, [familyMembers]);
  
  const handleSubmit = async () => {
    if (!formData.userId || !formData.date || !formData.count) return;
    
    setSubmitting(true);
    const result = await addGatha({
      ...formData,
      gathaNames: formData.gathaNames.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSubmitting(false);
    
    if (result.success) {
      setFormData(prev => ({
        ...prev,
        count: 1,
        gathaNames: ''
      }));
    }
  };
  
  return (
    <Layout title={t('gatha')} isAdmin={false}>
      <div className="max-w-lg mx-auto">
        <Card title={t('addGatha')}>
          <div className="space-y-4">
            <DatePicker
              label={t('selectDate')}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              max={getTodayDate()}
              required
            />
            
            {familyMembers.length > 1 && (
              <Select
                label={t('selectMember')}
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                options={familyMembers.map(m => ({
                  value: m._id,
                  label: m.name
                }))}
                placeholder={t('selectMember')}
                required
              />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label={t('gathaType')}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { value: 'new', label: t('new') },
                  { value: 'revision', label: t('revision') }
                ]}
                required
              />
              
              <Input
                label={t('count')}
                type="number"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
                min="1"
                required
              />
            </div>
            
            <Input
              label={t('gathaNames')}
              value={formData.gathaNames}
              onChange={(e) => setFormData({ ...formData, gathaNames: e.target.value })}
              placeholder="गाथा 1, गाथा 2, गाथा 3"
            />
            
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!formData.userId || !formData.count}
              className="w-full"
              icon={Plus}
            >
              {t('addGatha')}
            </Button>
          </div>
        </Card>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {t('attendancePending')}
          </p>
        </div>
      </div>
    </Layout>
  );
}

// ============================================
// USER REPORTS PAGE
// ============================================

export function UserReports() {
  const { t } = useTranslation();
  const {
    user,
    familyMembers,
    fetchUserReport,
    reportData,
    loading
  } = useApp();
  
  const [startDate, setStartDate] = useState(getMonthStartDate());
  const [endDate, setEndDate] = useState(getMonthEndDate());
  const [selectedMember, setSelectedMember] = useState('');
  
  const handleGenerateReport = async () => {
    await fetchUserReport(startDate, endDate, selectedMember || null);
  };
  
  useEffect(() => {
    handleGenerateReport();
  }, []);
  
  return (
    <Layout title={t('reports')} isAdmin={false}>
      <div className="space-y-6">
        {/* Filters */}
        <Card title={t('dateRange')}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DatePicker
              label={t('from')}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DatePicker
              label={t('to')}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
            {familyMembers.length > 1 && (
              <Select
                label={t('selectMember')}
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                options={[
                  { value: '', label: t('all') },
                  ...familyMembers.map(m => ({
                    value: m._id,
                    label: m.name
                  }))
                ]}
              />
            )}
            <div className="flex items-end">
              <Button onClick={handleGenerateReport} loading={loading} className="w-full">
                {t('generateReport')}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Summary */}
        {reportData && reportData.summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(reportData.summary).map(([userId, data]) => {
              const member = familyMembers.find(m => m._id === userId);
              return (
                <Card key={userId} className="border-l-4 border-jain-primary">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {member?.name || t('students')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('totalAttendance')}</span>
                      <span className="font-bold text-jain-primary">{data.totalAttendance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('newGatha')}</span>
                      <span className="font-bold text-green-600">{data.newGatha}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('revisionGatha')}</span>
                      <span className="font-bold text-blue-600">{data.revisionGatha}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Detailed History */}
        {reportData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance History */}
            <Card title={t('attendanceHistory')}>
              {reportData.attendance?.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {reportData.attendance.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.userId?.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title={t('noAttendance')}
                />
              )}
            </Card>
            
            {/* Gatha History */}
            <Card title={t('gathaHistory')}>
              {reportData.gatha?.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {reportData.gatha.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.userId?.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(item.date)} • {item.type === 'new' ? t('new') : t('revision')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={item.type === 'new' ? 'success' : 'info'}>
                          {item.count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title={t('noGatha')}
                />
              )}
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

// ============================================
// NOT FOUND PAGE
// ============================================

export function NotFoundPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">{t('noData')}</p>
        <Button onClick={() => window.location.href = '/'}>
          {t('home')}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// EXPORT ALL PAGES
// ============================================

export default {
  LoginPage,
  AdminDashboard,
  AdminStudents,
  AdminFamilies,
  AdminAttendance,
  AdminGatha,
  AdminApprovals,
  AdminReports,
  UserDashboard,
  UserAttendance,
  UserGatha,
  UserReports,
  NotFoundPage
};