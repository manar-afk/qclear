export type AqiCategory =
  | 'good'
  | 'moderate'
  | 'sensitive'
  | 'unhealthy'
  | 'veryUnhealthy'
  | 'hazardous';

export interface CurrentPollutants {
  usAqi: number;
  pm2_5: number;      // µg/m³
  pm10: number;       // µg/m³
  nitrogenDioxide?: number; // µg/m³
  ozone?: number;           // µg/m³
  carbonMonoxide?: number;  // µg/m³
  category: AqiCategory;
}

export interface HourlyReading {
  time: string;       // ISO string or local time string (e.g., '14:00')
  hour: number;       // 0 - 23
  pm2_5: number;      // µg/m³
  pm10: number;       // µg/m³
  usAqi: number;
}

export interface DerivedWindow {
  startHour: number;   // 0 - 23 local time
  endHour: number;     // 0 - 23 local time
  label: string;       // e.g. "13:00 - 16:00"
  avgPm25: number;     // µg/m³
  description: string;
}

export interface AirQualityData {
  latitude: number;
  longitude: number;
  city: string;
  timestamp: string;
  current: CurrentPollutants;
  hourly: HourlyReading[];
  ventilationWindow: DerivedWindow;
  peakSmogWindow: DerivedWindow;
  source: 'open-meteo' | 'waqi' | 'cache-fallback';
  isModeledEstimate: boolean;
}

export interface AirQualityProvider {
  name: string;
  getAirQuality(lat: number, lon: number, cityName?: string): Promise<AirQualityData>;
}
