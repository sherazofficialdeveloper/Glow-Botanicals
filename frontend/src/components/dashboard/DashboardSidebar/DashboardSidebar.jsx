// components/dashboard/DashboardSidebar/DashboardSidebar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Settings,
  LogOut,
  Star,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/contexts/WishlistContext';
import { useOrders } from '@/hooks/useOrders';

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { pagination: ordersPagination } = useOrders({ limit: 1 });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path) => {
    return pathname?.startsWith(path);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      path: '/orders',
      badge: ordersPagination?.total > 0 ? ordersPagination.total : null,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      path: '/wishlist',
      badge: wishlist?.length || 0,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: MapPin,
      path: '/addresses',
    },
    {
      id: 'reviews',
      label: 'My Reviews',
      icon: Star,
      path: '/reviews',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#d9006c] text-white shadow-lg flex items-center justify-center transition-all hover:bg-[#a80052] hover:scale-105"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 z-30
          w-64 min-h-screen
          bg-white border-r border-gray-100
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'guest@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all
                    ${active 
                      ? 'bg-[#d9006c] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-rose-50 hover:text-[#d9006c]'
                    }
                  `}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
                  <span className="ml-3 text-sm font-medium flex-1">
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <span className={`
                      text-xs font-bold px-2 py-0.5 rounded-full
                      ${active ? 'bg-white text-[#d9006c]' : 'bg-rose-100 text-[#d9006c]'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-4 h-4 ml-2" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3 text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};