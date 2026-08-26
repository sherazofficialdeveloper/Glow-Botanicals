// components/product/ProductDetails/ProductDetails.jsx
'use client';

import { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  Shield,
  Truck,
  RefreshCw,
  Minus,
  Plus,
  Share2,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/hooks/useToast';

export const ProductDetails = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className = '',
}) => {
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Glowly Botanical!`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast('Link copied to clipboard!', 'success');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-[#d4af37] fill-current" />
        ))}
        {halfStar && (
          <Star className="w-4 h-4 text-[#d4af37] fill-current" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${className}`}>
      
      {/* Left: Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square rounded-2xl bg-rose-50/50 border border-rose-100 p-4 flex items-center justify-center overflow-hidden relative">
          <img
            src={currentImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-extrabold text-lg px-6 py-3 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`
                  w-20 h-20 rounded-xl border-2 p-1 overflow-hidden transition-all flex-shrink-0
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

      {/* Right: Product Info */}
      <div className="space-y-6">
        {/* Category & Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" size="sm">
            {product.category?.name || product.category || 'Uncategorized'}
          </Badge>
          {product.tags?.map((tag, idx) => (
            <Badge key={idx} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
          {product.name}
        </h1>

        {product.subtitle && (
          <p className="text-sm text-gray-500 font-medium">
            {product.subtitle}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-3">
          {renderStars(product.rating || 0)}
          <span className="text-sm font-medium text-gray-700">
            {product.rating?.toFixed(1) || '0.0'}
          </span>
          <span className="text-sm text-gray-400">
            ({product.reviewsCount || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-extrabold text-[#d9006c]">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg font-semibold text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          {product.originalPrice && (
            <Badge variant="gold" size="sm">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Volume / Size */}
        {product.volume && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Size:</span> {product.volume}
          </p>
        )}

        {/* Description */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Benefits */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900">Key Benefits</h4>
            <ul className="space-y-1.5">
              {product.benefits.slice(0, 4).map((benefit, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center space-x-2 text-sm">
          {product.inStock ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-emerald-600">In Stock</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="font-medium text-red-600">Out of Stock</span>
            </>
          )}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
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

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center flex-1 px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  Share
                </>
              )}
            </button>
            <button
              onClick={onToggleWishlist}
              className={`
                flex items-center justify-center flex-1 px-4 py-2 border rounded-lg text-xs font-medium transition-colors
                ${isWishlisted 
                  ? 'border-rose-200 bg-rose-50 text-rose-600' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <Heart className={`w-3.5 h-3.5 mr-1.5 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-[10px] font-medium text-gray-600">100% Safe</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] font-medium text-gray-600">Free Shipping</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <RefreshCw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-[10px] font-medium text-gray-600">30-Day Return</p>
          </div>
        </div>

      </div>
    </div>
  );
};