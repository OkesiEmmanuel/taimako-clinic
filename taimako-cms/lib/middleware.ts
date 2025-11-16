import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const role = req.cookies.get('role')?.value;

  if (!role) return NextResponse.redirect(new URL('/auth/login', req.url));

  // Staff-only routes
  if (url.pathname.startsWith('/staff') && role !== 'staff') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Admin-only routes
  if (url.pathname.startsWith('/dashboard') && role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}
