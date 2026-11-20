import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getEnv, resetConfigCache } from '@/lib/config/config';

describe('Config Service Unit Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    resetConfigCache();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    resetConfigCache();
  });

  it('provides safe default values when env vars are absent', () => {
    const envObj = process.env as Record<string, string | undefined>;
    delete envObj.NODE_ENV;
    delete envObj.PORT;
    delete envObj.GOOGLE_CLOUD_PROJECT;
    delete envObj.GEMINI_MODEL;

    const config = getEnv();
    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(8080);
    expect(config.GOOGLE_CLOUD_PROJECT).toBeUndefined();
    expect(config.GOOGLE_CLOUD_LOCATION).toBe('global');
    expect(config.GEMINI_MODEL).toBe('gemini-3.5-flash');
  });

  it('validates per-field: bad PORT falls back to 8080 without discarding valid GEMINI_MODEL', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    process.env.PORT = 'not-a-number';
    process.env.GEMINI_MODEL = 'custom-gemini-model';
    process.env.GOOGLE_CLOUD_LOCATION = 'asia-south1';

    const config = getEnv();

    expect(config.PORT).toBe(8080);
    expect(config.GEMINI_MODEL).toBe('custom-gemini-model');
    expect(config.GOOGLE_CLOUD_LOCATION).toBe('asia-south1');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid PORT'));

    warnSpy.mockRestore();
  });

  it('accepts valid custom configuration', () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    process.env.PORT = '3000';
    process.env.GOOGLE_CLOUD_PROJECT = 'my-project-123';
    process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';
    process.env.GEMINI_MODEL = 'gemini-3.5-flash';

    const config = getEnv();

    expect(config.NODE_ENV).toBe('production');
    expect(config.PORT).toBe(3000);
    expect(config.GOOGLE_CLOUD_PROJECT).toBe('my-project-123');
    expect(config.GOOGLE_CLOUD_LOCATION).toBe('us-central1');
    expect(config.GEMINI_MODEL).toBe('gemini-3.5-flash');
  });
});
