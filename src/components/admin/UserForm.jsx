import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { User, Lock, Phone, MapPin, Users } from 'lucide-react';
import { Input, Button, Modal } from '../common';

const UserForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  groups = [],
  loading = false,
  error = null
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      password: '',
      phone: '',
      address: '',
      familyGroupId: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        password: initialData.password || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        familyGroupId: initialData.familyGroupId?._id || initialData.familyGroupId || ''
      });
    } else {
      reset({
        name: '',
        password: '',
        phone: '',
        address: '',
        familyGroupId: ''
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      familyGroupId: data.familyGroupId || null
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? t('admin.editUser') : t('admin.addUser')}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <Input
          label={t('auth.name')}
          icon={User}
          placeholder={t('placeholder.enterName')}
          error={errors.name?.message}
          {...register('name', {
            required: t('validation.nameRequired')
          })}
        />

        <Input
          label={t('auth.password')}
          icon={Lock}
          placeholder={t('placeholder.enterPassword')}
          error={errors.password?.message}
          {...register('password', {
            required: t('validation.passwordRequired'),
            minLength: {
              value: 3,
              message: t('validation.passwordMinLength')
            }
          })}
        />

        <Input
          label={t('user.phone')}
          icon={Phone}
          placeholder={t('placeholder.enterPhone')}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label={t('user.address')}
          icon={MapPin}
          placeholder={t('placeholder.enterAddress')}
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              {t('admin.familyGroup')}
            </div>
          </label>
          <select
            {...register('familyGroupId')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">{t('admin.noGroup')}</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.groupName} ({group.members?.length || 0} {t('admin.members')})
              </option>
            ))}
          </select>
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

export default UserForm;