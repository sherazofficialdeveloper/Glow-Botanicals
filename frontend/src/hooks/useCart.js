// frontend/src/hooks/useCart.js
'use client';

import { useCart as useCartContext } from '@/contexts/CartContext';

export const useCart = () => {
  return useCartContext();
};

export default useCart;