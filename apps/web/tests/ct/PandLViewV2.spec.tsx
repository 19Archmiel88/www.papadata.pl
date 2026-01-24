import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { PandLViewV2 } from '../../components/dashboard/PandLViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('PandLViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <PandLViewV2 />);
  await expect(component).toBeVisible();
});
