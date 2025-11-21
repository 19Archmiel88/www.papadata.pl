import { z } from 'zod';

/**
 * Schema for the Organisation step of the onboarding wizard. Required
 * properties correspond to company metadata and legal/compliance flags. Many
 * fields are readonly because in the initial release PapaData operates in
 * the `pl` market exclusively.
 */
export const organizationSchema = z.object({
  org_name: z.string().min(1, { message: 'Podaj nazwę organizacji' }),
  client_slug: z
    .string()
    .regex(/^[a-z0-9-]{3,30}$/i, {
      message: 'Slug może zawierać małe litery, cyfry i myślniki (3–30 znaków)',
    }),
  technical_email: z.string().email({ message: 'Niepoprawny adres e‑mail' }),
  language: z.literal('pl').default('pl'),
  timezone: z.literal('Europe/Warsaw').default('Europe/Warsaw'),
  currency: z.literal('PLN').default('PLN'),
  data_residency: z.literal('pl-warsaw').default('pl-warsaw'),
  bq_region: z.literal('europe-central2').default('europe-central2'),
  retention_months: z
    .number({ invalid_type_error: 'Okres retencji musi być liczbą' })
    .int()
    .min(6, { message: 'Minimum 6 miesięcy' })
    .max(60, { message: 'Maksimum 60 miesięcy' })
    .default(24),
  pseudonymization_enabled: z.boolean().default(true),
  dpa_accepted: z
    .boolean()
    .refine((v) => v === true, { message: 'Musisz zaakceptować umowę powierzenia' }),
});

export type OrganizationProfile = z.infer<typeof organizationSchema>;