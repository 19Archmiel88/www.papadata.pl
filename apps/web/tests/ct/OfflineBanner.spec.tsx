import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { OfflineBanner } from '../../components/OfflineBanner';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
  await page.addInitScript(() => {
    try {
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
    } catch {
      // ignore
    }
  });
});

test('OfflineBanner renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <OfflineBanner />);
  await expect(component).toBeAttached();
});
