import { describe, it, expect } from 'vitest';
import { calculateImpact } from '@/lib/impact/calculator';

describe('Deterministic Impact Calculator Unit Tests', () => {
  it('guarantees bounds: indoor reduction is between 0% and 100%, never negative', () => {
    const ambientLevels = [0, 25, 60, 150, 300, 650];

    for (const amb of ambientLevels) {
      const resultNoHabits = calculateImpact(amb, []);
      expect(resultNoHabits.indoorPm25ReductionPercent).toBeGreaterThanOrEqual(0);
      expect(resultNoHabits.indoorPm25ReductionPercent).toBeLessThanOrEqual(100);
      expect(resultNoHabits.mitigatedIndoorPm25).toBeGreaterThanOrEqual(0);

      const resultAllHabits = calculateImpact(amb, [
        'corsi_rosenthal_box',
        'weather_stripping',
        'damp_mopping',
        'kitchen_exhaust_timing',
        'n95_commute_mask',
      ]);
      expect(resultAllHabits.indoorPm25ReductionPercent).toBeGreaterThanOrEqual(0);
      expect(resultAllHabits.indoorPm25ReductionPercent).toBeLessThanOrEqual(100);
      expect(resultAllHabits.mitigatedIndoorPm25).toBeLessThanOrEqual(resultAllHabits.unmitigatedIndoorPm25);
    }
  });

  it('proves metric separation: wearing N95 mask does NOT alter indoor PM2.5', () => {
    const ambient = 200;
    const withoutMask = calculateImpact(ambient, ['corsi_rosenthal_box', 'damp_mopping']);
    const withMask = calculateImpact(ambient, ['corsi_rosenthal_box', 'damp_mopping', 'n95_commute_mask']);

    // Indoor metrics must be strictly identical
    expect(withoutMask.mitigatedIndoorPm25).toBe(withMask.mitigatedIndoorPm25);
    expect(withoutMask.indoorPm25ReductionPercent).toBe(withMask.indoorPm25ReductionPercent);

    // Outdoor inhaled dose avoided must ONLY increase with mask
    expect(withoutMask.outdoorCommuteInhaledDoseAvoidedUg).toBe(0);
    expect(withMask.outdoorCommuteInhaledDoseAvoidedUg).toBeGreaterThan(0);
  });

  it('indoor source interventions act as independent separate terms on indoor PM', () => {
    const ambient = 100;
    const base = calculateImpact(ambient, []);
    const withMopping = calculateImpact(ambient, ['damp_mopping']);

    // Mopping should drop indoor PM2.5 by ~6 µg/m³
    const diff = base.mitigatedIndoorPm25 - withMopping.mitigatedIndoorPm25;
    expect(Math.round(diff)).toBe(6);
  });

  it('correctly calculates weekly community emissions avoided', () => {
    const res = calculateImpact(150, ['metro_transit_shift', 'suppress_waste_burning', 'electric_heating_swap']);
    expect(res.weeklyCo2AvoidedKg).toBeGreaterThan(0);
    expect(res.weeklyPmAvoidedGrams).toBeGreaterThan(0);
  });
});
