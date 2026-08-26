// components/product/ProductGrid/ProductGrid.jsx
'use client';

import { useState } from 'react';
import { ProductCard } from '../ProductCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Pagination } from '@/components/common/Pagination';
import { ProductFilters } from '../ProductFilters';
import { ProductSort } from '../ProductSort';

export const ProductGrid = ({
  products = [],
  loading = false,
  onAddToCart,
  wishlistedIds = [],
  onToggleWishlist,
  onQuickView,
  title = 'Featured Collection',
  subtitle = 'Whitening • Brightening • Deep Hydration • Pore Tightening',
  showFilters = false,
  showSort = false,
  showPagination = false,
  pagination = null,
  onPageChange = null,
  className = '',
  columns = 4,
}) => {
  const [viewMode, setViewMode] = useState('grid');

  const getColumnsClass = () => {
    const classes = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };
    return classes[columns] || classes[4];
  };

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

  return (
    <section id="products" className={`py-16 lg:py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Botanical Beauty & Skincare"
          title={title}
          subtitle={subtitle}
        />

        {/* Filters and Sort */}
        {(showFilters || showSort) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {showFilters && <ProductFilters />}
            {showSort && <ProductSort />}
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-lg font-bold text-gray-900">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className={`grid ${getColumnsClass()} gap-6 sm:gap-8`}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                isWishlisted={wishlistedIds?.includes(product._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {showPagination && pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}

        {/* Bottom Callout */}
        {products.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-rose-500/10 via-rose-100/50 to-amber-500/10 rounded-2xl p-6 sm:p-8 border border-rose-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Need Help Choosing Your Skincare Ritual?
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Our botanical experts are standing by 24/7 to match your skin goals.
              </p>
            </div>
            <a
              href="/contact"
              className="bg-[#d9006c] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#a80052] transition-colors shadow-sm shrink-0"
            >
              Consult Skincare Expert
            </a>
          </div>
        )}

      </div>
    </section>
  );
};