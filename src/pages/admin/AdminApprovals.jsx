import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, Badge, Button, Tabs, Spinner } from '../../components/Components';
import { Check, X, CheckSquare, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export function AdminApprovals() {
  const { t } = useTranslation();
  const {
    pendingAttendance,
    pendingGatha,
    fetchPendingAttendance,
    fetchPendingGatha,
    approveAttendance,
    approveGatha,
    bulkApproveAttendance,
    bulkApproveGatha
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedIds, setSelectedIds] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([fetchPendingAttendance(), fetchPendingGatha()]);
      setIsLoading(false);
    };
    load();
  }, []);
  
  const handleApprove = async (id, type, status) => {
    setProcessingId(id);
    if (type === 'attendance') {
      await approveAttendance(id, status);
    } else {
      await approveGatha(id, status);
    }
    setProcessingId(null);
  };
  
  const handleBulkApprove = async (status) => {
    if (selectedIds.length === 0) return;
    
    setProcessing(true);
    if (activeTab === 'attendance') {
      await bulkApproveAttendance(selectedIds, status);
    } else {
      await bulkApproveGatha(selectedIds, status);
    }
    setSelectedIds([]);
    setProcessing(false);
  };
  
  const toggleSelectAll = () => {
    const items = activeTab === 'attendance' ? pendingAttendance : pendingGatha;
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i._id));
    }
  };
  
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return '-';
    }
  };
  
  const currentItems = activeTab === 'attendance' ? pendingAttendance : pendingGatha;
  
  const tabs = [
    { id: 'attendance', label: t('pendingAttendance'), count: pendingAttendance?.length || 0 },
    { id: 'gatha', label: t('pendingGatha'), count: pendingGatha?.length || 0 }
  ];
  
  return (
    <Layout title={t('approvals')} isAdmin>
      <Card>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setSelectedIds([]);
          }}
        />
        
        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mt-4">
            <span className="text-blue-800 font-medium">
              {selectedIds.length} items selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleBulkApprove('approved')}
                loading={processing}
                icon={Check}
              >
                Approve All
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleBulkApprove('rejected')}
                loading={processing}
                icon={X}
              >
                Reject All
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : currentItems?.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">{t('noPending')}</h3>
              <p className="text-gray-400">All items have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select All */}
              <div className="flex items-center space-x-2 p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === currentItems.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-orange-500 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
              
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                      className="w-4 h-4 text-orange-500 rounded border-gray-300"
                    />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeTab === 'attendance' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activeTab === 'attendance' ? (
                        <Calendar className="w-5 h-5 text-blue-600" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.userId?.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.date)}
                        {activeTab === 'gatha' && (
                          <span className="ml-2">
                            • {item.type === 'new' ? t('new') : t('revision')} ({item.count})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {activeTab === 'gatha' && (
                      <Badge variant={item.type === 'new' ? 'success' : 'info'}>
                        {item.count}
                      </Badge>
                    )}
                    <button
                      onClick={() => handleApprove(item._id, activeTab, 'approved')}
                      disabled={processingId === item._id}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleApprove(item._id, activeTab, 'rejected')}
                      disabled={processingId === item._id}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Layout>
  );
}

export default AdminApprovals;