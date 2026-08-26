// app/(shop)/cart/page.jsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';
import { formatCurrency } from '@/utils/formatters';

export default function CartPage() {
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

  const freeShippingThreshold = 35.00;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shippingCost + tax;

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (isLoading) {
    return (
      <Container className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#d9006c] border-t-transparent rounded-full animate-spin"></div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-rose-50 text-[#d9006c] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Looks like you haven't added any items to your cart yet. 
            Start shopping to find your perfect glow!
          </p>
          <Link href="/products" className="inline-block mt-6">
            <Button className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Start Shopping</span>
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4"
            >
              {/* Product Image */}
              <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images?.[0] || '/images/placeholder.png'}
                  alt={item.product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-bold text-gray-900 hover:text-[#d9006c] transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">{item.product.volume || ''}</p>
                <p className="text-sm font-bold text-[#d9006c] mt-1">
                  {formatCurrency(item.product.price)}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-full px-3 py-0.5">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-gray-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
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
            </div>

            {/* Free Shipping Progress */}
            {subtotal < freeShippingThreshold && (
              <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 mb-1.5">
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

            {/* Total */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span className="text-[#d9006c]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full mt-4 py-3 text-sm flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <Sparkles className="w-4 h-4" />
            </Button>

            {/* Trust Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-400">
              <span>🔒 Secure Checkout</span>
              <span>•</span>
              <span>✨ 30-Day Guarantee</span>
              <span>•</span>
              <span>🚚 Free Returns</span>
            </div>

            <Link
              href="/products"
              className="block mt-4 text-center text-sm text-gray-500 hover:text-[#d9006c] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}