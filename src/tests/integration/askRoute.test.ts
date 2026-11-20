import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/ask/route';
import { askRateLimiter } from '@/lib/security/rateLimiter';

describe('POST /api/ask Route Integration Tests', () => {
  beforeEach(() => {
    askRateLimiter.reset();
  });

  const validPayload = {
    question: 'Is it safe for our school to hold an outdoor sports assembly today?',
    aqi: 280,
    pm2_5: 195,
    pm10: 310,
    category: 'veryUnhealthy' as const,
    locationName: 'Dwarka, New Delhi',
    language: 'en' as const,
    simpleLanguage: false,
  };

  it('rejects questions shorter than 3 characters with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/ask', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, question: 'hi' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Validation Error');
  });

  it('rejects questions longer than 300 characters with HTTP 400', async () => {
    const longQuestion = 'a'.repeat(301);
    const req = new NextRequest('http://localhost:3000/api/ask', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, question: longQuestion }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Validation Error');
  });

  it('returns grounded offline guidance with key action item when GCP credentials are unset', async () => {
    const req = new NextRequest('http://localhost:3000/api/ask', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.answer).toBeDefined();
    expect(body.data.keyActionItem).toBeDefined();
    expect(body.data.severityAdvisory).toBeDefined();
    expect(body.isAIGenerated).toBe(false);
    expect(body.model).toBe('offline-guidance');
  });

  it('returns grounded Hindi response when requested with language="hi"', async () => {
    const req = new NextRequest('http://localhost:3000/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        ...validPayload,
        question: 'क्या आज स्कूल में आउटडोर खेलकूद या प्रार्थना सभा कराना ठीक है?',
        language: 'hi',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.answer).toMatch(/[\u0900-\u097F]/); // Contains Devanagari characters
    expect(body.data.keyActionItem).toMatch(/[\u0900-\u097F]/);
  });

  it('enforces rate limits on excessive questions', async () => {
    const clientIp = '198.51.100.55';
    // Consume 15 requests
    for (let i = 0; i < 15; i++) {
      askRateLimiter.check(clientIp);
    }

    const req = new NextRequest('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'x-forwarded-for': clientIp },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
  });
});
