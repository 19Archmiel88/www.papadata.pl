import { getApiConfig } from "./config";

export const getObservabilityConfig = () => {
  const { observability } = getApiConfig();
  return {
    provider: observability.provider,
    dsn: observability.dsn,
    environment: observability.environment,
  };
};
