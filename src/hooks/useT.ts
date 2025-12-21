import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'lang';
const SUPPORTED_LANGUAGES = ['pl', 'en'] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const normalizeLanguage = (value?: string): AppLanguage => {
  const base = value?.split('-')[0] ?? 'pl';
  return SUPPORTED_LANGUAGES.includes(base as AppLanguage) ? (base as AppLanguage) : 'pl';
};

export const useT = () => {
  const { t, i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.language);

  const setLang = useCallback(
    (next: AppLanguage) => {
      if (next === lang) return;
      i18n.changeLanguage(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore storage errors
      }
    },
    [i18n, lang],
  );

  return { t, lang, setLang };
};
