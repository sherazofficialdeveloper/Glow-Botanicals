// components/dashboard/Wishlist/Wishlist.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, Star, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';

export const Wishlist = ({ className = '' }) => {
  const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [addingToCart, setAddingToCart] = useState({});

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center ${className}`}>
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-[#d9006c]" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">Your Wishlist is Empty</h4>
        <p className="text-gray-500 max-w-sm mx-auto">
          Save your favorite products here. Start exploring our collection!
        </p>
        <Link href="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = async (product) => {
    setAddingToCart((prev) => ({ ...prev, [product._id]: true }));
    try {
      await addItem(product);
      showToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      showToast('Removed from wishlist', 'info');
    } catch (error) {
      showToast('Failed to remove', 'error');
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            My Wishlist ({wishlist.length})
          </h3>
          <p className="text-sm text-gray-500">Your saved favorite products</p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((product) => {
          const imageUrl = product.images?.[0] || '/images/placeholder.png';

          return (
            <div
              key={product._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              {/* Image */}
              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center relative">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(product._id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>

              {/* Details */}
              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1 hover:text-[#d9006c] transition-colors">
                    {product.name}
                  </h4>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  {product.category?.name || product.category}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mt-1.5">
                  <div className="flex text-[#d4af37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviewsCount || 0})
                  </span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="font-extrabold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart[product._id]}
                    className="text-xs"
                  >
                    {addingToCart[product._id] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};