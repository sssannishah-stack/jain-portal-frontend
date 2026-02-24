import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useAuth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAdmin, setUser, logout: storeLogout } = useAuthStore();

  const adminLoginMutation = useMutation({
    mutationFn: authService.adminLogin,
    onSuccess: (data) => {
      setAdmin(data.admin, data.token);
      toast.success(t('messages.loginSuccess'));
      navigate('/admin/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('auth.invalidCredentials'));
    }
  });

  const userLoginMutation = useMutation({
    mutationFn: authService.userLogin,
    onSuccess: (data) => {
      setUser(data.user, data.token, data.familyMembers, data.familyGroupId);
      toast.success(t('messages.loginSuccess'));
      navigate('/user/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('auth.invalidCredentials'));
    }
  });

  const logout = () => {
    storeLogout();
    toast.success(t('messages.logoutSuccess'));
    navigate('/');
  };

  return {
    adminLogin: adminLoginMutation.mutate,
    userLogin: userLoginMutation.mutate,
    logout,
    isAdminLoggingIn: adminLoginMutation.isPending,
    isUserLoggingIn: userLoginMutation.isPending
  };
};