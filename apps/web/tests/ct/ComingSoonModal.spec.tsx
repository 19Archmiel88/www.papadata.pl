import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { ComingSoonModal } from '../../components/ComingSoonModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('ComingSoonModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <ComingSoonModal t={t} context="Test" onClose={() => {}} isOpen />
  );
  await expect(component).toBeVisible();
});
