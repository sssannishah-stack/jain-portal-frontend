import { 
  format, 
  parseISO, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  subMonths,
  isToday,
  isYesterday,
  differenceInDays,
  addDays
} from 'date-fns';

export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const formatDateForDisplay = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isYesterday(dateObj)) return 'Yesterday';
  
  return format(dateObj, 'dd MMM yyyy');
};

export const getDateRange = (rangeType) => {
  const today = new Date();
  
  switch (rangeType) {
    case 'today':
      return {
        startDate: formatDateForInput(today),
        endDate: formatDateForInput(today)
      };
    case 'thisWeek':
      return {
        startDate: formatDateForInput(startOfWeek(today, { weekStartsOn: 1 })),
        endDate: formatDateForInput(endOfWeek(today, { weekStartsOn: 1 }))
      };
    case 'thisMonth':
      return {
        startDate: formatDateForInput(startOfMonth(today)),
        endDate: formatDateForInput(endOfMonth(today))
      };
    case 'lastMonth':
      const lastMonth = subMonths(today, 1);
      return {
        startDate: formatDateForInput(startOfMonth(lastMonth)),
        endDate: formatDateForInput(endOfMonth(lastMonth))
      };
    default:
      return {
        startDate: formatDateForInput(startOfMonth(today)),
        endDate: formatDateForInput(today)
      };
  }
};

export const getDaysInRange = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start) + 1;
};

export const generateDateArray = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const days = differenceInDays(end, start) + 1;
  
  return Array.from({ length: days }, (_, i) => {
    return formatDateForInput(addDays(start, i));
  });
};

export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return start <= end;
};

export const getTodayDate = () => formatDateForInput(new Date());