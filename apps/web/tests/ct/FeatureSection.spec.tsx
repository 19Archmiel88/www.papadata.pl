import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { FeaturesSection } from '../../components/FeatureSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('FeatureSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <FeaturesSection t={t} />);
  await expect(component).toBeVisible();
});
