// frontend/src/hooks/useWishlist.js
'use client';

import { useWishlist as useWishlistContext } from '@/contexts/WishlistContext';

export const useWishlist = () => {
  return useWishlistContext();
};

export default useWishlist;