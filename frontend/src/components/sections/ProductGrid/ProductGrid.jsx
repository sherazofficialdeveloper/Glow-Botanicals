// frontend/src/components/sections/ProductGrid/ProductGrid.jsx
'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const ProductGrid = ({
  products = [],
  loading = false,
  onAddToCart,
  wishlistedIds = [],
  onToggleWishlist,
  title = 'Featured Collection',
  subtitle = 'Whitening • Brightening • Deep Hydration • Pore Tightening',
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner text="Loading products..." />
          </div>
        </div>
      </section>
    );
  }

  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category?.name || p.category).filter(Boolean))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => (p.category?.name === selectedCategory || p.category === selectedCategory));

  return (
    <section id="products" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-200 text-[#d9006c] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            <span className="text-[#d4af37]">✦</span>
            <span>Botanical Beauty & Skincare</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 font-medium">{subtitle}</p>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#d9006c] text-white shadow-md'
                      : 'bg-rose-50/80 text-gray-700 hover:bg-rose-100 hover:text-[#d9006c]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistedIds.includes(product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;