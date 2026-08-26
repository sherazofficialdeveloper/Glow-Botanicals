// frontend/src/components/Toast/ToastContainer.jsx
'use client';

import { Toast } from './Toast.jsx';

export const ToastContainer = ({ toasts = [], position = 'bottom-right' }) => {
  if (toasts.length === 0) return null;

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`
        fixed z-50 flex flex-col space-y-3 pointer-events-none
        ${positionStyles[position] || positionStyles['bottom-right']}
      `}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => {}} // Will be handled by parent
          />
        </div>
      ))}
    </div>
  );
};