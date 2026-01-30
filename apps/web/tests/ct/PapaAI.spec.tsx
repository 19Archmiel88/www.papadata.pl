import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { PapaAI } from '../../components/PapaAI';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('PapaAI renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <PapaAI t={t} isOpen onOpenChange={() => {}} aiMode />
  );
  await expect(component).toBeVisible();
});
