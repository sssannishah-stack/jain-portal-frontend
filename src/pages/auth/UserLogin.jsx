import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Users, User, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { LanguageSwitcher } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services';
import toast from 'react-hot-toast';

const UserLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, isUserAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      password: ''
    }
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isUserAuthenticated) {
      navigate('/user/dashboard', { replace: true });
    }
  }, [isUserAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.userLogin(data);
      
      if (response.success && response.user && response.token) {
        // Set user in store
        setUser(response.user, response.token, response.familyMembers, response.familyGroupId);
        
        // Show success message
        toast.success(t('messages.loginSuccess'));
        
        // Navigate to user dashboard
        setTimeout(() => {
          navigate('/user/dashboard', { replace: true });
        }, 100);
      } else {
        toast.error(t('auth.invalidCredentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher variant="buttons" />
      </div>

      {/* Back Button */}
      <Link 
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">{t('common.back')}</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/30 mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.studentLogin')}
            </h1>
            <p className="text-gray-600">
              {t('auth.loginToContinue')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t('auth.name')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('placeholder.enterName')}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-emerald-500'
                  }`}
                  {...register('name', { required: t('validation.nameRequired') })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('placeholder.enterPassword')}
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-emerald-500'
                  }`}
                  {...register('password', { required: t('validation.passwordRequired') })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-emerald-700 text-sm">
                💡 {t('auth.studentLoginHint')}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('common.loading')}</span>
                </>
              ) : (
                <span>{t('auth.loginButton')}</span>
              )}
            </button>
          </form>

          {/* Switch to Admin Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('auth.areYouAdmin')}{' '}
              <Link to="/admin/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                {t('auth.adminLogin')}
              </Link>
            </p>
          </div>
        </div>

        {/* Family Group Info */}
        <div className="mt-6 bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
          <p className="text-teal-800 text-sm">
            🏠 {t('auth.familyLoginInfo')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;