/**
 * Client‑side telemetry helpers. In production these would forward events to
 * Google Analytics 4, BigQuery or another analytics platform via the BFF.
 * For now they simply log to the console so developers can verify that
 * instrumentation calls are made.
 */
export type TelemetryEvent =
  | 'onboarding_step_view'
  | 'integration_selected'
  | 'connection_test_ok'
  | 'connection_test_fail'
  | 'provisioning_start'
  | 'provisioning_progress'
  | 'provisioning_done';

export function track(event: TelemetryEvent, payload?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log(`[telemetry] ${event}`, payload || {});
}