// components/product/QuickViewModal/QuickViewModal.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, Shield, Heart, Minus, Plus, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';

export const QuickViewModal = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  isOpen = false,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setActiveImage(0);
  }, [product]);

  if (!product) return null;

  const images = product.images || ['/images/placeholder.png'];
  const currentImage = images[activeImage] || images[0];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.round(rating || 0) ? 'text-[#d4af37] fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
      className="p-0"
    >
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 text-gray-700 flex items-center justify-center transition-colors border border-rose-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Left Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-rose-50/50 border border-rose-100 p-4 flex items-center justify-center overflow-hidden relative">
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                }}
              />
              
              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product._id)}
                className={`absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md ${
                  isWishlisted ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-[#d9006c]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-gray-900 font-extrabold text-sm px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3 justify-center">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`
                      w-14 h-14 rounded-xl border-2 p-1 overflow-hidden transition-all
                      ${activeImage === index 
                        ? 'border-[#d9006c] ring-2 ring-rose-200' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="flex flex-col justify-between space-y-4">
            
            <div>
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" size="sm">
                  {product.category?.name || product.category || 'Uncategorized'}
                </Badge>
                {product.tags?.slice(0, 2).map((tag, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Link href={`/products/${product.slug}`} onClick={onClose}>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight hover:text-[#d9006c] transition-colors">
                  {product.name}
                </h2>
              </Link>

              {product.subtitle && (
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {product.subtitle}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                {renderStars(product.rating || 0)}
                <span className="text-xs font-medium text-gray-700">
                  {product.rating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-xs text-gray-400">
                  ({product.reviewsCount || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mt-3">
                <span className="text-2xl font-extrabold text-[#d9006c]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="gold" size="sm">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed mt-3 border-t border-rose-100 pt-3">
                {product.description}
              </p>

              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-1.5 pt-3">
                  {product.benefits.slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-gray-800">
                      <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center space-x-2 text-sm mt-3">
                {product.inStock ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-medium text-emerald-600">In Stock</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="font-medium text-red-600">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity and Add CTA */}
            <div className="pt-4 border-t border-rose-100 space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-rose-200 rounded-full bg-rose-50/50 px-3 py-1.5 space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="text-gray-600 hover:text-black font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-sm text-gray-900 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="text-gray-600 hover:text-black font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || added}
                  className="flex-1 py-3.5 text-sm flex items-center justify-center space-x-2"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart - {formatCurrency(product.price * quantity)}</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Free shipping on orders over $35</span>
                <span>30-Day Guarantee</span>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-center w-full text-xs font-medium text-[#d9006c] hover:underline"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                View Full Details
              </Link>
            </div>

          </div>
        </div>
      </div>
    </Modal>
  );
};