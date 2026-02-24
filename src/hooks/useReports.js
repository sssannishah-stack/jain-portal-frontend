import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: reportService.getDashboardStats,
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};

export const useUserDashboard = () => {
  return useQuery({
    queryKey: ['userDashboard'],
    queryFn: reportService.getUserDashboard,
    refetchInterval: 30000
  });
};

export const useFamilyDashboard = () => {
  return useQuery({
    queryKey: ['familyDashboard'],
    queryFn: reportService.getFamilyDashboard
  });
};

export const useStudentReport = (params = {}) => {
  return useQuery({
    queryKey: ['studentReport', params],
    queryFn: () => reportService.getStudentReport(params),
    enabled: params.enabled !== false
  });
};

export const useGroupReport = (params = {}) => {
  return useQuery({
    queryKey: ['groupReport', params],
    queryFn: () => reportService.getGroupReport(params),
    enabled: params.enabled !== false
  });
};

export const useTopPerformers = (params = {}) => {
  return useQuery({
    queryKey: ['topPerformers', params],
    queryFn: () => reportService.getTopPerformers(params)
  });
};