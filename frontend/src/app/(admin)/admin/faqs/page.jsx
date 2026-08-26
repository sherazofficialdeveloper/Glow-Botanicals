// app/(admin)/admin/faqs/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, GripVertical, Search } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { useFAQ } from '@/hooks/useFAQ';

export default function AdminFAQsPage() {
  const { showToast } = useToast();
  const { faqs, loading, refetch } = useFAQ();
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id) => {
    try {
      await adminService.deleteFAQ(id);
      showToast('FAQ deleted successfully', 'success');
      refetch();
      setDeleteId(null);
    } catch (error) {
      showToast('Failed to delete FAQ', 'error');
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      faq.question?.toLowerCase().includes(query) ||
      faq.answer?.toLowerCase().includes(query) ||
      faq.category?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      key: 'question',
      label: 'Question & Answer',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">{row.question}</div>
          <div className="text-xs text-gray-500 line-clamp-2 max-w-md">{row.answer}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <Badge variant="secondary" size="sm">
          {row.category || 'General'}
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
            href={`/admin/faqs/edit/${row._id}`}
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
          <div className="p-1.5 text-gray-300 cursor-grab">
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-sm text-gray-500">Manage frequently asked questions</p>
        </div>
        <Link
          href="/admin/faqs/add"
          className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search FAQs..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
        />
      </div>

      <DataTable
        data={filteredFaqs}
        columns={columns}
        loading={loading}
        emptyMessage={searchQuery ? 'No FAQs match your search' : 'No FAQs found. Add your first FAQ!'}
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete FAQ</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this FAQ? This action cannot be undone.
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