'use client';

import React from 'react';
import { I18nProvider } from '@papadata/i18n';

export function I18nRootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nProvider initialLocale="pl">{children}</I18nProvider>;
}
