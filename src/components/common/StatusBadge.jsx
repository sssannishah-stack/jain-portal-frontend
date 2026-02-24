import React from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const statusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: Clock,
    iconColor: 'text-yellow-500'
  },
  approved: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: Check,
    iconColor: 'text-green-500'
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: X,
    iconColor: 'text-red-500'
  },
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: Check,
    iconColor: 'text-green-500'
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: AlertCircle,
    iconColor: 'text-gray-500'
  }
};

const StatusBadge = ({ 
  status, 
  showIcon = true, 
  size = 'md',
  className = '' 
}) => {
  const { t } = useTranslation();
  
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 
      ${config.bg} ${config.text} ${config.border}
      ${sizeClasses[size]}
      border rounded-full font-medium
      ${className}
    `}>
      {showIcon && <Icon className={`${iconSizes[size]} ${config.iconColor}`} />}
      <span>{t(`status.${status}`)}</span>
    </span>
  );
};

export default StatusBadge;