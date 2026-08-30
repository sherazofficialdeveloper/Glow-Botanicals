// app/(dashboard)/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  TrendingUp,
  Package,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useWishlist';
import { userService } from '@/services/userService';

export default function DashboardPage() {
  const { user } = useAuth();
  const { orders, loading: ordersLoading } = useOrders({ limit: 5 });
  const { wishlist } = useWishlist();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userService.getDashboardStats();
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#d9006c]/10 via-rose-50 to-[#d4af37]/10 rounded-2xl p-6 sm:p-8 border border-rose-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0] || 'Customer'}! 👋
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Here's what's happening with your Glow  Botanical journey.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#a80052] transition-colors shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Shop Now</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} loading={statsLoading} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/orders"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-100 transition-colors">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs font-bold text-gray-700">My Orders</p>
        </Link>
        <Link
          href="/wishlist"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-rose-100 transition-colors">
            <Heart className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-xs font-bold text-gray-700">Wishlist</p>
          {wishlist?.length > 0 && (
            <span className="text-[10px] text-[#d9006c] font-bold">
              ({wishlist.length} items)
            </span>
          )}
        </Link>
        <Link
          href="/profile"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-100 transition-colors">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-gray-700">Profile</p>
        </Link>
        <Link
          href="/reviews"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-100 transition-colors">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xs font-bold text-gray-700">Reviews</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <Link
            href="/orders"
            className="text-sm text-[#d9006c] font-bold hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <RecentOrders orders={orders} loading={ordersLoading} />
      </div>

      {/* Membership Info */}
      <div className="bg-gradient-to-r from-rose-50 to-white rounded-xl p-6 border border-rose-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <h4 className="font-bold text-gray-900">Glow  Member</h4>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You're earning points on every purchase. 
              <span className="font-bold text-[#d9006c]"> 100 points = $5 off</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#d9006c]">{stats?.points || 0}</p>
              <p className="text-[10px] text-gray-500">Points</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#d4af37]">
                ${stats?.points ? Math.floor(stats.points / 20) : 0}
              </p>
              <p className="text-[10px] text-gray-500">Rewards Value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}