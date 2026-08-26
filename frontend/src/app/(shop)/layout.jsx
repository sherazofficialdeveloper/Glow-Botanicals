// frontend/src/app/(shop)/layout.jsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/SearchModal';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  // Check if current route is admin or auth (these have their own layouts)
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/login') || 
                      pathname?.startsWith('/register') || 
                      pathname?.startsWith('/forgot-password') ||
                      pathname?.startsWith('/reset-password') ||
                      pathname?.startsWith('/verify-email');

  // Don't show header/footer on admin and auth pages
  if (isAdminRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // Get wishlist count
  const wishlistCount = wishlist?.length || 0;

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      
      <main className="min-h-screen">
        {children}
      </main>
      
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={items}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={[]}
        onSelectProduct={() => {}}
      />
    </div>
  );
}