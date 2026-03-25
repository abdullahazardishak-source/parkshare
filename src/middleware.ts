import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth';
import type { UserRole } from '@/types';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let role: UserRole | null = null;
  let isAuthenticated = false;

  if (token) {
    try {
      const payload = await verifyAuthToken(token);
      role = payload.role;
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
      role = null;
    }
  }

  const isAdminLogin = pathname === '/admin/login';
  const isUserLogin = pathname === '/login';
  const isRegister = pathname === '/register';
  const isHome = pathname === '/';

  if (isAdminLogin && isAuthenticated && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if ((isUserLogin || isRegister || isHome) && isAuthenticated && role && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/admin') && !isAdminLogin) {
    if (!isAuthenticated || role !== 'admin') {
      const adminLoginUrl = new URL('/admin/login', request.url);
      adminLoginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/owner')) {
    if (!isAuthenticated || (role !== 'owner' && role !== 'admin')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const protectedRoutes = ['/dashboard', '/search', '/bookings', '/profile', '/wallet', '/listing', '/notifications'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/search/:path*',
    '/bookings/:path*',
    '/profile/:path*',
    '/wallet/:path*',
    '/listing/:path*',
    '/notifications/:path*',
    '/owner/:path*',
    '/admin/:path*',
  ],
};
