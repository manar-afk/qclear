import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/recommendations/route';
import { aiRateLimiter } from '@/lib/security/rateLimiter';
import { DEMO_PRESETS } from '@/constants/presets';

describe('POST /api/recommendations Route Integration Tests', () => {
  beforeEach(() => {
    aiRateLimiter.reset();
  });

  const validPayload = {
    aqi: 280,
    pm2_5: 195,
    pm10: 310,
    category: 'veryUnhealthy' as const,
    ventilationWindow: '13:00 - 16:00',
    peakSmogWindow: '06:00 - 09:00',
    household: DEMO_PRESETS[0],
    language: 'en' as const,
    simpleLanguage: false,
  };

  it('rejects malformed payloads with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/recommendations', {
      method: 'POST',
      body: JSON.stringify({ aqi: 'not-a-number' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Validation Error');
  });

  it('gracefully returns curated offline guidance when Vertex credentials are unset', async () => {
    const req = new NextRequest('http://localhost:3000/api/recommendations', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.dailyRoutines.length).toBeGreaterThan(0);
    expect(body.data.iaqHacks.length).toBeGreaterThan(0);
    expect(body.data.sustainableAlternatives.length).toBeGreaterThan(0);
    expect(body.isAIGenerated).toBe(false);
    expect(body.model).toBe('offline-guidance');
  });

  it('returns Hindi guidance when requested in language="hi"', async () => {
    const req = new NextRequest('http://localhost:3000/api/recommendations', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, language: 'hi' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    // Check Hindi Devanagari character presence
    expect(body.data.dailyRoutines[0].action).toMatch(/[\u0900-\u097F]/);
  });
});
