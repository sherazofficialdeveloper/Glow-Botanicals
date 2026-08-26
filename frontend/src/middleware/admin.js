// frontend/src/middleware/admin.js
import { NextResponse } from 'next/server';

export const adminMiddleware = (request) => {
  const token = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;

  // Admin routes
  const adminRoutes = [
    '/admin',
    '/admin/:path*',
  ];

  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin role - we'll let the API handle this
  // The API will verify the token and check admin role
  // If not admin, API will return 403

  return NextResponse.next();
};

export default adminMiddleware;