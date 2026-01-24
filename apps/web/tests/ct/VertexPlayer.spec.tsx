import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { VertexPlayer } from '../../components/VertexPlayer';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('VertexPlayer renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <VertexPlayer t={t} />);
  await expect(component).toBeVisible();
});
