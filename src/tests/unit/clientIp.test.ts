import { describe, it, expect } from 'vitest';
import { getClientIp } from '@/lib/security/rateLimiter';

describe('Client IP Extraction Unit Tests (Cloud Run & Proxy Aware)', () => {
  it('extracts the first IP from comma-separated x-forwarded-for header', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '203.0.113.195, 70.41.3.18, 150.172.238.178');

    const clientIp = getClientIp(headers);
    expect(clientIp).toBe('203.0.113.195');
  });

  it('trims whitespace and ignores downstream proxy IPs', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '  198.51.100.42  , 10.0.0.1');

    const clientIp = getClientIp(headers);
    expect(clientIp).toBe('198.51.100.42');
  });

  it('falls back to x-real-ip when x-forwarded-for is missing', () => {
    const headers = new Headers();
    headers.set('x-real-ip', '192.0.2.1');

    const clientIp = getClientIp(headers);
    expect(clientIp).toBe('192.0.2.1');
  });

  it('falls back to safe default 127.0.0.1 when all headers are absent', () => {
    const headers = new Headers();
    const clientIp = getClientIp(headers);
    expect(clientIp).toBe('127.0.0.1');
  });
});
