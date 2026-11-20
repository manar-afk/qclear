import { AirQualityProvider, AirQualityData, HourlyReading } from './types';
import { deriveWindows } from './windowDerivation';
import { getAqiCategory } from '@/constants/aqiBands';
import { UpstreamError } from '@/lib/errors/AppError';

interface OpenMeteoResponse {
  current?: {
    time: string;
    us_aqi?: number;
    pm2_5?: number;
    pm10?: number;
    nitrogen_dioxide?: number;
    ozone?: number;
    carbon_monoxide?: number;
  };
  hourly?: {
    time: string[];
    pm2_5: number[];
    pm10: number[];
    us_aqi?: number[];
  };
}

export class OpenMeteoAirQualityProvider implements AirQualityProvider {
  public readonly name = 'open-meteo';

  async getAirQuality(lat: number, lon: number, cityName = 'Current Location'): Promise<AirQualityData> {
    const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
    url.searchParams.set('latitude', lat.toFixed(4));
    url.searchParams.set('longitude', lon.toFixed(4));
    url.searchParams.set('hourly', 'pm2_5,pm10,us_aqi');
    url.searchParams.set('current', 'us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide');
    url.searchParams.set('forecast_hours', '24');
    url.searchParams.set('timezone', 'auto');

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        next: { revalidate: 600 }, // 10 minute cache
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'QCLEAR-Companion/1.0',
        },
      });
    } catch (err: unknown) {
      throw new UpstreamError('Open-Meteo', err instanceof Error ? err.message : 'Network request failed');
    }

    if (!response.ok) {
      throw new UpstreamError('Open-Meteo', `API returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as OpenMeteoResponse;

    if (!data.current || !data.hourly) {
      throw new UpstreamError('Open-Meteo', 'Malformed API response: missing current or hourly dataset');
    }

    // Process hourly points
    const hourly: HourlyReading[] = [];
    const times = data.hourly.time || [];
    const pm25Arr = data.hourly.pm2_5 || [];
    const pm10Arr = data.hourly.pm10 || [];
    const usAqiArr = data.hourly.us_aqi || [];

    for (let i = 0; i < times.length && i < 24; i++) {
      const timeStr = times[i];
      // Safely extract the local hour from "2026-11-20T14:00" directly to preserve timezone=auto
      const hourPart = timeStr.includes('T') ? parseInt(timeStr.split('T')[1].slice(0, 2), 10) : i;

      const pm2_5 = typeof pm25Arr[i] === 'number' ? Math.round(pm25Arr[i] * 10) / 10 : 0;
      const pm10 = typeof pm10Arr[i] === 'number' ? Math.round(pm10Arr[i] * 10) / 10 : 0;
      const usAqi = typeof usAqiArr[i] === 'number' ? Math.round(usAqiArr[i]) : Math.round(pm2_5 * 2.5);

      hourly.push({
        time: timeStr,
        hour: isNaN(hourPart) ? i : hourPart,
        pm2_5,
        pm10,
        usAqi,
      });
    }

    // Derive Ventilation and Peak Smog windows from real hourly data
    const { ventilationWindow, peakSmogWindow } = deriveWindows(hourly);

    const usAqi = Math.round(data.current.us_aqi ?? (data.current.pm2_5 ? data.current.pm2_5 * 2.5 : 50));
    const category = getAqiCategory(usAqi);

    return {
      latitude: lat,
      longitude: lon,
      city: cityName,
      timestamp: data.current.time || new Date().toISOString(),
      current: {
        usAqi,
        pm2_5: Math.round((data.current.pm2_5 ?? 0) * 10) / 10,
        pm10: Math.round((data.current.pm10 ?? 0) * 10) / 10,
        nitrogenDioxide: data.current.nitrogen_dioxide ? Math.round(data.current.nitrogen_dioxide * 10) / 10 : undefined,
        ozone: data.current.ozone ? Math.round(data.current.ozone * 10) / 10 : undefined,
        carbonMonoxide: data.current.carbon_monoxide ? Math.round(data.current.carbon_monoxide * 10) / 10 : undefined,
        category,
      },
      hourly,
      ventilationWindow,
      peakSmogWindow,
      source: 'open-meteo',
      isModeledEstimate: true,
    };
  }
}
