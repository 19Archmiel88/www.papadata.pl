import { landingPl, landingEn, type LandingTranslationKey } from './landing';
export type Locale = 'pl' | 'en';
export type TranslationKey = LandingTranslationKey;
export declare const translations: Record<Locale, Record<TranslationKey, string>>;
export declare function translate(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string;
export { landingPl, landingEn };
