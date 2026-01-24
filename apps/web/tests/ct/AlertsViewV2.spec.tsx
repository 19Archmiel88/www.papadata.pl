import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { AlertsViewV2 } from '../../components/dashboard/AlertsViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('AlertsViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <AlertsViewV2 />);
  await expect(component).toBeVisible();
});
