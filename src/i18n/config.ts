import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./en";
import { pl } from "./pl";

export type Locale = "pl" | "en";

export const STORAGE_KEY = "papadata-lang";
export const DEFAULT_LOCALE: Locale = "pl";
export const FALLBACK_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: Locale[] = ["pl", "en"];

function normalizeLocale(input?: string | null): Locale {
  if (input === "pl" || input === "en") return input;
  return DEFAULT_LOCALE;
}

export function getStoredLocale(): Locale {
  try {
    return normalizeLocale(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function persistLocale(next: string): Locale {
  const normalized = normalizeLocale(next);
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch {
    // ignore
  }
  return normalized;
}

export function detectInitialLocale(): Locale {
  const stored = getStoredLocale();
  if (stored) return stored;

  try {
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("pl")) return "pl";
    if (nav.startsWith("en")) return "en";
  } catch {
    // ignore
  }

  return DEFAULT_LOCALE;
}

const initialLocale = detectInitialLocale();

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      pl,
      en,
    },
    lng: initialLocale,
    fallbackLng: FALLBACK_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: { escapeValue: false },
    keySeparator: false,
    returnNull: false,
    returnEmptyString: false,
  });

i18n.on("languageChanged", (lng) => {
  persistLocale(lng);
});

export default i18n;
