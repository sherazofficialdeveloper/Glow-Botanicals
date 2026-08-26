// frontend/src/components/Toast/Toast.jsx
'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react';

export const Toast = ({ id, message, type = 'info', duration = 4000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const types = {
    success: {
      icon: CheckCircle,
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      progressBg: 'bg-emerald-500',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      progressBg: 'bg-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      iconColor: 'text-amber-500',
      progressBg: 'bg-amber-500',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-500',
      progressBg: 'bg-blue-500',
    },
    glow: {
      icon: Sparkles,
      bg: 'bg-rose-50 border-rose-200',
      text: 'text-rose-800',
      iconColor: 'text-[#d9006c]',
      progressBg: 'bg-[#d9006c]',
    },
  };

  const toastType = types[type] || types.info;
  const Icon = toastType.icon;

  useEffect(() => {
    if (duration === 0) return;

    const startTime = Date.now();
    const interval = 50;
    const totalSteps = duration / interval;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleClose();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={`
        relative max-w-sm w-full rounded-xl shadow-lg border p-4
        ${toastType.bg}
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 transform scale-95 translate-y-2' : 'opacity-100 transform scale-100 translate-y-0'}
      `}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 mt-0.5 ${toastType.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${toastType.text}`}>
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${toastType.progressBg}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};