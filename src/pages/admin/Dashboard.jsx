import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Users,
  UsersRound,
  ClipboardCheck,
  BookOpen,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  TrendingUp,
  AlertCircle,
  BarChart2
} from 'lucide-react';
import { Card, Loader, Button } from '../../components/common';
import { reportService } from '../../services';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-500 mt-1 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const EmptyPerformers = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
      <Icon className="w-8 h-8 text-gray-300" />
    </div>
    <p className="text-gray-500 text-sm">{message}</p>
    <p className="text-gray-400 text-xs mt-1">Data will appear once students are active</p>
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGroups: 0,
    pendingApprovals: 0,
    todayAttendance: 0,
    monthlyAttendance: 0,
    monthlyGatha: 0
  });
  const [topPerformers, setTopPerformers] = useState({ topByAttendance: [], topByGatha: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, performersRes] = await Promise.all([
        reportService.getDashboardStats(),
        reportService.getTopPerformers({ limit: 5 })
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (performersRes?.data) setTopPerformers(performersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  const attendanceRate = stats.totalStudents > 0
    ? Math.round((stats.todayAttendance / stats.totalStudents) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Admin overview for Jain Pathshala</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 w-fit">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/users">
          <Button icon={Plus} variant="primary" size="sm">Add Student</Button>
        </Link>
        <Link to="/admin/groups">
          <Button icon={UsersRound} variant="secondary" size="sm">Create Group</Button>
        </Link>
        <Link to="/admin/approvals">
          <Button icon={Clock} variant="secondary" size="sm">
            Approvals
            {stats.pendingApprovals > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                {stats.pendingApprovals}
              </span>
            )}
          </Button>
        </Link>
        <Link to="/admin/analytics">
          <Button icon={BarChart2} variant="secondary" size="sm">Full Analytics</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
          subtitle="Registered students"
        />
        <StatCard
          title="Family Groups"
          value={stats.totalGroups}
          icon={UsersRound}
          gradient="from-purple-500 to-purple-600"
          subtitle="Active groups"
        />
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance}
          icon={ClipboardCheck}
          gradient="from-green-500 to-emerald-600"
          subtitle="Marked today"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          gradient={stats.pendingApprovals > 0 ? "from-orange-500 to-red-500" : "from-gray-400 to-gray-500"}
          subtitle={stats.pendingApprovals > 0 ? "Action needed" : "All clear"}
        />
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Monthly Attendance</p>
              <p className="text-4xl font-bold mt-2">{stats.monthlyAttendance}</p>
              <p className="text-green-100 text-sm mt-2">Total this month</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
          {stats.totalStudents > 0 && (
            <div className="mt-4 space-y-2">
              <div className="bg-white/20 rounded-xl p-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  Today's rate: <strong>{attendanceRate}%</strong> ({stats.todayAttendance}/{stats.totalStudents} students)
                </span>
              </div>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/70 transition-all duration-700"
                  style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Gatha This Month</p>
              <p className="text-4xl font-bold mt-2">{stats.monthlyGatha}</p>
              <p className="text-blue-100 text-sm mt-2">Total recorded</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
          </div>
          {stats.monthlyGatha === 0 && (
            <div className="mt-4 bg-white/20 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">No gatha recorded yet this month</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top by Attendance */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top by Attendance
            </h3>
            <Link to="/admin/reports" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {topPerformers.topByAttendance?.length > 0 ? (
              topPerformers.topByAttendance.slice(0, 5).map((student, index) => (
                <div key={student._id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' :
                        'bg-gray-300'
                    }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">{student.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-bold text-green-600">{student.attendance}</span>
                    <p className="text-xs text-gray-400">days</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyPerformers icon={Award} message="No attendance data yet" />
            )}
          </div>
        </Card>

        {/* Top by Gatha */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Top by Gatha
            </h3>
            <Link to="/admin/reports" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {topPerformers.topByGatha?.length > 0 ? (
              topPerformers.topByGatha.slice(0, 5).map((student, index) => (
                <div key={student._id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' :
                        'bg-gray-300'
                    }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">{student.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-bold text-blue-600">{student.gatha}</span>
                    <p className="text-xs text-gray-400">gathas</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyPerformers icon={BarChart2} message="No gatha data yet" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;