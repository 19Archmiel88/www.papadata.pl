/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PROXY_TARGET?: string;
  readonly VITE_LEGAL_DOCS_BASE_URL?: string;
  readonly VITE_OBSERVABILITY_PROVIDER?: string;
  readonly VITE_OBSERVABILITY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '@sentry/browser' {
  export const init: (options: Record<string, unknown>) => void;
  export const captureMessage: (message: string, options?: Record<string, unknown>) => void;
  export const captureException: (error: Error, options?: Record<string, unknown>) => void;
  export const browserTracingIntegration: (opts?: Record<string, unknown>) => unknown;
  export const reportingObserverIntegration: () => unknown;
}
