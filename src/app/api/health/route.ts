import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/config/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const env = getEnv();

  return NextResponse.json(
    {
      status: 'healthy',
      app: 'QCLEAR',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      aiMode: env.GOOGLE_CLOUD_PROJECT ? 'vertex-ai' : 'offline-guidance',
      geminiModel: env.GEMINI_MODEL,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
