// components/cart/CartEmpty/CartEmpty.jsx
'use client';

import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useRouter } from 'next/navigation';

export const CartEmpty = ({ onClose }) => {
  const router = useRouter();

  const handleShopNow = () => {
    router.push('/products');
    if (onClose) onClose();
  };

  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-20 h-20 rounded-full bg-rose-50 text-[#d9006c] flex items-center justify-center mx-auto">
        <ShoppingBag className="w-10 h-10" />
      </div>
      
      <div>
        <h4 className="text-lg font-bold text-gray-900">Your cart is empty</h4>
        <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
          Explore our luxury botanical formulas and start your 3-minute glow routine today.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Button onClick={handleShopNow} className="px-8">
          <Sparkles className="w-4 h-4 mr-2" />
          Shop Best Sellers
        </Button>
        
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      {/* Recommended Products Placeholder */}
      <div className="pt-4 border-t border-gray-100 mt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          You might also like
        </p>
        <div className="flex justify-center space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};