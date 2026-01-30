import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { IntegrationsModal } from '../../components/IntegrationsModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('IntegrationsModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <IntegrationsModal
      t={t}
      category="all"
      isOpen
      onClose={() => {}}
      onSelectIntegration={() => {}}
    />
  );
  await expect(component).toBeVisible();
});
