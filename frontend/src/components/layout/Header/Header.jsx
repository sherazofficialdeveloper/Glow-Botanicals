// frontend/src/components/layout/Header/Header.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  User,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  Package,
  Star,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { MobileMenu } from '../MobileMenu';

export const Header = ({
  onOpenCart,
  onOpenSearch,
  className = '',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Blog', path: '/blog' },
  ];

  const handleNavigate = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  const wishlistCount = wishlist?.length || 0;

  return (
    <header
      className={`
        sticky top-0 z-40 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-white border-b border-rose-100 py-3'
        }
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#d9006c] transition-colors focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <img
              src="/logo.png"
              alt="Glowly Botanical"
              className="h-10 sm:h-12 md:h-28 w-auto object-contain"
              onError={(e) => {
                e.target.src = '/images/logo-placeholder.png';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path || 
                (item.path !== '/' && pathname?.startsWith(item.path));
              
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`
                    text-xs font-bold tracking-widest transition-colors uppercase relative py-1
                    ${isActive 
                      ? 'text-[#d9006c]' 
                      : 'text-gray-800 hover:text-[#d9006c]'
                    }
                    after:content-[''] after:absolute after:bottom-0 after:left-0 
                    after:w-0 after:h-0.5 after:bg-[#d9006c] 
                    hover:after:w-full after:transition-all after:duration-300
                    ${isActive ? 'after:w-full' : ''}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-gray-700 hover:text-[#d9006c] transition-colors relative group"
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden md:inline text-[11px] font-semibold tracking-wider ml-1 uppercase text-gray-600 group-hover:text-[#d9006c]">
                Search
              </span>
            </button>

            {/* User / Account */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden sm:flex p-2 text-gray-700 hover:text-[#d9006c] transition-colors items-center space-x-1"
                aria-label="Account"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-900 text-sm">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4 mr-3" />
                        Orders
                      </Link>
                      
                      <Link
                        href="/wishlist"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        Wishlist
                      </Link>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-2.5 text-sm text-[#d9006c] font-bold hover:bg-rose-50 border-t border-gray-100 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center px-4 py-2.5 text-sm text-[#d9006c] font-bold hover:bg-rose-50 transition-colors border-t border-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-700 hover:text-[#d9006c] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-[#d9006c] text-white px-3 sm:px-4 py-2 rounded-full hover:bg-[#a80052] transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                Cart
              </span>
              <span className="bg-white text-[#d9006c] text-xs font-extrabold px-2 py-0.5 rounded-full ml-1 min-w-[20px] text-center">
                {totalItems}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        user={user}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </header>
  );
};