// app/(admin)/admin/orders/page.jsx
'use client';

import { useState } from 'react';
import { OrderTable } from '@/components/admin/OrderTable';
import { useOrders } from '@/hooks/useOrders';

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { orders, loading, pagination } = useOrders({
    page,
    limit: 10,
    search,
    status,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">View and manage all orders</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s === 'all' ? '' : s);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
              (s === 'all' && !status) || status === s
                ? 'bg-[#d9006c] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <OrderTable
        orders={orders}
        loading={loading}
        pagination={{
          page: pagination.page,
          total: pagination.total,
          totalPages: pagination.totalPages,
          limit: pagination.limit,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
      />
    </div>
  );
}