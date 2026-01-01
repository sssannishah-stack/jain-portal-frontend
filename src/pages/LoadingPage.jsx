import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6 animate-pulse">
          <span className="text-4xl">🙏</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className="text-white text-lg font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;