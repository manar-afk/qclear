import { describe, it, expect } from 'vitest';
import { en } from '@/lib/i18n/en';
import { hi } from '@/lib/i18n/hi';

describe('i18n Key Parity Unit Test', () => {
  it('en.ts and hi.ts must have identical sets of keys', () => {
    const enKeys = Object.keys(en).sort();
    const hiKeys = Object.keys(hi).sort();

    expect(enKeys).toEqual(hiKeys);
  });

  it('no translated strings should be empty', () => {
    Object.entries(en).forEach(([key, val]) => {
      expect(val.trim().length, `English key ${key} is empty`).toBeGreaterThan(0);
    });
    Object.entries(hi).forEach(([key, val]) => {
      expect(val.trim().length, `Hindi key ${key} is empty`).toBeGreaterThan(0);
    });
  });
});
