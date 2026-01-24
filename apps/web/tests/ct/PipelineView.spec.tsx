import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { PipelineView } from '../../components/dashboard/PipelineView';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('PipelineView renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <PipelineView />);
  await expect(component).toBeVisible();
});
