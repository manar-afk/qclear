import { TranslationDictionary } from './types';

export const en: TranslationDictionary = {
  appName: 'QCLEAR',
  tagline: 'Your GenAI Companion for Severe Winter Smog & Clean Urban Living',
  languageSwitch: 'हिन्दी',
  simpleLanguageToggle: 'Simple Language',
  highContrastToggle: 'High Contrast',
  refreshButton: 'Refresh Data',
  refreshing: 'Updating...',
  searchPlaceholder: 'Search city (e.g. New Delhi, Mumbai, Lahore)...',
  searchButton: 'Search',
  locating: 'Detecting GPS...',
  useMyLocation: 'Use My Location',
  lastUpdated: 'Last Updated',
  dataSourceNotice: 'Live Hourly Modelled AQI (Open-Meteo)',
  modeledEstimateNotice: 'Note: Values are atmospheric modelled estimates, not physical station readings.',

  // AQI Bands & Labels
  aqiGood: 'Good',
  aqiModerate: 'Moderate',
  aqiSensitive: 'Unhealthy for Sensitive Groups',
  aqiUnhealthy: 'Unhealthy',
  aqiVeryUnhealthy: 'Very Unhealthy',
  aqiHazardous: 'Hazardous',
  aqiSevere: 'Severe Smog Inversion',
  aqiLabel: 'US AQI',
  pm25Label: 'PM2.5 (Fine Particulates)',
  pm10Label: 'PM10 (Inhalable Dust)',
  no2Label: 'NO₂ (Nitrogen Dioxide)',
  o3Label: 'O₃ (Surface Ozone)',
  coLabel: 'CO (Carbon Monoxide)',

  // Trend Chart & Windows
  trendTitle: '24-Hour Air Quality & Ventilation Forecast',
  trendSubtitle: 'Dynamically calculated from real hourly PM2.5 dispersal patterns',
  ventilationWindowBadge: 'Safe Ventilation Window',
  peakSmogWindowBadge: 'Peak Smog Inversion Window',
  recommendedVentilationText: 'Recommended time to air rooms & cycle outdoor air',
  peakSmogText: 'Keep windows sealed; run purifiers on continuous mode',
  hourlyPm25: 'PM2.5 (µg/m³)',
  hourlyPm10: 'PM10 (µg/m³)',

  // Household Presets
  demoHouseholdsTitle: 'Demo Household Presets (One-Click Tailoring)',
  presetToddlerElderlyName: 'Family with Toddler & Elderly',
  presetToddlerElderlyDesc: 'High respiratory sensitivity, gas cooking, daily school transit',
  presetSchoolRwaName: 'School & RWA Leader',
  presetSchoolRwaDesc: 'Outdoor assembly decisions, campus waste-burning prevention, carpool routing',
  presetRemoteWorkerName: 'Remote Worker with Purifier',
  presetRemoteWorkerDesc: 'Home office sealing, delivery consolidation, motorized scooter transit',
  customProfile: 'Custom Household Profile',

  // Three Pillars
  pillarRoutines: 'Daily Routines',
  pillarHacks: 'IAQ Hacks',
  pillarAlternatives: 'Sustainable Alternatives',
  timeBlockedRoutinesTitle: 'Time-Blocked Daily Routines',
  indoorHacksTitle: 'Budget-Tiered Indoor Air Hacks',
  sustainableSwapsTitle: 'Community & Sustainable Alternatives',

  // Impact Badges
  whyThisMatters: 'Why This Matters',
  personalExposureReduction: 'Indoor PM2.5 Infiltration Avoided',
  outdoorDoseAvoided: 'Outdoor Commute Inhaled Dose Avoided',
  communityEmissionImpact: 'Community Emissions Avoided',
  estimateDisclaimer: 'Estimated impact based on mathematical dispersion models',
  aiGeneratedBadge: 'AI-Generated (Vertex AI)',
  offlineGuidanceBadge: 'Curated Offline Guidance',

  // Impact Simulator
  simulatorTitle: 'Interactive Impact Simulator & Habit Checklist',
  simulatorSubtitle: 'Check routines below to dynamically simulate personal exposure drops and collective community savings',
  cumulativePersonalExposure: 'Cumulative Indoor Exposure Avoided',
  cumulativeCommunityEmissions: 'Weekly Emissions Prevented',
  beforeAfterIndoorEstimate: 'Simulated Indoor PM2.5 Level',
  simulatedIndoorPm25: 'Simulated Indoor PM2.5',
  resetHabits: 'Reset Habits',
  selectAllHabits: 'Select All Habits',

  // DIY IAQ Card
  corsiTitle: 'DIY Corsi-Rosenthal Filter Box Guide',
  corsiSubtitle: 'Affordable, high-volume air cleaner (~200 CFM CADR) built from household box fan & MERV-13 filters',
  corsiMaterials: 'Materials: 1 standard 20" box fan, 4 or 5 MERV-13 furnace filters, duct tape, cardboard shroud.',
  corsiSteps: 'Tape filters into an airtight cube with airflow pointing inwards; tape fan on top blowing upwards; fit cardboard bottom.',
  corsiCostNote: 'Cost: ~₹1,800 ($22) vs ₹12,000+ commercial purifiers with equivalent clean air delivery.',

  // Ask QCLEAR Assistant
  askTitle: 'Ask QCLEAR Smog Assistant',
  askSubtitle: 'Ask real-time situational questions grounded in current AQI & your household setup',
  askPlaceholder: 'e.g. Is it safe for my 2-year-old to play outside today? Or should our school hold morning assembly?',
  askButton: 'Ask Question',
  askingButton: 'Analyzing AQI & Generating Guidance...',
  askSampleQ1: 'Can we hold an outdoor school sports assembly today?',
  askSampleQ2: 'How should I ventilate an infant bedroom during this smog level?',
  askSampleQ3: 'What is the best time for my outdoor evening walk today?',
  askDisclaimer: 'Non-Medical Notice: Answers are based on atmospheric models and public health guidelines. For respiratory emergencies, consult a medical doctor immediately.',

  // Disclaimers & Errors
  medicalDisclaimer: 'Medical Disclaimer: QCLEAR provides informational environmental wellness guidance. It is not a substitute for clinical medical advice. Individuals with acute respiratory or cardiovascular conditions must follow their physician instructions.',
  methodologyLink: 'Calculation Methodology & Documented Assumptions',
  rateLimitError: 'Request limit reached. Please wait a moment before refreshing.',
  upstreamError: 'Air quality service temporarily unavailable. Displaying cached data.',
  networkError: 'Unable to reach service. Please check your internet connection.',
};
