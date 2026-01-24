// apps/web/utils/telemetry.ts
import { getSentryModule, initObservability } from './observability.provider';
import { devLog } from './devlog';

export type TelemetryEvent =
  | {
      event: 'api.response';
      method: string;
      url: string;
      status: number;
      requestId?: string;
      durationMs: number;
      env: string;
      mode: string;
    }
  | {
      event: 'api.error';
      method: string;
      url: string;
      requestId?: string;
      durationMs: number;
      env: string;
      mode: string;
      error: string;
    };

const ensureObservability = (): boolean => Boolean(initObservability());

export const logTelemetry = (payload: TelemetryEvent) => {
  if (import.meta.env.DEV) {
    devLog('info', '[telemetry]', payload);
    return;
  }

  if (!ensureObservability()) return;
  const Sentry = getSentryModule();
  if (!Sentry) return;

  if (payload.event === 'api.error') {
    Sentry.captureMessage(`API Error: ${payload.method} ${payload.url}`, {
      level: 'error',
      tags: { env: payload.env, mode: payload.mode },
      extra: {
        method: payload.method,
        url: payload.url,
        durationMs: payload.durationMs,
        requestId: payload.requestId,
        error: payload.error,
      },
    });
  }
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.DEV) {
    devLog('error', '[telemetry:error]', { error, context });
    return;
  }

  if (!ensureObservability()) return;
  const Sentry = getSentryModule();
  if (!Sentry) return;

  Sentry.captureException(error, { extra: context });
};
