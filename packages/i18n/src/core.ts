import { landingPl, landingEn, type LandingTranslationKey } from './landing';

export type Locale = 'pl' | 'en';
export type TranslationKey = LandingTranslationKey;

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  pl: landingPl,
  en: landingEn,
};

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = translations[locale] ?? translations.pl;
  const base = dict[key] ?? key;

  if (!params) {
    return base;
  }

  let value = base;

  // Używamy split/join zamiast replaceAll (działa na ES2020)
  for (const [paramKey, paramValue] of Object.entries(params)) {
    const token = `{{${paramKey}}}`;
    value = value.split(token).join(String(paramValue));
  }

  return value;
}

export { landingPl, landingEn };
