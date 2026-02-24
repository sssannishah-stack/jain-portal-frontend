import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, ExportButtons } from '../common';
import { format } from 'date-fns';

const ReportTable = ({
  data,
  type = 'student', // 'student' or 'group'
  dateRange,
  loading = false,
  onRowClick
}) => {
  const { t } = useTranslation();

  const studentColumns = [
    {
      key: 'name',
      label: t('common.name'),
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          {row.familyGroupId && (
            <p className="text-xs text-gray-500">
              {row.familyGroupId.groupName || t('admin.inGroup')}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'totalAttendance',
      label: t('user.totalAttendance'),
      render: (value) => (
        <span className="font-semibold text-blue-600">{value || 0}</span>
      )
    },
    {
      key: 'newGatha',
      label: t('user.totalNewGatha'),
      render: (value) => (
        <span className="font-semibold text-green-600">{value || 0}</span>
      )
    },
    {
      key: 'revisionGatha',
      label: t('user.totalRevisionGatha'),
      render: (value) => (
        <span className="font-semibold text-purple-600">{value || 0}</span>
      )
    },
    {
      key: 'totalGatha',
      label: t('admin.totalGatha'),
      render: (value) => (
        <span className="font-bold text-gray-900">{value || 0}</span>
      )
    }
  ];

  const groupColumns = [
    {
      key: 'groupName',
      label: t('admin.groupName'),
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">
            {row.memberCount || row.members?.length || 0} {t('admin.members')}
          </p>
        </div>
      )
    },
    {
      key: 'totalAttendance',
      label: t('user.totalAttendance'),
      render: (value) => (
        <span className="font-semibold text-blue-600">{value || 0}</span>
      )
    },
    {
      key: 'totalGatha',
      label: t('admin.totalGatha'),
      render: (value) => (
        <span className="font-semibold text-green-600">{value || 0}</span>
      )
    },
    {
      key: 'avgAttendance',
      label: t('reports.avgAttendance'),
      render: (value) => (
        <span className="text-gray-600">{value?.toFixed(1) || '0.0'}</span>
      )
    },
    {
      key: 'avgGatha',
      label: t('reports.avgGatha'),
      render: (value) => (
        <span className="text-gray-600">{value?.toFixed(1) || '0.0'}</span>
      )
    }
  ];

  const columns = type === 'student' ? studentColumns : groupColumns;

  const exportColumns = columns.map(col => ({
    key: col.key,
    label: col.label,
    exportValue: (value, row) => {
      if (col.key === 'name' && row.familyGroupId) {
        return `${value} (${row.familyGroupId.groupName || ''})`;
      }
      if (col.key === 'groupName') {
        return `${value} (${row.memberCount || row.members?.length || 0} members)`;
      }
      return value;
    }
  }));

  const filename = `${type}_report_${dateRange?.startDate || 'all'}_to_${dateRange?.endDate || 'all'}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {dateRange?.startDate && dateRange?.endDate && (
            <span>
              {t('common.dateRange')}: {format(new Date(dateRange.startDate), 'dd MMM yyyy')} - {format(new Date(dateRange.endDate), 'dd MMM yyyy')}
            </span>
          )}
        </div>
        <ExportButtons
          data={data}
          columns={exportColumns}
          filename={filename}
        />
      </div>

      <Table
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={onRowClick}
        emptyMessage={t('reports.noData')}
      />
    </div>
  );
};

export default ReportTable;