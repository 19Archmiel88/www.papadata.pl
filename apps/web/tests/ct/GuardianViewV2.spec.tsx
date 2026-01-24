import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { GuardianViewV2 } from '../../components/dashboard/GuardianViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('GuardianViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <GuardianViewV2 />);
  await expect(component).toBeVisible();
});
