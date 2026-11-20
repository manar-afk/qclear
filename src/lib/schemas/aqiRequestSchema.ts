import { z } from 'zod';

export const aqiQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).default(28.6139),
  lon: z.coerce.number().min(-180).max(180).default(77.2090),
  city: z.string().trim().max(100).default('New Delhi'),
  search: z.string().trim().max(100).optional(),
});

export type AqiQueryInput = z.infer<typeof aqiQuerySchema>;
