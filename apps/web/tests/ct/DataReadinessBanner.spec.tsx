import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { DataReadinessBanner } from '../../components/dashboard/DataReadinessBanner';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('DataReadinessBanner renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <DataReadinessBanner
      status={{ mode: 'live', lastSyncAt: new Date().toISOString() } as any}
      loading={false}
      error={null}
    />
  );
  await expect(component).toBeVisible();
});
