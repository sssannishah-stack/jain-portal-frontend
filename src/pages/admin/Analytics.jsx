import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart2,
    Users,
    CalendarCheck,
    BookOpen,
    TrendingUp,
    Award,
    Zap,
    RefreshCw,
    Loader2,
    ArrowUpDown,
    UsersRound,
    Target,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import { Card, DateRangePicker } from '../../components/common';
import { reportService } from '../../services';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';

const SortButton = ({ label, field, sortKey, onSort }) => (
    <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 text-xs font-medium transition-colors ${sortKey === field ? 'text-primary-600' : 'text-gray-500 hover:text-gray-800'}`}
    >
        {label}
        <ArrowUpDown className="w-3 h-3" />
    </button>
);

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [studentReport, setStudentReport] = useState([]);
    const [groupReport, setGroupReport] = useState([]);
    const [sortKey, setSortKey] = useState('attendance');
    const [activeTab, setActiveTab] = useState('students');
    const [dateRange, setDateRange] = useState({
        startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [analyticsRes, studentRes, groupRes] = await Promise.all([
                reportService.getAnalyticsStats(dateRange),
                reportService.getStudentReport(dateRange),
                reportService.getGroupReport(dateRange)
            ]);
            if (analyticsRes?.data) setData(analyticsRes.data);
            if (studentRes?.data) setStudentReport(studentRes.data || []);
            if (groupRes?.data) setGroupReport(groupRes.data || []);
        } catch (err) {
            console.error('Analytics error:', err);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const sortedStudents = [...studentReport].sort((a, b) => {
        if (sortKey === 'attendance') return (b.totalAttendance || 0) - (a.totalAttendance || 0);
        if (sortKey === 'gatha') return (b.totalGatha || 0) - (a.totalGatha || 0);
        if (sortKey === 'new') return (b.newGatha || 0) - (a.newGatha || 0);
        return a.name.localeCompare(b.name);
    });

    const sortedGroups = [...groupReport].sort((a, b) => (b.totalAttendance || 0) - (a.totalAttendance || 0));

    const rangeLabel = dateRange.startDate && dateRange.endDate
        ? `${format(new Date(dateRange.startDate), 'dd MMM')} – ${format(new Date(dateRange.endDate), 'dd MMM yyyy')}`
        : 'This Month';

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart2 className="w-7 h-7 text-primary-500" />
                        Analytics
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Deep dive into attendance & gatha data</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 w-fit">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span>{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
                </div>
            </div>

            {/* Date Range Picker */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Analyse Period</p>
                        <p className="text-xs text-gray-400">Showing: {rangeLabel}</p>
                    </div>
                    <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onDateChange={setDateRange}
                    />
                </div>
            </Card>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <p className="text-gray-500 text-sm">Loading analytics...</p>
                    </div>
                </div>
            ) : data ? (
                <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                icon: CalendarCheck,
                                label: 'Total Attendance',
                                value: data.totalAttendance,
                                gradient: 'from-green-500 to-emerald-600',
                                sub: `${data.uniqueStudentsAttended} unique students`
                            },
                            {
                                icon: Target,
                                label: 'Attendance Rate',
                                value: `${data.attendanceRate}%`,
                                gradient: 'from-blue-500 to-blue-600',
                                sub: `of ${data.totalStudents} students`
                            },
                            {
                                icon: Zap,
                                label: 'New Gatha',
                                value: data.newGatha,
                                gradient: 'from-purple-500 to-indigo-600',
                                sub: 'total count'
                            },
                            {
                                icon: RefreshCw,
                                label: 'Revision Gatha',
                                value: data.revisionGatha,
                                gradient: 'from-orange-500 to-amber-500',
                                sub: `${data.totalGatha} total`
                            }
                        ].map(({ icon: Icon, label, value, gradient, sub }) => (
                            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                                    <p className="text-gray-500 mt-1 text-sm">{label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Attendance Rate Bar */}
                    {data.totalStudents > 0 && (
                        <Card className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    Overall Attendance Rate
                                </h3>
                                <span className="text-2xl font-bold text-green-600">{data.attendanceRate}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
                                    style={{ width: `${Math.min(data.attendanceRate, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                                <span>{data.uniqueStudentsAttended} students attended</span>
                                <span>{data.totalStudents} total students</span>
                            </div>
                        </Card>
                    )}

                    {/* Top Performers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="p-5">
                            <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-500" />
                                Top by Attendance ({rangeLabel})
                            </h3>
                            {data.topByAttendance?.length > 0 ? (
                                <div className="space-y-2">
                                    {data.topByAttendance.map((s, i) => (
                                        <div key={s._id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}>
                                                {i + 1}
                                            </div>
                                            <p className="flex-1 text-sm font-medium text-gray-900 truncate">{s.name}</p>
                                            <span className="text-sm font-bold text-green-600">{s.attendance} days</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
                            )}
                        </Card>

                        <Card className="p-5">
                            <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                Top by Gatha ({rangeLabel})
                            </h3>
                            {data.topByGatha?.length > 0 ? (
                                <div className="space-y-2">
                                    {data.topByGatha.map((s, i) => (
                                        <div key={s._id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}>
                                                {i + 1}
                                            </div>
                                            <p className="flex-1 text-sm font-medium text-gray-900 truncate">{s.name}</p>
                                            <span className="text-sm font-bold text-blue-600">{s.gatha} gathas</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
                            )}
                        </Card>
                    </div>

                    {/* Student/Group Comparison */}
                    <Card className="p-5">
                        {/* Tabs */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                {[
                                    { key: 'students', label: 'Students', icon: Users },
                                    { key: 'groups', label: 'Groups', icon: UsersRound }
                                ].map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === key ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {activeTab === 'students' && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    Sort by:
                                    <SortButton label="Attend." field="attendance" sortKey={sortKey} onSort={setSortKey} />
                                    <SortButton label="Gatha" field="gatha" sortKey={sortKey} onSort={setSortKey} />
                                    <SortButton label="New" field="new" sortKey={sortKey} onSort={setSortKey} />
                                </div>
                            )}
                        </div>

                        {activeTab === 'students' ? (
                            sortedStudents.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">#</th>
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">Name</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Attend.</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">New</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Rev.</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedStudents.map((s, i) => (
                                                <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-2.5 px-2 text-gray-400 text-xs">{i + 1}</td>
                                                    <td className="py-2.5 px-2">
                                                        <Link
                                                            to={`/admin/reports/student/${s._id}`}
                                                            className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                                                        >
                                                            {s.name}
                                                        </Link>
                                                    </td>
                                                    <td className="py-2.5 px-2 text-right">
                                                        <span className="font-semibold text-green-600">{s.totalAttendance}</span>
                                                    </td>
                                                    <td className="py-2.5 px-2 text-right text-blue-600 font-medium">{s.newGatha}</td>
                                                    <td className="py-2.5 px-2 text-right text-purple-600 font-medium">{s.revisionGatha}</td>
                                                    <td className="py-2.5 px-2 text-right font-bold text-gray-900">{s.totalGatha}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-10">No student data for this period</p>
                            )
                        ) : (
                            sortedGroups.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">Group</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Members</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Attend.</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Total Gatha</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Avg Attend.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedGroups.map((g, i) => (
                                                <tr key={g._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-2.5 px-2">
                                                        <Link
                                                            to={`/admin/reports/group/${g._id}`}
                                                            className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                                                        >
                                                            {g.groupName}
                                                        </Link>
                                                    </td>
                                                    <td className="py-2.5 px-2 text-right text-gray-600">{g.memberCount}</td>
                                                    <td className="py-2.5 px-2 text-right font-semibold text-green-600">{g.totalAttendance}</td>
                                                    <td className="py-2.5 px-2 text-right font-semibold text-blue-600">{g.totalGatha}</td>
                                                    <td className="py-2.5 px-2 text-right text-gray-600">{g.avgAttendance}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-10">No group data for this period</p>
                            )
                        )}
                    </Card>
                </>
            ) : (
                <div className="text-center py-20">
                    <BarChart2 className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">No analytics data available</p>
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;
