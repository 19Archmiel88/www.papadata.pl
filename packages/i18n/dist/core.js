import { landingPl, landingEn } from './landing';
export const translations = {
    pl: landingPl,
    en: landingEn
};
export function translate(locale, key, params) {
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
