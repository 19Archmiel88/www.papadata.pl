import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { SettingsOrgView } from '../../components/dashboard/SettingsOrgView';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('SettingsOrgView renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <SettingsOrgView />);
  await expect(component).toBeVisible();
});
