import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a random 16-byte cryptographic nonce using Web Crypto API
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');

  // Build Content Security Policy
  // Note: connect-src is strictly 'self' because all external API calls (Open-Meteo, Vertex AI) happen server-side
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.open-meteo.com;
    font-src 'self' data:;
    connect-src 'self';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  // Set the nonce on the request headers so Server Components can access it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set response security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/health (Cloud Run health check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg
     */
    '/((?!api/health|_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};
