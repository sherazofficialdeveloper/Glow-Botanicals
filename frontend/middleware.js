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

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!token;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin redirects are handled after AuthProvider verifies the existing bearer
  // token with the API. The browser session is stored in localStorage for the
  // API interceptor, so a cookie-presence check cannot establish that a
  // session is valid or that the user is an admin.
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