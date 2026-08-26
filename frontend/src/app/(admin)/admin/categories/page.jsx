// app/(admin)/admin/categories/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Badge } from '@/components/common/Badge';

export default function AdminCategoriesPage() {
  const { categories, loading, refetch } = useCategories();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCategory(id);
      showToast('Category deleted successfully', 'success');
      refetch();
      setDeleteId(null);
    } catch (error) {
      showToast('Failed to delete category', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.slug}</div>
        </div>
      ),
    },
    {
      key: 'products',
      label: 'Products',
      render: (row) => (
        <Badge variant="secondary" size="sm">
          {row.products || 0} products
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'} size="sm">
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/categories/edit/${row._id}`}
            className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">Manage product categories</p>
        </div>
        <Link
          href="/admin/categories/add"
          className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Link>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
        emptyMessage="No categories found"
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Category</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}