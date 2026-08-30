// app/(admin)/admin/reviews/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Star, User, Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useReviews } from '@/hooks/useReviews';
import { useToast } from '@/hooks/useToast';
import { reviewService } from '@/services/reviewService';

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('pending');
  const { reviews, loading, pagination, refetch } = useReviews({
    page,
    limit: 10,
    status: filter,
    admin: true,
  });
  const { showToast } = useToast();

  const handleApprove = async (id) => {
    try {
      await reviewService.approveReview(id);
      showToast('Review approved successfully', 'success');
      refetch();
    } catch (error) {
      showToast('Failed to approve review', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await reviewService.rejectReview(id);
      showToast('Review rejected', 'info');
      refetch();
    } catch (error) {
      showToast('Failed to reject review', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;

    try {
      await reviewService.deleteReview(id);
      showToast('Review deleted successfully', 'success');
      refetch();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete review', 'error');
    }
  };
  const columns = [
    {
      key: 'user',
      label: 'Customer',
      render: (row) => (
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white font-bold text-xs">
              {row.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {row.user?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500">{row.user?.email}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'product',
      label: 'Product',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{row.product?.name}</p>
          <p className="text-xs text-gray-500">{row.product?.category}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < row.rating ? 'text-[#d4af37] fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'comment',
      label: 'Review',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900 font-medium">{row.text}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{row.text}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge
          variant={
            row.isApproved
              ? 'success'
              : row.isRejected
              ? 'danger'
              : 'warning'
          }
          size="sm"
        >
          {row.isApproved
            ? 'Approved'
            : row.isRejected
            ? 'Rejected'
            : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        return (
          <div className="flex items-center space-x-2">
            {!row.isApproved && !row.isRejected && (
              <>
                <button onClick={() => handleApprove(row._id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => handleReject(row._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
            <Link href={`/admin/reviews/${row._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit review">
              <Pencil className="w-4 h-4" />
            </Link>
            <button onClick={() => handleDelete(row._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete review">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500">Manage customer reviews</p>
        </div>
        <Link href="/admin/reviews/add">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['pending', 'approved', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => {
              setFilter(s);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
              filter === s
                ? 'bg-[#d9006c] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <DataTable
        data={reviews}
        columns={columns}
        loading={loading}
        pagination={{
          page: pagination.page,
          total: pagination.total,
          totalPages: pagination.totalPages,
          limit: pagination.limit,
          onPageChange: setPage,
        }}
        emptyMessage="No reviews found"
      />
    </div>
  );
}