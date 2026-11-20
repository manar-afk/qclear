'use client';

import React, { useState } from 'react';
import { AirQualityData } from '@/services/aqi/types';
import { usePreferences } from '@/context/PreferencesContext';
import { TrendingUp, Wind, AlertOctagon } from 'lucide-react';

interface HourlyTrendChartProps {
  data: AirQualityData | null;
}

export function HourlyTrendChart({ data }: HourlyTrendChartProps) {
  const { language, t } = usePreferences();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hourly = data?.hourly || [];
  const ventilationWindow = data?.ventilationWindow;
  const peakSmogWindow = data?.peakSmogWindow;

  if (hourly.length === 0) {
    return null;
  }

  // Calculate SVG scales
  const maxPm25 = Math.max(...hourly.map((h) => h.pm2_5), 100);
  const chartHeight = 160;
  const chartWidth = 720;
  const paddingX = 24;
  const paddingY = 24;

  const points = hourly.map((h, i) => {
    const x = paddingX + (i / (hourly.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (h.pm2_5 / maxPm25) * (chartHeight - paddingY * 2);
    return { x, y, ...h };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill area under the curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm border space-y-5" aria-label="24-Hour Trend and Ventilation Forecast">
      {/* Header and Window Highlights */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t.trendTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.trendSubtitle}
          </p>
        </div>

        {/* Dynamic Derived Window Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {ventilationWindow && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold">
              <Wind className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>{t.ventilationWindowBadge}: {ventilationWindow.label}</span>
            </div>
          )}
          {peakSmogWindow && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-300 dark:border-rose-700 text-xs font-semibold">
              <AlertOctagon className="w-4 h-4 text-rose-600" aria-hidden="true" />
              <span>{t.peakSmogWindowBadge}: {peakSmogWindow.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[640px] relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible"
            role="img"
            aria-label="24-hour PM2.5 particulate concentration curve"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
            <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
            <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="currentColor" strokeOpacity="0.2" />

            {/* Area Fill */}
            <path d={areaD} fill="url(#curveGradient)" />

            {/* PM2.5 Line */}
            <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points & Interactive Tooltip Target */}
            {points.map((p, i) => {
              const isVentilation = ventilationWindow && p.hour >= ventilationWindow.startHour && p.hour < ventilationWindow.endHour;
              const isPeak = peakSmogWindow && p.hour >= peakSmogWindow.startHour && p.hour < peakSmogWindow.endHour;

              let fillColor = '#2563eb';
              if (isVentilation) fillColor = '#10b981';
              if (isPeak) fillColor = '#e11d48';

              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIndex === i ? 6 : 3.5}
                    fill={fillColor}
                    stroke="#ffffff"
                    strokeWidth={hoveredIndex === i ? 2.5 : 1.5}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  {/* Hour labels every 3 hours */}
                  {i % 3 === 0 && (
                    <text
                      x={p.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-400 font-medium"
                    >
                      {p.hour}:00
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hovered details box */}
          {hoveredIndex !== null && (
            <div
              className="absolute -top-3 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-md pointer-events-none z-10 space-y-0.5 border border-slate-700"
              style={{ left: `${(points[hoveredIndex].x / chartWidth) * 100}%` }}
            >
              <div className="font-bold">{points[hoveredIndex].hour}:00 Local Time</div>
              <div className="text-blue-300">PM2.5: {points[hoveredIndex].pm2_5} µg/m³</div>
              <div className="text-slate-300">AQI: {points[hoveredIndex].usAqi}</div>
            </div>
          )}
        </div>
      </div>

      {/* Explanatory notes on the derived windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
          <Wind className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>{t.recommendedVentilationText} ({ventilationWindow?.label}):</strong>{' '}
            {language === 'hi'
              ? 'इस समय हवा में प्रदूषण सबसे कम है। 15-20 मिनट के लिए क्रॉस-वेंटिलेशन करें।'
              : 'Safest window to crack windows for 15-20 min cross-ventilation to flush indoor VOCs.'}
          </span>
        </div>
        <div className="flex items-start gap-2 text-rose-800 dark:text-rose-300">
          <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>{t.peakSmogText} ({peakSmogWindow?.label}):</strong>{' '}
            {language === 'hi'
              ? 'तापमान उलटाव (thermal inversion) के कारण धुआं जमीन पर जमा है। खिड़कियां पूरी तरह बंद रखें।'
              : 'Thermal inversion traps particulates near the ground. Avoid outdoor exercise and seal drafty gaps.'}
          </span>
        </div>
      </div>
    </section>
  );
}
