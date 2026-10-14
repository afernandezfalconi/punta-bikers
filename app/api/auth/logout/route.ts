import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  const response = NextResponse.redirect(new URL('/auth/login', baseUrl));
  response.cookies.delete('sb-access-token');
  return response;
}
