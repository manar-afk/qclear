'use client';

import React, { useState } from 'react';
import { PreferencesProvider, usePreferences } from '@/context/PreferencesContext';
import { Header } from '@/components/Header';
import { LiveAQIWidget } from '@/components/LiveAQIWidget';
import { HourlyTrendChart } from '@/components/HourlyTrendChart';
import { HouseholdPresetBar } from '@/components/HouseholdPresetBar';
import { ThreePillarsContainer } from '@/components/ThreePillarsContainer';
import { AskQClear } from '@/components/AskQClear';
import { ImpactSimulator } from '@/components/ImpactSimulator';
import { CorsiRosenthalCard } from '@/components/CorsiRosenthalCard';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { useAirQuality } from '@/hooks/useAirQuality';
import { useRecommendations } from '@/hooks/useRecommendations';
import { DEMO_PRESETS, HouseholdProfile } from '@/constants/presets';
import { ShieldCheck, Heart, Github } from 'lucide-react';

function DashboardContent() {
  const { language, isSimpleLanguage } = usePreferences();

  // Household Profile state (defaults to Preset 0: Family with Toddler & Elderly)
  const [household, setHousehold] = useState<HouseholdProfile>(DEMO_PRESETS[0]);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Air Quality Hook
  const {
    data: aqiData,
    isLoading: isAqiLoading,
    isRefreshing,
    refresh: refreshAqi,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectLocation,
    requestCurrentLocation,
    popularCities,
  } = useAirQuality(household.lat, household.lon, household.locationName);

  // AI & Recommendations Hook
  const {
    recommendations,
    isLoading: isAiLoading,
    isAIGenerated,
    modelName,
  } = useRecommendations(aqiData, household, language, isSimpleLanguage);

  const handleSelectPreset = (preset: HouseholdProfile) => {
    setHousehold(preset);
    selectLocation(preset.locationName, preset.lat, preset.lon);
  };

  const handleUpdateCustomProfile = (custom: HouseholdProfile) => {
    setHousehold(custom);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8" role="main">
        {/* Section 1: Live Air Quality & Search Dashboard */}
        <LiveAQIWidget
          data={aqiData}
          isLoading={isAqiLoading}
          isRefreshing={isRefreshing}
          onRefresh={refreshAqi}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          onSelectCity={selectLocation}
          onRequestLocation={requestCurrentLocation}
          popularCities={popularCities}
        />

        {/* Section 2: Real 24-Hour Trend & Derived Ventilation / Smog Inversion Windows */}
        <HourlyTrendChart data={aqiData} />

        {/* Section 3: Household Profile Presets (One-Click Tailoring) */}
        <HouseholdPresetBar
          activeProfile={household}
          onSelectPreset={handleSelectPreset}
          onUpdateCustomProfile={handleUpdateCustomProfile}
        />

        {/* Section 4: The Three Pillars of Clean Living */}
        <ThreePillarsContainer
          recommendations={recommendations}
          isLoading={isAiLoading}
          isAIGenerated={isAIGenerated}
          modelName={modelName}
        />

        {/* Section 5: Grounded Situational Q&A Assistant */}
        <AskQClear aqiData={aqiData} household={household} />

        {/* Section 6: Interactive Impact Simulator */}
        <ImpactSimulator ambientPm25={aqiData?.current.pm2_5 ?? 185} />

        {/* Section 7: DIY Corsi-Rosenthal Filter Box Guide */}
        <CorsiRosenthalCard />
      </main>

      {/* Non-Medical Disclaimer Modal */}
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">QCLEAR</span>
            <span>•</span>
            <span>{language === 'hi' ? 'शुद्ध वायु साथी' : 'CleanAir Urban Companion'}</span>
          </div>

          <div className="flex items-center gap-4 text-center">
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(true)}
              className="hover:underline text-blue-600 dark:text-blue-400 font-semibold"
            >
              {language === 'hi' ? 'चिकित्सा अस्वीकरण एवं वैज्ञानिक पद्धति' : 'Medical Disclaimer & Sourcing'}
            </button>
            <span>•</span>
            <span>Zero-API-Key Architecture (Vertex AI ADC)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Built for clean urban living</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <PreferencesProvider>
      <DashboardContent />
    </PreferencesProvider>
  );
}
