// components/admin/OrderTable/OrderTable.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { DataTable } from '../DataTable';
import { Badge } from '@/components/common/Badge';

export const OrderTable = ({
  orders,
  loading,
  pagination,
  onSearch,
  onPageChange,
}) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
    };
    return colors[status] || 'secondary';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'secondary',
    };
    return colors[status] || 'secondary';
  };

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order #',
      render: (row) => (
        <Link
          href={`/admin/orders/${row._id}`}
          className="font-mono text-sm font-medium text-[#d9006c] hover:underline"
        >
          #{row.orderNumber}
        </Link>
      ),
    },
    {
      key: 'user',
      label: 'Customer',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.user?.name || 'Guest'}
          </div>
          <div className="text-xs text-gray-500">{row.user?.email || '-'}</div>
        </div>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">
            ${row.total?.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            {row.items?.length || 0} items
          </div>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-700">
            {row.paymentMethod?.toUpperCase()}
          </div>
          <Badge variant={getPaymentStatusColor(row.paymentStatus)} size="sm">
            {row.paymentStatus}
          </Badge>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={getStatusColor(row.status)} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <div className="text-sm text-gray-500">
          {new Date(row.createdAt).toLocaleDateString()}
          <div className="text-xs">
            {new Date(row.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Link
          href={`/admin/orders/${row._id}`}
          className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50 transition-colors inline-flex"
        >
          <Eye className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      loading={loading}
      pagination={pagination}
      onSearch={onSearch}
      searchPlaceholder="Search orders..."
      emptyMessage="No orders found"
      onRowClick={(row) => window.location.href = `/admin/orders/${row._id}`}
    />
  );
};