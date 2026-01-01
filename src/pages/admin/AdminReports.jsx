import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, Badge, Button, Select, DatePicker, Spinner } from '../../components/Components';
import { Download, FileText, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export function AdminReports() {
  const { t } = useTranslation();
  const { fetchStudentReport, fetchFamilyReport, exportReport, reportData } = useApp();
  
  const [reportType, setReportType] = useState('student');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerate = async () => {
    setIsLoading(true);
    if (reportType === 'student') {
      await fetchStudentReport(startDate, endDate);
    } else {
      await fetchFamilyReport(startDate, endDate);
    }
    setIsLoading(false);
  };
  
  const handleExport = async () => {
    const result = await exportReport(startDate, endDate);
    if (result.success) {
      const { attendance, gatha, reportName, dateRange } = result.data;
      
      // Create CSV content
      const headers = ['Date', 'Student Name', 'Type', 'Count'];
      const rows = [
        ...attendance.map(a => [a.date, a.studentName, 'Attendance', '1']),
        ...gatha.map(g => [g.date, g.studentName, g.type, g.count])
      ];
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${reportName}_${dateRange.start}_${dateRange.end}.csv`;
      link.click();
    }
  };
  
  return (
    <Layout title={t('reports')} isAdmin>
      <div className="space-y-6">
        {/* Filters */}
        <Card title={t('generateReport')}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label={t('selectReportType')}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'student', label: t('byStudent') },
                { value: 'family', label: t('byFamily') }
              ]}
            />
            <DatePicker
              label={t('from')}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DatePicker
              label={t('to')}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
            <div className="flex items-end">
              <Button
                onClick={handleGenerate}
                loading={isLoading}
                className="w-full"
                icon={FileText}
              >
                {t('generateReport')}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Report Results */}
        {reportData && (
          <Card
            title={`${t('reports')} (${startDate} - ${endDate})`}
            action={
              <Button variant="outline" icon={Download} onClick={handleExport}>
                {t('exportCSV')}
              </Button>
            }
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('totalAttendance')}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {reportData.totals?.totalAttendance || reportData.grandTotals?.totalAttendance || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('newGatha')}</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reportData.totals?.totalNewGatha || reportData.grandTotals?.totalNewGatha || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('revisionGatha')}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {reportData.totals?.totalRevisionGatha || reportData.grandTotals?.totalRevisionGatha || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Table */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : reportData.report?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {t('noReportData')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('name')}</th>
                      {reportType === 'family' && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('memberCount')}</th>
                      )}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('totalAttendance')}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('newGatha')}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('revisionGatha')}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('totalGatha')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.report.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
                        {reportType === 'family' && (
                          <td className="px-4 py-3">
                            <Badge variant="info">{row.memberCount}</Badge>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-700">{row.totalAttendance}</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">{row.newGatha}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">{row.revisionGatha}</td>
                        <td className="px-4 py-3">
                          <Badge variant="primary">{row.totalGatha}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default AdminReports;