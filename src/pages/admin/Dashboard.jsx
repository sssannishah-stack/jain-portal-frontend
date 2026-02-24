import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UsersRound, 
  ClipboardCheck, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Card, Loader, Button } from '../../components/common';
import { reportService } from '../../services';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUpRight className="w-4 h-4" />
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-500 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

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
      
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
      if (performersRes?.data) {
        setTopPerformers(performersRes.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const weeklyData = [
    { day: 'Mon', attendance: 45, gatha: 120 },
    { day: 'Tue', attendance: 52, gatha: 145 },
    { day: 'Wed', attendance: 48, gatha: 130 },
    { day: 'Thu', attendance: 55, gatha: 160 },
    { day: 'Fri', attendance: 50, gatha: 140 },
    { day: 'Sat', attendance: 60, gatha: 180 },
    { day: 'Sun', attendance: 35, gatha: 90 }
  ];

  const gathaDistribution = [
    { name: 'New Gatha', value: 60, color: '#22c55e' },
    { name: 'Revision', value: 40, color: '#3b82f6' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/users">
          <Button icon={Plus} variant="primary">Add Student</Button>
        </Link>
        <Link to="/admin/groups">
          <Button icon={Plus} variant="secondary">Create Group</Button>
        </Link>
        <Link to="/admin/approvals">
          <Button icon={Clock} variant="secondary">
            View Approvals ({stats.pendingApprovals})
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="blue"
          trend="up"
          trendValue="+12%"
          subtitle="This month"
        />
        <StatCard
          title="Family Groups"
          value={stats.totalGroups}
          icon={UsersRound}
          color="purple"
          trend="up"
          trendValue="+3"
          subtitle="This month"
        />
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance}
          icon={ClipboardCheck}
          color="green"
          trend="up"
          trendValue="+8%"
          subtitle="vs yesterday"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          color="yellow"
          subtitle="Needs attention"
        />
      </div>

      {/* Big Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Monthly Attendance</p>
              <p className="text-4xl font-bold mt-2">{stats.monthlyAttendance}</p>
              <div className="flex items-center gap-1 mt-2 text-green-100">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">15% increase from last month</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Gatha This Month</p>
              <p className="text-4xl font-bold mt-2">{stats.monthlyGatha}</p>
              <div className="flex items-center gap-1 mt-2 text-blue-100">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">23% increase from last month</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Approval Rate</p>
              <p className="text-4xl font-bold mt-2">94%</p>
              <div className="flex items-center gap-1 mt-2 text-orange-100">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Great performance!</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="attendance" name="Attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gatha" name="Gatha" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Gatha Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gathaDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gathaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {gathaDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top by Attendance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top by Attendance
            </h3>
            <Link to="/admin/reports" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {topPerformers.topByAttendance?.length > 0 ? (
              topPerformers.topByAttendance.slice(0, 5).map((student, index) => (
                <div key={student._id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{student.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">{student.attendance}</span>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </Card>

        {/* Top by Gatha */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Top by Gatha
            </h3>
            <Link to="/admin/reports" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {topPerformers.topByGatha?.length > 0 ? (
              topPerformers.topByGatha.slice(0, 5).map((student, index) => (
                <div key={student._id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{student.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">{student.gatha}</span>
                    <p className="text-xs text-gray-500">gathas</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;