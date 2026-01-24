import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { CookieBanner } from '../../components/CookieBanner';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('CookieBanner renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <CookieBanner t={t} onResolution={() => {}} />);
  await expect(component).toBeVisible();
});
