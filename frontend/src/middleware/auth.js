// frontend/src/middleware/auth.js
import { NextResponse } from 'next/server';

export const authMiddleware = (request) => {
  const token = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes (no auth required)
  const publicRoutes = [
    '/',
    '/home',
    '/products',
    '/products/:path*',
    '/categories',
    '/categories/:path*',
    '/about',
    '/contact',
    '/faq',
    '/blog',
    '/blog/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/privacy-policy',
    '/terms',
  ];

  // Protected routes (auth required)
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/:path*',
    '/orders',
    '/orders/:path*',
    '/wishlist',
    '/profile',
    '/addresses',
    '/reviews',
    '/settings',
    '/checkout',
    '/checkout/:path*',
  ];

  // Admin routes
  const adminRoutes = [
    '/admin',
    '/admin/:path*',
  ];

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth route with token
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Admin routes - check for admin role (handled by API)
  // We'll let the API handle admin authorization

  return NextResponse.next();
};

export default authMiddleware;