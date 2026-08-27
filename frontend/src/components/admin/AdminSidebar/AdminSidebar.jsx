// components/admin/AdminSidebar/AdminSidebar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image,
  Video,
  Star,
  Ticket,
  Settings,
  FileText,
  CreditCard,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    products: true,
    orders: false,
    content: false,
    settings: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) =>
      Object.keys(prev).reduce(
        (next, menuId) => ({
          ...next,
          [menuId]: menuId === menu ? !prev[menuId] : false,
        }),
        {}
      )
    );
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    return pathname?.startsWith(path);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      path: '/admin/products',
      subItems: [
        { label: 'All Products', path: '/admin/products' },
        { label: 'Add Product', path: '/admin/products/add' },
        { label: 'Categories', path: '/admin/categories' },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      subItems: [
        { label: 'All Orders', path: '/admin/orders' },
        { label: 'Pending', path: '/admin/orders?status=pending' },
        { label: 'Processing', path: '/admin/orders?status=processing' },
        { label: 'Shipped', path: '/admin/orders?status=shipped' },
        { label: 'Delivered', path: '/admin/orders?status=delivered' },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      path: '/admin/customers',
    },
    {
      id: 'content',
      label: 'Content',
      icon: Image,
      path: '/admin/before-after',
      subItems: [
        { label: 'Before/After', path: '/admin/before-after' },
        { label: 'Videos', path: '/admin/videos' },
        { label: 'Reviews', path: '/admin/reviews' },
        { label: 'FAQs', path: '/admin/faqs' },
        { label: 'Blog', path: '/admin/blogs' },
      ],
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: Ticket,
      path: '/admin/coupons',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      subItems: [
        { label: 'General', path: '/admin/settings/general' },
        { label: 'Payment', path: '/admin/settings/payment' },
        { label: 'Shipping', path: '/admin/settings/shipping' },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#1a1a2e] text-white h-screen sticky top-0 overflow-y-auto transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#d9006c] flex items-center justify-center font-bold text-sm">
              GB
            </div>
            <span className="font-bold text-lg">Glowly</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/admin/dashboard" className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#d9006c] flex items-center justify-center font-bold text-sm">
              GB
            </div>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedMenus[item.id];
          const isItemActive = isActive(item.path);

          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <div
                className={`flex items-center rounded-lg transition-all cursor-pointer ${
                  isItemActive
                    ? 'bg-[#d9006c] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                } ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}
                onClick={() => {
                  if (hasSubItems) {
                    toggleMenu(item.id);
                  } else {
                    // Navigate
                  }
                }}
              >
                <Link
                  href={item.path}
                  className="flex items-center w-full"
                  onClick={(e) => {
                    if (hasSubItems) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 text-sm font-medium flex-1">
                        {item.label}
                      </span>
                      {hasSubItems && (
                        <div className="ml-auto">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </Link>
              </div>

              {/* Sub Items */}
              {!isCollapsed && hasSubItems && isExpanded && (
                <div className="ml-9 mt-1 space-y-1 border-l-2 border-white/10 pl-3">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.path}
                      href={sub.path}
                      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                        pathname === sub.path
                          ? 'text-[#d9006c] bg-white/5 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom - Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button
          onClick={logout}
          className={`flex items-center w-full rounded-lg transition-all text-gray-300 hover:text-white hover:bg-white/10 ${
            isCollapsed ? 'justify-center p-3' : 'px-4 py-3'
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
