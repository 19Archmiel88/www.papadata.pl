import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { PromoModal } from '../../components/PromoModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('PromoModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <PromoModal t={t} onClose={() => {}} onSelectPlan={() => {}} onDemo={() => {}} isOpen />,
  );
  await expect(component).toBeVisible();
});
