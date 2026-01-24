import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { ContactModal } from '../../components/ContactModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('ContactModal renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <ContactModal t={t} isOpen onClose={() => {}} />);
  await expect(component).toBeVisible();
});
