import { type NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/app']
const authRoutes = ['/auth/login', '/auth/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('sb-yrwpwpbjndfaphcqxlek-auth-token')?.value

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without auth, redirect to login
  if (isProtected && !sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If accessing auth route with valid session, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/auth/:path*'],
}
