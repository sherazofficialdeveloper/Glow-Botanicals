// app/(admin)/admin/coupons/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Tag, Calendar, Percent } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { formatCurrency } from '@/utils/formatters';

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCoupons();
      setCoupons(data);
    } catch (error) {
      showToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCoupon(id);
      showToast('Coupon deleted successfully', 'success');
      fetchCoupons();
      setDeleteId(null);
    } catch (error) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  const columns = [
    {
      key: 'code',
      label: 'Coupon Code',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-[#d9006c] text-sm uppercase bg-rose-50 px-3 py-1 rounded-full inline-block">
            {row.code}
          </div>
        </div>
      ),
    },
    {
      key: 'discount',
      label: 'Discount',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <Percent className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-gray-900">{row.discount}%</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge variant="secondary" size="sm">
          {row.type || 'Percentage'}
        </Badge>
      ),
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.usedCount || 0} / {row.usageLimit || '∞'}
        </div>
      ),
    },
    {
      key: 'validity',
      label: 'Valid Until',
      render: (row) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : 'Never'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isExpired = row.expiryDate && new Date(row.expiryDate) < new Date();
        return (
          <Badge variant={isExpired ? 'danger' : (row.isActive ? 'success' : 'warning')} size="sm">
            {isExpired ? 'Expired' : (row.isActive ? 'Active' : 'Inactive')}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/coupons/edit/${row._id}`}
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
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">Manage discount coupons</p>
        </div>
        <Link
          href="/admin/coupons/add"
          className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coupon</span>
        </Link>
      </div>

      <DataTable
        data={coupons}
        columns={columns}
        loading={loading}
        emptyMessage="No coupons found. Add your first coupon!"
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Coupon</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this coupon? This action cannot be undone.
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