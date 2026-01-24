import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { AdsViewV2 } from '../../components/dashboard/AdsViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('AdsViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <AdsViewV2 />);
  await expect(component).toBeVisible();
});
