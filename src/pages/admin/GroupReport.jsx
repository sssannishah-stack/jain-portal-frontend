import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common';

const GroupReport = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('admin.groupReport')}</h1>
      <Card className="p-6">
        <p>Group ID: {id}</p>
        {/* Detailed group report implementation */}
      </Card>
    </div>
  );
};

export default GroupReport;