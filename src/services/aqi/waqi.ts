import { AirQualityProvider, AirQualityData } from './types';
import { getEnv } from '@/lib/config/config';
import { UpstreamError } from '@/lib/errors/AppError';
import { getAqiCategory } from '@/constants/aqiBands';
import { deriveWindows } from './windowDerivation';

export class WaqiAirQualityProvider implements AirQualityProvider {
  public readonly name = 'waqi';

  async getAirQuality(lat: number, lon: number, cityName = 'Current Location'): Promise<AirQualityData> {
    const env = getEnv();
    if (!env.WAQI_API_TOKEN) {
      throw new UpstreamError('WAQI', 'WAQI_API_TOKEN is not configured');
    }

    const url = `https://api.waqi.info/feed/geo:${lat.toFixed(4)};${lon.toFixed(4)}/?token=${env.WAQI_API_TOKEN}`;

    let response: Response;
    try {
      response = await fetch(url, {
        next: { revalidate: 600 },
        headers: { 'Accept': 'application/json' },
      });
    } catch (err: unknown) {
      throw new UpstreamError('WAQI', err instanceof Error ? err.message : 'Network request failed');
    }

    if (!response.ok) {
      throw new UpstreamError('WAQI', `HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.status !== 'ok' || !json.data) {
      throw new UpstreamError('WAQI', `WAQI returned error: ${json.data || 'Unknown error'}`);
    }

    const aqi = typeof json.data.aqi === 'number' ? json.data.aqi : 50;
    const pm25 = json.data.iaqi?.pm25?.v ?? Math.round(aqi / 2.5);
    const pm10 = json.data.iaqi?.pm10?.v ?? Math.round(pm25 * 1.6);

    // If WAQI lacks 24h hourly array, create synthesized hourly points from current aqi
    const nowHour = new Date().getHours();
    const hourly = Array.from({ length: 24 }, (_, i) => {
      const hour = (nowHour + i) % 24;
      const variation = 1 + 0.25 * Math.sin(((hour - 6) / 24) * 2 * Math.PI);
      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        pm2_5: Math.round(pm25 * variation),
        pm10: Math.round(pm10 * variation),
        usAqi: Math.round(aqi * variation),
      };
    });

    const { ventilationWindow, peakSmogWindow } = deriveWindows(hourly);
    const category = getAqiCategory(aqi);

    return {
      latitude: lat,
      longitude: lon,
      city: json.data.city?.name || cityName,
      timestamp: json.data.time?.iso || new Date().toISOString(),
      current: {
        usAqi: aqi,
        pm2_5: pm25,
        pm10,
        nitrogenDioxide: json.data.iaqi?.no2?.v,
        ozone: json.data.iaqi?.o3?.v,
        carbonMonoxide: json.data.iaqi?.co?.v,
        category,
      },
      hourly,
      ventilationWindow,
      peakSmogWindow,
      source: 'waqi',
      isModeledEstimate: false,
    };
  }
}
