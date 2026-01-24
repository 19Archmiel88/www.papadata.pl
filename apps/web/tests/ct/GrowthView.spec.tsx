import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { GrowthView } from '../../components/dashboard/GrowthView';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('GrowthView renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <GrowthView />);
  await expect(component).toBeVisible();
});
