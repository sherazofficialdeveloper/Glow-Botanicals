// components/cart/CartItem/CartItem.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, X } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(product._id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(product._id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsRemoving(false);
    }
  };

  const imageUrl = product.images?.[0] || '/images/placeholder.png';

  return (
    <div
      className={`flex space-x-4 p-3 bg-white rounded-xl border border-rose-100 shadow-sm relative group transition-opacity ${
        isRemoving ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="w-20 h-20 flex-shrink-0 rounded-lg bg-rose-50/50 p-1 overflow-hidden border border-rose-100"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = '/images/placeholder.png';
          }}
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h4 className="text-xs font-bold text-gray-900 line-clamp-2 hover:text-[#d9006c] transition-colors">
              {product.name}
            </h4>
          </Link>
          <p className="text-[11px] text-gray-500 font-medium">
            {product.volume || 'Standard Size'}
          </p>
          <p className="text-xs font-extrabold text-[#d9006c] mt-0.5">
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Quantity Controls */}
          <div className="flex items-center border border-rose-200 rounded-full bg-white px-2 py-0.5 space-x-2 text-xs">
            <button
              onClick={() => handleUpdateQuantity(-1)}
              disabled={isUpdating || quantity <= 1}
              className="text-gray-500 hover:text-black p-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold text-gray-900 min-w-[14px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(1)}
              disabled={isUpdating}
              className="text-gray-500 hover:text-black p-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Item Total & Remove */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-gray-900">
              {formatCurrency(product.price * quantity)}
            </span>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-gray-400 hover:text-rose-600 transition-colors p-1 disabled:opacity-40"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      {!product.inStock && (
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            Out of Stock
          </span>
        </div>
      )}

      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#d9006c] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};