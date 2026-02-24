import { STATUS, GATHA_TYPES } from './constants';

export const getStatusColor = (status) => {
  switch (status) {
    case STATUS.APPROVED:
      return 'bg-green-100 text-green-800';
    case STATUS.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case STATUS.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getGathaTypeColor = (type) => {
  switch (type) {
    case GATHA_TYPES.NEW:
      return 'bg-blue-100 text-blue-800';
    case GATHA_TYPES.REVISION:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateCSV = (data, headers) => {
  const headerRow = headers.map(h => h.label).join(',');
  const dataRows = data.map(item => 
    headers.map(h => {
      let value = item[h.key];
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      return value || '';
    }).join(',')
  );
  return [headerRow, ...dataRows].join('\n');
};

export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat().format(num);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};