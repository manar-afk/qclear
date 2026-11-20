'use client';

import { useState, useEffect, useCallback } from 'react';
import { AIRecommendationsOutput } from '@/lib/schemas/aiRequestSchema';
import { HouseholdProfile } from '@/constants/presets';
import { AirQualityData } from '@/services/aqi/types';
import { Language } from '@/lib/i18n';

interface UseRecommendationsResult {
  recommendations: AIRecommendationsOutput | null;
  isLoading: boolean;
  isAIGenerated: boolean;
  modelName: string;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecommendations(
  aqiData: AirQualityData | null,
  household: HouseholdProfile,
  language: Language,
  simpleLanguage: boolean
): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<AIRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [modelName, setModelName] = useState('offline-guidance');
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!aqiData) return;

    setIsLoading(true);
    setError(null);

    const payload = {
      aqi: aqiData.current.usAqi,
      pm2_5: aqiData.current.pm2_5,
      pm10: aqiData.current.pm10,
      category: aqiData.current.category,
      ventilationWindow: aqiData.ventilationWindow.label,
      peakSmogWindow: aqiData.peakSmogWindow.label,
      household: {
        locationName: household.locationName,
        members: household.members,
        commuteMode: household.commuteMode,
        commuteMinutes: household.commuteMinutes,
        homeSetup: household.homeSetup,
        communityRole: household.communityRole,
      },
      language,
      simpleLanguage,
    };

    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to generate recommendations`);
      }

      const json = await res.json();
      setRecommendations(json.data);
      setIsAIGenerated(Boolean(json.isAIGenerated));
      setModelName(json.model || 'offline-guidance');
    } catch (err: unknown) {
      console.warn('[useRecommendations] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [aqiData, household, language, simpleLanguage]);

  useEffect(() => {
    if (aqiData) {
      fetchRecommendations();
    }
  }, [fetchRecommendations, aqiData]);

  return {
    recommendations,
    isLoading,
    isAIGenerated,
    modelName,
    error,
    refetch: fetchRecommendations,
  };
}
