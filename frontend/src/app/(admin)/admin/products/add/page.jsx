// app/(admin)/admin/products/add/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { useToast } from '@/hooks/useToast';
import { useCategories } from '@/hooks/useCategories';
import { adminService } from '@/services/adminService';

export default function AddProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();

  const handleSubmit = async (formData) => {
    try {
      await adminService.createProduct(formData);
      showToast('Product created successfully!', 'success');
      router.push('/admin/products');
    } catch (error) {
      showToast(error.message || 'Failed to create product', 'error');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500">Create a new product for your store</p>
      </div>

      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        loading={categoriesLoading}
      />
    </div>
  );
}