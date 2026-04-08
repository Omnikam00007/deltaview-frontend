import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Read the token securely from cookies
  const token = request.cookies.get('deltaview_access_token')?.value;
  const { pathname } = request.nextUrl;
  
  // Define route classifications
  const isAuthRoute = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register');
  
  // Protected routes explicitly require a token
  // If we add new sections like /settings, they should be added here
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/portfolio') || 
    pathname.startsWith('/funds') || 
    pathname.startsWith('/pnl');

  // Scenario 1: Attempting to access a protected route without being authenticated
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    // Optional: Pass an ?error or ?next parameter if desired
    return NextResponse.redirect(loginUrl);
  }

  // Scenario 2: Attempting to access login/register while already authenticated
  if (token && isAuthRoute) {
    // Proactively send them to the primary application page
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow all other requests to proceed natively
  return NextResponse.next();
}

// Ensure middleware only runs on relevant routes to preserve performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (Next.js internal API routes, though our backend is separate)
     * - _next/static (static rendering files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
