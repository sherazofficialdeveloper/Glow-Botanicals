// app/(dashboard)/orders/page.jsx
'use client';

import { useState } from 'react';
import { OrderHistory } from '@/components/dashboard/OrderHistory';
import { useOrders } from '@/hooks/useOrders';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { orders, loading, pagination } = useOrders({
    page,
    limit: 10,
    search,
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
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500">View and track all your orders</p>
      </div>

      <OrderHistory
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