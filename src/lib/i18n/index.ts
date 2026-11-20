import { en } from './en';
import { hi } from './hi';
import { TranslationDictionary } from './types';

export type Language = 'en' | 'hi';

export function getTranslations(lang: Language): TranslationDictionary {
  return lang === 'hi' ? hi : en;
}

export * from './types';
export { en, hi };
