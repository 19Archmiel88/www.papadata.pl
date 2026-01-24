import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { ProductsViewV2 } from '../../components/dashboard/ProductsViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('ProductsViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <ProductsViewV2 />);
  await expect(component).toBeVisible();
});
