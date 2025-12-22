import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export type ConsentPreferences = Pick<ConsentState, 'analytics' | 'marketing'>;

export type ConsentContextValue = {
  consent: ConsentState | null;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: ConsentPreferences) => void;
};

const STORAGE_KEY = 'papadata-consent';

const readConsent = (): ConsentState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<ConsentState> | null;
    if (!parsed) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

const persistConsent = (value: ConsentState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const ConsentContext = createContext<ConsentContextValue | null>(null);

export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<ConsentState | null>(() => readConsent());

  const updateConsent = useCallback((next: ConsentState) => {
    setConsent(next);
    persistConsent(next);
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    });
  }, [updateConsent]);

  const rejectAll = useCallback(() => {
    updateConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    });
  }, [updateConsent]);

  const savePreferences = useCallback(
    (preferences: ConsentPreferences) => {
      updateConsent({
        necessary: true,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        updatedAt: new Date().toISOString(),
      });
    },
    [updateConsent],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      acceptAll,
      rejectAll,
      savePreferences,
    }),
    [consent, acceptAll, rejectAll, savePreferences],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};
