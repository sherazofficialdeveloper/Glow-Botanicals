// frontend/src/app/error.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Something Went Wrong
        </h1>
        
        {/* Error Message */}
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        
        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={reset}
            className="w-full bg-[#d9006c] text-white px-4 py-2.5 sm:py-3 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full text-sm text-gray-500 hover:text-[#d9006c] transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>
          
          <button
            onClick={() => router.back()}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}