interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * Extracts the real client IP from incoming request headers.
 * Under Google Cloud Run / reverse proxies, 'x-forwarded-for' contains
 * a comma-separated list of IPs: "client, proxy1, proxy2".
 * The first entry is the client's actual IP address.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp && firstIp !== 'unknown') {
      return firstIp;
    }
  }

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp && realIp !== 'unknown') {
    return realIp;
  }

  return '127.0.0.1';
}

export class RateLimiter {
  private requests = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 60, windowSeconds = 60) {
    this.maxRequests = maxRequests;
    this.windowMs = windowSeconds * 1000;
  }

  /**
   * Checks if an IP or identifier has exceeded the rate limit.
   * Returns { allowed: true } or { allowed: false, retryAfterSeconds }
   */
  check(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { allowed: true };
    }

    if (record.count >= this.maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    }

    record.count += 1;
    return { allowed: true };
  }

  reset(): void {
    this.requests.clear();
  }
}

// Global rate limiters (per-instance in-memory buckets)
export const aqiRateLimiter = new RateLimiter(60, 60);       // 60 req/min per IP
export const aiRateLimiter = new RateLimiter(20, 60);        // 20 req/min per IP
export const askRateLimiter = new RateLimiter(15, 60);       // 15 req/min per IP for Ask QCLEAR
