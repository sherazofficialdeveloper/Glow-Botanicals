// frontend/middleware.js
import { NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/products',
  '/products/:path*',
  '/categories',
  '/categories/:path*',
  '/about',
  '/contact',
  '/faq',
  '/blog',
  '/blog/:path*',
  '/privacy-policy',
  '/terms',
];

const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

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

const adminRoutes = [
  '/admin',
  '/admin/:path*',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!token;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Check if route is admin
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing admin route without token, redirect to login
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth route with token, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For protected routes with token, ensure token is valid
  if (isProtectedRoute && isAuthenticated) {
    // Check if token is expired by making a request to /auth/me
    // The API interceptor will handle this
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - images folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|logo|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$).*)',
  ],
};