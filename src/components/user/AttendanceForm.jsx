import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Send, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Card } from '../common';
import FamilyMemberSelector from './FamilyMemberSelector';
import { useAuthStore } from '../../store/authStore';

const AttendanceForm = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation();
  const { user, familyMembers } = useAuthStore();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMembers, setSelectedMembers] = useState([user?._id]);
  const [submitted, setSubmitted] = useState(false);

  const hasFamily = familyMembers && familyMembers.length > 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await onSubmit({
      date,
      userIds: selectedMembers
    });

    if (result?.success) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  if (submitted) {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('user.attendanceMarked')}
        </h3>
        <p className="text-gray-500">{t('user.waitingApproval')}</p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            {t('common.date')}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {hasFamily && (
          <FamilyMemberSelector
            selectedMembers={selectedMembers}
            onSelectionChange={setSelectedMembers}
            mode="multiple"
          />
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={selectedMembers.length === 0}
          icon={Send}
          className="w-full"
          size="lg"
        >
          {t('user.markAttendance')}
        </Button>

        <p className="text-xs text-center text-gray-500">
          {t('user.attendanceNote')}
        </p>
      </form>
    </Card>
  );
};

export default AttendanceForm;