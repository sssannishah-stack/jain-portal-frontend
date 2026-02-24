import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCheck, XCircle, Filter, CalendarCheck, BookOpen } from 'lucide-react';
import { Button, Card, DateRangePicker, ConfirmDialog, EmptyState } from '../../components/common';
import { ApprovalCard } from '../../components/admin';
import { attendanceService, gathaService } from '../../services';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const PendingApprovals = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [attendanceList, setAttendanceList] = useState([]);
  const [gathaList, setGathaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  // Bulk action
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, gathaRes] = await Promise.all([
        attendanceService.getPending(dateRange),
        gathaService.getPending(dateRange)
      ]);
      setAttendanceList(attendanceRes.data || []);
      setGathaList(gathaRes.data || []);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast.error(t('messages.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, type) => {
    setActionLoading(true);
    try {
      if (type === 'attendance') {
        await attendanceService.approve(id);
        toast.success(t('messages.attendanceApproved'));
      } else {
        await gathaService.approve(id);
        toast.success(t('messages.gathaApproved'));
      }
      fetchData();
    } catch (error) {
      toast.error(t('messages.somethingWrong'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, type) => {
    setActionLoading(true);
    try {
      if (type === 'attendance') {
        await attendanceService.reject(id);
        toast.success(t('messages.attendanceRejected'));
      } else {
        await gathaService.reject(id);
        toast.success(t('messages.gathaRejected'));
      }
      fetchData();
    } catch (error) {
      toast.error(t('messages.somethingWrong'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = (action) => {
    setBulkAction(action);
    setShowBulkConfirm(true);
  };

  const confirmBulkAction = async () => {
    setActionLoading(true);
    try {
      const attendanceIds = attendanceList.map(a => a._id);
      const gathaIds = gathaList.map(g => g._id);

      if (bulkAction === 'approve') {
        if (attendanceIds.length > 0) {
          await attendanceService.bulkApprove(attendanceIds);
        }
        if (gathaIds.length > 0) {
          await gathaService.bulkApprove(gathaIds);
        }
        toast.success(t('messages.bulkApproved'));
      }
      // Add bulk reject if needed
      
      setShowBulkConfirm(false);
      fetchData();
    } catch (error) {
      toast.error(t('messages.somethingWrong'));
    } finally {
      setActionLoading(false);
    }
  };

  const getFilteredData = () => {
    if (activeTab === 'attendance') return { attendance: attendanceList, gatha: [] };
    if (activeTab === 'gatha') return { attendance: [], gatha: gathaList };
    return { attendance: attendanceList, gatha: gathaList };
  };

  const { attendance, gatha } = getFilteredData();
  const totalPending = attendanceList.length + gathaList.length;

  const tabs = [
    { id: 'all', label: t('admin.allApprovals'), count: totalPending },
    { id: 'attendance', label: t('admin.attendanceApprovals'), count: attendanceList.length, icon: CalendarCheck },
    { id: 'gatha', label: t('admin.gathaApprovals'), count: gathaList.length, icon: BookOpen }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.approvals')}</h1>
          <p className="text-gray-500">
            {totalPending} {t('admin.pendingApprovals').toLowerCase()}
          </p>
        </div>
        {totalPending > 0 && (
          <Button 
            icon={CheckCheck} 
            onClick={() => handleBulkAction('approve')}
            loading={actionLoading}
          >
            {t('admin.approveAll')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={setDateRange}
          />

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : totalPending === 0 ? (
        <EmptyState
          icon="calendar"
          title={t('admin.noApprovals')}
          description={t('admin.noApprovalsDesc')}
        />
      ) : (
        <div className="space-y-6">
          {/* Attendance Section */}
          {attendance.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-500" />
                {t('common.attendance')} ({attendance.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendance.map(item => (
                  <ApprovalCard
                    key={item._id}
                    item={item}
                    type="attendance"
                    onApprove={(id) => handleApprove(id, 'attendance')}
                    onReject={(id) => handleReject(id, 'attendance')}
                    loading={actionLoading}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gatha Section */}
          {gatha.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                {t('admin.totalGatha')} ({gatha.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gatha.map(item => (
                  <ApprovalCard
                    key={item._id}
                    item={item}
                    type="gatha"
                    onApprove={(id) => handleApprove(id, 'gatha')}
                    onReject={(id) => handleReject(id, 'gatha')}
                    loading={actionLoading}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bulk Confirm Dialog */}
      <ConfirmDialog
        isOpen={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={confirmBulkAction}
        title={t('admin.approveAll')}
        message={`${t('messages.confirmApprove')} (${totalPending} items)`}
        type="success"
        loading={actionLoading}
      />
    </div>
  );
};

export default PendingApprovals;