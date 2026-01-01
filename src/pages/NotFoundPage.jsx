import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>{t('home')}</span>
        </a>
      </div>
    </div>
  );
}

export default NotFoundPage;