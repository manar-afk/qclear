'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AirQualityData } from '@/services/aqi/types';
import { GeocodingResult, POPULAR_CITIES } from '@/services/geocoding/geocodingService';

export function useAirQuality(initialLat = 28.6139, initialLon = 77.2090, initialCity = 'New Delhi') {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [coords, setCoords] = useState({ lat: initialLat, lon: initialLon, city: initialCity });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch AQI data
  const fetchData = useCallback(async (lat: number, lon: number, city: string, isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/aqi?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch air quality`);
      }
      const json: AirQualityData = await res.json();
      setData(json);
    } catch (err: unknown) {
      console.error('[useAirQuality] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to retrieve air quality');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and when coords change
  useEffect(() => {
    fetchData(coords.lat, coords.lon, coords.city);
  }, [coords.lat, coords.lon, coords.city, fetchData]);

  // 10-minute auto-refresh timer
  useEffect(() => {
    const timer = setInterval(() => {
      fetchData(coords.lat, coords.lon, coords.city, true);
    }, 10 * 60 * 1000);

    return () => clearInterval(timer);
  }, [coords.lat, coords.lon, coords.city, fetchData]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/aqi?search=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.results || []);
        }
      } catch (err) {
        console.warn('[useAirQuality] Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Select city from search or preset
  const selectLocation = (city: string, lat: number, lon: number) => {
    setCoords({ lat, lon, city });
    setSearchQuery('');
    setSearchResults([]);
  };

  // Immediate search & select first match on Enter / Submit
  const submitSearch = async (query?: string) => {
    const q = (query ?? searchQuery).trim();
    if (!q) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/aqi?search=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        const results: GeocodingResult[] = json.results || [];
        if (results.length > 0) {
          selectLocation(results[0].name, results[0].latitude, results[0].longitude);
        } else {
          setError(`No location found for "${q}".`);
        }
      }
    } catch (err) {
      console.warn('[useAirQuality] submitSearch error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Browser Geolocation
  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectLocation('My Location', pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLoading(false);
        setError(`Location access denied or unavailable (${err.message}).`);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return {
    data,
    coords,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchData(coords.lat, coords.lon, coords.city, true),
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectLocation,
    submitSearch,
    requestCurrentLocation,
    popularCities: POPULAR_CITIES,
  };
}
