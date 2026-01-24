import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { KnowledgeView } from '../../components/dashboard/KnowledgeView';
import { applyBrowserMocks, mountDashboardView } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('KnowledgeView renders', async ({ mount }) => {
  const component = await mountDashboardView(mount, <KnowledgeView />);
  await expect(component).toBeVisible();
});
