import { z } from 'zod';

/**
 * Schema describing the scheduling options for data ingestion in step 4 of
 * the onboarding. Frequency can be expressed either as a cron‑like
 * expression or via friendly selections (daily, hourly etc.). For the
 * prototype we allow a free‑form string; additional validation can be
 * introduced server‑side. Backfill is constrained to avoid excessive
 * historical pulls.
 */
export const scheduleSchema = z.object({
  timezone: z.literal('Europe/Warsaw').default('Europe/Warsaw'),
  frequency: z.string().min(1, { message: 'Określ częstotliwość' }),
  exact_time: z.string().optional(),
  minute_offset: z.number().int().min(0).max(59).optional(),
  window: z.number().int().min(1).default(1),
  late_reprocess_days: z.number().int().min(0).max(7).default(0),
  backfill_months: z.number().int().min(0).max(60).default(0),
  mode: z.enum(['throttled', 'fast']).default('throttled'),
});

export type Schedule = z.infer<typeof scheduleSchema>;