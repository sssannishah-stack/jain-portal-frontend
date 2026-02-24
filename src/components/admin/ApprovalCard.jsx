import React from 'react';
import { Check, X, Calendar, User, BookOpen, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { StatusBadge } from '../common';

const ApprovalCard = ({
  item,
  type, // 'attendance' or 'gatha'
  onApprove,
  onReject,
  loading = false
}) => {
  const { t } = useTranslation();

  const isGatha = type === 'gatha';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isGatha 
                ? item.gathaType === 'new' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
                : 'bg-primary-100 text-primary-700'
            }`}>
              {isGatha 
                ? item.gathaType === 'new' 
                  ? t('user.newGatha')
                  : t('user.revisionGatha')
                : t('common.attendance')
              }
            </span>
            <StatusBadge status={item.status} size="sm" />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 text-gray-900 font-medium mb-1">
            <User className="w-4 h-4 text-gray-400" />
            <span>{item.userId?.name || 'Unknown'}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(item.date), 'dd MMM yyyy')}</span>
          </div>

          {/* Gatha Details */}
          {isGatha && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>{item.gathaCount} {t('user.gathas')}</span>
              {item.gathaDetails && (
                <span className="text-gray-400">- {item.gathaDetails}</span>
              )}
            </div>
          )}

          {/* Marked By */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>
              {t('common.markedBy')}: {
                item.markedByAdmin 
                  ? t('common.admin')
                  : item.markedBy?.name || item.userId?.name || 'Self'
              }
            </span>
          </div>
        </div>

        {/* Actions */}
        {item.status === 'pending' && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onApprove(item._id)}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
            >
              <Check className="w-4 h-4" />
              <span>{t('common.approve')}</span>
            </button>
            <button
              onClick={() => onReject(item._id)}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              <span>{t('common.reject')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalCard;