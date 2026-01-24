import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { AboutModal } from '../../components/AboutModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('AboutModal renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <AboutModal t={t} onClose={() => {}} isOpen />);
  await expect(component).toBeVisible();
});
