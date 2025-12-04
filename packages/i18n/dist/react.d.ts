import React from 'react';
import { type Locale, type TranslationKey } from './core';

// Funkcja tłumacząca
export type I18nFn = (
  key: TranslationKey,
  params?: Record<string, string | number>
) => string;

// Funkcja + stan języka (zgodne z src/react.tsx)
export type I18nContextValue = I18nFn & {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export interface I18nProviderProps {
  initialLocale?: Locale;
  children: React.ReactNode;
}

export declare const I18nProvider: React.FC<I18nProviderProps>;

export declare function useI18n(): I18nContextValue;

export type { Locale, TranslationKey } from './core';
