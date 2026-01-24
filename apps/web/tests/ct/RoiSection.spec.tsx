import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { RoiSection } from '../../components/RoiSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('RoiSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <RoiSection t={t} onCtaClick={() => {}} />);
  await expect(component).toBeVisible();
});
