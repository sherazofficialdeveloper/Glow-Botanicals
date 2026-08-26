// components/dashboard/RecentOrders/RecentOrders.jsx
'use client';

import Link from 'next/link';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { formatCurrency } from '@/utils/formatters';

export const RecentOrders = ({ orders, loading = false, limit = 5 }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No orders yet</p>
        <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here</p>
        <Link
          href="/products"
          className="inline-block mt-4 text-[#d9006c] font-bold text-sm hover:underline"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

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

  const displayOrders = orders.slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {displayOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-gray-900">
                      #{order.orderNumber}
                    </span>
                    <Badge variant={statusConfig.variant} size="sm">
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-0.5">
                    <span>{order.items?.length || 0} items</span>
                    <span>•</span>
                    <span>{formatCurrency(order.total)}</span>
                    <span>•</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#d9006c] transition-colors" />
            </Link>
          );
        })}
      </div>

      {orders.length > limit && (
        <div className="p-4 border-t border-gray-100 text-center">
          <Link
            href="/orders"
            className="text-sm font-bold text-[#d9006c] hover:underline"
          >
            View All Orders
          </Link>
        </div>
      )}
    </div>
  );
};