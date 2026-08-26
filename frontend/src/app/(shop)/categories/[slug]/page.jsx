// app/(shop)/categories/[slug]/page.jsx
'use client';

import { useParams } from 'next/navigation';
import { useCategory } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Container } from '@/components/common/Container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const { category, loading: categoryLoading } = useCategory(slug);
  const { products, loading: productsLoading } = useProducts({
    category: category?._id,
    limit: 24,
  });
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  if (categoryLoading) {
    return (
      <Container className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner text="Loading category..." />
      </Container>
    );
  }

  if (!category) {
    return (
      <Container className="min-h-[400px] flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Category Not Found</h2>
        <p className="text-gray-500 mt-2">The category you're looking for doesn't exist.</p>
        <a href="/categories" className="mt-4 text-[#d9006c] font-bold hover:underline">
          Browse All Categories →
        </a>
      </Container>
    );
  }

  const wishlistedIds = wishlist?.map(p => p._id) || [];

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb className="mb-6" />

      {/* Category Header */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-24 h-24 rounded-2xl object-cover border border-white shadow-md"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 mt-1">{category.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {products.length} products in this category
            </p>
          </div>
        </div>
      </div>

      <ProductGrid
        products={products}
        loading={productsLoading}
        onAddToCart={addItem}
        wishlistedIds={wishlistedIds}
        onToggleWishlist={toggleWishlist}
        title=""
        subtitle=""
        columns={3}
      />
    </Container>
  );
}