import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, Badge, Button, Input, Modal, MultiSelect, Spinner } from '../../components/Components';
import { Plus, Edit, Trash2, Search, AlertCircle, Users } from 'lucide-react';

export function AdminFamilies() {
  const { t } = useTranslation();
  const { students, families, fetchStudents, fetchFamilies, addFamily, updateFamily, deleteFamily } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', memberIds: [] });
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([fetchStudents(), fetchFamilies()]);
      setIsLoading(false);
    };
    load();
  }, []);
  
  const resetForm = () => {
    setFormData({ name: '', description: '', memberIds: [] });
    setFormError('');
    setSelectedFamily(null);
    setShowModal(false);
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFormError('Family name is required');
      return;
    }
    
    setSubmitting(true);
    setFormError('');
    
    let result;
    if (selectedFamily) {
      result = await updateFamily(selectedFamily._id, formData);
    } else {
      result = await addFamily(formData);
    }
    
    setSubmitting(false);
    
    if (result.success) {
      resetForm();
      await fetchFamilies();
      await fetchStudents();
    } else {
      setFormError(result.message || 'Operation failed');
    }
  };
  
  const handleEdit = (family) => {
    setSelectedFamily(family);
    setFormData({
      name: family.name,
      description: family.description || '',
      memberIds: family.members?.map(m => m._id) || []
    });
    setFormError('');
    setShowModal(true);
  };
  
  const handleDelete = async () => {
    if (selectedFamily) {
      await deleteFamily(selectedFamily._id);
      setSelectedFamily(null);
      setShowDeleteConfirm(false);
    }
  };
  
  // Get students available for selection (not in any family or in current family)
  const availableStudents = (students || []).filter(s =>
    !s.familyId || (selectedFamily && s.familyId?._id === selectedFamily._id)
  );
  
  const filteredFamilies = (families || []).filter(f =>
    f.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout title={t('families')} isAdmin>
      <Card
        title={`${t('families')} (${filteredFamilies.length})`}
        action={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            {t('addFamily')}
          </Button>
        }
      >
        {/* Search */}
        <div className="mb-6">
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
        
        {/* Families Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredFamilies.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('noFamilies')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFamilies.map((family) => (
              <div
                key={family._id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{family.name}</h3>
                      <p className="text-sm text-gray-500">{family.members?.length || 0} {t('members')}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(family)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFamily(family);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {family.description && (
                  <p className="text-sm text-gray-600 mb-3">{family.description}</p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {family.members?.slice(0, 4).map((member) => (
                    <Badge key={member._id} variant="info">{member.name}</Badge>
                  ))}
                  {family.members?.length > 4 && (
                    <Badge variant="default">+{family.members.length - 4}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={selectedFamily ? t('editFamily') : t('addFamily')}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label={t('familyName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('familyName')}
            required
          />
          
          <Input
            label={t('description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('description')}
          />
          
          <MultiSelect
            label={t('selectMembers')}
            options={availableStudents.map(s => ({
              value: s._id,
              label: `${s.name} (${s.password})`
            }))}
            selected={formData.memberIds}
            onChange={(ids) => setFormData({ ...formData, memberIds: ids })}
          />
          
          {formData.memberIds.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ {formData.memberIds.length} {t('members')} selected
              </p>
            </div>
          )}
          
          {formError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{formError}</span>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={resetForm}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              {t('save')}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('delete')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {t('confirmDelete')} <strong>"{selectedFamily?.name}"</strong>?
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              {t('cancel')}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              {t('delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default AdminFamilies;