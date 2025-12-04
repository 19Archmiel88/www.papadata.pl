'use client';

import React from 'react';

// U CIEBIE: index w packages/i18n jest barrelem (core/react/landing),
// więc te trzy rzeczy powinny być dostępne z '@papadata/i18n'.
// Jeśli createI18n / landingTranslations masz pod inną nazwą – tylko ten import popraw.
import {
  I18nProvider,
  createI18n,
  landingTranslations,
} from '@papadata/i18n';

/**
 * Tworzymy instancję i18n dla landingu / demo.
 * Typowy wzór to createI18n(translations, defaultLocale).
 * Jeśli u Ciebie createI18n ma inny podpis (np. obiekt z polami),
 * zmień TYLKO tę linię zgodnie z własnym API.
 */
const i18n = createI18n(landingTranslations, 'pl');

export function I18nAppProvider({ children }: { children: React.ReactNode }) {
  return <I18nProvider value={i18n}>{children}</I18nProvider>;
}
