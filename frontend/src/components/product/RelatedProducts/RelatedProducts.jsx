// components/product/RelatedProducts/RelatedProducts.jsx
'use client';

import { ProductCard } from '../ProductCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const RelatedProducts = ({
  products = [],
  loading = false,
  onAddToCart,
  wishlistedIds = [],
  onToggleWishlist,
  onQuickView,
  title = 'You May Also Like',
  className = '',
}) => {
  if (loading) {
    return (
      <section className={`py-12 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner text="Loading related products..." />
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={title}
          subtitle="Customers who bought this also loved these"
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
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
      </div>
    </section>
  );
};