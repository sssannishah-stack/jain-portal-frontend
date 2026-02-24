import React from 'react';
import { Check, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';

const FamilyMemberSelector = ({
  selectedMembers,
  onSelectionChange,
  mode = 'multiple', // 'single' or 'multiple'
  showSelectAll = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const { familyMembers, user } = useAuthStore();

  if (!familyMembers || familyMembers.length <= 1) {
    return null;
  }

  const allSelected = selectedMembers.length === familyMembers.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([user._id]);
    } else {
      onSelectionChange(familyMembers.map(m => m._id));
    }
  };

  const handleMemberClick = (memberId) => {
    if (mode === 'single') {
      onSelectionChange([memberId]);
    } else {
      if (selectedMembers.includes(memberId)) {
        // Don't allow deselecting if it's the only one selected
        if (selectedMembers.length > 1) {
          onSelectionChange(selectedMembers.filter(id => id !== memberId));
        }
      } else {
        onSelectionChange([...selectedMembers, memberId]);
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Users className="w-4 h-4 text-gray-400" />
          {t('user.selectFamilyMember')}
        </label>
        
        {showSelectAll && mode === 'multiple' && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {allSelected ? t('common.deselectAll') : t('user.markForAll')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {familyMembers.map((member) => {
          const isSelected = selectedMembers.includes(member._id);
          const isCurrentUser = member._id === user._id;

          return (
            <button
              key={member._id}
              type="button"
              onClick={() => handleMemberClick(member._id)}
              className={`
                relative flex items-center gap-2 p-3 rounded-xl border-2 transition-all
                ${isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium truncate ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                  {member.name}
                </p>
                {isCurrentUser && (
                  <p className="text-xs text-gray-500">{t('common.you')}</p>
                )}
              </div>

              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        {t('user.selectedCount', { count: selectedMembers.length, total: familyMembers.length })}
      </p>
    </div>
  );
};

export default FamilyMemberSelector;