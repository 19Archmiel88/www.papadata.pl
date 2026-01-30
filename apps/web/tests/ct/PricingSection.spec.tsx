import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { PricingSection } from '../../components/PricingSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('PricingSection renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <PricingSection t={t} onCompare={() => {}} onPlanCtaClick={() => {}} />
  );
  await expect(component).toBeVisible();
});
