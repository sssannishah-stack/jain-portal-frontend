import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon,
  action,
  className = '',
  bodyClassName = '',
  noPadding = false
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-saffron-50 text-saffron-500 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : `p-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;