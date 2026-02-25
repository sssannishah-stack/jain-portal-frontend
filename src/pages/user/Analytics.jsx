import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart2,
    CalendarCheck,
    BookOpen,
    Flame,
    Zap,
    TrendingUp,
    Award,
    ArrowLeft,
    Loader2,
    CalendarDays,
    Target,
    RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { reportService } from '../../services';
import { DateRangePicker } from '../../components/common';
import { format, startOfMonth, endOfMonth, subDays, differenceInDays } from 'date-fns';

const StatChip = ({ icon: Icon, label, value, color, sub }) => (
    <div className={`rounded-2xl p-4 ${color} flex flex-col gap-1`}>
        <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 opacity-80" />
            <span className="text-xs font-medium opacity-80">{label}</span>
        </div>
        <p className="text-3xl font-bold">{value}</p>
        {sub && <p className="text-xs opacity-70 mt-0.5">{sub}</p>}
    </div>
);

const AttendanceHeatmap = ({ attendanceDates, startDate, endDate }) => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = differenceInDays(end, start) + 1;

    if (totalDays > 62) return null; // Only show for short ranges

    const attendanceSet = new Set(attendanceDates || []);
    const days = [];

    for (let i = 0; i < totalDays; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        days.push({ dateStr: ds, date: d, attended: attendanceSet.has(ds) });
    }

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary-500" />
                Attendance Calendar
            </h3>
            <div className="flex flex-wrap gap-1.5">
                {days.map(({ dateStr, date, attended }) => (
                    <div
                        key={dateStr}
                        title={`${format(date, 'dd MMM')} — ${attended ? 'Present' : 'Absent'}`}
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium transition-all ${attended
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-400'
                            }`}
                    >
                        {date.getDate()}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-xs text-gray-500">Present</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-200" />
                    <span className="text-xs text-gray-500">Absent</span>
                </div>
            </div>
        </div>
    );
};

const UserAnalytics = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await reportService.getUserAnalytics(dateRange);
            if (res?.data) setData(res.data);
        } catch (err) {
            console.error('Analytics error:', err);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const rangeLabel = dateRange.startDate && dateRange.endDate
        ? `${format(new Date(dateRange.startDate), 'dd MMM')} – ${format(new Date(dateRange.endDate), 'dd MMM yyyy')}`
        : 'This Month';

    return (
        <div className="max-w-lg mx-auto space-y-4 animate-fade-in">

            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-xl md:hidden"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-primary-500" />
                        My Analytics
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">Track your progress over any period</p>
                </div>
                {!loading && (
                    <button
                        onClick={fetchAnalytics}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Date Picker */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Select Period</p>
                <DateRangePicker
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onDateChange={setDateRange}
                    className="w-full"
                />
                <p className="text-xs text-gray-400 mt-2">Showing: {rangeLabel}</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <Loader2 className="w-7 h-7 text-white animate-spin" />
                        </div>
                        <p className="text-sm text-gray-500">Loading analytics...</p>
                    </div>
                </div>
            ) : data ? (
                <>
                    {/* Streak Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-5 h-5" />
                                <span className="text-sm font-medium opacity-90">Current Streak</span>
                            </div>
                            <p className="text-4xl font-bold">{data.currentStreak}</p>
                            <p className="text-xs opacity-75 mt-1">days in a row</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5" />
                                <span className="text-sm font-medium opacity-90">Longest Streak</span>
                            </div>
                            <p className="text-4xl font-bold">{data.longestStreak}</p>
                            <p className="text-xs opacity-75 mt-1">personal best</p>
                        </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-green-500" />
                            Attendance for Period
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-green-700">{data.attendanceCount}</p>
                                <p className="text-xs text-green-600 mt-0.5">Days Present</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-blue-700">{data.totalDaysInRange || '—'}</p>
                                <p className="text-xs text-blue-600 mt-0.5">Total Days</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-emerald-700">{data.attendanceRate ?? '—'}%</p>
                                <p className="text-xs text-emerald-600 mt-0.5">Rate</p>
                            </div>
                        </div>

                        {/* Attendance Rate Bar */}
                        {data.attendanceRate !== undefined && data.totalDaysInRange > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Attendance Rate</span>
                                    <span>{data.attendanceRate}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                                        style={{ width: `${Math.min(data.attendanceRate, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {data.attendanceRate >= 80
                                        ? '🏆 Excellent attendance!'
                                        : data.attendanceRate >= 50
                                            ? '👍 Good effort, keep going!'
                                            : '📈 You can do better!'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gatha Summary */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            Gatha for Period
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <StatChip
                                icon={Zap}
                                label="New"
                                value={data.newGathaTotal}
                                color="bg-blue-50 text-blue-700"
                            />
                            <StatChip
                                icon={RefreshCw}
                                label="Revision"
                                value={data.revisionGathaTotal}
                                color="bg-purple-50 text-purple-700"
                            />
                            <StatChip
                                icon={TrendingUp}
                                label="Total"
                                value={data.totalGathaCount}
                                color="bg-indigo-50 text-indigo-700"
                            />
                        </div>
                    </div>

                    {/* Attendance Calendar/Heatmap */}
                    <AttendanceHeatmap
                        attendanceDates={data.attendanceDates}
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                    />

                    {/* Recent Gatha Entries */}
                    {data.gathaRecords && data.gathaRecords.length > 0 && (
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-indigo-500" />
                                Gatha Entries ({rangeLabel})
                            </h3>
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {data.gathaRecords.map((g, i) => (
                                    <div key={g._id || i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${g.gathaType === 'new' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                            {g.gathaType === 'new'
                                                ? <Zap className="w-4 h-4 text-blue-600" />
                                                : <RefreshCw className="w-4 h-4 text-purple-600" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {g.gathaCount} {g.gathaType === 'new' ? 'New' : 'Revision'} Gatha
                                            </p>
                                            {g.gathaDetails && (
                                                <p className="text-xs text-gray-500 truncate">{g.gathaDetails}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                            {format(new Date(g.date), 'dd MMM')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Motivational footer */}
                    <div className="bg-gradient-to-r from-primary-50 to-orange-50 rounded-2xl p-4 border border-primary-100 text-center">
                        <p className="text-sm font-semibold text-primary-800">
                            {data.currentStreak > 0
                                ? `🔥 You're on a ${data.currentStreak}-day attendance streak! Keep it going!`
                                : '🌱 Start your attendance streak today!'}
                        </p>
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <BarChart2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">No data available for this period</p>
                    <p className="text-xs text-gray-400 mt-1">Try selecting a different date range</p>
                </div>
            )}

            <div className="h-1" />
        </div>
    );
};

export default UserAnalytics;
