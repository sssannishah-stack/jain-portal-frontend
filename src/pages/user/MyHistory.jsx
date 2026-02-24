import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Calendar,
  BookOpen,
  CalendarCheck,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { attendanceService, gathaService } from '../../services';
import { format, subDays } from 'date-fns';

const MyHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');

      const [attRes, gathaRes] = await Promise.all([
        attendanceService.getOwn({ startDate, endDate }),
        gathaService.getOwn({ startDate, endDate })
      ]);

      const combined = [
        ...(attRes?.data || []).map(a => ({ ...a, type: 'attendance' })),
        ...(gathaRes?.data || []).map(g => ({ ...g, type: 'gatha' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setData(combined);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-xl md:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My History</h1>
          <p className="text-xs text-gray-500">Last 30 days activity</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'attendance', label: 'Attendance' },
          { key: 'gatha', label: 'Gatha' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <CalendarCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-700">
            {data.filter(d => d.type === 'attendance').length}
          </p>
          <p className="text-xs text-blue-600">Attendance</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-700">
            {data.filter(d => d.type === 'gatha' && d.gathaType === 'new').reduce((sum, g) => sum + (g.gathaCount || 0), 0)}
          </p>
          <p className="text-xs text-green-600">New Gatha</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <History className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-purple-700">
            {data.filter(d => d.type === 'gatha' && d.gathaType === 'revision').reduce((sum, g) => sum + (g.gathaCount || 0), 0)}
          </p>
          <p className="text-xs text-purple-600">Revision</p>
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No records found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.type === 'attendance' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {item.type === 'attendance' ? (
                    <CalendarCheck className="w-5 h-5 text-blue-600" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-green-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.type === 'attendance' 
                        ? 'Attendance' 
                        : `${item.gathaCount} ${item.gathaType === 'new' ? 'New' : 'Revision'} Gatha`
                      }
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(item.date), 'EEEE, dd MMM yyyy')}
                  </p>
                  {item.gathaDetails && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{item.gathaDetails}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHistory;