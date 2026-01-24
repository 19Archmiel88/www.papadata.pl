import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { IntegrationsMarquee } from '../../components/IntegrationsMarquee';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('IntegrationsMarquee renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <IntegrationsMarquee t={t} />);
  await expect(component).toBeVisible();
});
