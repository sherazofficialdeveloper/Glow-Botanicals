// components/dashboard/DashboardStats/DashboardStats.jsx
'use client';

import { 
  ShoppingBag, 
  Heart, 
  Star, 
  TrendingUp,
  Package,
  Clock,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const DashboardStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      id: 'orders',
      label: 'Total Orders',
      value: stats?.orders || 0,
      icon: ShoppingBag,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'spent',
      label: 'Total Spent',
      value: formatCurrency(stats?.spent || 0),
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'wishlist',
      label: 'Wishlist Items',
      value: stats?.wishlist || 0,
      icon: Heart,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      id: 'reviews',
      label: 'Reviews',
      value: stats?.reviews || 0,
      icon: Star,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;

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
            </div>
          </div>
        );
      })}
    </div>
  );
};