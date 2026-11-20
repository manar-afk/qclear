interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMinutes = 10) {
    this.defaultTtlMs = defaultTtlMinutes * 60 * 1000;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T, customTtlMinutes?: number): void {
    const ttl = customTtlMinutes ? customTtlMinutes * 60 * 1000 : this.defaultTtlMs;
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global singletons for server routes
export const aqiCache = new MemoryCache<any>(10); // 10 min TTL
export const recommendationsCache = new MemoryCache<any>(60); // 60 min TTL
