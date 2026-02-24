import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common';

const StudentReport = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('admin.studentReport')}</h1>
      <Card className="p-6">
        <p>Student ID: {id}</p>
        {/* Detailed student report implementation */}
      </Card>
    </div>
  );
};

export default StudentReport;