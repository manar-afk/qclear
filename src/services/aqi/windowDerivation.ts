import { HourlyReading, DerivedWindow } from './types';

/**
 * Named constants for waking hours (local time)
 * Ventilation window is restricted to waking hours so families don't get advised to open windows at 3 AM.
 */
export const WAKING_HOURS_START = 7;  // 07:00 local time
export const WAKING_HOURS_END = 21;    // 21:00 local time
export const WINDOW_DURATION_HOURS = 3;

/**
 * Formats hour integer to HH:00 display format (e.g. 7 -> "07:00")
 */
function formatHour(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  return `${normalized.toString().padStart(2, '0')}:00`;
}

/**
 * Derives the optimal ventilation window (safest waking hours to air rooms)
 * and the peak smog inversion window (highest particulate accumulation) from real hourly data.
 */
export function deriveWindows(hourly: HourlyReading[]): {
  ventilationWindow: DerivedWindow;
  peakSmogWindow: DerivedWindow;
} {
  if (!hourly || hourly.length === 0) {
    // Safe fallback if hourly data is empty
    return {
      ventilationWindow: {
        startHour: 13,
        endHour: 16,
        label: '13:00 - 16:00',
        avgPm25: 50,
        description: 'Recommended daytime ventilation window (fallback)',
      },
      peakSmogWindow: {
        startHour: 6,
        endHour: 9,
        label: '06:00 - 09:00',
        avgPm25: 180,
        description: 'Morning thermal inversion smog peak (fallback)',
      },
    };
  }

  // 1. Calculate Peak Smog Inversion Window across ALL hours (0 - 23)
  let maxAvgPm25 = -Infinity;
  let peakStartHour = 0;

  for (let i = 0; i <= hourly.length - WINDOW_DURATION_HOURS; i++) {
    const windowSlice = hourly.slice(i, i + WINDOW_DURATION_HOURS);
    const avg = windowSlice.reduce((sum, h) => sum + h.pm2_5, 0) / WINDOW_DURATION_HOURS;

    if (avg > maxAvgPm25) {
      maxAvgPm25 = avg;
      peakStartHour = windowSlice[0].hour;
    }
  }

  const peakEndHour = (peakStartHour + WINDOW_DURATION_HOURS) % 24;

  // 2. Calculate Ventilation Window ONLY within waking hours [WAKING_HOURS_START, WAKING_HOURS_END]
  let minAvgPm25 = Infinity;
  let ventStartHour = WAKING_HOURS_START;

  // Filter or search windows where the entire 3-hour window falls within [WAKING_HOURS_START, WAKING_HOURS_END]
  for (let i = 0; i <= hourly.length - WINDOW_DURATION_HOURS; i++) {
    const windowSlice = hourly.slice(i, i + WINDOW_DURATION_HOURS);
    const startH = windowSlice[0].hour;
    const endH = startH + WINDOW_DURATION_HOURS;

    // Check waking hours constraint
    const isWithinWaking = startH >= WAKING_HOURS_START && endH <= WAKING_HOURS_END;

    if (isWithinWaking) {
      const avg = windowSlice.reduce((sum, h) => sum + h.pm2_5, 0) / WINDOW_DURATION_HOURS;
      if (avg < minAvgPm25) {
        minAvgPm25 = avg;
        ventStartHour = startH;
      }
    }
  }

  // If no waking window found (e.g. data spans fewer hours), fall back to best overall in daylight
  if (minAvgPm25 === Infinity) {
    minAvgPm25 = maxAvgPm25;
    ventStartHour = WAKING_HOURS_START;
  }

  const ventEndHour = (ventStartHour + WINDOW_DURATION_HOURS) % 24;

  return {
    ventilationWindow: {
      startHour: ventStartHour,
      endHour: ventEndHour,
      label: `${formatHour(ventStartHour)} - ${formatHour(ventEndHour)}`,
      avgPm25: Math.round(minAvgPm25 * 10) / 10,
      description: `Lowest PM2.5 period during waking hours (${Math.round(minAvgPm25)} µg/m³ average). Safest time to ventilate.`,
    },
    peakSmogWindow: {
      startHour: peakStartHour,
      endHour: peakEndHour,
      label: `${formatHour(peakStartHour)} - ${formatHour(peakEndHour)}`,
      avgPm25: Math.round(maxAvgPm25 * 10) / 10,
      description: `Severe particulate accumulation peak (${Math.round(maxAvgPm25)} µg/m³ average). Keep windows sealed.`,
    },
  };
}
