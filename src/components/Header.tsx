'use client';

import React from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { Wind, Languages, Eye, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenDisclaimer?: () => void;
}

export function Header({ onOpenDisclaimer }: HeaderProps) {
  const {
    language,
    setLanguage,
    isSimpleLanguage,
    toggleSimpleLanguage,
    isHighContrast,
    toggleHighContrast,
    t,
  } = usePreferences();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm transition-colors" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20" aria-hidden="true">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                QCLEAR
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {language === 'hi' ? 'शुद्ध वायु साथी' : 'CleanAir'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center gap-2 sm:gap-3" role="toolbar" aria-label="Application controls">
          {/* Simple Language Toggle */}
          <button
            type="button"
            onClick={toggleSimpleLanguage}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isSimpleLanguage
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
            aria-pressed={isSimpleLanguage}
            aria-label={t.simpleLanguageToggle}
            title={language === 'hi' ? 'छोटे और आसान शब्दों में मार्गदर्शन' : 'Short sentences and plain words'}
          >
            <span>{language === 'hi' ? 'सरल भाषा' : 'Plain Text'}</span>
          </button>

          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`min-h-[44px] min-w-[44px] p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all border ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-500 font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
            aria-pressed={isHighContrast}
            aria-label={t.highContrastToggle}
            title={t.highContrastToggle}
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">{t.highContrastToggle}</span>
          </button>

          {/* Language Switcher (EN / HI) */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm"
            aria-label={`Switch language to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            <Languages className="w-4 h-4" aria-hidden="true" />
            <span>{t.languageSwitch}</span>
          </button>

          {/* Methodology / Disclaimer Button */}
          {onOpenDisclaimer && (
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg"
              aria-label="View calculations methodology and medical disclaimer"
              title="Methodology & Disclaimer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
