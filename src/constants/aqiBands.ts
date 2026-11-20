import { AqiCategory } from '@/services/aqi/types';

export interface AqiBandInfo {
  category: AqiCategory;
  labelEn: string;
  labelHi: string;
  minAqi: number;
  maxAqi: number;
  color: string;
  badgeClass: string;
  patternClass: string;
  iconName: 'ShieldCheck' | 'AlertCircle' | 'AlertTriangle' | 'ShieldAlert' | 'Flame' | 'Biohazard';
  healthAdvisoryEn: string;
  healthAdvisoryHi: string;
}

export const AQI_BANDS: Record<AqiCategory, AqiBandInfo> = {
  good: {
    category: 'good',
    labelEn: 'Good',
    labelHi: 'अच्छा (Good)',
    minAqi: 0,
    maxAqi: 50,
    color: '#10B981',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
    patternClass: 'pattern-good',
    iconName: 'ShieldCheck',
    healthAdvisoryEn: 'Air quality is satisfactory. Ideal for active natural ventilation and outdoor activities.',
    healthAdvisoryHi: 'वायु गुणवत्ता संतोषजनक है। कमरों में ताजी हवा लाने और बाहरी गतिविधियों के लिए उपयुक्त समय।',
  },
  moderate: {
    category: 'moderate',
    labelEn: 'Moderate',
    labelHi: 'मध्यम (Moderate)',
    minAqi: 51,
    maxAqi: 100,
    color: '#F59E0B',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
    patternClass: 'pattern-moderate',
    iconName: 'AlertCircle',
    healthAdvisoryEn: 'Acceptable air quality. Unusually sensitive individuals should monitor outdoor exposure.',
    healthAdvisoryHi: 'स्वीकार्य वायु गुणवत्ता। अत्यधिक संवेदनशील लोग लंबे समय तक बाहर रहने से बचें।',
  },
  sensitive: {
    category: 'sensitive',
    labelEn: 'Unhealthy for Sensitive Groups',
    labelHi: 'संवेदनशील समूहों के लिए अस्वस्थ',
    minAqi: 101,
    maxAqi: 150,
    color: '#F97316',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700',
    patternClass: 'pattern-sensitive',
    iconName: 'AlertTriangle',
    healthAdvisoryEn: 'Children, elderly, and those with asthma or respiratory conditions should limit prolonged outdoor exertion.',
    healthAdvisoryHi: 'बच्चे, बुजुर्ग और अस्थमा या श्वसन संबंधी रोगी भारी बाहरी व्यायाम सीमित करें।',
  },
  unhealthy: {
    category: 'unhealthy',
    labelEn: 'Unhealthy',
    labelHi: 'अस्वस्थ (Unhealthy)',
    minAqi: 151,
    maxAqi: 200,
    color: '#EF4444',
    badgeClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700',
    patternClass: 'pattern-unhealthy',
    iconName: 'ShieldAlert',
    healthAdvisoryEn: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects. Wear N95 outdoors.',
    healthAdvisoryHi: 'सामान्य लोगों पर भी असर पड़ सकता है; संवेदनशील लोगों पर गंभीर प्रभाव। बाहर निकलते समय N95 मास्क पहनें।',
  },
  veryUnhealthy: {
    category: 'veryUnhealthy',
    labelEn: 'Very Unhealthy',
    labelHi: 'अत्यंत अस्वस्थ (Very Unhealthy)',
    minAqi: 201,
    maxAqi: 300,
    color: '#8B5CF6',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700',
    patternClass: 'pattern-very-unhealthy',
    iconName: 'Flame',
    healthAdvisoryEn: 'Health alert: risk of health effects increased for everyone. Seal room drafts and run air purifiers continuously.',
    healthAdvisoryHi: 'स्वास्थ्य चेतावनी: सभी के लिए स्वास्थ्य जोखिम। कमरों के झरोखे सील करें और एयर प्यूरीफायर चालू रखें।',
  },
  hazardous: {
    category: 'hazardous',
    labelEn: 'Hazardous / Severe Smog',
    labelHi: 'खतरनाक / गंभीर स्मॉग (Hazardous)',
    minAqi: 301,
    maxAqi: 1000,
    color: '#881337',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-700',
    patternClass: 'pattern-hazardous',
    iconName: 'Biohazard',
    healthAdvisoryEn: 'Emergency conditions: entire population is likely to be affected. Avoid all outdoor exertion; seal living spaces.',
    healthAdvisoryHi: 'आपातकालीन स्तर: पूरी आबादी प्रभावित हो सकती है। सभी बाहरी गतिविधियों से बचें; कमरे पूरी तरह बंद रखें।',
  },
};

export function getAqiCategory(usAqi: number): AqiCategory {
  if (usAqi <= 50) return 'good';
  if (usAqi <= 100) return 'moderate';
  if (usAqi <= 150) return 'sensitive';
  if (usAqi <= 200) return 'unhealthy';
  if (usAqi <= 300) return 'veryUnhealthy';
  return 'hazardous';
}
