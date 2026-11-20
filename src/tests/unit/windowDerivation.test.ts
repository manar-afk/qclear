import { describe, it, expect } from 'vitest';
import {
  deriveWindows,
  WAKING_HOURS_START,
  WAKING_HOURS_END,
  WINDOW_DURATION_HOURS,
} from '@/services/aqi/windowDerivation';
import { HourlyReading } from '@/services/aqi/types';

describe('Window Derivation Unit Tests', () => {
  it('correctly respects WAKING_HOURS constraint (7:00 to 21:00) for ventilation window', () => {
    // Construct 24 hours where 03:00 - 06:00 is artificially cleanest,
    // but 14:00 - 17:00 is cleanest during waking hours.
    const hourly: HourlyReading[] = Array.from({ length: 24 }, (_, hour) => {
      let pm25 = 200;
      if (hour >= 3 && hour <= 5) {
        pm25 = 15; // Cleanest overall, but during sleep!
      } else if (hour >= 13 && hour <= 15) {
        pm25 = 65; // Cleanest waking window
      } else if (hour >= 6 && hour <= 8) {
        pm25 = 350; // Severe morning inversion
      }

      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        pm2_5: pm25,
        pm10: pm25 * 1.5,
        usAqi: pm25 * 2,
      };
    });

    const { ventilationWindow, peakSmogWindow } = deriveWindows(hourly);

    // The ventilation window MUST start at or after WAKING_HOURS_START (7)
    // and end before or at WAKING_HOURS_END (21).
    expect(ventilationWindow.startHour).toBeGreaterThanOrEqual(WAKING_HOURS_START);
    expect(ventilationWindow.startHour + WINDOW_DURATION_HOURS).toBeLessThanOrEqual(WAKING_HOURS_END);

    // It should pick the 13:00 window, NOT the 03:00 window
    expect(ventilationWindow.startHour).toBe(13);
    expect(ventilationWindow.endHour).toBe(16);

    // Peak smog window is not restricted to waking hours; should detect the 06:00 inversion peak
    expect(peakSmogWindow.startHour).toBe(6);
    expect(peakSmogWindow.endHour).toBe(9);
    expect(peakSmogWindow.avgPm25).toBe(350);
  });

  it('peak smog window can occur outside waking hours (e.g. late night inversion)', () => {
    const hourly: HourlyReading[] = Array.from({ length: 24 }, (_, hour) => {
      // Hours 1, 2, 3 are in the middle of the night (01:00 - 04:00)
      const pm25 = hour >= 1 && hour <= 3 ? 400 : 120;
      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        pm2_5: pm25,
        pm10: pm25 * 1.5,
        usAqi: pm25 * 2,
      };
    });

    const { peakSmogWindow } = deriveWindows(hourly);
    expect(peakSmogWindow.startHour).toBe(1);
    expect(peakSmogWindow.endHour).toBe(4);
    expect(peakSmogWindow.avgPm25).toBe(400);
  });

  it('handles empty hourly arrays gracefully with defaults', () => {
    const { ventilationWindow, peakSmogWindow } = deriveWindows([]);
    expect(ventilationWindow.label).toBeDefined();
    expect(peakSmogWindow.label).toBeDefined();
  });
});
