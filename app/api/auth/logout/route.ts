import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/auth/login', process.env.VERCEL_URL || 'http://localhost:3000'));
  response.cookies.delete('sb-access-token');
  return response;
}
