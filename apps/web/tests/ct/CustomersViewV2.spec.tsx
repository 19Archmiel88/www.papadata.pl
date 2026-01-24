import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { CustomersViewV2 } from '../../components/dashboard/CustomersViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('CustomersViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <CustomersViewV2 />);
  await expect(component).toBeVisible();
});
