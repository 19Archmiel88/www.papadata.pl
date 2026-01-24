import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { LegalDocPage } from '../../components/LegalDocPage';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('LegalDocPage renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <LegalDocPage t={t} content="Test" fallbackTitle="Legal" onBack={() => {}} />,
  );
  await expect(component).toBeVisible();
});
