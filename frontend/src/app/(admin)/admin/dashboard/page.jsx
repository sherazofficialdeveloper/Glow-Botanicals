// app/(admin)/admin/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { OrderTable } from '@/components/admin/OrderTable';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { adminService } from '@/services/adminService';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { orders, loading: ordersLoading } = useOrders({ limit: 5 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.name}! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} loading={statsLoading} />

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <a href="/admin/orders" className="text-sm text-[#d9006c] font-bold hover:underline">
            View All
          </a>
        </div>
        <OrderTable
          orders={orders}
          loading={ordersLoading}
          pagination={{
            page: 1,
            total: orders?.length || 0,
            totalPages: 1,
            limit: 5,
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/admin/products/add"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">➕</span>
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Add Product</h4>
          <p className="text-xs text-gray-500 mt-1">Add new product to store</p>
        </a>
        <a
          href="/admin/orders"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📦</span>
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Manage Orders</h4>
          <p className="text-xs text-gray-500 mt-1">View and process orders</p>
        </a>
        <a
          href="/admin/customers"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👥</span>
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Customers</h4>
          <p className="text-xs text-gray-500 mt-1">View customer list</p>
        </a>
        <a
          href="/admin/reviews"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
        >
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">⭐</span>
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Reviews</h4>
          <p className="text-xs text-gray-500 mt-1">Approve customer reviews</p>
        </a>
      </div>
    </div>
  );
}