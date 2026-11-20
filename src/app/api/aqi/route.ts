import { NextRequest, NextResponse } from 'next/server';
import { aqiQuerySchema } from '@/lib/schemas/aqiRequestSchema';
import { getAirQualityData } from '@/services/aqi';
import { searchCities } from '@/services/geocoding/geocodingService';
import { aqiRateLimiter, getClientIp } from '@/lib/security/rateLimiter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Extract client IP from proxy headers
  const ip = getClientIp(request.headers);
  const rateLimit = aqiRateLimiter.check(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again shortly.',
        retryAfter: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds || 60),
        },
      }
    );
  }

  // Parse & validate search params
  const { searchParams } = new URL(request.url);
  const rawParams = {
    lat: searchParams.get('lat') || undefined,
    lon: searchParams.get('lon') || undefined,
    city: searchParams.get('city') || undefined,
    search: searchParams.get('search') || undefined,
  };

  const validation = aqiQuerySchema.safeParse(rawParams);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Bad Request',
        details: validation.error.format(),
      },
      { status: 400 }
    );
  }

  const { lat, lon, city, search } = validation.data;

  // Handle city search queries
  if (search) {
    try {
      const cities = await searchCities(search);
      return NextResponse.json({ results: cities });
    } catch (err: unknown) {
      return NextResponse.json(
        { error: 'Geocoding failed', message: err instanceof Error ? err.message : 'Unknown error' },
        { status: 502 }
      );
    }
  }

  // Fetch live air quality
  try {
    const data = await getAirQualityData(lat, lon, city);
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'AQI Service Error', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 502 }
    );
  }
}
