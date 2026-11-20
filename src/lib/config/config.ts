import { z } from 'zod';

export interface AppConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  GOOGLE_CLOUD_PROJECT?: string;
  GOOGLE_CLOUD_LOCATION: string;
  GEMINI_MODEL: string;
  WAQI_API_TOKEN?: string;
}

// Field-level schemas and safe defaults
const fieldSchemas = {
  NODE_ENV: {
    schema: z.enum(['development', 'production', 'test']),
    defaultValue: 'development' as const,
  },
  PORT: {
    schema: z.coerce.number().int().min(1).max(65535),
    defaultValue: 8080,
  },
  GOOGLE_CLOUD_PROJECT: {
    schema: z.string().trim().min(1).optional(),
    defaultValue: undefined,
  },
  GOOGLE_CLOUD_LOCATION: {
    schema: z.string().trim().min(1),
    defaultValue: 'global',
  },
  GEMINI_MODEL: {
    schema: z.string().trim().min(1),
    defaultValue: 'gemini-3.5-flash',
  },
  WAQI_API_TOKEN: {
    schema: z.string().trim().min(1).optional(),
    defaultValue: undefined,
  },
};

let cachedConfig: AppConfig | null = null;

/**
 * Validates environment variables per-field.
 * On invalid value, logs the specific failure and falls back only for that field.
 * Never throws at import or evaluation time.
 */
export function getEnv(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const validated: Partial<AppConfig> = {};

  // Validate NODE_ENV
  const nodeEnvResult = fieldSchemas.NODE_ENV.schema.safeParse(process.env.NODE_ENV);
  if (nodeEnvResult.success) {
    validated.NODE_ENV = nodeEnvResult.data;
  } else {
    if (process.env.NODE_ENV) {
      console.warn(`[Config Warning] Invalid NODE_ENV "${process.env.NODE_ENV}". Falling back to "${fieldSchemas.NODE_ENV.defaultValue}".`);
    }
    validated.NODE_ENV = fieldSchemas.NODE_ENV.defaultValue;
  }

  // Validate PORT
  const portResult = fieldSchemas.PORT.schema.safeParse(process.env.PORT);
  if (portResult.success) {
    validated.PORT = portResult.data;
  } else {
    if (process.env.PORT) {
      console.warn(`[Config Warning] Invalid PORT "${process.env.PORT}". Falling back to "${fieldSchemas.PORT.defaultValue}".`);
    }
    validated.PORT = fieldSchemas.PORT.defaultValue;
  }

  // Validate GOOGLE_CLOUD_PROJECT
  const projectResult = fieldSchemas.GOOGLE_CLOUD_PROJECT.schema.safeParse(process.env.GOOGLE_CLOUD_PROJECT);
  if (projectResult.success) {
    validated.GOOGLE_CLOUD_PROJECT = projectResult.data;
  } else {
    console.warn(`[Config Warning] Invalid GOOGLE_CLOUD_PROJECT. Running in Offline Guidance mode.`);
    validated.GOOGLE_CLOUD_PROJECT = fieldSchemas.GOOGLE_CLOUD_PROJECT.defaultValue;
  }

  // Validate GOOGLE_CLOUD_LOCATION
  const locationResult = fieldSchemas.GOOGLE_CLOUD_LOCATION.schema.safeParse(process.env.GOOGLE_CLOUD_LOCATION);
  if (locationResult.success) {
    validated.GOOGLE_CLOUD_LOCATION = locationResult.data;
  } else {
    if (process.env.GOOGLE_CLOUD_LOCATION) {
      console.warn(`[Config Warning] Invalid GOOGLE_CLOUD_LOCATION. Falling back to "${fieldSchemas.GOOGLE_CLOUD_LOCATION.defaultValue}".`);
    }
    validated.GOOGLE_CLOUD_LOCATION = fieldSchemas.GOOGLE_CLOUD_LOCATION.defaultValue;
  }

  // Validate GEMINI_MODEL
  const modelResult = fieldSchemas.GEMINI_MODEL.schema.safeParse(process.env.GEMINI_MODEL);
  if (modelResult.success) {
    validated.GEMINI_MODEL = modelResult.data;
  } else {
    if (process.env.GEMINI_MODEL) {
      console.warn(`[Config Warning] Invalid GEMINI_MODEL. Falling back to "${fieldSchemas.GEMINI_MODEL.defaultValue}".`);
    }
    validated.GEMINI_MODEL = fieldSchemas.GEMINI_MODEL.defaultValue;
  }

  // Validate WAQI_API_TOKEN
  const waqiResult = fieldSchemas.WAQI_API_TOKEN.schema.safeParse(process.env.WAQI_API_TOKEN);
  if (waqiResult.success) {
    validated.WAQI_API_TOKEN = waqiResult.data;
  } else {
    validated.WAQI_API_TOKEN = fieldSchemas.WAQI_API_TOKEN.defaultValue;
  }

  cachedConfig = validated as AppConfig;
  return cachedConfig;
}

/**
 * Resets cached configuration (for unit tests)
 */
export function resetConfigCache(): void {
  cachedConfig = null;
}
