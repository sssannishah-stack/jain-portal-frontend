import React from 'react';
import { User, Lock, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from '../common';
import toast from 'react-hot-toast';

const CredentialsModal = ({ isOpen, onClose, user }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState({ name: false, password: false });

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [field]: true }));
    toast.success(t('messages.copied'));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('admin.viewCredentials')}
      size="sm"
    >
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {t('admin.credentialsWarning')}
          </p>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('auth.name')}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{user.name}</span>
            </div>
            <button
              onClick={() => copyToClipboard(user.name, 'name')}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied.name ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('auth.password')}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="font-medium font-mono">{user.password}</span>
            </div>
            <button
              onClick={() => copyToClipboard(user.password, 'password')}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied.password ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Group Info */}
        {user.familyGroupId && (
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-primary-800">
              <strong>{t('admin.familyGroup')}:</strong> {user.familyGroupId.groupName || user.familyGroupId}
            </p>
          </div>
        )}

        <div className="pt-4">
          <Button onClick={onClose} className="w-full">
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CredentialsModal;