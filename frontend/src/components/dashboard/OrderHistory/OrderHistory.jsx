// components/dashboard/OrderHistory/OrderHistory.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Pagination } from '@/components/common/Pagination';
import { formatCurrency } from '@/utils/formatters';

export const OrderHistory = ({
  orders,
  loading = false,
  pagination,
  onPageChange,
  onSearch,
  className = '',
}) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', variant: 'warning', icon: Clock },
      processing: { label: 'Processing', variant: 'info', icon: Package },
      shipped: { label: 'Shipped', variant: 'primary', icon: Truck },
      delivered: { label: 'Delivered', variant: 'success', icon: CheckCircle },
      cancelled: { label: 'Cancelled', variant: 'danger', icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    // Apply filter logic
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center ${className}`}>
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h4>
        <p className="text-gray-500 max-w-sm mx-auto">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link href="/products">
          <Button className="mt-6">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 mr-1">Filter:</span>
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilter(status)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                filterStatus === status
                  ? 'bg-[#d9006c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#d9006c]/20 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-900">
                        #{order.orderNumber}
                      </span>
                      <Badge variant={statusConfig.variant} size="sm">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>{order.items?.length || 0} items</span>
                      <span>•</span>
                      <span className="font-bold text-gray-700">
                        {formatCurrency(order.total)}
                      </span>
                      <span>•</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      {order.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{order.paymentMethod}</span>
                        </>
                      )}
                    </div>
                    {order.shippingAddress && (
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[300px]">
                        📦 {order.shippingAddress.address}, {order.shippingAddress.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    as="span"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View Details
                  </Button>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#d9006c] transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};