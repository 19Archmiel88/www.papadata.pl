import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { ReportsView } from '../../components/dashboard/ReportsView';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('ReportsView renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <ReportsView />);
  await expect(component).toBeVisible();
});
