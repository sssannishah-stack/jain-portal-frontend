import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Users, Shield, User, Lock, Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const { adminLogin, userLogin, error, clearError, loading } = useApp();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ username: '', name: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    clearError();
    setFormData({ username: '', name: '', password: '' });
  }, [isAdmin, clearError]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      if (isAdmin) {
        result = await adminLogin(formData.username, formData.password);
      } else {
        result = await userLogin(formData.name, formData.password);
      }
      
      if (result.success) {
        window.location.href = isAdmin ? '/admin/dashboard' : '/user/dashboard';
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हि' },
    { code: 'gu', label: 'ગુ' }
  ];
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 flex space-x-1 bg-white/20 backdrop-blur-sm rounded-full p-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i18n.language === lang.code
                  ? 'bg-white text-orange-600'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl mb-6">
              <span className="text-5xl">🙏</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('appName')}</h1>
            <p className="text-white/80">{isAdmin ? t('adminLogin') : t('studentLogin')}</p>
          </div>
          
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setIsAdmin(false)}
                className={`flex-1 py-4 px-6 text-center font-semibold relative ${
                  !isAdmin ? 'text-orange-600' : 'text-gray-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{t('studentLogin')}</span>
                </div>
                {!isAdmin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
              </button>
              <button
                onClick={() => setIsAdmin(true)}
                className={`flex-1 py-4 px-6 text-center font-semibold relative ${
                  isAdmin ? 'text-orange-600' : 'text-gray-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>{t('adminLogin')}</span>
                </div>
                {isAdmin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {isAdmin ? t('username') : t('name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={isAdmin ? formData.username : formData.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      [isAdmin ? 'username' : 'name']: e.target.value 
                    })}
                    placeholder={isAdmin ? t('username') : t('name')}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t('password')}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>{t('login')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          <p className="text-center mt-8 text-white/70 text-sm">© 2024 {t('appName')}</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;