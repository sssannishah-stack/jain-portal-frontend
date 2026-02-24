import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useUsers = (params = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params)
  });

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.userCreated'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.userUpdated'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('messages.userDeleted'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  return {
    users: usersQuery.data?.data || [],
    totalUsers: usersQuery.data?.total || 0,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    refetch: usersQuery.refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id
  });
};