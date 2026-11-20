import { z } from 'zod';

export const askRequestSchema = z.object({
  question: z.string().trim().min(3, 'Question must be at least 3 characters long').max(300, 'Question cannot exceed 300 characters'),
  aqi: z.number().min(0).max(1000),
  pm2_5: z.number().min(0).max(2000),
  pm10: z.number().min(0).max(3000),
  category: z.enum(['good', 'moderate', 'sensitive', 'unhealthy', 'veryUnhealthy', 'hazardous']),
  locationName: z.string().max(100).default('Current City'),
  household: z.object({
    hasToddler: z.boolean().default(false),
    hasElderly: z.boolean().default(false),
    hasRespiratorySensitivity: z.boolean().default(false),
    commuteMode: z.string().default('transit'),
    hasPurifier: z.boolean().default(false),
  }).optional(),
  language: z.enum(['en', 'hi']).default('en'),
  simpleLanguage: z.boolean().default(false),
});

export type AskRequestInput = z.infer<typeof askRequestSchema>;

export const askResponseSchema = z.object({
  answer: z.string().min(1),
  keyActionItem: z.string().min(1),
  severityAdvisory: z.string().min(1),
});

export type AskResponseOutput = z.infer<typeof askResponseSchema>;
