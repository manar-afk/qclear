'use client';

import React, { useState } from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { AirQualityData } from '@/services/aqi/types';
import { HouseholdProfile } from '@/constants/presets';
import { AskResponseOutput } from '@/lib/schemas/askSchema';
import { MessageSquare, Sparkles, Shield, Send, AlertTriangle, CheckCircle } from 'lucide-react';

interface AskQClearProps {
  aqiData: AirQualityData | null;
  household: HouseholdProfile;
}

export function AskQClear({ aqiData, household }: AskQClearProps) {
  const { language, isSimpleLanguage, t } = usePreferences();

  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AskResponseOutput | null>(null);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [modelName, setModelName] = useState('offline-guidance');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleQuestions = [
    t.askSampleQ1,
    t.askSampleQ2,
    t.askSampleQ3,
  ];

  const handleAsk = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const q = (customQuestion ?? question).trim();
    if (!q || q.length < 3) return;

    setIsLoading(true);
    setError(null);

    const payload = {
      question: q,
      aqi: aqiData?.current.usAqi ?? 185,
      pm2_5: aqiData?.current.pm2_5 ?? 120,
      pm10: aqiData?.current.pm10 ?? 200,
      category: aqiData?.current.category ?? 'unhealthy',
      locationName: aqiData?.city ?? household.locationName,
      household: {
        hasToddler: household.members.hasToddler,
        hasElderly: household.members.hasElderly,
        hasRespiratorySensitivity: household.members.hasRespiratorySensitivity,
        commuteMode: household.commuteMode,
        hasPurifier: household.homeSetup.hasPurifier,
      },
      language,
      simpleLanguage: isSimpleLanguage,
    };

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to get answer`);
      }

      const json = await res.json();
      setResponse(json.data);
      setIsAIGenerated(Boolean(json.isAIGenerated));
      setModelName(json.model || 'offline-guidance');
    } catch (err: unknown) {
      console.warn('[AskQClear] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to query assistant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm border space-y-4" aria-label="Ask QCLEAR Situational Smog Assistant">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.askTitle}
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {t.askSubtitle}
        </span>
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-xs font-semibold text-slate-400 mr-1 self-center hidden sm:inline">
          {language === 'hi' ? 'सुझाए गए प्रश्न:' : 'Suggested Questions:'}
        </span>
        {sampleQuestions.map((qText, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setQuestion(qText);
              handleAsk(undefined, qText);
            }}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition text-left"
          >
            {qText}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => handleAsk(e)} className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, 300))}
            placeholder={t.askPlaceholder}
            disabled={isLoading}
            className="w-full pl-4 pr-28 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white disabled:opacity-60"
            aria-label={t.askPlaceholder}
          />
          <button
            type="submit"
            disabled={isLoading || question.trim().length < 3}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition flex items-center gap-1.5 shadow-sm"
          >
            {isLoading ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isLoading ? '...' : t.askButton}</span>
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>{language === 'hi' ? 'लाइव AQI व आपके परिवार प्रोफाइल पर आधारित' : 'Grounded in live AQI and your active profile'}</span>
          <span>{question.length}/300</span>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 text-xs border border-rose-200 dark:border-rose-800">
          {error}
        </div>
      )}

      {/* Answer Display */}
      {response && (
        <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-3 shadow-sm animate-fadeIn">
          {/* Badge */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isAIGenerated
                  ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {isAIGenerated ? (
                <>
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>AI-Generated ({modelName})</span>
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 text-slate-600" />
                  <span>{t.offlineGuidanceBadge}</span>
                </>
              )}
            </span>

            <span className="text-[11px] text-slate-500">
              AQI: {aqiData?.current.usAqi ?? 185} ({aqiData?.current.category?.toUpperCase()})
            </span>
          </div>

          {/* Core Answer */}
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            {response.answer}
          </p>

          {/* Action Item & Advisory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>{language === 'hi' ? 'मुख्य कदम:' : 'Key Action:'}</strong> {response.keyActionItem}</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong>{language === 'hi' ? 'स्थिति संदर्भ:' : 'Context:'}</strong> {response.severityAdvisory}</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            {t.askDisclaimer}
          </div>
        </div>
      )}
    </section>
  );
}
