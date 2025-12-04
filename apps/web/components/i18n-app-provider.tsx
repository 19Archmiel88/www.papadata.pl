'use client';

import React from 'react';
import { I18nProvider } from '@papadata/i18n';

/**
 * Zapewnia lokalny provider i18n z domyślnym językiem PL.
 * Przydatne w miejscach, gdzie nie korzystamy z globalnego providera.
 */
export function I18nAppProvider({ children }: { children: React.ReactNode }) {
  return <I18nProvider initialLocale="pl">{children}</I18nProvider>;
}
