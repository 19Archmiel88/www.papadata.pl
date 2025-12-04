'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Locale, TranslationKey } from './core';
import { translate } from './core';

type I18nFn = (
  key: TranslationKey,
  params?: Record<string, string | number>
) => string;

export type I18nContextValue = I18nFn & {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  initialLocale = 'pl',
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const value = useMemo<I18nContextValue>(() => {
    const fn = ((key: TranslationKey, params?: Record<string, string | number>) =>
      translate(locale, key, params)) as I18nContextValue;

    fn.locale = locale;
    fn.setLocale = setLocale;

    return fn;
  }, [locale]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
