'use client';

import React from 'react';
import { AirQualityData } from '@/services/aqi/types';
import { AQI_BANDS } from '@/constants/aqiBands';
import { usePreferences } from '@/context/PreferencesContext';
import {
  RotateCw,
  MapPin,
  Search,
  Crosshair,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Biohazard,
  Info,
  Clock,
  Radio,
} from 'lucide-react';
import { GeocodingResult } from '@/services/geocoding/geocodingService';

interface LiveAQIWidgetProps {
  data: AirQualityData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: GeocodingResult[];
  isSearching: boolean;
  onSelectCity: (city: string, lat: number, lon: number) => void;
  onRequestLocation: () => void;
  popularCities: GeocodingResult[];
}

export function LiveAQIWidget({
  data,
  isLoading,
  isRefreshing,
  onRefresh,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  onSelectCity,
  onRequestLocation,
  popularCities,
}: LiveAQIWidgetProps) {
  const { language, t } = usePreferences();

  const current = data?.current;
  const category = current?.category || 'hazardous';
  const band = AQI_BANDS[category];

  const formattedLastUpdated = data?.timestamp
    ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--';

  // Icon mapping
  const renderIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />;
      case 'Biohazard':
      default:
        return <Biohazard className="w-5 h-5 text-rose-700 dark:text-rose-400" aria-hidden="true" />;
    }
  };

  return (
    <section
      className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm border transition-all space-y-4"
      aria-label="Live Air Quality Dashboard"
    >
      {/* Dynamic Status Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        {isRefreshing
          ? t.refreshing
          : `${t.lastUpdated}: ${formattedLastUpdated}. Current AQI is ${current?.usAqi ?? 0}, ${band?.labelEn}.`}
      </div>

      {/* Top Banner: Source Transparency & Last Updated */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
          <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" aria-hidden="true" />
          <span>{t.dataSourceNotice}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.lastUpdated}:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{formattedLastUpdated}</span>
        </div>
      </div>

      {/* Search & Location Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        {/* City Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              aria-label={t.searchPlaceholder}
            />
            {isSearching && (
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-slate-400 animate-pulse">
                ...
              </span>
            )}
            <button
              type="button"
              onClick={onRequestLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title={t.useMyLocation}
              aria-label={t.useMyLocation}
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
              <ul role="listbox">
                {searchResults.map((city) => (
                  <li key={city.id}>
                    <button
                      type="button"
                      onClick={() => onSelectCity(city.name, city.latitude, city.longitude)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center justify-between transition"
                    >
                      <span className="font-medium text-slate-900 dark:text-white">{city.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Popular Cities Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
            Quick:
          </span>
          {popularCities.slice(0, 4).map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city.name, city.latitude, city.longitude)}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition border ${
                data?.city === city.name
                  ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Manual Refresh Button with loading state */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing || isLoading}
          className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 transition shadow-sm self-start lg:self-auto"
          aria-label={t.refreshButton}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span>{isRefreshing ? t.refreshing : t.refreshButton}</span>
        </button>
      </div>

      {/* Primary Display */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Fetching real-time atmospheric data...</p>
        </div>
      ) : (
        <div className="pt-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Location & Badge */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {data?.city || 'New Delhi'}
                </h2>
              </div>
              {/* Colorblind-Safe Severity Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border-2 ${band.badgeClass} ${band.patternClass}`}
                role="status"
              >
                {renderIcon(band.iconName)}
                <span>
                  {language === 'hi' ? band.labelHi : band.labelEn} • {current?.usAqi ?? 0} {t.aqiLabel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg">
                {language === 'hi' ? band.healthAdvisoryHi : band.healthAdvisoryEn}
              </p>
            </div>

            {/* Circular AQI & PM2.5 Readout */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-white font-black shadow-lg"
                style={{ backgroundColor: band.color }}
              >
                <span className="text-2xl sm:text-3xl leading-none">{current?.usAqi ?? '--'}</span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase opacity-90 mt-0.5">
                  AQI
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t.pm25Label}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {current?.pm2_5 ?? '--'}{' '}
                  <span className="text-xs sm:text-sm font-normal text-slate-500">µg/m³</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {data?.isModeledEstimate ? 'Atmospheric Model' : 'Station Reading'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Pollutants Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.pm10Label}</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {current?.pm10 ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.no2Label}</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {current?.nitrogenDioxide ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.o3Label}</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {current?.ozone ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.coLabel}</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {current?.carbonMonoxide ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
            </div>
          </div>

          {/* Timestamp & Source Attribution */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 gap-1">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t.modeledEstimateNotice}</span>
            </div>
            <div>
              <span>{t.dataSourceNotice} • {t.lastUpdated}: {formattedLastUpdated}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
