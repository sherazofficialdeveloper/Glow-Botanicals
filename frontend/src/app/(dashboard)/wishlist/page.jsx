// app/(dashboard)/wishlist/page.jsx
'use client';

import { Wishlist } from '@/components/dashboard/Wishlist';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-sm text-gray-500">
          {wishlist?.length || 0} items saved for later
        </p>
      </div>

      <Wishlist />
    </div>
  );
}