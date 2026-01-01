import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, Badge, Button, Input, Modal, Table, Spinner } from '../../components/Components';
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';

export function AdminStudents() {
  const { t } = useTranslation();
  const { students, fetchStudents, addStudent, updateStudent, deleteStudent } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchStudents();
      setIsLoading(false);
    };
    load();
  }, []);
  
  const resetForm = () => {
    setFormData({ name: '', password: '' });
    setFormError('');
    setSelectedStudent(null);
    setShowModal(false);
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.password.trim()) {
      setFormError('All fields are required');
      return;
    }
    
    setSubmitting(true);
    setFormError('');
    
    let result;
    if (selectedStudent) {
      result = await updateStudent(selectedStudent._id, formData);
    } else {
      result = await addStudent(formData);
    }
    
    setSubmitting(false);
    
    if (result.success) {
      resetForm();
    } else {
      setFormError(result.message || 'Operation failed');
    }
  };
  
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({ name: student.name, password: student.password });
    setFormError('');
    setShowModal(true);
  };
  
  const handleDelete = async () => {
    if (selectedStudent) {
      await deleteStudent(selectedStudent._id);
      setSelectedStudent(null);
      setShowDeleteConfirm(false);
    }
  };
  
  const filteredStudents = (students || []).filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.password?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout title={t('students')} isAdmin>
      <Card
        title={`${t('students')} (${filteredStudents.length})`}
        action={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            {t('addStudent')}
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
        
        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('noStudents')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('name')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('password')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('families')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{student.password}</td>
                    <td className="px-4 py-3">
                      {student.familyId?.name ? (
                        <Badge variant="primary">{student.familyId.name}</Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={selectedStudent ? t('editStudent') : t('addStudent')}
      >
        <div className="space-y-4">
          <Input
            label={t('studentName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('studentName')}
            required
          />
          <Input
            label={t('studentPassword')}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={t('studentPassword')}
            required
          />
          
          {formError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{formError}</span>
            </div>
          )}
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Note: Same name and password combination cannot exist for two students.
            </p>
          </div>
          
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
            {t('confirmDelete')} <strong>"{selectedStudent?.name}"</strong>?
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

export default AdminStudents;