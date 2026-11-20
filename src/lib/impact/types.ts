export interface ImpactIntervention {
  id: string;
  category: 'indoor_envelope' | 'indoor_source' | 'indoor_cleaner' | 'commute_mask' | 'sustainable_action';
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  // Personal health efficiency (0 to 1) or particulate reduction in µg/m³
  efficiencyOrReduction: number;
  // Community emissions avoided per week (grams CO2 or grams PM)
  weeklyCo2AvoidedGrams: number;
  weeklyPmAvoidedGrams: number;
  isDefaultSelected?: boolean;
}

export interface ImpactCalculationResult {
  // Ambient PM2.5 reading used as input
  ambientPm25: number;

  // Personal Indoor Metrics
  unmitigatedIndoorPm25: number;     // Ambient * Infiltration Factor F + Indoor Baseline
  mitigatedIndoorPm25: number;       // Resulting indoor level after active interventions
  indoorPm25ReductionPercent: number;// % reduction in indoor PM2.5
  indoorPm25ReducedUgM3: number;     // Absolute drop in indoor PM2.5 (µg/m³)

  // Personal Outdoor / Commute Metrics
  outdoorCommuteInhaledDoseAvoidedUg: number; // Inhaled dose avoided during commute (µg/day)
  isMaskActive: boolean;

  // Collective Community Metrics
  weeklyCo2AvoidedKg: number;        // Kilograms of CO2 avoided per week
  weeklyPmAvoidedGrams: number;      // Grams of PM2.5/PM10 avoided per week
}
