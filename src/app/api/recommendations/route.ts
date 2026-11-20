import { NextRequest, NextResponse } from 'next/server';
import { recommendationRequestSchema, aiRecommendationsOutputSchema } from '@/lib/schemas/aiRequestSchema';
import { getVertexClient } from '@/services/ai/vertexClient';
import { buildPrompt } from '@/services/ai/promptBuilder';
import { getOfflineGuidance } from '@/services/ai/offlineGuidance';
import { recommendationsCache } from '@/lib/cache/memoryCache';
import { aiRateLimiter, getClientIp } from '@/lib/security/rateLimiter';
import { getEnv } from '@/lib/config/config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // 1. Rate limiting via proxy-aware IP extraction
  const ip = getClientIp(request.headers);
  const rateLimit = aiRateLimiter.check(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'AI recommendation rate limit exceeded. Please try again shortly.',
        retryAfter: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds || 60),
        },
      }
    );
  }

  // 2. Validate request payload
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const validation = recommendationRequestSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        details: validation.error.format(),
      },
      { status: 400 }
    );
  }

  const input = validation.data;
  const env = getEnv();

  // 3. Compute full-profile hash for caching
  const cacheKey = [
    input.category,
    input.household.commuteMode,
    input.household.homeSetup.hasPurifier,
    input.household.members.hasToddler,
    input.household.members.hasElderly,
    input.household.members.hasRespiratorySensitivity,
    input.language,
    input.simpleLanguage,
  ].join('_');

  const cachedResult = recommendationsCache.get(cacheKey);
  if (cachedResult) {
    return NextResponse.json(cachedResult);
  }

  // 4. Attempt Vertex AI generation if client is available
  const vertexClient = getVertexClient();

  if (vertexClient && env.GOOGLE_CLOUD_PROJECT) {
    try {
      const { systemInstruction, userPrompt } = buildPrompt(input);

      const response = await vertexClient.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
        config: {
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for deterministic adherence
        },
      });

      const responseText = response.text?.trim() || '';
      // Strip potential markdown code fences if LLM added them
      const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

      const parsedJson = JSON.parse(cleanedJson);
      const outputValidation = aiRecommendationsOutputSchema.safeParse(parsedJson);

      if (outputValidation.success) {
        const payload = {
          data: outputValidation.data,
          isAIGenerated: true,
          model: env.GEMINI_MODEL,
          timestamp: new Date().toISOString(),
        };
        recommendationsCache.set(cacheKey, payload);
        return NextResponse.json(payload);
      } else {
        console.warn('[Recommendations API] Gemini output schema validation failed:', outputValidation.error);
      }
    } catch (err: unknown) {
      console.warn('[Recommendations API] Vertex AI call failed or timed out:', err);
    }
  }

  // 5. High-quality Offline Guidance Fallback
  const offlineData = getOfflineGuidance(input);
  const fallbackPayload = {
    data: offlineData,
    isAIGenerated: false,
    model: 'offline-guidance',
    timestamp: new Date().toISOString(),
  };

  recommendationsCache.set(cacheKey, fallbackPayload, 15); // 15 min cache
  return NextResponse.json(fallbackPayload);
}
