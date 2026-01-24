import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { IntegrationConnectModal } from '../../components/IntegrationConnectModal';
import { applyBrowserMocks, mountWithProviders, sampleIntegration, t } from './utils';

const fallbackIntegration = sampleIntegration ?? ({
  id: 'shopify',
  provider: 'shopify',
  category: 'ecommerce',
  status: 'live',
  auth: 'oauth2',
  label: 'Shopify',
} as any);

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('IntegrationConnectModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <IntegrationConnectModal t={t} integration={fallbackIntegration} onClose={() => {}} isOpen />,
  );
  await expect(component).toBeVisible();
});
