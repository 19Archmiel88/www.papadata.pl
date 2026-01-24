import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { InteractiveButton } from '../../components/InteractiveButton';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('InteractiveButton renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <InteractiveButton>Click</InteractiveButton>);
  await expect(component).toContainText('Click');
});
