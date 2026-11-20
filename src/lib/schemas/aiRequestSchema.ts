import { z } from 'zod';

export const recommendationRequestSchema = z.object({
  aqi: z.number().min(0).max(1000),
  pm2_5: z.number().min(0).max(2000),
  pm10: z.number().min(0).max(3000),
  category: z.enum(['good', 'moderate', 'sensitive', 'unhealthy', 'veryUnhealthy', 'hazardous']),
  ventilationWindow: z.string().default('13:00 - 16:00'),
  peakSmogWindow: z.string().default('06:00 - 09:00'),
  household: z.object({
    locationName: z.string().max(100),
    members: z.object({
      hasToddler: z.boolean(),
      hasElderly: z.boolean(),
      hasRespiratorySensitivity: z.boolean(),
    }),
    commuteMode: z.enum(['two_wheeler', 'car', 'transit', 'remote']),
    commuteMinutes: z.number().min(0).max(300),
    homeSetup: z.object({
      hasPurifier: z.boolean(),
      crossVentilation: z.boolean(),
      cookingFuel: z.enum(['lpg_gas', 'electric_induction', 'biomass']),
    }),
    communityRole: z.enum(['family', 'school', 'rwa']),
  }),
  language: z.enum(['en', 'hi']).default('en'),
  simpleLanguage: z.boolean().default(false),
});

export type RecommendationRequestInput = z.infer<typeof recommendationRequestSchema>;

export const routineItemSchema = z.object({
  timeBlock: z.string(), // e.g. "06:00 - 09:00"
  action: z.string(),
  rationale: z.string(),
  maskGuidance: z.string(),
  indoorPm25ReductionPct: z.number().min(0).max(100),
  weeklyEmissionsAvoidedG: z.number().min(0),
});

export const iaqHackItemSchema = z.object({
  tier: z.enum(['tier_0_free', 'tier_1_budget', 'tier_2_purifier']),
  title: z.string(),
  costEstimate: z.string(),
  actionSteps: z.string(),
  whyThisMatters: z.string(),
  indoorPm25ReductionPct: z.number().min(0).max(100),
  weeklyEmissionsAvoidedG: z.number().min(0),
});

export const sustainableAlternativeItemSchema = z.object({
  category: z.enum(['transport', 'heating', 'cooking', 'community']),
  title: z.string(),
  action: z.string(),
  whyThisMatters: z.string(),
  indoorPm25ReductionPct: z.number().min(0).max(100),
  weeklyEmissionsAvoidedG: z.number().min(0),
});

export const aiRecommendationsOutputSchema = z.object({
  dailyRoutines: z.array(routineItemSchema),
  iaqHacks: z.array(iaqHackItemSchema),
  sustainableAlternatives: z.array(sustainableAlternativeItemSchema),
});

export type AIRecommendationsOutput = z.infer<typeof aiRecommendationsOutputSchema>;
