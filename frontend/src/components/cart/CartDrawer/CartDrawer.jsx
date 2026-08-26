// components/cart/CartDrawer/CartDrawer.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '../CartItem';
import { CartEmpty } from '../CartEmpty';
import { Button } from '@/components/common/Button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';

export const CartDrawer = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    items, 
    totalItems, 
    subtotal, 
    total,
    removeItem, 
    updateQuantity,
    clearCart,
    isLoading 
  } = useCart();
  
  const [orderNote, setOrderNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Free shipping threshold
  const freeShippingThreshold = 35.00;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      if (!user) {
        router.push('/checkout');
      } else {
        router.push('/checkout');
      }
      onClose();
      setIsCheckingOut(false);
    }, 500);
  };

  if (!isOpen) return null;

  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = subtotal + shippingCost + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#d9006c]" />
              <h3 className="font-extrabold text-base text-gray-900 uppercase tracking-wider">
                Shopping Cart ({totalItems})
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-rose-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Free Shipping Meter */}
          {items.length > 0 && (
            <div className="px-6 py-3 bg-[#fff0f5] border-b border-rose-100">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 mb-1.5">
                <Truck className="w-4 h-4 text-[#d9006c]" />
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-extrabold">
                      🎉 Free Express Shipping Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#d9006c]">${remainingForFreeShipping.toFixed(2)}</strong> more for FREE Shipping!
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full h-2 bg-rose-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-[#d9006c] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <CartEmpty onClose={onClose} />
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-rose-100 bg-rose-50/20 space-y-4">
              
              {/* Order Note Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="text-xs font-bold text-gray-600 hover:text-[#d9006c] underline uppercase tracking-wider"
                >
                  {showNoteInput ? '- Hide Order Note' : '+ Add Special Order Note'}
                </button>
                {showNoteInput && (
                  <textarea
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Enter gift message or special instructions..."
                    className="w-full mt-2 bg-white border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#d9006c] focus:ring-1 focus:ring-[#d9006c]"
                  />
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-rose-100 pt-2 mt-2 flex justify-between font-extrabold text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-[#d9006c]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500">
                Taxes and shipping calculated at checkout.
              </p>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 text-sm flex items-center justify-center space-x-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed To Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              {/* Trust Badge */}
              <div className="flex items-center justify-center space-x-4 text-[10px] text-gray-400">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>Secure Checkout</span>
                </span>
                <span>•</span>
                <span>30-Day Guarantee</span>
                <span>•</span>
                <span>Free Returns</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};