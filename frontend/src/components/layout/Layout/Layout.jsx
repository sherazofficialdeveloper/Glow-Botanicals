// components/layout/Layout/Layout.jsx
'use client';

import { useState } from 'react';
import { AnnouncementBar } from '../AnnouncementBar';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/SearchModal';

export const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <main className="min-h-screen">{children}</main>
      <Footer />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};