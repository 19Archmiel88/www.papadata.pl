import { getObservabilityConfig } from "./observability";

export const initObservability = () => {
  const config = getObservabilityConfig();
  if (config.provider === "none" || !config.dsn) {
    return null;
  }

  if (config.provider === "sentry") {
    void import("@sentry/node").then(({ init }) => {
      init({
        dsn: config.dsn,
        environment: config.environment,
        tracesSampleRate: 0.1,
      });
    });
  }

  return config;
};
