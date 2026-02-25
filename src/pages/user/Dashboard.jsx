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
  Zap,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { reportService, attendanceService } from '../../services';
import { format } from 'date-fns';

const quotes = [
  { text: 'अहिंसा परमो धर्मः', sub: 'Non-violence is the highest virtue.' },
  { text: 'सर्वे भवन्तु सुखिनः', sub: 'May all beings be happy.' },
  { text: 'ज्ञान ही शक्ति है', sub: 'Knowledge is power — keep learning!' },
];

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
  const quote = quotes[new Date().getDay() % quotes.length];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardRes = await reportService.getUserDashboard();
      if (dashboardRes?.data) setStats(dashboardRes.data);
      try {
        const attRes = await attendanceService.getOwn({ startDate: today, endDate: today });
        setTodayMarked((attRes?.data || []).length > 0);
      } catch (e) { }
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
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto animate-fade-in">

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-orange-500 to-amber-400 p-5 text-white shadow-xl shadow-primary-500/25">
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-sm" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-sm" />
        <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative">
          {/* Date + greeting */}
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span className="text-xs font-medium text-white/90">
                {format(new Date(), 'EEE, dd MMM yyyy')}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold leading-tight mb-1">
            {greeting()}, {user?.name?.split(' ')[0]}! 🙏
          </h1>
          <p className="text-white/80 text-sm mb-4">
            {todayMarked
              ? "✨ You've marked your attendance today!"
              : "📌 Don't forget to mark attendance today!"}
          </p>

          {/* Today status pill */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${todayMarked ? 'bg-green-400/30 text-white' : 'bg-red-400/30 text-white'
            }`}>
            {todayMarked
              ? <><CheckCircle2 className="w-3.5 h-3.5" /> Attendance Done</>
              : <><Clock className="w-3.5 h-3.5" /> Attendance Pending</>
            }
          </div>

          {hasFamilyGroup && (
            <div className="inline-flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full bg-white/20 text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              {familyMembers.length} Members
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/user/mark-attendance')}
          className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all active:scale-[0.97] ${todayMarked
              ? 'bg-white border-2 border-green-200 shadow-sm'
              : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
            }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${todayMarked ? 'bg-green-100' : 'bg-white/20'
            }`}>
            {todayMarked
              ? <CheckCircle2 className="w-6 h-6 text-green-600" />
              : <CalendarCheck className="w-6 h-6 text-white" />
            }
          </div>
          <p className={`font-bold text-sm leading-tight ${todayMarked ? 'text-green-700' : 'text-white'}`}>
            {todayMarked ? 'Marked ✓' : 'Mark Attendance'}
          </p>
          <p className={`text-xs mt-0.5 ${todayMarked ? 'text-green-500' : 'text-white/75'}`}>
            {todayMarked ? 'Done for today' : 'Tap to mark now'}
          </p>
          {!todayMarked && (
            <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-white/10 rounded-full" />
          )}
        </button>

        <button
          onClick={() => navigate('/user/add-gatha')}
          className="relative overflow-hidden rounded-2xl p-4 text-left bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-[0.97]"
        >
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold text-sm leading-tight text-white">Add Gatha</p>
          <p className="text-xs mt-0.5 text-white/75">New or revision</p>
          <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-white/10 rounded-full" />
        </button>
      </div>

      {/* My Stats */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary-500" />
          My Progress This Month
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Attendance', value: stats.myStats?.attendance || 0, color: 'bg-blue-50 text-blue-600', icon: CalendarCheck },
            { label: 'Total Gatha', value: totalGatha, color: 'bg-green-50 text-green-600', icon: Zap },
            { label: 'New Gatha', value: stats.myStats?.newGatha || 0, color: 'bg-emerald-50 text-emerald-600', icon: Sparkles },
            { label: 'Revision', value: stats.myStats?.revisionGatha || 0, color: 'bg-purple-50 text-purple-600', icon: Award },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className={`rounded-xl p-3 ${color.split(' ')[0]}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-white/60`}>
                <Icon className={`w-4 h-4 ${color.split(' ')[1]}`} />
              </div>
              <p className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending count */}
      {(stats.myStats?.pending || 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Pending Gatha</p>
            <p className="text-xs text-amber-600">{stats.myStats.pending} gatha awaiting approval</p>
          </div>
          <span className="ml-auto text-2xl font-bold text-amber-700">{stats.myStats.pending}</span>
        </div>
      )}

      {/* Family Section */}
      {hasFamilyGroup && (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Family Group
            </h3>
            <button
              onClick={() => navigate('/user/family-history')}
              className="text-indigo-600 text-xs font-medium flex items-center gap-0.5 hover:underline"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {familyMembers.map((member) => (
              <div key={member._id} className="flex-shrink-0 flex flex-col items-center gap-1 px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${member._id === user._id
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-indigo-300 ring-offset-1'
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                  {member.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-xs text-gray-600 max-w-[52px] truncate text-center font-medium">
                  {member._id === user._id ? 'You' : member.name?.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-indigo-100">
              <p className="text-xl font-bold text-indigo-700">{stats.familyStats?.attendance || 0}</p>
              <p className="text-xs text-gray-600 mt-0.5">Family Attendance</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-100">
              <p className="text-xl font-bold text-purple-700">{stats.familyStats?.gatha || 0}</p>
              <p className="text-xs text-gray-600 mt-0.5">Family Gatha</p>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
        <div className="flex gap-3 items-start">
          <span className="text-3xl leading-none">🙏</span>
          <div>
            <p className="text-amber-900 font-semibold text-sm italic">"{quote.text}"</p>
            <p className="text-amber-700 text-xs mt-1">{quote.sub}</p>
          </div>
        </div>
      </div>

      {/* Bottom padding for nav bar */}
      <div className="h-1" />
    </div>
  );
};

export default UserDashboard;