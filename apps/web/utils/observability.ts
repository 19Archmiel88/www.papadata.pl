import { devLog } from './devlog';
import { getWebConfig } from '../config';

export type ObservabilityProvider = 'none' | 'sentry';

export interface ObservabilityConfig {
  provider: ObservabilityProvider;
  dsn: string;
  environment: string;
  release?: string;
}

/**
 * Normalizes & validates observability env config.
 * - Whitelists providers
 * - Trims/lowercases provider
 * - If provider !== 'none' but DSN is missing -> provider forced to 'none'
 */
export const getObservabilityConfig = (): ObservabilityConfig => {
  const config = getWebConfig();
  const { provider, dsn, environment, release } = config.observability;

  if (
    provider !== 'none' &&
    dsn.length === 0 &&
    String(import.meta.env.MODE).trim() !== 'production'
  ) {
    devLog(
      'warn',
      '[observability] Provider requested but DSN is missing; falling back to provider="none".'
    );
  }

  return { provider, dsn, environment, release };
};
