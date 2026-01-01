import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, StatCard, Badge, Button, Input, Select, DatePicker, Spinner } from '../../components/Components';
import { 
  Calendar, 
  BookOpen, 
  FileText, 
  Flame, 
  Check, 
  Clock, 
  Loader2, 
  Plus, 
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  PieChart,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

// ============================================
// HELPER FUNCTIONS
// ============================================

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getMonthStartDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
};

const getMonthEndDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
};

const formatDate = (date) => {
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch {
    return '-';
  }
};

// Calculate days in date range
const getDaysInRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

function ProgressBar({ value, max, color = 'orange', label, showPercentage = true }) {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  
  const colors = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };
  
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-800">{value}/{max}</span>
        </div>
      )}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-gray-500 text-right">{percentage}%</p>
      )}
    </div>
  );
}

// ============================================
// MINI STAT COMPONENT
// ============================================

function MiniStat({ icon: Icon, label, value, color = 'gray', trend }) {
  const colors = {
    orange: 'text-orange-500 bg-orange-50',
    green: 'text-green-500 bg-green-50',
    blue: 'text-blue-500 bg-blue-50',
    purple: 'text-purple-500 bg-purple-50',
    gray: 'text-gray-500 bg-gray-50'
  };
  
  return (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
      {trend !== undefined && (
        <div className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

// ============================================
// USER DASHBOARD (WITH INLINE FORMS)
// ============================================

export function UserDashboard() {
  const { t } = useTranslation();
  const { user, familyMembers, fetchUserDashboard, dashboardData, dashboardLoading, markAttendance, addGatha, showToast } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Attendance Form State
  const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
  const [selectedMemberAttendance, setSelectedMemberAttendance] = useState('');
  const [submittingAttendance, setSubmittingAttendance] = useState(false);
  const [markingAttendanceId, setMarkingAttendanceId] = useState(null);
  
  // Gatha Form State
  const [gathaFormData, setGathaFormData] = useState({
    userId: '',
    date: getTodayDate(),
    type: 'new',
    count: 1,
    gathaNames: ''
  });
  const [submittingGatha, setSubmittingGatha] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchUserDashboard();
      setIsLoading(false);
    };
    load();
  }, []);
  
  // Set default member for single member family
  useEffect(() => {
    if (familyMembers?.length === 1) {
      setSelectedMemberAttendance(familyMembers[0]._id);
      setGathaFormData(prev => ({ ...prev, userId: familyMembers[0]._id }));
    }
  }, [familyMembers]);
  
  // Handle Mark Attendance
  const handleMarkAttendance = async (memberId = null) => {
    const id = memberId || selectedMemberAttendance;
    if (!id || !attendanceDate) {
      showToast('error', 'Please select a member and date');
      return;
    }
    
    if (memberId) {
      setMarkingAttendanceId(memberId);
    } else {
      setSubmittingAttendance(true);
    }
    
    const result = await markAttendance(id, attendanceDate);
    
    if (memberId) {
      setMarkingAttendanceId(null);
    } else {
      setSubmittingAttendance(false);
    }
    
    if (result.success) {
      // Refresh dashboard
      await fetchUserDashboard();
    }
  };
  
  // Handle Mark All Attendance
  const handleMarkAllAttendance = async () => {
    if (!familyMembers || familyMembers.length === 0) return;
    
    setSubmittingAttendance(true);
    for (const member of familyMembers) {
      await markAttendance(member._id, attendanceDate);
    }
    setSubmittingAttendance(false);
    await fetchUserDashboard();
  };
  
  // Handle Add Gatha
  const handleAddGatha = async () => {
    if (!gathaFormData.userId) {
      showToast('error', 'Please select a member');
      return;
    }
    if (!gathaFormData.count || gathaFormData.count < 1) {
      showToast('error', 'Please enter valid gatha count');
      return;
    }
    
    setSubmittingGatha(true);
    const result = await addGatha({
      ...gathaFormData,
      gathaNames: gathaFormData.gathaNames.split('\n').map(s => s.trim()).filter(Boolean)
    });
    setSubmittingGatha(false);
    
    if (result.success) {
      setGathaFormData(prev => ({
        ...prev,
        count: 1,
        gathaNames: ''
      }));
      await fetchUserDashboard();
    }
  };
  
  if (isLoading || dashboardLoading) {
    return (
      <Layout title={t('dashboard')} isAdmin={false}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">{t('loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const data = dashboardData || {
    today: { attendance: [] },
    monthly: { attendance: 0, newGatha: 0, revisionGatha: 0 },
    pending: { attendance: 0, gatha: 0 },
    streak: 0
  };
  
  return (
    <Layout title={t('dashboard')} isAdmin={false}>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t('welcome')}, {user?.name}! 🙏</h2>
              {user?.familyName && (
                <p className="opacity-90">{t('myFamily')}: {user.familyName}</p>
              )}
            </div>
            {data.streak > 0 && (
              <div className="text-center bg-white/20 rounded-xl p-4">
                <Flame className="w-8 h-8 mx-auto mb-1" />
                <p className="text-2xl font-bold">{data.streak}</p>
                <p className="text-xs opacity-90">{t('days')} {t('streak')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Flame}
            label={t('streak')}
            value={data.streak || 0}
            subValue={t('days')}
            color="orange"
          />
          <StatCard
            icon={Calendar}
            label={`${t('thisMonth')} ${t('attendance')}`}
            value={data.monthly?.attendance || 0}
            color="green"
          />
          <StatCard
            icon={BookOpen}
            label={t('newGatha')}
            value={data.monthly?.newGatha || 0}
            color="blue"
          />
          <StatCard
            icon={BookOpen}
            label={t('revisionGatha')}
            value={data.monthly?.revisionGatha || 0}
            color="purple"
          />
        </div>
        
        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN - Attendance */}
          <div className="space-y-6">
            {/* Mark Attendance Card */}
            <Card title={`📅 ${t('markAttendance')}`}>
              <div className="space-y-4">
                <DatePicker
                  label={t('selectDate')}
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  max={getTodayDate()}
                  required
                />
                
                {familyMembers?.length > 1 ? (
                  <>
                    <Select
                      label={t('selectMember')}
                      value={selectedMemberAttendance}
                      onChange={(e) => setSelectedMemberAttendance(e.target.value)}
                      options={familyMembers.map(m => ({
                        value: m._id,
                        label: m.name
                      }))}
                      placeholder={t('selectMember')}
                      required
                    />
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleMarkAttendance()}
                        loading={submittingAttendance && !markingAttendanceId}
                        disabled={!selectedMemberAttendance}
                        className="flex-1"
                        icon={Check}
                      >
                        {t('markAttendance')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleMarkAllAttendance}
                        loading={submittingAttendance}
                        className="flex-1"
                      >
                        {t('all')}
                      </Button>
                    </div>
                    
                    {/* Family Quick Mark */}
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">{t('familyMembers')}</p>
                      <div className="space-y-2">
                        {familyMembers.map((member) => (
                          <div
                            key={member._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 font-semibold text-sm">
                                  {member.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800">{member.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAttendance(member._id)}
                              loading={markingAttendanceId === member._id}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => handleMarkAttendance()}
                    loading={submittingAttendance}
                    className="w-full"
                    icon={Check}
                  >
                    {t('markAttendance')}
                  </Button>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {t('attendancePending')}
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Today's Status */}
            <Card title={`✅ ${t('todayStatus')}`}>
              {data.today?.attendance?.length > 0 ? (
                <div className="space-y-2">
                  {data.today.attendance.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.status === 'approved' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {item.status === 'approved' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                      <Badge variant={item.status === 'approved' ? 'success' : 'warning'}>
                        {item.status === 'approved' ? t('approved') : t('pending')}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">{t('notMarked')}</p>
                </div>
              )}
            </Card>
          </div>
          
          {/* RIGHT COLUMN - Gatha */}
          <div className="space-y-6">
            {/* Add Gatha Card */}
            <Card title={`📖 ${t('addGatha')}`}>
              <div className="space-y-4">
                <DatePicker
                  label={t('selectDate')}
                  value={gathaFormData.date}
                  onChange={(e) => setGathaFormData({ ...gathaFormData, date: e.target.value })}
                  max={getTodayDate()}
                  required
                />
                
                {familyMembers?.length > 1 && (
                  <Select
                    label={t('selectMember')}
                    value={gathaFormData.userId}
                    onChange={(e) => setGathaFormData({ ...gathaFormData, userId: e.target.value })}
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
                    value={gathaFormData.type}
                    onChange={(e) => setGathaFormData({ ...gathaFormData, type: e.target.value })}
                    options={[
                      { value: 'new', label: `${t('new')} ✨` },
                      { value: 'revision', label: `${t('revision')} 🔄` }
                    ]}
                    required
                  />
                  
                  <Input
                    label={t('count')}
                    type="number"
                    value={gathaFormData.count}
                    onChange={(e) => setGathaFormData({ ...gathaFormData, count: parseInt(e.target.value) || 1 })}
                    min="1"
                    required
                  />
                </div>
                
                {/* Gatha Details - Textarea */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('gathaDetails') || 'Gatha Details'} ({t('optional') || 'Optional'})
                  </label>
                  <textarea
                    value={gathaFormData.gathaNames}
                    onChange={(e) => setGathaFormData({ ...gathaFormData, gathaNames: e.target.value })}
                    placeholder={`गाथा 1\nगाथा 2\nगाथा 3`}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500">Enter each gatha on a new line</p>
                </div>
                
                <Button
                  onClick={handleAddGatha}
                  loading={submittingGatha}
                  disabled={!gathaFormData.userId || !gathaFormData.count}
                  className="w-full"
                  icon={Plus}
                >
                  {t('addGatha')}
                </Button>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {t('attendancePending')}
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Monthly Summary */}
            <Card title={`📊 ${t('monthlyStats')}`}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">{data.monthly?.attendance || 0}</p>
                    <p className="text-xs text-gray-600">{t('attendance')}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {(data.monthly?.newGatha || 0) + (data.monthly?.revisionGatha || 0)}
                    </p>
                    <p className="text-xs text-gray-600">{t('totalGatha')}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('newGatha')}</span>
                    <span className="font-medium text-green-600">{data.monthly?.newGatha || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('revisionGatha')}</span>
                    <span className="font-medium text-blue-600">{data.monthly?.revisionGatha || 0}</span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Pending Items */}
            {(data.pending?.attendance > 0 || data.pending?.gatha > 0) && (
              <Card title={`⏳ ${t('pending')}`}>
                <div className="space-y-2">
                  {data.pending?.attendance > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-gray-700">{t('pendingAttendance')}</span>
                      </div>
                      <Badge variant="warning">{data.pending.attendance}</Badge>
                    </div>
                  )}
                  {data.pending?.gatha > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-gray-700">{t('pendingGatha')}</span>
                      </div>
                      <Badge variant="warning">{data.pending.gatha}</Badge>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ============================================
// USER ATTENDANCE (Redirect to Dashboard)
// ============================================

export function UserAttendance() {
  useEffect(() => {
    window.location.href = '/user/dashboard';
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );
}

// ============================================
// USER GATHA (Redirect to Dashboard)
// ============================================

export function UserGatha() {
  useEffect(() => {
    window.location.href = '/user/dashboard';
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );
}

// ============================================
// USER REPORTS (WITH ANALYTICS)
// ============================================

export function UserReports() {
  const { t } = useTranslation();
  const { user, familyMembers, fetchUserReport, reportData } = useApp();
  
  const [startDate, setStartDate] = useState(getMonthStartDate());
  const [endDate, setEndDate] = useState(getMonthEndDate());
  const [selectedMember, setSelectedMember] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateReport = async () => {
    setIsLoading(true);
    await fetchUserReport(startDate, endDate, selectedMember || null);
    setIsLoading(false);
  };
  
  useEffect(() => {
    handleGenerateReport();
  }, []);
  
  // Calculate analytics
  const calculateAnalytics = () => {
    if (!reportData) return null;
    
    const totalDays = getDaysInRange(startDate, endDate);
    const totalAttendance = reportData.attendance?.filter(a => a.status === 'approved').length || 0;
    const totalGathaNew = reportData.gatha?.filter(g => g.type === 'new' && g.status === 'approved').reduce((sum, g) => sum + g.count, 0) || 0;
    const totalGathaRevision = reportData.gatha?.filter(g => g.type === 'revision' && g.status === 'approved').reduce((sum, g) => sum + g.count, 0) || 0;
    const pendingAttendance = reportData.attendance?.filter(a => a.status === 'pending').length || 0;
    const pendingGatha = reportData.gatha?.filter(g => g.status === 'pending').length || 0;
    
    const attendancePercentage = totalDays > 0 ? Math.round((totalAttendance / totalDays) * 100) : 0;
    const avgGathaPerDay = totalAttendance > 0 ? ((totalGathaNew + totalGathaRevision) / totalAttendance).toFixed(1) : 0;
    
    return {
      totalDays,
      totalAttendance,
      totalGathaNew,
      totalGathaRevision,
      totalGatha: totalGathaNew + totalGathaRevision,
      pendingAttendance,
      pendingGatha,
      attendancePercentage,
      avgGathaPerDay
    };
  };
  
  const analytics = calculateAnalytics();
  
  return (
    <Layout title={t('reports')} isAdmin={false}>
      <div className="space-y-6">
        {/* Filters */}
        <Card title={`🔍 ${t('dateRange')}`}>
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
            {familyMembers?.length > 1 && (
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
              <Button 
                onClick={handleGenerateReport} 
                loading={isLoading} 
                className="w-full"
                icon={BarChart3}
              >
                {t('generateReport')}
              </Button>
            </div>
          </div>
        </Card>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : reportData && analytics ? (
          <>
            {/* Analytics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniStat
                icon={Calendar}
                label={t('totalAttendance')}
                value={analytics.totalAttendance}
                color="orange"
              />
              <MiniStat
                icon={Target}
                label={t('attendancePercentage')}
                value={`${analytics.attendancePercentage}%`}
                color="green"
              />
              <MiniStat
                icon={BookOpen}
                label={t('totalGatha')}
                value={analytics.totalGatha}
                color="blue"
              />
              <MiniStat
                icon={TrendingUp}
                label="Avg/Day"
                value={analytics.avgGathaPerDay}
                color="purple"
              />
            </div>
            
            {/* Detailed Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Attendance Stats */}
              <Card className="border-l-4 border-orange-500">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('attendance')}</h4>
                </div>
                <div className="space-y-3">
                  <ProgressBar
                    value={analytics.totalAttendance}
                    max={analytics.totalDays}
                    color="orange"
                    label={`${t('approved')} / ${t('totalDays') || 'Total Days'}`}
                  />
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-gray-600">{t('pending')}</span>
                    <span className="font-medium text-yellow-600">{analytics.pendingAttendance}</span>
                  </div>
                </div>
              </Card>
              
              {/* New Gatha Stats */}
              <Card className="border-l-4 border-green-500">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('newGatha')}</h4>
                </div>
                <div className="text-center py-2">
                  <p className="text-4xl font-bold text-green-600">{analytics.totalGathaNew}</p>
                  <p className="text-sm text-gray-500 mt-1">gathas learned</p>
                </div>
                <div className="flex justify-center mt-2">
                  <Badge variant="success">✨ New</Badge>
                </div>
              </Card>
              
              {/* Revision Gatha Stats */}
              <Card className="border-l-4 border-blue-500">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('revisionGatha')}</h4>
                </div>
                <div className="text-center py-2">
                  <p className="text-4xl font-bold text-blue-600">{analytics.totalGathaRevision}</p>
                  <p className="text-sm text-gray-500 mt-1">gathas revised</p>
                </div>
                <div className="flex justify-center mt-2">
                  <Badge variant="info">🔄 Revision</Badge>
                </div>
              </Card>
            </div>
            
            {/* Performance Summary */}
            <Card title={`📈 ${t('performance') || 'Performance Summary'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attendance Performance */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-700">{t('attendance')} {t('performance') || 'Performance'}</h5>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                          analytics.attendancePercentage >= 80 ? 'text-green-600 bg-green-200' :
                          analytics.attendancePercentage >= 50 ? 'text-yellow-600 bg-yellow-200' :
                          'text-red-600 bg-red-200'
                        }`}>
                          {analytics.attendancePercentage >= 80 ? 'Excellent' :
                           analytics.attendancePercentage >= 50 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-600">
                          {analytics.attendancePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                      <div
                        style={{ width: `${analytics.attendancePercentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                          analytics.attendancePercentage >= 80 ? 'bg-green-500' :
                          analytics.attendancePercentage >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-gray-500">Present</p>
                      <p className="font-bold text-green-600">{analytics.totalAttendance} days</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-gray-500">Total Days</p>
                      <p className="font-bold text-gray-800">{analytics.totalDays} days</p>
                    </div>
                  </div>
                </div>
                
                {/* Gatha Performance */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-700">{t('gatha')} {t('performance') || 'Performance'}</h5>
                  <div className="flex items-center justify-center py-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-800">{analytics.totalGatha}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                      </div>
                      {/* Decorative ring */}
                      <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="8"
                          strokeDasharray={`${(analytics.totalGathaNew / (analytics.totalGatha || 1)) * 352} 352`}
                          className="transition-all duration-500"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-green-50 rounded flex items-center justify-between">
                      <span className="text-gray-600">New</span>
                      <span className="font-bold text-green-600">{analytics.totalGathaNew}</span>
                    </div>
                    <div className="p-2 bg-blue-50 rounded flex items-center justify-between">
                      <span className="text-gray-600">Revision</span>
                      <span className="font-bold text-blue-600">{analytics.totalGathaRevision}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Member-wise Summary (if multiple members) */}
            {reportData.summary && Object.keys(reportData.summary).length > 0 && (
              <Card title={`👥 ${t('familyMembers')} ${t('summary') || 'Summary'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(reportData.summary).map(([userId, data]) => {
                    const member = familyMembers?.find(m => m._id === userId);
                    const memberTotal = data.totalAttendance + data.newGatha + data.revisionGatha;
                    
                    return (
                      <div
                        key={userId}
                        className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-bold">
                              {member?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{member?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">Total: {memberTotal}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" /> {t('attendance')}
                            </span>
                            <span className="font-medium text-orange-600">{data.totalAttendance}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center">
                              <BookOpen className="w-3 h-3 mr-1" /> {t('newGatha')}
                            </span>
                            <span className="font-medium text-green-600">{data.newGatha}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center">
                              <BookOpen className="w-3 h-3 mr-1" /> {t('revisionGatha')}
                            </span>
                            <span className="font-medium text-blue-600">{data.revisionGatha}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
            
            {/* Detailed History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance History */}
              <Card title={`📅 ${t('attendanceHistory')}`}>
                {reportData.attendance?.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {reportData.attendance.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'approved' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {item.status === 'approved' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{item.userId?.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                          </div>
                        </div>
                        <Badge variant={item.status === 'approved' ? 'success' : 'warning'} size="sm">
                          {item.status === 'approved' ? '✓' : '⏳'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>{t('noAttendance')}</p>
                  </div>
                )}
              </Card>
              
              {/* Gatha History */}
              <Card title={`📖 ${t('gathaHistory')}`}>
                {reportData.gatha?.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {reportData.gatha.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.type === 'new' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <BookOpen className={`w-4 h-4 ${
                              item.type === 'new' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{item.userId?.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(item.date)} • {item.type === 'new' ? '✨ New' : '🔄 Revision'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={item.type === 'new' ? 'success' : 'info'}>
                          {item.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>{t('noGatha')}</p>
                  </div>
                )}
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>{t('noReportData')}</p>
              <Button onClick={handleGenerateReport} className="mt-4">
                {t('generateReport')}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

// ============================================
// EXPORT ALL USER PAGES
// ============================================

export default {
  UserDashboard,
  UserAttendance,
  UserGatha,
  UserReports
};