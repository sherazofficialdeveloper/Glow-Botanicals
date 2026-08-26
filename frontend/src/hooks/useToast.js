// frontend/src/hooks/useToast.js
'use client';

import { useToast as useToastContext } from '@/contexts/ToastContext';

export const useToast = () => {
  return useToastContext();
};

export default useToast;