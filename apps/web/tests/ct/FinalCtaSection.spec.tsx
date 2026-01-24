import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { FinalCtaSection } from '../../components/FinalCtaSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('FinalCtaSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <FinalCtaSection t={t} />);
  await expect(component).toBeVisible();
});
