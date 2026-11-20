import { describe, it, expect } from 'vitest';
import { calculateImpact, DEFAULT_INTERVENTIONS } from '@/lib/impact/calculator';

describe('Habit Checklist & Simulator Interaction Tests', () => {
  it('toggling habit on and off dynamically updates cumulative exposure and emissions', () => {
    const ambient = 200;
    const initialHabits = ['corsi_rosenthal_box'];
    const initialResult = calculateImpact(ambient, initialHabits);

    // Toggle on 'weather_stripping'
    const updatedHabits = [...initialHabits, 'weather_stripping'];
    const updatedResult = calculateImpact(ambient, updatedHabits);

    // Mitigated indoor PM2.5 should decrease further with draft sealing
    expect(updatedResult.mitigatedIndoorPm25).toBeLessThan(initialResult.mitigatedIndoorPm25);
    expect(updatedResult.indoorPm25ReductionPercent).toBeGreaterThan(initialResult.indoorPm25ReductionPercent);

    // Toggle on a community intervention ('metro_transit_shift')
    const withCommunity = [...updatedHabits, 'metro_transit_shift'];
    const communityResult = calculateImpact(ambient, withCommunity);

    expect(communityResult.weeklyCo2AvoidedKg).toBeGreaterThan(updatedResult.weeklyCo2AvoidedKg);

    // Toggle off 'corsi_rosenthal_box'
    const withoutCorsi = withCommunity.filter((h) => h !== 'corsi_rosenthal_box');
    const withoutCorsiResult = calculateImpact(ambient, withoutCorsi);

    expect(withoutCorsiResult.mitigatedIndoorPm25).toBeGreaterThan(communityResult.mitigatedIndoorPm25);
  });

  it('select all habits includes all interventions from DEFAULT_INTERVENTIONS', () => {
    const allIds = DEFAULT_INTERVENTIONS.map((i) => i.id);
    const result = calculateImpact(250, allIds);

    expect(result.indoorPm25ReductionPercent).toBeGreaterThan(60);
    expect(result.weeklyCo2AvoidedKg).toBeGreaterThan(5);
    expect(result.isMaskActive).toBe(true);
    expect(result.outdoorCommuteInhaledDoseAvoidedUg).toBeGreaterThan(0);
  });
});
