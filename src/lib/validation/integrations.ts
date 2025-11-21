import { z } from 'zod';

/**
 * Enumerated connector identifiers supported by the PL‑only release. These
 * correspond to e‑commerce, marketplace, analytics and payment providers
 * commonly used in Poland.
 */
export const ConnectorId = z.enum([
  'woocommerce',
  'shopify',
  'allegro',
  'baselinker',
  'ga4',
  'googleads',
  'metaads',
  'payu',
  'przelewy24',
  'inpost',
  'tiktokads',
  'gsc',
]);

export type ConnectorId = z.infer<typeof ConnectorId>;

/**
 * Schema for a single integration definition. Each integration allows
 * enabling/disabling, alias naming, backfill history and plan selection.
 */
export const integrationSchema = z.object({
  id: ConnectorId,
  enabled: z.boolean(),
  alias: z.string().optional(),
  backfill_months: z
    .number({ invalid_type_error: 'Okres backfill musi być liczbą' })
    .int()
    .min(1, { message: 'Minimum 1 miesiąc' })
    .max(60, { message: 'Maksimum 60 miesięcy' })
    .default(12),
  plan: z.enum(['standard', 'extended']).default('standard'),
});

export const integrationsSchema = z.array(integrationSchema).min(1, {
  message: 'Wybierz przynajmniej jedną integrację',
});

export type Integration = z.infer<typeof integrationSchema>;