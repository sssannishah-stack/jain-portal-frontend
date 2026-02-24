import React from 'react';
import { Inbox, Search, Users, Calendar, FileText, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const iconMap = {
  default: Inbox,
  search: Search,
  users: Users,
  calendar: Calendar,
  file: FileText
};

const EmptyState = ({
  icon = 'default',
  title,
  description,
  action,
  actionLabel,
  className = ''
}) => {
  const { t } = useTranslation();
  const Icon = iconMap[icon] || iconMap.default;

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title || t('empty.title')}
      </h3>
      
      <p className="text-gray-500 text-center max-w-sm mb-6">
        {description || t('empty.description')}
      </p>

      {action && (
        <Button onClick={action} icon={Plus}>
          {actionLabel || t('empty.action')}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;