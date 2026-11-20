export interface TranslationDictionary {
  appName: string;
  tagline: string;
  languageSwitch: string;
  simpleLanguageToggle: string;
  highContrastToggle: string;
  refreshButton: string;
  refreshing: string;
  searchPlaceholder: string;
  searchButton: string;
  locating: string;
  useMyLocation: string;
  lastUpdated: string;
  dataSourceNotice: string;
  modeledEstimateNotice: string;

  // AQI Bands & Labels
  aqiGood: string;
  aqiModerate: string;
  aqiSensitive: string;
  aqiUnhealthy: string;
  aqiVeryUnhealthy: string;
  aqiHazardous: string;
  aqiSevere: string;
  aqiLabel: string;
  pm25Label: string;
  pm10Label: string;
  no2Label: string;
  o3Label: string;
  coLabel: string;

  // Trend Chart & Windows
  trendTitle: string;
  trendSubtitle: string;
  ventilationWindowBadge: string;
  peakSmogWindowBadge: string;
  recommendedVentilationText: string;
  peakSmogText: string;
  hourlyPm25: string;
  hourlyPm10: string;

  // Household Presets
  demoHouseholdsTitle: string;
  presetToddlerElderlyName: string;
  presetToddlerElderlyDesc: string;
  presetSchoolRwaName: string;
  presetSchoolRwaDesc: string;
  presetRemoteWorkerName: string;
  presetRemoteWorkerDesc: string;
  customProfile: string;

  // Three Pillars
  pillarRoutines: string;
  pillarHacks: string;
  pillarAlternatives: string;
  timeBlockedRoutinesTitle: string;
  indoorHacksTitle: string;
  sustainableSwapsTitle: string;

  // Impact Badges
  whyThisMatters: string;
  personalExposureReduction: string;
  outdoorDoseAvoided: string;
  communityEmissionImpact: string;
  estimateDisclaimer: string;
  aiGeneratedBadge: string;
  offlineGuidanceBadge: string;

  // Impact Simulator
  simulatorTitle: string;
  simulatorSubtitle: string;
  cumulativePersonalExposure: string;
  cumulativeCommunityEmissions: string;
  beforeAfterIndoorEstimate: string;
  simulatedIndoorPm25: string;
  resetHabits: string;
  selectAllHabits: string;

  // DIY IAQ Card
  corsiTitle: string;
  corsiSubtitle: string;
  corsiMaterials: string;
  corsiSteps: string;
  corsiCostNote: string;

  // Ask QCLEAR Assistant
  askTitle: string;
  askSubtitle: string;
  askPlaceholder: string;
  askButton: string;
  askingButton: string;
  askSampleQ1: string;
  askSampleQ2: string;
  askSampleQ3: string;
  askDisclaimer: string;

  // Disclaimers & Errors
  medicalDisclaimer: string;
  methodologyLink: string;
  rateLimitError: string;
  upstreamError: string;
  networkError: string;
}
