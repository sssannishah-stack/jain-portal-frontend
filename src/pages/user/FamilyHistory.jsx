import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, BookOpen, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Card, DateRangePicker, Loader, StatusBadge, EmptyState, Table } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { attendanceService, gathaService } from '../../services';
import toast from 'react-hot-toast';

const FamilyHistory = () => {
  const { t } = useTranslation();
  const { familyMembers, user, hasFamily } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMember, setSelectedMember] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().setDate(1)), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [gathaData, setGathaData] = useState([]);

  useEffect(() => {
    if (hasFamily()) {
      fetchHistory();
    }
  }, [dateRange]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [attendanceRes, gathaRes] = await Promise.all([
        attendanceService.getFamily({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        gathaService.getFamily({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        })
      ]);

      setAttendanceData(attendanceRes.data || []);
      setGathaData(gathaRes.data || []);
    } catch (error) {
      console.error('Error fetching family history:', error);
      toast.error(t('messages.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (range) => {
    setDateRange(range);
  };

  // Filter data based on selected member
  const filterByMember = (data) => {
    if (selectedMember === 'all') return data;
    return data.filter(item => item.userId?._id === selectedMember);
  };

  // Combine and sort data
  const getCombinedData = () => {
    const attendance = filterByMember(attendanceData).map(item => ({
      ...item,
      type: 'attendance'
    }));
    
    const gatha = filterByMember(gathaData).map(item => ({
      ...item,
      type: 'gatha'
    }));

    return [...attendance, ...gatha].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  };

  const getFilteredData = () => {
    const combined = getCombinedData();
    if (activeTab === 'all') return combined;
    if (activeTab === 'attendance') return combined.filter(item => item.type === 'attendance');
    return combined.filter(item => item.type === 'gatha');
  };

  // Calculate stats per member
  const getMemberStats = () => {
    return familyMembers.map(member => {
      const memberAttendance = attendanceData.filter(
        a => a.userId?._id === member._id && a.status === 'approved'
      ).length;
      
      const memberGatha = gathaData
        .filter(g => g.userId?._id === member._id && g.status === 'approved')
        .reduce((sum, g) => sum + (g.gathaCount || 0), 0);

      return {
        ...member,
        attendance: memberAttendance,
        gatha: memberGatha
      };
    });
  };

  const columns = [
    {
      key: 'date',
      label: t('common.date'),
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{format(new Date(value), 'dd MMM yyyy')}</span>
        </div>
      )
    },
    {
      key: 'userId',
      label: t('common.name'),
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-sm">
              {value?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="font-medium">{value?.name || 'Unknown'}</span>
          {value?._id === user?._id && (
            <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
              {t('common.you')}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: t('common.type'),
      render: (value, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'attendance'
            ? 'bg-blue-100 text-blue-700'
            : row.gathaType === 'new'
              ? 'bg-green-100 text-green-700'
              : 'bg-purple-100 text-purple-700'
        }`}>
          {value === 'attendance' 
            ? t('common.attendance')
            : row.gathaType === 'new' 
              ? t('user.newGatha')
              : t('user.revisionGatha')
          }
        </span>
      )
    },
    {
      key: 'details',
      label: t('user.gathaDetails'),
      render: (value, row) => (
        row.type === 'gatha' ? (
          <div>
            <span className="font-medium">{row.gathaCount} {t('user.gathas')}</span>
            {row.gathaDetails && (
              <p className="text-xs text-gray-500 mt-0.5">{row.gathaDetails}</p>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      )
    },
    {
      key: 'status',
      label: t('common.status'),
      render: (value) => <StatusBadge status={value} size="sm" />
    }
  ];

  if (!hasFamily()) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('user.familyHistory')}</h1>
        <EmptyState
          icon="users"
          title={t('user.noFamily')}
          description={t('user.noFamilyDescription')}
        />
      </div>
    );
  }

  const memberStats = getMemberStats();
  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('user.familyHistory')}</h1>
          <p className="text-gray-500 mt-1">
            {t('user.familyOf')} {familyMembers.length} {t('admin.members')}
          </p>
        </div>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Member Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {memberStats.map((member) => (
          <Card 
            key={member._id}
            className={`cursor-pointer transition-all ${
              selectedMember === member._id 
                ? 'ring-2 ring-primary-500 bg-primary-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedMember(selectedMember === member._id ? 'all' : member._id)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                member._id === user?._id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className="font-bold text-lg">
                  {member.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {member.name}
                  {member._id === user?._id && (
                    <span className="text-xs text-primary-600 ml-1">({t('common.you')})</span>
                  )}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    {member.attendance}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-green-500" />
                    {member.gatha}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Clear Filter Button */}
      {selectedMember !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{t('common.filter')}:</span>
          <button
            onClick={() => setSelectedMember('all')}
            className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
          >
            {familyMembers.find(m => m._id === selectedMember)?.name}
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {[
          { key: 'all', label: t('admin.allApprovals') },
          { key: 'attendance', label: t('admin.attendanceApprovals') },
          { key: 'gatha', label: t('admin.gathaApprovals') }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Table */}
      {loading ? (
        <Loader />
      ) : filteredData.length === 0 ? (
        <EmptyState
          icon="calendar"
          title={t('user.noHistory')}
          description={t('user.noHistoryDescription')}
        />
      ) : (
        <Table
          columns={columns}
          data={filteredData}
          pageSize={15}
        />
      )}
    </div>
  );
};

export default FamilyHistory;