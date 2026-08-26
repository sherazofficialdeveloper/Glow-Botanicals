// components/common/Toast/Toast.jsx
'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  className = '',
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      icon: CheckCircle,
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      iconColor: 'text-amber-500',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-500',
    },
  };

  const toastType = types[type] || types.info;
  const Icon = toastType.icon;

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 max-w-sm w-full 
        rounded-xl shadow-lg border p-4 
        animate-fadeIn
        ${toastType.bg}
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${toastType.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${toastType.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};