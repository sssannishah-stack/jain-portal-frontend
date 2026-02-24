import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  subMonths,
  subDays,
  isValid 
} from 'date-fns';

const DateRangePicker = ({
  startDate,
  endDate,
  onDateChange,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalStartDate(startDate || '');
    setLocalEndDate(endDate || '');
  }, [startDate, endDate]);

  const presets = [
    {
      label: t('dateRange.today'),
      getValue: () => ({
        start: format(new Date(), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      })
    },
    {
      label: t('dateRange.yesterday'),
      getValue: () => ({
        start: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        end: format(subDays(new Date(), 1), 'yyyy-MM-dd')
      })
    },
    {
      label: t('dateRange.thisWeek'),
      getValue: () => ({
        start: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        end: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
      })
    },
    {
      label: t('dateRange.thisMonth'),
      getValue: () => ({
        start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
      })
    },
    {
      label: t('dateRange.lastMonth'),
      getValue: () => ({
        start: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        end: format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')
      })
    },
    {
      label: t('dateRange.last7Days'),
      getValue: () => ({
        start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      })
    },
    {
      label: t('dateRange.last30Days'),
      getValue: () => ({
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      })
    }
  ];

  const handlePresetClick = (preset) => {
    const { start, end } = preset.getValue();
    setLocalStartDate(start);
    setLocalEndDate(end);
    onDateChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  const handleApply = () => {
    onDateChange({ startDate: localStartDate, endDate: localEndDate });
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalStartDate('');
    setLocalEndDate('');
    onDateChange({ startDate: '', endDate: '' });
    setIsOpen(false);
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    const parsed = new Date(date);
    return isValid(parsed) ? format(parsed, 'dd MMM yyyy') : '';
  };

  const displayText = localStartDate && localEndDate
    ? `${formatDisplayDate(localStartDate)} - ${formatDisplayDate(localEndDate)}`
    : t('dateRange.selectRange');

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[280px]"
      >
        <Calendar className="w-5 h-5 text-gray-400" />
        <span className={`flex-1 text-left ${localStartDate ? 'text-gray-900' : 'text-gray-500'}`}>
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[320px]">
          {/* Presets */}
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('dateRange.quickSelect')}</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('dateRange.customRange')}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.from')}
                </label>
                <input
                  type="date"
                  value={localStartDate}
                  onChange={(e) => setLocalStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.to')}
                </label>
                <input
                  type="date"
                  value={localEndDate}
                  onChange={(e) => setLocalEndDate(e.target.value)}
                  min={localStartDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              {t('common.clear')}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {t('common.apply')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;