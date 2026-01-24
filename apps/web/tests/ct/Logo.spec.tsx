import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { Logo } from '../../components/Logo';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('Logo renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <Logo />);
  await expect(component).toBeVisible();
});
