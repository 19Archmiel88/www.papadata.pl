import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { SettingsWorkspaceView } from '../../components/dashboard/SettingsWorkspaceView';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('SettingsWorkspaceView renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <SettingsWorkspaceView />);
  await expect(component).toBeVisible();
});
