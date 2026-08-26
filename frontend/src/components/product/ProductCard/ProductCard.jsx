// frontend/src/components/product/ProductCard.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const imageUrl = product.images?.[0] || '/images/placeholder.png';
  const secondaryImage = product.images?.[1] || imageUrl;
  const tags = product.tags?.length >= 2 ? product.tags.slice(0, 2) : ['Multi-Action', 'Deep Nourish'];

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist(product._id);
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[#f8f8fb] rounded-3xl border border-gray-200/60 hover:border-rose-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xs transition-all ${
          isWishlisted ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-[#d9006c] hover:bg-white'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-20 bg-[#d9006c] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
          -{discountPercent}%
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="relative h-60 w-full overflow-hidden bg-gradient-to-b from-white/90 to-[#f3f3f8] p-6 flex items-center justify-center">
        <img
          src={isHovered && secondaryImage ? secondaryImage : imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = '/images/placeholder.png'; }}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-extrabold text-sm px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-[#f8f8fb]">
        <div className="space-y-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-[#d9006c] transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {tags.map((tag, idx) => (
              <span key={idx} className="inline-block bg-pink-50 text-[#d9006c] text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md border border-pink-100/80">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-normal line-clamp-2 pt-1">
            {product.description?.substring(0, 80)}...
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-lg font-extrabold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center space-x-1.5 ${
              !product.inStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
              added ? 'bg-emerald-600 text-white' : 'bg-[#d9006c] hover:bg-[#a80052] text-white hover:shadow-md active:scale-95'
            }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{added ? 'Added' : (!product.inStock ? 'Out of Stock' : 'Buy Now')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};