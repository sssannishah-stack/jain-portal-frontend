import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Users, Lock, FileText, X, Plus, Search } from 'lucide-react';
import { Input, Button, Modal } from '../common';

const GroupForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  availableUsers = [],
  loading = false,
  error = null
}) => {
  const { t } = useTranslation();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      groupName: '',
      groupPassword: '',
      description: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        groupName: initialData.groupName || '',
        groupPassword: initialData.groupPassword || '',
        description: initialData.description || ''
      });
      setSelectedMembers(initialData.members?.map(m => m._id || m) || []);
    } else {
      reset({
        groupName: '',
        groupPassword: '',
        description: ''
      });
      setSelectedMembers([]);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      members: selectedMembers
    });
  };

  const handleClose = () => {
    reset();
    setSelectedMembers([]);
    setSearchQuery('');
    onClose();
  };

  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserDetails = availableUsers.filter(user =>
    selectedMembers.includes(user._id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? t('admin.editGroup') : t('admin.addGroup')}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('admin.groupName')}
            icon={Users}
            placeholder={t('placeholder.enterGroupName')}
            error={errors.groupName?.message}
            {...register('groupName', {
              required: t('validation.groupNameRequired')
            })}
          />

          <Input
            label={t('admin.groupPassword')}
            icon={Lock}
            placeholder={t('placeholder.enterGroupPassword')}
            error={errors.groupPassword?.message}
            {...register('groupPassword', {
              required: t('validation.groupPasswordRequired')
            })}
          />
        </div>

        <Input
          label={t('admin.description')}
          icon={FileText}
          placeholder={t('placeholder.enterDescription')}
          {...register('description')}
        />

        {/* Selected Members */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('admin.selectedMembers')} ({selectedMembers.length})
          </label>
          
          {selectedUserDetails.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedUserDetails.map(user => (
                <span
                  key={user._id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={() => toggleMember(user._id)}
                    className="hover:bg-primary-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('admin.noMembersSelected')}</p>
          )}
        </div>

        {/* Add Members */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('admin.addMembers')}
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('placeholder.searchUsers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <label
                  key={user._id}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                    selectedMembers.includes(user._id) ? 'bg-primary-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => toggleMember(user._id)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="flex-1">{user.name}</span>
                  {user.familyGroupId && (
                    <span className="text-xs text-gray-500">
                      ({t('admin.inGroup')})
                    </span>
                  )}
                </label>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">{t('common.noData')}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            {initialData ? t('common.save') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupForm;