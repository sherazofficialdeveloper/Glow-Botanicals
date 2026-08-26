// app/(admin)/admin/products/edit/[id]/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { useToast } from '@/hooks/useToast';
import { useCategories } from '@/hooks/useCategories';
import { useProductById } from '@/hooks/useProduct';
import { adminService } from '@/services/adminService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  
  const { product, loading: productLoading, error: productError } = useProductById(id);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const handleSubmit = async (formData) => {
    try {
      await adminService.updateProduct(id, formData);
      showToast('Product updated successfully!', 'success');
      router.push('/admin/products');
    } catch (error) {
      showToast(error.message || 'Failed to update product', 'error');
      throw error;
    }
  };

  // Handle loading state
  if (productLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading product data..." />
      </div>
    );
  }

  // Handle categories error
  if (categoriesError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Error Loading Categories</h2>
        <p className="text-gray-500 mt-2">
          {categoriesError.message || 'Failed to load categories. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block mt-4 bg-[#d9006c] text-white px-4 py-2 rounded hover:bg-[#b8005a]"
        >
          Retry
        </button>
        <a href="/admin/products" className="inline-block mt-4 ml-3 text-[#d9006c] font-bold hover:underline">
          Back to Products
        </a>
      </div>
    );
  }

  // Handle product not found
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-500 mt-2">The product you're looking for doesn't exist.</p>
        <a href="/admin/products" className="inline-block mt-4 text-[#d9006c] font-bold hover:underline">
          Back to Products
        </a>
      </div>
    );
  }

  // Handle product error
  if (productError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Error Loading Product</h2>
        <p className="text-gray-500 mt-2">
          {productError.message || 'Failed to load product details. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block mt-4 bg-[#d9006c] text-white px-4 py-2 rounded hover:bg-[#b8005a]"
        >
          Retry
        </button>
        <a href="/admin/products" className="inline-block mt-4 ml-3 text-[#d9006c] font-bold hover:underline">
          Back to Products
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500">Update product information</p>
      </div>

      <ProductForm
        product={product}
        categories={categories || []}
        onSubmit={handleSubmit}
        loading={categoriesLoading}
      />
    </div>
  );
}
