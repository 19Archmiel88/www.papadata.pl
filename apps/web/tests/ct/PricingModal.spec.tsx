import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { PricingModal } from '../../components/PricingModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('PricingModal renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <PricingModal t={t} onClose={() => {}} isOpen />);
  await expect(component).toBeVisible();
});
