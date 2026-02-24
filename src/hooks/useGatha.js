import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gathaService } from '../services';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useGatha = (params = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // User: Add gatha
  const addMutation = useMutation({
    mutationFn: gathaService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatha'] });
      queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
      toast.success(t('user.gathaAdded'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  // User: Get own gatha
  const ownGathaQuery = useQuery({
    queryKey: ['gatha', 'own', params],
    queryFn: () => gathaService.getOwn(params),
    enabled: params.enabled !== false
  });

  // User: Get family gatha
  const familyGathaQuery = useQuery({
    queryKey: ['gatha', 'family', params],
    queryFn: () => gathaService.getFamily(params),
    enabled: params.family === true
  });

  // Admin: Approve
  const approveMutation = useMutation({
    mutationFn: gathaService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast.success(t('messages.gathaApproved'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  // Admin: Reject
  const rejectMutation = useMutation({
    mutationFn: gathaService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      toast.success(t('messages.gathaRejected'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  // Admin: Add for user
  const addForUserMutation = useMutation({
    mutationFn: gathaService.addForUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatha'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast.success(t('user.gathaAdded'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  return {
    // User
    addGatha: addMutation.mutateAsync,
    ownGatha: ownGathaQuery.data?.data || [],
    familyGatha: familyGathaQuery.data?.data || [],
    isAdding: addMutation.isPending,
    isLoadingOwn: ownGathaQuery.isLoading,
    isLoadingFamily: familyGathaQuery.isLoading,
    
    // Admin
    approveGatha: approveMutation.mutate,
    rejectGatha: rejectMutation.mutate,
    addGathaForUser: addForUserMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isAddingForUser: addForUserMutation.isPending
  };
};