'use client';

import React, { useState } from 'react';
import { DEFAULT_INTERVENTIONS, calculateImpact } from '@/lib/impact/calculator';
import { usePreferences } from '@/context/PreferencesContext';
import {
  SlidersHorizontal,
  CheckCircle2,
  Circle,
  RotateCcw,
  CheckCheck,
  ShieldAlert,
  HeartPulse,
  Leaf,
  Info,
} from 'lucide-react';

interface ImpactSimulatorProps {
  ambientPm25: number;
}

export function ImpactSimulator({ ambientPm25 }: ImpactSimulatorProps) {
  const { language, t } = usePreferences();

  // Initialize with default selected interventions
  const [selectedHabits, setSelectedHabits] = useState<string[]>(
    DEFAULT_INTERVENTIONS.filter((i) => i.isDefaultSelected).map((i) => i.id)
  );

  const toggleHabit = (id: string) => {
    setSelectedHabits((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedHabits(DEFAULT_INTERVENTIONS.map((i) => i.id));
  };

  const resetAll = () => {
    setSelectedHabits([]);
  };

  // Deterministically compute impact from LIVE ambient PM2.5
  const impact = calculateImpact(ambientPm25, selectedHabits);

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm border space-y-6" aria-label="Interactive Impact Simulator">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t.simulatorTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.simulatorSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={selectAll}
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{t.selectAllHabits}</span>
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetHabits}</span>
          </button>
        </div>
      </div>

      {/* Live Metric Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Simulated Indoor PM2.5 Meter */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-900/60 border border-blue-100 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>{t.beforeAfterIndoorEstimate}</span>
            <span className="text-[11px] text-slate-400">Baseline: {impact.unmitigatedIndoorPm25} µg/m³</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
              {impact.mitigatedIndoorPm25}
            </span>
            <span className="text-sm font-semibold text-slate-500">µg/m³</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(5, (impact.mitigatedIndoorPm25 / Math.max(1, impact.unmitigatedIndoorPm25)) * 100))}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? `बाहरी हवा (${ambientPm25} µg/m³) से कमरे का धुआं घटाकर ${impact.mitigatedIndoorPm25} µg/m³ किया`
              : `Reduced from unmitigated ${impact.unmitigatedIndoorPm25} µg/m³ ambient baseline`}
          </p>
        </div>

        {/* Indoor Exposure Avoided % */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-slate-800 dark:to-slate-900/60 border border-emerald-100 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>{t.cumulativePersonalExposure}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {impact.indoorPm25ReductionPercent}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              ({impact.indoorPm25ReducedUgM3} µg/m³ saved)
            </span>
          </div>
          <div className="w-full bg-emerald-200 dark:bg-emerald-950 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${impact.indoorPm25ReductionPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {impact.isMaskActive
              ? language === 'hi'
                ? `सफर में N95 से फेफड़ों में ${impact.outdoorCommuteInhaledDoseAvoidedUg} µg धुआं जाने से बचा`
                : `Plus ~${impact.outdoorCommuteInhaledDoseAvoidedUg} µg/day outdoor inhaled dose avoided via N95`
              : language === 'hi'
              ? 'N95 मास्क जोड़ने पर बाहरी सफर में भी 76% सुरक्षा मिलेगी'
              : 'Add N95 respirator habit to protect outdoor transit dose'}
          </p>
        </div>

        {/* Community Emissions Avoided */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-900/60 border border-purple-100 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-800 dark:text-purple-300">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-purple-600" />
              <span>{t.cumulativeCommunityEmissions}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">
              {impact.weeklyCo2AvoidedKg}
            </span>
            <span className="text-sm font-semibold text-slate-500">kg CO₂ / week</span>
          </div>
          <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">
            + {impact.weeklyPmAvoidedGrams}g PM avoided
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'सामुदायिक कचरा रोकने व मेट्रो सफर से वायुमंडल में धुएं की बचत'
              : 'Collective emissions prevented from reaching neighborhood ambient air'}
          </p>
        </div>
      </div>

      {/* Habits Toggle Checklist */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          {language === 'hi' ? 'आदतें व सुरक्षा उपाय चुनें (लाइव प्रभाव देखें):' : 'Select Routines & Hacks to Apply:'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEFAULT_INTERVENTIONS.map((item) => {
            const isSelected = selectedHabits.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleHabit(item.id)}
                className={`p-3.5 rounded-xl text-left transition border flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
                role="checkbox"
                aria-checked={isSelected}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {language === 'hi' ? item.titleHi : item.titleEn}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    {language === 'hi' ? item.descriptionHi : item.descriptionEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface Assumptions Footnote */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        <span>
          Mathematical assumptions: Building envelope infiltration factor F = 0.55 [Illustrative default for typical unsealed urban homes]; mask dose uses 0.8 m³/hr breathing volume and 80% consumer fit factor.
        </span>
      </div>
    </section>
  );
}
