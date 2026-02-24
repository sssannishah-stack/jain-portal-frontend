import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useAttendance = (params = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // User: Mark attendance
  const markMutation = useMutation({
    mutationFn: attendanceService.mark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
      toast.success(t('user.attendanceMarked'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  // User: Get own attendance
  const ownAttendanceQuery = useQuery({
    queryKey: ['attendance', 'own', params],
    queryFn: () => attendanceService.getOwn(params),
    enabled: params.enabled !== false
  });

  // User: Get family attendance
  const familyAttendanceQuery = useQuery({
    queryKey: ['attendance', 'family', params],
    queryFn: () => attendanceService.getFamily(params),
    enabled: params.family === true
  });

  // Admin: Approve
  const approveMutation = useMutation({
    mutationFn: attendanceService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast.success(t('messages.attendanceApproved'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  // Admin: Reject
  const rejectMutation = useMutation({
    mutationFn: attendanceService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      toast.success(t('messages.attendanceRejected'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  // Admin: Add for user
  const addForUserMutation = useMutation({
    mutationFn: attendanceService.addForUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast.success(t('user.attendanceMarked'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('messages.somethingWrong'));
    }
  });

  return {
    // User
    markAttendance: markMutation.mutateAsync,
    ownAttendance: ownAttendanceQuery.data?.data || [],
    familyAttendance: familyAttendanceQuery.data?.data || [],
    isMarking: markMutation.isPending,
    isLoadingOwn: ownAttendanceQuery.isLoading,
    isLoadingFamily: familyAttendanceQuery.isLoading,
    
    // Admin
    approveAttendance: approveMutation.mutate,
    rejectAttendance: rejectMutation.mutate,
    addAttendanceForUser: addForUserMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isAddingForUser: addForUserMutation.isPending
  };
};