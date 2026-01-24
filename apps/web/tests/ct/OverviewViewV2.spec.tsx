import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { OverviewViewV2 } from '../../components/dashboard/OverviewViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('OverviewViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <OverviewViewV2 />);
  await expect(component).toBeVisible();
});
