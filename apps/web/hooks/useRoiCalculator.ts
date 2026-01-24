import { useState, useMemo, useCallback } from 'react';

// Biznesowe stałe (jedno miejsce do zmiany i testów)
const WEEKS_PER_MONTH = 4.33;
const EFFICIENCY_GAIN = 0.45;

// Guardrails (żeby UI nie rozwaliło matematyki)
const LIMITS = {
  analysts: { min: 1, max: 200 },
  hoursPerAnalystPerWeek: { min: 0, max: 80 },
} as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export type Segment = 'ecommerce' | 'agency' | 'enterprise';

interface UseRoiCalculatorProps {
  rateEco: number;
  rateAge: number;
  rateEnt: number;

  /**
   * Opcjonalnie: segment startowy (np. na landing najczęściej ecommerce)
   */
  defaultSegment?: Segment;

  /**
   * Opcjonalnie: startowe wartości (np. pod presety w UI)
   */
  defaultAnalysts?: number;
  defaultHoursPerAnalystPerWeek?: number;
}

/**
 * Headless ROI Calculator Hook
 * Centralizes all mathematical formulas and business rules for PapaData savings estimations.
 *
 * Założenia:
 * - 4.33 tygodnia / miesiąc (średnia)
 * - Efficiency gain: 45% czasu odzyskanego dzięki automatyzacji
 *
 * UWAGA: Hook zwraca liczby bez waluty. Format PLN rób w warstwie UI.
 */
export const useRoiCalculator = ({
  rateEco,
  rateAge,
  rateEnt,
  defaultSegment = 'ecommerce',
  defaultAnalysts = 3,
  defaultHoursPerAnalystPerWeek = 12,
}: UseRoiCalculatorProps) => {
  const [segment, setSegment] = useState<Segment>(defaultSegment);
  const [analysts, setAnalysts] = useState(() =>
    clamp(Math.floor(defaultAnalysts), LIMITS.analysts.min, LIMITS.analysts.max),
  );
  const [hoursPerAnalystPerWeek, setHoursPerAnalystPerWeek] = useState(() =>
    clamp(defaultHoursPerAnalystPerWeek, LIMITS.hoursPerAnalystPerWeek.min, LIMITS.hoursPerAnalystPerWeek.max),
  );

  // Determine current hourly rate based on segment
  const hourlyRate = useMemo(() => {
    switch (segment) {
      case 'ecommerce':
        return rateEco;
      case 'agency':
        return rateAge;
      case 'enterprise':
        return rateEnt;
      default:
        return rateAge;
    }
  }, [segment, rateEco, rateAge, rateEnt]);

  // Perform calculations (spójne jednostki tyg/msc)
  const results = useMemo(() => {
    const totalHoursWeekly = analysts * hoursPerAnalystPerWeek;
    const totalHoursMonthly = totalHoursWeekly * WEEKS_PER_MONTH;

    const recoveredHoursWeekly = totalHoursWeekly * EFFICIENCY_GAIN;
    const recoveredHoursMonthly = totalHoursMonthly * EFFICIENCY_GAIN;

    const manualCostMonthly = Math.round(totalHoursMonthly * hourlyRate);
    const savedCostMonthly = Math.round(recoveredHoursMonthly * hourlyRate);

    // Zaokrąglenia czasu (UI-friendly)
    const recoveredHoursWeeklyRounded = Number(recoveredHoursWeekly.toFixed(1));
    const recoveredHoursMonthlyRounded = Number(recoveredHoursMonthly.toFixed(1));

    return {
      // Inputs-derived metrics
      hourlyRate,
      totalHoursWeekly: Number(totalHoursWeekly.toFixed(1)),
      totalHoursMonthly: Number(totalHoursMonthly.toFixed(1)),

      // Primary ROI outputs
      manualCostMonthly,
      savedCostMonthly,

      // Time recovered (weekly + monthly)
      recoveredHoursWeekly: recoveredHoursWeeklyRounded,
      recoveredHoursMonthly: recoveredHoursMonthlyRounded,

      // For backwards compatibility (jeśli UI używa starych nazw)
      manualCost: manualCostMonthly,
      recoveredTime: recoveredHoursWeeklyRounded, // UWAGA: to jest tygodniowo (jak wcześniej)
      totalSavings: savedCostMonthly,
    };
  }, [analysts, hoursPerAnalystPerWeek, hourlyRate]);

  // Handlers (z clamp)
  const updateAnalysts = useCallback((val: number) => {
    const next = clamp(Math.floor(val), LIMITS.analysts.min, LIMITS.analysts.max);
    setAnalysts(next);
  }, []);

  const updateHours = useCallback((val: number) => {
    const next = clamp(val, LIMITS.hoursPerAnalystPerWeek.min, LIMITS.hoursPerAnalystPerWeek.max);
    setHoursPerAnalystPerWeek(next);
  }, []);

  const changeSegment = useCallback((seg: Segment) => setSegment(seg), []);

  return {
    // State
    segment,
    analysts,
    hours: hoursPerAnalystPerWeek, // compat: stare UI może używać `hours`
    hoursPerAnalystPerWeek,

    // Actions
    changeSegment,
    updateAnalysts,
    updateHours,

    // Results
    ...results,
  };
};
