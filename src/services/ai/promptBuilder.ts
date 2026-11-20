import { RecommendationRequestInput } from '@/lib/schemas/aiRequestSchema';

export function buildPrompt(input: RecommendationRequestInput): { systemInstruction: string; userPrompt: string } {
  const isHindi = input.language === 'hi';
  const isSimple = input.simpleLanguage;
  const isCleanAir = input.aqi <= 100;
  const isSevereSmog = input.aqi > 200;

  const systemInstruction = `You are QCLEAR, a certified urban environmental health and clean air specialist.
Your mission is to provide hyper-tailored daily routines, budget-friendly indoor air quality (IAQ) hacks, and sustainable swaps for families navigating urban air pollution.

CORE RULES:
1. Ground every recommendation in the live atmospheric air quality and the specific household demographic.
2. Tone & Advisory Direction:
${
  isCleanAir
    ? '   - AIR IS CURRENTLY ACCEPTABLE / CLEAN (AQI <= 100). Actively celebrate clean air! Recommend full natural cross-ventilation during daylight, outdoor exercise/sports, and running purifiers on low/eco mode to save electricity.'
    : isSevereSmog
    ? '   - AIR IS IN SEVERE SMOG / HAZARDOUS INVERSION (AQI > 200). Strict containment protocol: Keep windows hermetically sealed during inversion peaks, run purifiers continuously, avoid all outdoor morning exertion, wear fitted N95/N99 respirators for transit, and protect toddlers and elderly.'
    : '   - AIR IS MODERATE TO UNHEALTHY (AQI 101-200). Balanced precaution: protect sensitive members, time ventilation strictly during the cleanest window, and reduce prolonged outdoor exertion.'
}
3. Language: Respond in ${isHindi ? 'HINDI (हिन्दी)' : 'ENGLISH'}.
   - JSON keys MUST remain in English.
   - All string values (actions, rationales, steps) MUST be in ${isHindi ? 'clear Hindi (हिन्दी)' : 'fluent English'}.
${isSimple ? '   - Use SIMPLE LANGUAGE: Short sentences, plain everyday words, easily understood by children and elderly.' : ''}
4. Response Format: Return ONLY a valid JSON object matching the requested schema. No conversational preamble, no markdown backticks outside of JSON.`;

  const userPrompt = `LIVE ATMOSPHERIC READINGS:
- City: ${input.household.locationName}
- Current US AQI: ${input.aqi} (${input.category.toUpperCase()})
- Live PM2.5: ${input.pm2_5} µg/m³
- Live PM10: ${input.pm10} µg/m³
- Dynamically Derived Safe Ventilation Window: ${input.ventilationWindow}
- Dynamically Derived Peak Smog Inversion Window: ${input.peakSmogWindow}

HOUSEHOLD PROFILE:
- Vulnerable Members: Toddler: ${input.household.members.hasToddler ? 'YES' : 'NO'}, Elderly (65+): ${input.household.members.hasElderly ? 'YES' : 'NO'}, Asthma/Respiratory: ${input.household.members.hasRespiratorySensitivity ? 'YES' : 'NO'}
- Commute: ${input.household.commuteMode} (${input.household.commuteMinutes} mins daily)
- Home Setup: HEPA Purifier: ${input.household.homeSetup.hasPurifier ? 'YES' : 'NO'}, Cooking Fuel: ${input.household.homeSetup.cookingFuel}
- Community Role: ${input.household.communityRole.toUpperCase()}

Generate exactly:
1. "dailyRoutines": Array of 3-4 time-blocked routine items (Morning Inversion, Midday Ventilation Window, Evening Commute/Bedtime). Include specific window opening guidance, transit precautions, and N95 fit advice.
2. "iaqHacks": Array of 3 budget-tiered hacks (tier_0_free, tier_1_budget, tier_2_purifier). Include Corsi-Rosenthal DIY box, damp mopping vs sweeping, and kitchen exhaust timing.
3. "sustainableAlternatives": Array of 3 community actions (transport, heating, community leaf-burning suppression).

Output strict JSON.`;

  return { systemInstruction, userPrompt };
}
