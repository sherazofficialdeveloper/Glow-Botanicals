// components/checkout/OrderSummary/OrderSummary.jsx
'use client';

import { useState } from 'react';
import { Truck, ShieldCheck, Sparkles, ChevronDown, ChevronUp, Tag, X, Loader } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/contexts/CartContext';
import { couponService } from '@/services/couponService';

export const OrderSummary = ({
  showItems = true,
  showShipping = true,
  showCoupon = false,
  onCouponChange,
  className = '',
}) => {
  const { items, subtotal, totalItems } = useCart();
  const [showDetails, setShowDetails] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validating, setValidating] = useState(false);

  // Shipping calculation
  const freeShippingThreshold = 35.00;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 5.99;

  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percentage'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value;
    if (appliedCoupon.maxDiscount) {
      discount = Math.min(discount, appliedCoupon.maxDiscount);
    }
    discount = Math.min(discount, subtotal);
  }

  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setValidating(true);
    setCouponError('');
    try {
      const { coupon } = await couponService.validateCoupon(couponInput.trim());
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        setCouponError(`This coupon requires a minimum order of ${formatCurrency(coupon.minPurchase)}`);
        return;
      }
      setAppliedCoupon(coupon);
      if (onCouponChange) onCouponChange(coupon.code);
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid or expired coupon code');
      setAppliedCoupon(null);
      if (onCouponChange) onCouponChange(null);
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    if (onCouponChange) onCouponChange(null);
  };

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center ${className}`}>
        <p className="text-sm text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

      {/* Items Count */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Items ({totalItems})</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {/* Show/Hide Items */}
      {showItems && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3"
        >
          {showDetails ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
          {showDetails ? 'Hide items' : 'Show items'}
        </button>
      )}

      {showDetails && showItems && (
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

        {appliedCoupon && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount ({appliedCoupon.code})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        
        {showShipping && (
          <div className="flex justify-between text-gray-600">
            <div className="flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping</span>
            </div>
            <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      {/* Coupon Code */}
      {showCoupon && (
        <div className="border-t border-gray-100 pt-3 mt-3">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-emerald-700 font-medium">
                <Tag className="w-4 h-4" />
                <span>{appliedCoupon.code} applied</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-emerald-600 hover:text-emerald-800"
                aria-label="Remove coupon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex space-x-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
              />
              <button
                type="submit"
                disabled={validating || !couponInput.trim()}
                className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center"
              >
                {validating ? <Loader className="w-4 h-4 animate-spin" /> : 'Apply'}
              </button>
            </form>
          )}
          {couponError && (
            <p className="text-xs text-red-600 mt-1.5">{couponError}</p>
          )}
        </div>
      )}

      {/* Total */}
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="flex justify-between font-extrabold text-gray-900 text-lg">
          <span>Total</span>
          <span className="text-[#d9006c]">{formatCurrency(total)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Taxes included
        </p>
      </div>

      {/* Free Shipping Progress */}
      {showShipping && subtotal < freeShippingThreshold && (
        <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 mb-1.5">
            <Truck className="w-4 h-4 text-[#d9006c]" />
            <span>
              Add <strong className="text-[#d9006c]">${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for FREE Shipping!
            </span>
          </div>
          <div className="w-full h-1.5 bg-rose-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] transition-all duration-500 rounded-full"
              style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
            />
          </div>
        </div>
      )}

      {showShipping && subtotal >= freeShippingThreshold && (
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
            <Truck className="w-4 h-4" />
            <span>🎉 Free Express Shipping Unlocked!</span>
          </div>
        </div>
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
        <span>•</span>
        <span>COD Available</span>
      </div>
    </div>
  );
};