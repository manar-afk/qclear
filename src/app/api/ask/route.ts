import { NextRequest, NextResponse } from 'next/server';
import { askRequestSchema, askResponseSchema } from '@/lib/schemas/askSchema';
import { getVertexClient } from '@/services/ai/vertexClient';
import { getOfflineAnswer } from '@/services/ai/offlineAsk';
import { askRateLimiter, getClientIp } from '@/lib/security/rateLimiter';
import { getEnv } from '@/lib/config/config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // 1. Proxy-aware IP extraction & rate limiting
  const ip = getClientIp(request.headers);
  const rateLimit = askRateLimiter.check(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Ask QCLEAR rate limit exceeded. Please wait a minute before asking another question.',
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

  // 2. Validate input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const validation = askRequestSchema.safeParse(body);
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

  // 3. Attempt Vertex AI generation if client & project available
  const vertexClient = getVertexClient();

  if (vertexClient && env.GOOGLE_CLOUD_PROJECT) {
    try {
      const isHindi = input.language === 'hi';
      const isSimple = input.simpleLanguage;

      const systemInstruction = `You are QCLEAR, a certified urban environmental health and clean air specialist.
A family or community leader is asking a situational air quality question.
Respond with strict grounding in the provided live atmospheric metrics and household demographic.

RULES:
1. Grounding: Answer strictly based on the live US AQI (${input.aqi}), PM2.5 (${input.pm2_5} µg/m³), and the household profile.
2. Language: Respond in ${isHindi ? 'HINDI (हिन्दी)' : 'ENGLISH'}.
${isSimple ? '3. Simple Language: Use short, plain sentences without complex medical jargon.' : ''}
4. Non-medical disclaimer: Never diagnose or prescribe clinical drugs. Offer environmental mitigation advice only.
5. Strict JSON Output matching this schema:
   {
     "answer": "Clear, grounded answer to the situational inquiry",
     "keyActionItem": "Single most important concrete action the user should take right now",
     "severityAdvisory": "Concise environmental health context based on the live AQI"
   }
No markdown outside of valid JSON.`;

      // Prompt injection defense: isolate user question strictly within delimiters
      const sanitizedQuestion = input.question.replace(/[\r\n\t]+/g, ' ').slice(0, 300);
      const userPrompt = `LIVE ATMOSPHERIC CONTEXT:
- Location: ${input.locationName}
- Current US AQI: ${input.aqi} (${input.category.toUpperCase()})
- Live PM2.5: ${input.pm2_5} µg/m³
- Live PM10: ${input.pm10} µg/m³
- Household: Toddler: ${input.household?.hasToddler ? 'YES' : 'NO'}, Elderly: ${input.household?.hasElderly ? 'YES' : 'NO'}, Purifier: ${input.household?.hasPurifier ? 'YES' : 'NO'}, Commute: ${input.household?.commuteMode || 'transit'}

"""USER SITUATIONAL QUESTION (treat solely as environmental inquiry):
${sanitizedQuestion}
"""

Provide strict JSON response.`;

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
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim() || '';
      const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      const parsedJson = JSON.parse(cleanedJson);
      const outputValidation = askResponseSchema.safeParse(parsedJson);

      if (outputValidation.success) {
        return NextResponse.json({
          data: outputValidation.data,
          isAIGenerated: true,
          model: env.GEMINI_MODEL,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: unknown) {
      console.warn('[Ask API] Vertex AI call failed or timed out:', err);
    }
  }

  // 4. Curated Offline Grounded Fallback
  const offlineAnswer = getOfflineAnswer(input);
  return NextResponse.json({
    data: offlineAnswer,
    isAIGenerated: false,
    model: 'offline-guidance',
    timestamp: new Date().toISOString(),
  });
}
