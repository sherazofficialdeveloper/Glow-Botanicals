// components/admin/DashboardStats/DashboardStats.jsx
'use client';

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export const DashboardStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: `$${stats?.revenue?.toFixed(2) || '0.00'}`,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: stats?.orders || 0,
      change: stats?.ordersChange || 0,
      icon: ShoppingBag,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'customers',
      label: 'Total Customers',
      value: stats?.customers || 0,
      change: stats?.customersChange || 0,
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'products',
      label: 'Total Products',
      value: stats?.products || 0,
      change: stats?.productsChange || 0,
      icon: Package,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isPositive = item.change >= 0;

        return (
          <div
            key={item.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                {item.label}
              </span>
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {item.value}
              </span>
              {item.change !== 0 && (
                <span
                  className={`text-xs font-medium flex items-center ${
                    isPositive ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {Math.abs(item.change)}%
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};