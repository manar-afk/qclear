/**
 * QCLEAR Deterministic Impact Engine Assumptions
 *
 * CITATION DISCIPLINE:
 * - Only precisely named public sources (organization/author, title, year) with stable references are cited.
 * - All other numeric values are explicitly labelled [Illustrative Assumption].
 * - Model structure splits indoor ambient infiltration (C * F) from internal indoor-generated sources.
 */

export interface SourceCitation {
  key: string;
  sourceType: 'General Reference' | 'Standard' | 'Illustrative Assumption';
  reference: string;
  url?: string;
  notes: string;
}

export const IMPACT_ASSUMPTIONS = {
  /**
   * [Illustrative Assumption]
   * Infiltration factor F: The fraction of outdoor ambient PM2.5 penetrating an unsealed urban residence.
   * Default: 0.55 (surfaced in UI as a typical unsealed home estimate).
   */
  INFILTRATION_FACTOR_F: 0.55,

  /**
   * [Illustrative Assumption]
   * Baseline internal particulate matter generated indoors from cooking, dusting, and movement (µg/m³).
   */
  INDOOR_GENERATED_BASELINE_PM25: 25.0,

  /**
   * [Illustrative Assumption]
   * Corsi-Rosenthal box DIY clean air delivery rate filtration efficiency on recirculating room air.
   * (EPA guide is cited as a general reference on air cleaner principles; CR efficiency itself is an illustrative estimate).
   */
  CORSI_ROSENTHAL_EFFICIENCY: 0.70,

  /**
   * [Illustrative Assumption]
   * Door & window weather-stripping foam draft sealing infiltration reduction efficiency.
   */
  DRAFT_SEALING_EFFICIENCY: 0.20,

  /**
   * [Illustrative Assumption]
   * Internal source reduction from damp mopping instead of dry brooming (µg/m³ prevented).
   * Note: Acts directly on indoor-generated particulate matter, not multiplied into outdoor ambient infiltration.
   */
  DAMP_MOPPING_INDOOR_SOURCE_REDUCTION_UG: 6.0,

  /**
   * [Illustrative Assumption]
   * Internal source reduction from closing kitchen doors and running exhaust during frying/tadka (µg/m³ prevented).
   * Note: Acts directly on indoor-generated particulate matter, not multiplied into outdoor ambient infiltration.
   */
  KITCHEN_EXHAUST_TIMING_INDOOR_SOURCE_REDUCTION_UG: 14.0,

  /**
   * [Standard] National Ambient Air Quality Standard for 24-hr PM2.5 in India
   * Central Pollution Control Board (CPCB), "National Ambient Air Quality Standards", 2009.
   * Safe limit: 60 µg/m³.
   */
  CPCB_24HR_PM25_STANDARD_UG_M3: 60.0,

  /**
   * Commute / Outdoor Respiration Parameters:
   */
  // Light activity adult breathing volume in m³/hour
  // US EPA, "Exposure Factors Handbook", 2011 (Chapter 6: Inhalation Rates).
  RESPIRATION_RATE_M3_PER_HOUR: 0.80,

  // N95 / FFP2 filter media efficiency for fine particulates
  // NIOSH 42 CFR Part 84 standard.
  N95_FILTER_MEDIA_EFFICIENCY: 0.95,

  /**
   * [Illustrative Assumption]
   * Fit factor for non-fit-tested consumer mask wear (accounting for typical edge leakage).
   */
  MASK_CONSUMER_FIT_FACTOR: 0.80,

  /**
   * Average daily roundtrip commute time (minutes) used for exposure calculations.
   */
  DEFAULT_COMMUTE_MINUTES: 50.0,

  /**
   * Community Emissions Avoided per Week (Estimates):
   */
  // Shifting 10km daily roundtrip commute from solo petrol scooter to Electric Metro/Carpool (g CO2 avoided/week)
  // [Illustrative Assumption]
  METRO_COMMUTE_WEEKLY_CO2_AVOIDED_G: 2100.0,

  // Preventing 1 outdoor garden/garbage leaf pile burn event per week (g PM2.5 avoided)
  // [Illustrative Assumption]
  WASTE_BURNING_SUPPRESSION_WEEKLY_PM_G: 120.0,

  // Shifting room heating from smoky biomass brazier (angeethi) to electric radiant heater (g CO2 avoided/week)
  // [Illustrative Assumption]
  ELECTRIC_HEATING_SWAP_WEEKLY_CO2_G: 4500.0,
};

export const CITATIONS_REGISTRY: Record<string, SourceCitation> = {
  INFILTRATION_FACTOR_F: {
    key: 'INFILTRATION_FACTOR_F',
    sourceType: 'Illustrative Assumption',
    reference: 'Typical unsealed Indian urban dwelling baseline (illustrative default: 55% penetration).',
    notes: 'Surfaced transparently in the QCLEAR interface.',
  },
  EPA_AIR_CLEANERS_GENERAL: {
    key: 'EPA_AIR_CLEANERS_GENERAL',
    sourceType: 'General Reference',
    reference: 'US EPA, "Air Cleaners and Air Filters in the Home", 2018.',
    url: 'https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home',
    notes: 'General reference on portable air cleaner mechanisms and ventilation guidelines.',
  },
  CPCB_NAAQS_2009: {
    key: 'CPCB_NAAQS_2009',
    sourceType: 'Standard',
    reference: 'Central Pollution Control Board (CPCB), "National Ambient Air Quality Standards Notification", 2009.',
    url: 'https://cpcb.nic.in/air-pollution/',
    notes: 'Official Indian 24-hour PM2.5 threshold of 60 µg/m³.',
  },
  EPA_EXPOSURE_FACTORS: {
    key: 'EPA_EXPOSURE_FACTORS',
    sourceType: 'Standard',
    reference: 'US EPA, "Exposure Factors Handbook: 2011 Edition", Chapter 6: Inhalation Rates.',
    url: 'https://www.epa.gov/expobox/about-exposure-factors-handbook',
    notes: 'Derives the 0.8 m³/hr adult respiration rate during light transit activity.',
  },
  CORSI_ROSENTHAL_EFFICIENCY: {
    key: 'CORSI_ROSENTHAL_EFFICIENCY',
    sourceType: 'Illustrative Assumption',
    reference: '70% room air recirculating reduction based on 4-filter MERV-13 cube with 20" box fan.',
    notes: 'Labelled as an illustrative assumption.',
  },
  MASK_FIT_FACTOR: {
    key: 'MASK_FIT_FACTOR',
    sourceType: 'Illustrative Assumption',
    reference: '80% consumer fit factor multiplied with 95% N95 media efficiency = 76% effective dose reduction.',
    notes: 'A standard NIOSH N95 media retains 95%, but real-world unsealed edges reduce protection to ~76%.',
  },
};
