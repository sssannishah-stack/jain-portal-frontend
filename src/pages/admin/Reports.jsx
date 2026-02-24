import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UsersRound } from 'lucide-react';
import { Card, DateRangePicker } from '../../components/common';
import { ReportTable } from '../../components/admin';
import { reportService } from '../../services';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const Reports = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('student');
  const [studentData, setStudentData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [studentRes, groupRes] = await Promise.all([
        reportService.getStudentReport(dateRange),
        reportService.getGroupReport(dateRange)
      ]);
      setStudentData(studentRes.data || []);
      setGroupData(groupRes.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error(t('messages.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'student', label: t('admin.studentWiseReport'), icon: Users },
    { id: 'group', label: t('admin.groupWiseReport'), icon: UsersRound }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.reports')}</h1>
        <p className="text-gray-500">{t('admin.reportsDescription')}</p>
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
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Report Table */}
      <ReportTable
        data={activeTab === 'student' ? studentData : groupData}
        type={activeTab}
        dateRange={dateRange}
        loading={loading}
      />
    </div>
  );
};

export default Reports;