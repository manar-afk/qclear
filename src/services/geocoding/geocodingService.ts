export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export const POPULAR_CITIES: GeocodingResult[] = [
  { id: 1273294, name: 'New Delhi', latitude: 28.6139, longitude: 77.2090, country: 'India', admin1: 'Delhi' },
  { id: 1275339, name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, country: 'India', admin1: 'Maharashtra' },
  { id: 1275004, name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, country: 'India', admin1: 'West Bengal' },
  { id: 1277333, name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, country: 'India', admin1: 'Karnataka' },
  { id: 1172451, name: 'Lahore', latitude: 31.5497, longitude: 74.3436, country: 'Pakistan', admin1: 'Punjab' },
  { id: 1816670, name: 'Beijing', latitude: 39.9042, longitude: 116.4074, country: 'China', admin1: 'Beijing' },
];

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return POPULAR_CITIES;
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1 hour cache
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(trimmed.toLowerCase()));
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(trimmed.toLowerCase()));
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      admin1: item.admin1 || '',
    }));
  } catch (err) {
    console.warn('[GeocodingService] search failed, returning filtered presets:', err);
    return POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(trimmed.toLowerCase()));
  }
}
