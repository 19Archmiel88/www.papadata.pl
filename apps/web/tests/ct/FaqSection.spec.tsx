import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { FaqSection } from '../../components/FaqSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('FaqSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <FaqSection t={t} />);
  await expect(component).toBeVisible();
});
