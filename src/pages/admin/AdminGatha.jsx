import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, Button, Input, Select, DatePicker, Spinner } from '../../components/Components';
import { Plus, BookOpen, Search } from 'lucide-react';

export function AdminGatha() {
  const { t } = useTranslation();
  const { students, fetchStudents, adminAddGatha } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'new',
    count: 1,
    gathaNames: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchStudents();
      setIsLoading(false);
    };
    load();
  }, []);
  
  const handleSubmit = async () => {
    if (!formData.userId || !formData.count) return;
    
    setSubmitting(true);
    const result = await adminAddGatha({
      ...formData,
      gathaNames: formData.gathaNames.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSubmitting(false);
    
    if (result.success) {
      setFormData({
        ...formData,
        userId: '',
        count: 1,
        gathaNames: ''
      });
    }
  };
  
  const filteredStudents = (students || []).filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout title={t('gatha')} isAdmin>
      <Card title={t('addGatha')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DatePicker
              label={t('selectDate')}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search')} {t('students')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`${t('search')}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <Select
              label={t('selectMember')}
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              options={filteredStudents.map(s => ({
                value: s._id,
                label: `${s.name} ${s.familyId?.name ? `(${s.familyId.name})` : ''}`
              }))}
              placeholder={t('selectMember')}
              required
            />
          </div>
          
          <div className="space-y-4">
            <Select
              label={t('gathaType')}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'new', label: `${t('new')} ✨` },
                { value: 'revision', label: `${t('revision')} 🔄` }
              ]}
              required
            />
            
            <Input
              label={t('count')}
              type="number"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
              min="1"
              required
            />
            
            <Input
              label={t('gathaNames')}
              value={formData.gathaNames}
              onChange={(e) => setFormData({ ...formData, gathaNames: e.target.value })}
              placeholder="गाथा 1, गाथा 2, गाथा 3"
            />
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ Admin added gatha is automatically approved
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!formData.userId || !formData.count}
            icon={Plus}
          >
            {t('addGatha')}
          </Button>
        </div>
      </Card>
    </Layout>
  );
}

export default AdminGatha;