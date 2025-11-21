import { z } from 'zod';

/**
 * Connections schema defines the structure for secrets provided in step 3.
 * Depending on the connector each secret set will be different; for
 * simplicity this schema allows any keys but ensures that at least one
 * property is present and non‑empty. The backend will further validate
 * individual secret fields.
 */
export const connectionSecretsSchema = z.record(z.string(), z.string().min(1)).refine(
  (obj) => Object.keys(obj).length > 0,
  { message: 'Podaj co najmniej jeden sekret' }
);

export type ConnectionSecrets = z.infer<typeof connectionSecretsSchema>;