import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const UserStatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  trend,
  trendValue,
  loading = false,
  className = ''
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-6 shadow-sm animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div className="w-16 h-6 bg-gray-200 rounded" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        {trend && (
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-sm backdrop-blur-sm">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-4xl font-bold mb-1">{value}</h3>
        <p className="text-white/80 font-medium">{title}</p>
        {subtitle && (
          <p className="text-white/60 text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default UserStatsCard;