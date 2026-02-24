import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useGroups = (params = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const groupsQuery = useQuery({
    queryKey: ['groups', params],
    queryFn: () => groupService.getAll(params)
  });

  const createMutation = useMutation({
    mutationFn: groupService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.groupCreated'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => groupService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.groupUpdated'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: groupService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.groupDeleted'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ groupId, userId }) => groupService.addMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.memberAdded'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ groupId, userId }) => groupService.removeMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.memberRemoved'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  return {
    groups: groupsQuery.data?.data || [],
    totalGroups: groupsQuery.data?.total || 0,
    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    refetch: groupsQuery.refetch,
    createGroup: createMutation.mutate,
    updateGroup: updateMutation.mutate,
    deleteGroup: deleteMutation.mutate,
    addMember: addMemberMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};

export const useGroup = (id) => {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => groupService.getById(id),
    enabled: !!id
  });
};