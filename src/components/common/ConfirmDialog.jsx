import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from './Button';

const iconConfig = {
  danger: {
    icon: AlertTriangle,
    bg: 'bg-red-100',
    color: 'text-red-600'
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-100',
    color: 'text-yellow-600'
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-100',
    color: 'text-green-600'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-100',
    color: 'text-blue-600'
  }
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = 'danger',
  loading = false
}) => {
  const { t } = useTranslation();
  
  const config = iconConfig[type] || iconConfig.danger;
  const Icon = config.icon;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 rounded-full ${config.bg} flex items-center justify-center mb-4`}>
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title || t('confirm.title')}
        </h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message || t('confirm.message')}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText || t('common.cancel')}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText || t('common.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;