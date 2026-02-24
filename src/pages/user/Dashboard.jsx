import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  Award,
  Target,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { reportService, attendanceService } from '../../services';
import { format } from 'date-fns';

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, familyMembers } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [todayMarked, setTodayMarked] = useState(false);
  const [stats, setStats] = useState({
    myStats: { attendance: 0, newGatha: 0, revisionGatha: 0, pending: 0 },
    familyStats: { attendance: 0, gatha: 0, memberCount: 0 }
  });

  const hasFamilyGroup = familyMembers && familyMembers.length > 1;
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const dashboardRes = await reportService.getUserDashboard();
      if (dashboardRes?.data) {
        setStats(dashboardRes.data);
      }

      // Check today's attendance
      try {
        const attRes = await attendanceService.getOwn({ startDate: today, endDate: today });
        setTodayMarked((attRes?.data || []).length > 0);
      } catch (e) {
        console.log('Could not check attendance');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalGatha = (stats.myStats?.newGatha || 0) + (stats.myStats?.revisionGatha || 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      {/* Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-orange-500 to-amber-500 rounded-3xl p-5 text-white">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span className="text-white/80 text-xs font-medium">
              {format(new Date(), 'EEEE, dd MMM yyyy')}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1">
            नमस्ते, {user?.name?.split(' ')[0]}! 🙏
          </h1>
          <p className="text-white/80 text-sm">
            {todayMarked 
              ? "Great! You've marked attendance today" 
              : "Don't forget to mark attendance!"
            }
          </p>
          
          {hasFamilyGroup && (
            <div className="inline-flex items-center gap-1.5 mt-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{familyMembers.length} Family Members</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions - Main Feature */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mark Attendance Button */}
        <button
          onClick={() => navigate('/user/mark-attendance')}
          className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all active:scale-[0.98] ${
            todayMarked 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
            todayMarked ? 'bg-green-500' : 'bg-white/20'
          }`}>
            {todayMarked ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <CalendarCheck className="w-6 h-6 text-white" />
            )}
          </div>
          <p className={`font-bold text-base mb-0.5 ${todayMarked ? 'text-green-700' : 'text-white'}`}>
            {todayMarked ? 'Marked ✓' : 'Mark Attendance'}
          </p>
          <p className={`text-xs ${todayMarked ? 'text-green-600' : 'text-white/80'}`}>
            {todayMarked ? 'Completed for today' : 'Tap to mark'}
          </p>
          {!todayMarked && (
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
          )}
        </button>

        {/* Add Gatha Button */}
        <button
          onClick={() => navigate('/user/add-gatha')}
          className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-left text-white shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="font-bold text-base mb-0.5">Add Gatha</p>
          <p className="text-xs text-white/80">New or Revision</p>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
        </button>
      </div>

      {/* Today's Status */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-500" />
          Today's Progress
        </h3>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 ${
              todayMarked ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {todayMarked ? (
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              ) : (
                <Clock className="w-7 h-7 text-orange-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">Attendance</p>
            <p className={`font-bold text-sm ${todayMarked ? 'text-green-600' : 'text-orange-500'}`}>
              {todayMarked ? 'Done' : 'Pending'}
            </p>
          </div>
          
          <div className="w-px h-16 bg-gray-200"></div>
          
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="font-bold text-sm text-amber-600">{stats.myStats?.pending || 0}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.myStats?.attendance || 0}</p>
          <p className="text-xs text-gray-500">Attendance (Month)</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalGatha}</p>
          <p className="text-xs text-gray-500">Total Gatha</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.myStats?.newGatha || 0}</p>
          <p className="text-xs text-gray-500">New Gatha</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.myStats?.revisionGatha || 0}</p>
          <p className="text-xs text-gray-500">Revision Gatha</p>
        </div>
      </div>

      {/* Family Section */}
      {hasFamilyGroup && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Family Members
            </h3>
            <button
              onClick={() => navigate('/user/family-history')}
              className="text-indigo-600 text-xs font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {familyMembers.map((member) => (
              <div
                key={member._id}
                className="flex-shrink-0 flex flex-col items-center gap-1 p-2"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  member._id === user._id 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-indigo-300' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  {member.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-xs text-gray-600 max-w-[60px] truncate text-center">
                  {member._id === user._id ? 'You' : member.name?.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-indigo-700">{stats.familyStats?.attendance || 0}</p>
              <p className="text-xs text-gray-600">Family Attendance</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-purple-700">{stats.familyStats?.gatha || 0}</p>
              <p className="text-xs text-gray-600">Family Gatha</p>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
        <div className="flex gap-3">
          <span className="text-3xl">🙏</span>
          <div>
            <p className="text-amber-900 font-medium text-sm italic">
              "अहिंसा परमो धर्मः"
            </p>
            <p className="text-amber-700 text-xs mt-1">
              Keep learning! Your dedication is inspiring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;