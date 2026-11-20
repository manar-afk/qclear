import { GoogleGenAI } from '@google/genai';
import { getEnv } from '@/lib/config/config';

let cachedClient: GoogleGenAI | null = null;
let initialized = false;

/**
 * Returns the GoogleGenAI client configured in Vertex AI mode with ADC.
 * Returns null if GOOGLE_CLOUD_PROJECT is not set or SDK fails to initialize.
 */
export function getVertexClient(): GoogleGenAI | null {
  if (initialized) {
    return cachedClient;
  }

  initialized = true;
  const env = getEnv();

  if (!env.GOOGLE_CLOUD_PROJECT) {
    console.info('[VertexAI] GOOGLE_CLOUD_PROJECT is not configured. QCLEAR running in Curated Offline Guidance mode.');
    return null;
  }

  try {
    cachedClient = new GoogleGenAI({
      vertexai: true, // Lowercase vertexai SDK option
      project: env.GOOGLE_CLOUD_PROJECT,
      location: env.GOOGLE_CLOUD_LOCATION,
    });
    console.info(`[VertexAI] Initialized with project "${env.GOOGLE_CLOUD_PROJECT}" in location "${env.GOOGLE_CLOUD_LOCATION}".`);
    return cachedClient;
  } catch (err) {
    console.warn('[VertexAI] Failed to initialize GoogleGenAI in Vertex mode. Falling back to offline guidance:', err);
    cachedClient = null;
    return null;
  }
}
