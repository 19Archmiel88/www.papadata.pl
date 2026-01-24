export type DevLogLevel = 'info' | 'warn' | 'error';

export const devLog = (level: DevLogLevel, message: string, extra?: unknown) => {
  if (!import.meta.env.DEV) return;
  if (typeof window === 'undefined') return;

  const detail = { level, message, extra };
  window.dispatchEvent(new CustomEvent('papadata:devlog', { detail }));
};
