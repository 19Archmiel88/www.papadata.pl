import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { DashboardSection } from '../../components/dashboard/DashboardSection';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('DashboardSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <DashboardSection />);
  await expect(component).toBeVisible();
});
