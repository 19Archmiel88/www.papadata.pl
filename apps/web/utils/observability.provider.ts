// apps/web/utils/observability.provider.ts
import { getObservabilityConfig } from './observability';
import { initWebVitals } from './web-vitals';
import { devLog } from './devlog';

type SentryModule = {
  init: (options: Record<string, unknown>) => void;
  captureMessage: (message: string, options?: Record<string, unknown>) => void;
  captureException: (error: Error, options?: Record<string, unknown>) => void;
  browserTracingIntegration?: (opts?: Record<string, unknown>) => unknown;
  reportingObserverIntegration?: () => unknown;
};

let sentryInitialized = false;
let sentryInitKey: string | null = null;
let sentryInitPromise: Promise<void> | null = null;
let sentryModule: SentryModule | null = null;

type ObservabilityConfig = {
  provider: string;
  dsn?: string | null;
  environment?: string | null;
};

const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem('cookie_consent');
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { analytical?: boolean } | null;
    return Boolean(parsed?.analytical);
  } catch {
    return false;
  }
};

const shouldDropForNoConsent = () => !hasAnalyticsConsent();

const makeInitKey = (config: ObservabilityConfig) =>
  `${config.provider}:${config.dsn ?? ''}:${config.environment ?? ''}`;

const initSentryIfNeeded = async () => {
  const config = getObservabilityConfig() as ObservabilityConfig;

  if (config.provider !== 'sentry' || !config.dsn) return;
  if (!hasAnalyticsConsent()) return;

  const key = makeInitKey(config);

  // Already initialized with same config
  if (sentryInitialized && sentryInitKey === key) return;

  // If an init is already in flight, don't start a new one.
  if (sentryInitPromise) return sentryInitPromise;

  sentryInitPromise = (async () => {
    // Dynamic import: keep Sentry out of the bundle path until consent exists (best-effort).
    const Sentry = (await import('@sentry/browser')) as SentryModule;

    // If consent was revoked while loading, do nothing.
    if (!hasAnalyticsConsent()) return;

    // If we were initialized while awaiting imports, bail.
    if (sentryInitialized && sentryInitKey === key) return;

    // Keep the first successful init per session to avoid undefined behavior.
    if (sentryInitialized && sentryInitKey && sentryInitKey !== key) {
      if (import.meta.env.DEV) {
        devLog(
          'warn',
          '[observability] Sentry already initialized; skipping re-init with new config.'
        );
      }
      return;
    }

    // Integrations live in the same module (Sentry SDK exports helpers)
    const browserTracingIntegration = (Sentry as any).browserTracingIntegration as
      | ((opts?: any) => any)
      | undefined;
    const reportingObserverIntegration = (Sentry as any).reportingObserverIntegration as
      | (() => any)
      | undefined;

    Sentry.init({
      dsn: config.dsn ?? undefined,
      environment: config.environment ?? undefined,
      tracesSampleRate: config.environment === 'production' ? 0.1 : 1.0,
      integrations: [
        ...(browserTracingIntegration ? [browserTracingIntegration({ enableInp: true })] : []),
        ...(reportingObserverIntegration ? [reportingObserverIntegration()] : []),
      ],
      // Hard gate at send-time in case consent changes after init.
      beforeSend(event: any) {
        if (shouldDropForNoConsent()) return null;
        return event;
      },
      beforeSendTransaction(txn: any) {
        if (shouldDropForNoConsent()) return null;
        return txn;
      },
    });

    sentryInitialized = true;
    sentryInitKey = key;
    sentryModule = Sentry;

    // Web Vitals: avoid spamming. Report only "poor" vitals in production (and sample).
    initWebVitals((metric) => {
      if (!hasAnalyticsConsent()) return;

      if (import.meta.env.DEV) {
        devLog('info', '[vitals]', metric);
        return;
      }

      const rating = (metric as any)?.rating as string | undefined;

      // Send only poor vitals, and sample to reduce volume.
      if (rating && rating !== 'poor') return;

      const sampleRate = 0.1; // 10% of poor vitals
      if (Math.random() > sampleRate) return;

      Sentry.captureMessage(`WebVital ${metric.name}`, {
        level: 'info',
        tags: { 'web-vital': metric.name, rating: rating ?? 'unknown' },
        extra: metric as unknown as Record<string, unknown>,
      });
    });
  })()
    .catch((err) => {
      if (import.meta.env.DEV) {
        devLog('warn', '[observability] Failed to init Sentry', err);
      }
    })
    .finally(() => {
      sentryInitPromise = null;
    });

  return sentryInitPromise;
};

const ensureSentryReady = async (): Promise<SentryModule | null> => {
  const config = getObservabilityConfig() as ObservabilityConfig;

  if (config.provider !== 'sentry' || !config.dsn) return null;
  if (!hasAnalyticsConsent()) return null;

  if (sentryModule && sentryInitialized) return sentryModule;

  await initSentryIfNeeded();
  return sentryModule && sentryInitialized ? sentryModule : null;
};

export const getSentryModule = () => (sentryInitialized ? sentryModule : null);

export const initObservability = () => {
  const config = getObservabilityConfig() as ObservabilityConfig;

  // Provider off / missing DSN
  if (config.provider === 'none' || !config.dsn) {
    return null;
  }

  // Consent gate: do not initialize until consent exists.
  // If user later grants consent, calling initObservability() again will initialize.
  if (!hasAnalyticsConsent()) {
    return null;
  }

  // Kick off init (async) but keep API sync for existing callers.
  void initSentryIfNeeded();

  return config;
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  void (async () => {
    const Sentry = await ensureSentryReady();
    if (!Sentry) return;
    Sentry.captureException(error, context ? { extra: context } : undefined);
  })();
};

export const captureMessage = (
  message: string,
  options?: {
    level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
) => {
  void (async () => {
    const Sentry = await ensureSentryReady();
    if (!Sentry) return;
    Sentry.captureMessage(message, options as any);
  })();
};
