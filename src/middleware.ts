import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 60; // requests
const WINDOW_MS = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  const record = rateLimit.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return NextResponse.next();
  }
  
  if (record.count >= RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  record.count++;
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

