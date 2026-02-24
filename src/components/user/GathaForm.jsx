import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, BookOpen, Send, CheckCircle, Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Card, Input } from '../common';
import FamilyMemberSelector from './FamilyMemberSelector';
import { useAuthStore } from '../../store/authStore';

const GathaForm = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation();
  const { user, familyMembers } = useAuthStore();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMembers, setSelectedMembers] = useState([user?._id]);
  const [gathaType, setGathaType] = useState('new');
  const [gathaCount, setGathaCount] = useState(1);
  const [gathaDetails, setGathaDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const hasFamily = familyMembers && familyMembers.length > 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await onSubmit({
      date,
      userIds: selectedMembers,
      gathaType,
      gathaCount: parseInt(gathaCount),
      gathaDetails
    });

    if (result?.success) {
      setSubmitted(true);
      setGathaCount(1);
      setGathaDetails('');
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
          {t('user.gathaAdded')}
        </h3>
        <p className="text-gray-500">{t('user.waitingApproval')}</p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gatha Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('user.gathaType')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGathaType('new')}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                ${gathaType === 'new'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">{t('user.newGatha')}</span>
            </button>
            <button
              type="button"
              onClick={() => setGathaType('revision')}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                ${gathaType === 'revision'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">{t('user.revisionGatha')}</span>
            </button>
          </div>
        </div>

        {/* Date */}
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

        {/* Gatha Count */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BookOpen className="w-4 h-4 text-gray-400" />
            {t('user.gathaCount')}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGathaCount(Math.max(1, gathaCount - 1))}
              className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={gathaCount}
              onChange={(e) => setGathaCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={() => setGathaCount(gathaCount + 1)}
              className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Gatha Details */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('user.gathaDetails')} ({t('common.optional')})
          </label>
          <textarea
            value={gathaDetails}
            onChange={(e) => setGathaDetails(e.target.value)}
            placeholder={t('placeholder.gathaDetails')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Family Member Selection */}
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
          disabled={selectedMembers.length === 0 || gathaCount < 1}
          icon={Send}
          className="w-full"
          size="lg"
        >
          {t('user.addGatha')}
        </Button>
      </form>
    </Card>
  );
};

export default GathaForm;