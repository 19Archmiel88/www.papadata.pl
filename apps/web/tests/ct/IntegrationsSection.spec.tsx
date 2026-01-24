import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { IntegrationsSection } from '../../components/IntegrationsSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('IntegrationsSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <IntegrationsSection t={t} />);
  await expect(component).toBeVisible();
});
