// app/(shop)/categories/page.jsx
'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';

export default function CategoriesPage() {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <Container className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner text="Loading categories..." />
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <SectionHeader
        title="Shop by Category"
        subtitle="Browse our products by category"
        align="center"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {categories?.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-video bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center text-4xl">
                  {category.name?.charAt(0) || '📂'}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#d9006c] transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {category.products || 0} products
              </p>
            </div>
          </Link>
        ))}
      </div>

      {(!categories || categories.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found</p>
        </div>
      )}
    </Container>
  );
}