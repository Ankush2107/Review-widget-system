import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/api/widgets', '/api/analytics'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', decoded.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/widgets/:path*',
    '/api/analytics/:path*'
  ]
};