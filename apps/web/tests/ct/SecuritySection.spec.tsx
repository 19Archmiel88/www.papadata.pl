import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { SecuritySection } from '../../components/SecuritySection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('SecuritySection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <SecuritySection t={t} />);
  await expect(component).toBeVisible();
});
