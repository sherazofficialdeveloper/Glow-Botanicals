// app/(admin)/admin/products/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { ProductTable } from '@/components/admin/ProductTable';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { products, loading, pagination, refetch } = useProducts({
    page,
    limit: 10,
    search,
  });
  const { showToast } = useToast();

  const handleDelete = async (productId) => {
    try {
      await adminService.deleteProduct(productId);
      showToast('Product deleted successfully', 'success');
      refetch();
    } catch (error) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Table */}
      <ProductTable
        products={products}
        loading={loading}
        pagination={{
          page: pagination.page,
          total: pagination.total,
          totalPages: pagination.totalPages,
          limit: pagination.limit,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        onDelete={handleDelete}
      />
    </div>
  );
}