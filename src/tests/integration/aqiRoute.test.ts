import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/aqi/route';
import { aqiRateLimiter } from '@/lib/security/rateLimiter';

describe('GET /api/aqi Route Integration Tests', () => {
  beforeEach(() => {
    aqiRateLimiter.reset();
  });

  it('rejects invalid coordinates with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/aqi?lat=999&lon=999');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Bad Request');
  });

  it('returns valid air quality data for Delhi coordinates', async () => {
    const req = new NextRequest('http://localhost:3000/api/aqi?lat=28.6139&lon=77.2090&city=New%20Delhi');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.city).toBe('New Delhi');
    expect(body.current).toBeDefined();
    expect(body.current.usAqi).toBeGreaterThanOrEqual(0);
    expect(body.ventilationWindow).toBeDefined();
    expect(body.peakSmogWindow).toBeDefined();
    expect(body.hourly).toBeDefined();
    expect(body.hourly.length).toBeGreaterThan(0);
  }, 15000);

  it('enforces rate limits when requests exceed threshold', async () => {
    const clientIp = '192.168.1.100';
    // Consume rate limit allowance
    for (let i = 0; i < 60; i++) {
      aqiRateLimiter.check(clientIp);
    }

    const req = new NextRequest('http://localhost:3000/api/aqi?lat=28.61&lon=77.20', {
      headers: { 'x-forwarded-for': clientIp },
    });
    const res = await GET(req);

    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
  });
});
