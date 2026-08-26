// app/(admin)/admin/before-after/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Image, Eye } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

export default function AdminBeforeAfterPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await adminService.getBeforeAfter();
      setItems(data);
    } catch (error) {
      showToast('Failed to load before-after items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteBeforeAfter(id);
      showToast('Item deleted successfully', 'success');
      fetchItems();
      setDeleteId(null);
    } catch (error) {
      showToast('Failed to delete item', 'error');
    }
  };

  const columns = [
    {
      key: 'images',
      label: 'Images',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={row.before || '/images/placeholder-before.jpg'}
              alt="Before"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/placeholder-before.jpg';
              }}
            />
          </div>
          <span className="text-xs text-gray-400">→</span>
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={row.after || '/images/placeholder-after.jpg'}
              alt="After"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/placeholder-after.jpg';
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500 line-clamp-1">{row.description}</div>
        </div>
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
      key: 'order',
      label: 'Order',
      render: (row) => (
        <span className="text-sm text-gray-500">{row.order || 0}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/before-after/edit/${row._id}`}
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
          <h1 className="text-2xl font-bold text-gray-900">Before & After</h1>
          <p className="text-sm text-gray-500">Manage before-after transformation images</p>
        </div>
        <Link
          href="/admin/before-after/add"
          className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </Link>
      </div>

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        emptyMessage="No before-after items found"
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Item</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this before-after item? This action cannot be undone.
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