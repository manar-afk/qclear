import { ImpactIntervention, ImpactCalculationResult } from './types';
import { IMPACT_ASSUMPTIONS } from './assumptions';

export const DEFAULT_INTERVENTIONS: ImpactIntervention[] = [
  {
    id: 'corsi_rosenthal_box',
    category: 'indoor_cleaner',
    titleEn: 'DIY Corsi-Rosenthal Filter Box',
    titleHi: 'सस्ता DIY कोर्सी-रोजेंथल फिल्टर बॉक्स',
    descriptionEn: '4 MERV-13 filters + box fan running continuous low/med mode (~70% recirculating reduction)',
    descriptionHi: '4 MERV-13 फिल्टर और बॉक्स पंखा (लगभग 70% इनडोर धुएं में कमी)',
    efficiencyOrReduction: IMPACT_ASSUMPTIONS.CORSI_ROSENTHAL_EFFICIENCY,
    weeklyCo2AvoidedGrams: 0,
    weeklyPmAvoidedGrams: 0,
    isDefaultSelected: true,
  },
  {
    id: 'weather_stripping',
    category: 'indoor_envelope',
    titleEn: 'Door & Window Draft Sealing',
    titleHi: 'दरवाजों और खिड़कियों की ड्राफ्ट सीलिंग',
    descriptionEn: 'Self-adhesive foam tape on exterior balcony doors & leaky window edges (~20% infiltration reduction)',
    descriptionHi: 'बालकनी के दरवाजों और खिड़कियों पर फोम टेप (लगभग 20% बाहरी धुएं की घुसपैठ में कमी)',
    efficiencyOrReduction: IMPACT_ASSUMPTIONS.DRAFT_SEALING_EFFICIENCY,
    weeklyCo2AvoidedGrams: 0,
    weeklyPmAvoidedGrams: 0,
    isDefaultSelected: true,
  },
  {
    id: 'damp_mopping',
    category: 'indoor_source',
    titleEn: 'Damp Mopping (No Dry Brooming)',
    titleHi: 'गीला पोछा (सूखी झाड़ू बिल्कुल नहीं)',
    descriptionEn: 'Prevents PM10/PM2.5 resuspension from dry sweeping (~6 µg/m³ indoor particulate reduction)',
    descriptionHi: 'सूखी झाड़ू से उड़ने वाली धूल रोकता है (लगभग 6 µg/m³ इनडोर धूल में कमी)',
    efficiencyOrReduction: IMPACT_ASSUMPTIONS.DAMP_MOPPING_INDOOR_SOURCE_REDUCTION_UG,
    weeklyCo2AvoidedGrams: 0,
    weeklyPmAvoidedGrams: 0,
    isDefaultSelected: true,
  },
  {
    id: 'kitchen_exhaust_timing',
    category: 'indoor_source',
    titleEn: 'Kitchen Exhaust & Door Closure During Cooking',
    titleHi: 'कुकिंग के समय एग्जॉस्ट फैन व रसोई का दरवाजा बंद रखना',
    descriptionEn: 'Isolates high-temperature oil tadka/frying emissions (~14 µg/m³ indoor particulate reduction)',
    descriptionHi: 'छौंक और तलने से उठने वाले भारी धुएं को कमरे में फैलने से रोकता है (~14 µg/m³ कमी)',
    efficiencyOrReduction: IMPACT_ASSUMPTIONS.KITCHEN_EXHAUST_TIMING_INDOOR_SOURCE_REDUCTION_UG,
    weeklyCo2AvoidedGrams: 0,
    weeklyPmAvoidedGrams: 0,
    isDefaultSelected: false,
  },
  {
    id: 'n95_commute_mask',
    category: 'commute_mask',
    titleEn: 'N95 Respirator for Daily Commute',
    titleHi: 'सफर के दौरान फिटेड N95 रेस्पिरेटर मास्क',
    descriptionEn: '95% filtration × 80% consumer fit factor = 76% effective inhaled particulate dose avoided',
    descriptionHi: '95% फिल्टरेशन क्षमता × 80% फिट फैक्टर = फेफड़ों में जाने वाले धुएं में 76% की कमी',
    efficiencyOrReduction: IMPACT_ASSUMPTIONS.N95_FILTER_MEDIA_EFFICIENCY * IMPACT_ASSUMPTIONS.MASK_CONSUMER_FIT_FACTOR,
    weeklyCo2AvoidedGrams: 0,
    weeklyPmAvoidedGrams: 0,
    isDefaultSelected: true,
  },
  {
    id: 'metro_transit_shift',
    category: 'sustainable_action',
    titleEn: 'Metro / Electric Transit vs Solo Two-Wheeler',
    titleHi: 'अकेले स्कूटर की जगह दिल्ली मेट्रो / इलेक्ट्रिक बस',
    descriptionEn: 'Reduces tailpipe exposure in urban street canyons; avoids ~2.1 kg CO2 weekly per commuter',
    descriptionHi: 'ट्रैफिक जाम में सीधे धुएं से बचाव; प्रति सप्ताह लगभग 2.1 किग्रा CO2 की बचत',
    efficiencyOrReduction: 0,
    weeklyCo2AvoidedGrams: IMPACT_ASSUMPTIONS.METRO_COMMUTE_WEEKLY_CO2_AVOIDED_G,
    weeklyPmAvoidedGrams: 15.0,
    isDefaultSelected: false,
  },
  {
    id: 'suppress_waste_burning',
    category: 'sustainable_action',
    titleEn: 'RWA Waste & Leaf Burning Suppression',
    titleHi: 'सूखे पत्तों व कचरे को जलाने पर RWA रोक',
    descriptionEn: 'Reporting and composting neighborhood horticultural waste; avoids ~120g toxic PM2.5 weekly',
    descriptionHi: 'कचरा जलाने के बजाय कम्पोस्टिंग; प्रति सप्ताह लगभग 120 ग्राम जहरीले PM2.5 से बचाव',
    efficiencyOrReduction: 0,
    weeklyCo2AvoidedGrams: 3200.0,
    weeklyPmAvoidedGrams: IMPACT_ASSUMPTIONS.WASTE_BURNING_SUPPRESSION_WEEKLY_PM_G,
    isDefaultSelected: false,
  },
  {
    id: 'electric_heating_swap',
    category: 'sustainable_action',
    titleEn: 'Electric Radiant Heater Swap (No Biomass Angeethi)',
    titleHi: 'अंगीठी/लकड़ी की जगह इलेक्ट्रिक हीटर का उपयोग',
    descriptionEn: 'Eliminates deadly carbon monoxide and heavy indoor smoke; avoids ~4.5 kg CO2 weekly',
    descriptionHi: 'कमरे में दम घोंटने वाली कार्बन मोनोऑक्साइड से मुक्ति; प्रति सप्ताह ~4.5 किग्रा CO2 बचत',
    efficiencyOrReduction: 0,
    weeklyCo2AvoidedGrams: IMPACT_ASSUMPTIONS.ELECTRIC_HEATING_SWAP_WEEKLY_CO2_G,
    weeklyPmAvoidedGrams: 85.0,
    isDefaultSelected: false,
  },
];

/**
 * Deterministic calculation of exposure reduction and emissions saved.
 * Guaranteed no NaN, no negative values, strictly bounded between 0% and 100%.
 */
export function calculateImpact(
  ambientPm25: number,
  selectedInterventionIds: string[],
  commuteMinutes = IMPACT_ASSUMPTIONS.DEFAULT_COMMUTE_MINUTES
): ImpactCalculationResult {
  const safeAmbient = Math.max(0, ambientPm25);
  const selectedSet = new Set(selectedInterventionIds);

  // 1. Unmitigated Indoor PM2.5
  // Outdoor infiltration portion + indoor generated baseline
  const F = IMPACT_ASSUMPTIONS.INFILTRATION_FACTOR_F; // 0.55
  const unmitigatedInfiltrated = safeAmbient * F;
  const unmitigatedIndoorGenerated = IMPACT_ASSUMPTIONS.INDOOR_GENERATED_BASELINE_PM25; // 25
  const unmitigatedIndoorPm25 = Math.round((unmitigatedInfiltrated + unmitigatedIndoorGenerated) * 10) / 10;

  // 2. Compute Envelope Reduction (e.g., weather stripping)
  let envelopeMultiplier = 1.0;
  if (selectedSet.has('weather_stripping')) {
    envelopeMultiplier *= (1 - IMPACT_ASSUMPTIONS.DRAFT_SEALING_EFFICIENCY);
  }

  // 3. Compute Air Cleaning Reduction (e.g., Corsi-Rosenthal box / HEPA)
  let cleanerMultiplier = 1.0;
  if (selectedSet.has('corsi_rosenthal_box')) {
    cleanerMultiplier *= (1 - IMPACT_ASSUMPTIONS.CORSI_ROSENTHAL_EFFICIENCY);
  }

  // Penetrated and cleaned outdoor portion
  const mitigatedInfiltrated = unmitigatedInfiltrated * envelopeMultiplier * cleanerMultiplier;

  // 4. Compute Indoor-Source Reduction (separate term acting on indoor-generated PM)
  let indoorSourceReductionUg = 0;
  if (selectedSet.has('damp_mopping')) {
    indoorSourceReductionUg += IMPACT_ASSUMPTIONS.DAMP_MOPPING_INDOOR_SOURCE_REDUCTION_UG;
  }
  if (selectedSet.has('kitchen_exhaust_timing')) {
    indoorSourceReductionUg += IMPACT_ASSUMPTIONS.KITCHEN_EXHAUST_TIMING_INDOOR_SOURCE_REDUCTION_UG;
  }

  const mitigatedIndoorGenerated = Math.max(0, unmitigatedIndoorGenerated - indoorSourceReductionUg);

  // Total mitigated indoor PM2.5
  const mitigatedIndoorPm25 = Math.round((mitigatedInfiltrated + mitigatedIndoorGenerated) * 10) / 10;

  // Absolute and percentage indoor reduction
  const indoorPm25ReducedUgM3 = Math.max(0, Math.round((unmitigatedIndoorPm25 - mitigatedIndoorPm25) * 10) / 10);
  const indoorPm25ReductionPercent = unmitigatedIndoorPm25 > 0
    ? Math.min(100, Math.max(0, Math.round((indoorPm25ReducedUgM3 / unmitigatedIndoorPm25) * 100)))
    : 0;

  // 5. Outdoor Commute Inhaled Dose Avoided
  // Note: N95 Mask does NOT reduce indoor PM2.5; it reduces outdoor inhaled dose during commute
  const isMaskActive = selectedSet.has('n95_commute_mask');
  let outdoorCommuteInhaledDoseAvoidedUg = 0;

  if (isMaskActive) {
    const hours = commuteMinutes / 60;
    const respirationVolumeM3 = IMPACT_ASSUMPTIONS.RESPIRATION_RATE_M3_PER_HOUR * hours;
    const effectiveMaskProtection = IMPACT_ASSUMPTIONS.N95_FILTER_MEDIA_EFFICIENCY * IMPACT_ASSUMPTIONS.MASK_CONSUMER_FIT_FACTOR; // 0.95 * 0.80 = 0.76
    // Dose avoided = Ambient PM2.5 (µg/m³) * Volume (m³) * Protection
    outdoorCommuteInhaledDoseAvoidedUg = Math.round(safeAmbient * respirationVolumeM3 * effectiveMaskProtection * 10) / 10;
  }

  // 6. Community Emissions Avoided (Weekly)
  let totalCo2AvoidedGrams = 0;
  let totalPmAvoidedGrams = 0;

  for (const item of DEFAULT_INTERVENTIONS) {
    if (selectedSet.has(item.id)) {
      totalCo2AvoidedGrams += item.weeklyCo2AvoidedGrams;
      totalPmAvoidedGrams += item.weeklyPmAvoidedGrams;
    }
  }

  return {
    ambientPm25: safeAmbient,
    unmitigatedIndoorPm25,
    mitigatedIndoorPm25,
    indoorPm25ReductionPercent,
    indoorPm25ReducedUgM3,
    outdoorCommuteInhaledDoseAvoidedUg,
    isMaskActive,
    weeklyCo2AvoidedKg: Math.round((totalCo2AvoidedGrams / 1000) * 10) / 10,
    weeklyPmAvoidedGrams: Math.round(totalPmAvoidedGrams * 10) / 10,
  };
}
