// components/admin/ProductTable/ProductTable.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, MoreVertical } from 'lucide-react';
import { DataTable } from '../DataTable';
import { Badge } from '@/components/common/Badge';

export const ProductTable = ({
  products,
  loading,
  pagination,
  onSearch,
  onDelete,
  onPageChange,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={row.images?.[0] || '/images/placeholder.png'}
            alt={row.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {row.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">${row.price?.toFixed(2)}</div>
          {row.originalPrice && (
            <div className="text-xs text-gray-400 line-through">
              ${row.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <Badge variant="secondary" size="sm">
          {row.category?.name || row.category || 'Uncategorized'}
        </Badge>
      ),
    },
    {
      key: 'inStock',
      label: 'Stock',
      render: (row) => (
        <Badge
          variant={row.inStock ? 'success' : 'danger'}
          size="sm"
        >
          {row.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/products/edit/${row._id}`}
            onClick={(event) => event.stopPropagation()}
            className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <Link
            href={`/products/${row.slug}`}
            target="_blank"
            onClick={(event) => event.stopPropagation()}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={(event) => {
              event.stopPropagation();
              setShowDeleteModal(row._id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onSearch={onSearch}
        searchPlaceholder="Search products..."
        emptyMessage="No products found. Add your first product!"
        onRowClick={(row) => window.location.href = `/admin/products/edit/${row._id}`}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Product
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(showDeleteModal);
                  setShowDeleteModal(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
