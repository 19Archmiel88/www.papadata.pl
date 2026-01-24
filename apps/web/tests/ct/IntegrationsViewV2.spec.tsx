import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { IntegrationsViewV2 } from '../../components/dashboard/IntegrationsViewV2';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('IntegrationsViewV2 renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <IntegrationsViewV2 />);
  await expect(component).toBeVisible();
});
