'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, getTranslations, TranslationDictionary } from '@/lib/i18n';

interface PreferencesContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isSimpleLanguage: boolean;
  toggleSimpleLanguage: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  t: TranslationDictionary;
}

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isSimpleLanguage, setIsSimpleLanguage] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Language persistence
    const savedLang = localStorage.getItem('qclear_lang') as Language | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
    } else {
      // Browser language check
      const navLang = navigator.language.toLowerCase();
      const detected: Language = navLang.startsWith('hi') ? 'hi' : 'en';
      setLanguageState(detected);
      document.documentElement.lang = detected;
    }

    // 2. Simple language persistence
    const savedSimple = localStorage.getItem('qclear_simple_lang');
    if (savedSimple) {
      setIsSimpleLanguage(savedSimple === 'true');
    }

    // 3. High contrast persistence
    const savedContrast = localStorage.getItem('qclear_high_contrast');
    if (savedContrast === 'true') {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('qclear_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleSimpleLanguage = () => {
    setIsSimpleLanguage(prev => {
      const next = !prev;
      localStorage.setItem('qclear_simple_lang', String(next));
      return next;
    });
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => {
      const next = !prev;
      localStorage.setItem('qclear_high_contrast', String(next));
      if (next) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return next;
    });
  };

  const t = getTranslations(language);

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        isSimpleLanguage,
        toggleSimpleLanguage,
        isHighContrast,
        toggleHighContrast,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
