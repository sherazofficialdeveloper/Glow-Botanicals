// components/cart/CartSummary/CartSummary.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';

export const CartSummary = ({ 
  showCheckout = true,
  showCoupon = true,
  className = '' 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, totalItems } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center ${className}`}>
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#d9006c] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h4 className="font-bold text-gray-900 mb-1">Your cart is empty</h4>
        <p className="text-sm text-gray-500 mb-4">Start shopping to see your items here</p>
        <Button onClick={() => router.push('/products')}>
          Shop Now
        </Button>
      </div>
    );
  }

  // Shipping calculation
  const freeShippingThreshold = 35.00;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal + shippingCost + tax - discount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Simulate coupon validation
    if (couponCode.toUpperCase() === 'GLOW15') {
      setCouponDiscount(subtotal * 0.15);
      setCouponApplied(true);
      // Show toast message
    } else {
      // Show error toast
      setCouponDiscount(0);
      setCouponApplied(false);
    }
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

      {/* Items Count */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Items ({totalItems})</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {/* Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3"
      >
        {showDetails ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
        {showDetails ? 'Hide details' : 'Show details'}
      </button>

      {showDetails && (
        <div className="space-y-2 text-sm border-t border-gray-100 pt-3 mb-3">
          {items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-gray-600">
              <span className="truncate max-w-[200px]">
                {item.quantity}x {item.product.name}
              </span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <div className="flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping</span>
          </div>
          <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        {couponApplied && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount ({couponCode.toUpperCase()})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="flex justify-between font-extrabold text-gray-900 text-lg">
          <span>Total</span>
          <span className="text-[#d9006c]">{formatCurrency(total)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Taxes and shipping calculated at checkout
        </p>
      </div>

      {/* Coupon Section */}
      {showCoupon && !couponApplied && (
        <div className="mt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim()}
              className="text-xs"
            >
              Apply
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Try code: <span className="font-mono font-bold">GLOW15</span> for 15% off
          </p>
        </div>
      )}

      {couponApplied && (
        <div className="mt-4 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <span className="text-xs font-medium text-emerald-700">
            ✓ Coupon applied ({couponCode.toUpperCase()})
          </span>
          <button
            onClick={handleRemoveCoupon}
            className="text-xs text-gray-400 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Checkout Button */}
      {showCheckout && (
        <Button
          onClick={() => router.push('/checkout')}
          className="w-full mt-4 py-3 text-sm"
        >
          Proceed to Checkout
        </Button>
      )}

      {/* Trust Badges */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-400">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Secure Checkout</span>
        </span>
        <span>•</span>
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>30-Day Guarantee</span>
        </span>
        <span>•</span>
        <span>Free Returns</span>
      </div>
    </div>
  );
};