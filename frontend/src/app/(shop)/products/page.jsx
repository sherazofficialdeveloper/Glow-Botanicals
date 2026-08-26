// frontend/src/app/(shop)/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { Container } from '@/components/common/Container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductSort } from '@/components/product/ProductSort';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: searchParams?.get('category') || '',
    search: searchParams?.get('search') || '',
    sort: searchParams?.get('sort') || 'newest',
    minPrice: searchParams?.get('minPrice') || '',
    maxPrice: searchParams?.get('maxPrice') || '',
  });

  const { products, loading, pagination, refetch } = useProducts({
    page,
    limit: 12,
    ...filters,
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      category: searchParams?.get('category') || '',
      search: searchParams?.get('search') || '',
      sort: searchParams?.get('sort') || 'newest',
      minPrice: searchParams?.get('minPrice') || '',
      maxPrice: searchParams?.get('maxPrice') || '',
    });
    setPage(1);
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistedIds = wishlist?.map(p => p._id) || [];

  return (
    <>
      <Container className="py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6" />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {filters.search ? `Results for "${filters.search}"` : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total || 0} products found
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <ProductSort />
              <span className="text-sm text-gray-500 hidden sm:block">
                Showing {products.length} of {pagination.total} products
              </span>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner text="Loading products..." />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      category: '',
                      search: '',
                      sort: 'newest',
                      minPrice: '',
                      maxPrice: '',
                    });
                    setPage(1);
                  }}
                  className="mt-4 text-[#d9006c] font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={addItem}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlistedIds.includes(product._id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}