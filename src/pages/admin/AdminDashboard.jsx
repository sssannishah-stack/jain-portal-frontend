import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, StatCard, Badge, QuickActionButton } from '../../components/Components';
import { Calendar, BookOpen, Users, UserPlus, CheckSquare, FileText, Loader2 } from 'lucide-react';

export function AdminDashboard() {
  const { t } = useTranslation();
  const { 
    fetchAdminDashboard, 
    dashboardData, 
    dashboardLoading,
    fetchPendingAttendance,
    fetchPendingGatha,
    pendingAttendance,
    pendingGatha,
    user
  } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAdminDashboard(),
        fetchPendingAttendance(),
        fetchPendingGatha()
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);
  
  if (isLoading || dashboardLoading) {
    return (
      <Layout title={t('dashboard')} isAdmin>
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
    today: { attendance: 0, gatha: 0 },
    monthly: { attendance: 0, newGatha: 0, revisionGatha: 0 },
    pending: { attendance: 0, gatha: 0 },
    totals: { students: 0, families: 0 },
    weeklyTrend: []
  };
  
  return (
    <Layout title={t('dashboard')} isAdmin>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">{t('welcomeBack')}, {user?.name}! 🙏</h2>
          <p className="opacity-90">{new Date().toLocaleDateString()}</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label={`${t('today')} ${t('attendance')}`}
            value={data.today?.attendance || 0}
            color="orange"
          />
          <StatCard
            icon={BookOpen}
            label={`${t('today')} ${t('gatha')}`}
            value={data.today?.gatha || 0}
            color="green"
          />
          <StatCard
            icon={Users}
            label={t('totalStudents')}
            value={data.totals?.students || 0}
            color="blue"
          />
          <StatCard
            icon={UserPlus}
            label={t('totalFamilies')}
            value={data.totals?.families || 0}
            color="purple"
          />
        </div>
        
        {/* Monthly Stats & Pending */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title={t('monthlyStats')}>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-600">{t('totalAttendance')}</span>
                <span className="text-2xl font-bold text-orange-600">{data.monthly?.attendance || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">{t('newGatha')}</span>
                <span className="text-2xl font-bold text-green-600">{data.monthly?.newGatha || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">{t('revisionGatha')}</span>
                <span className="text-2xl font-bold text-blue-600">{data.monthly?.revisionGatha || 0}</span>
              </div>
            </div>
          </Card>
          
          <Card title={t('pendingApprovals')}>
            <div className="space-y-4">
              <a href="/admin/approvals" className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 border border-yellow-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">{t('pendingAttendance')}</span>
                </div>
                <Badge variant="warning">{pendingAttendance?.length || 0}</Badge>
              </a>
              <a href="/admin/approvals" className="flex justify-between items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 border border-orange-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">{t('pendingGatha')}</span>
                </div>
                <Badge variant="warning">{pendingGatha?.length || 0}</Badge>
              </a>
            </div>
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
              icon={CheckSquare} 
              label={t('approvals')} 
              onClick={() => window.location.href = '/admin/approvals'} 
              color="success" 
            />
            <QuickActionButton 
              icon={FileText} 
              label={t('reports')} 
              onClick={() => window.location.href = '/admin/reports'} 
            />
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default AdminDashboard;