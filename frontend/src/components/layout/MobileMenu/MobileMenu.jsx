// frontend/src/components/layout/MobileMenu/MobileMenu.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  User, 
  LogOut, 
  Heart, 
  ShoppingBag,
  LayoutDashboard,
  Package,
  Settings,
  Star,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  user,
  isAuthenticated,
  isAdmin,
  onNavigate,
  onLogout,
}) => {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!isOpen) return null;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const dashboardLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: Package },
    { label: 'Wishlist', path: '/wishlist', icon: Heart },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Addresses', path: '/addresses', icon: MapPin },
    { label: 'Reviews', path: '/reviews', icon: Star },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 left-0 z-50 w-80 h-full bg-white shadow-2xl lg:hidden overflow-y-auto animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-bold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && user ? (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white font-bold text-lg">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-100">
            <Link
              href="/login"
              className="flex items-center justify-center w-full bg-[#d9006c] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors"
              onClick={onClose}
            >
              <User className="w-4 h-4 mr-2" />
              Login / Register
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {/* Main Nav Items */}
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
              onClick={onClose}
            >
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}

          {/* Dashboard Section (for authenticated users) */}
          {isAuthenticated && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Your Account
              </p>
              {dashboardLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
                    onClick={onClose}
                  >
                    <Icon className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center px-3 py-2.5 rounded-lg bg-[#d9006c]/10 text-[#d9006c] font-bold hover:bg-[#d9006c]/20 transition-colors mt-1"
                  onClick={onClose}
                >
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Need help?</span>
            <Link href="/contact" className="text-[#d9006c] font-bold hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};