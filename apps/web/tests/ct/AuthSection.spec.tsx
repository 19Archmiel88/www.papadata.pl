import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { AuthSection } from '../../components/AuthSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('AuthSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <AuthSection t={t} />);
  await expect(component).toBeVisible();
});
