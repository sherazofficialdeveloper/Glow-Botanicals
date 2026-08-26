// components/product/AddToCart/AddToCart.jsx
'use client';

import { useState } from 'react';
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';

export const AddToCart = ({
  product,
  onAddToCart,
  quantity = 1,
  showQuantity = true,
  className = '',
  buttonText = 'Add to Cart',
  fullWidth = false,
  disabled = false,
}) => {
  const [qty, setQty] = useState(quantity);
  const [added, setAdded] = useState(false);

  const handleQuantityChange = (delta) => {
    const newQuantity = qty + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQty(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showQuantity && (
        <div className="flex items-center border border-rose-200 rounded-full bg-rose-50/50 px-3 py-1.5 space-x-4 flex-shrink-0">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={qty <= 1}
            className="text-gray-600 hover:text-black font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-gray-900 min-w-[20px] text-center">
            {qty}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={qty >= 10}
            className="text-gray-600 hover:text-black font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={disabled || added || !product?.inStock}
        fullWidth={fullWidth}
        className="flex-1 py-3.5 text-sm flex items-center justify-center space-x-2"
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>
              {!product?.inStock ? 'Out of Stock' : buttonText}
              {product && product.inStock && ` - ${formatCurrency(product.price * qty)}`}
            </span>
          </>
        )}
      </Button>
    </div>
  );
};