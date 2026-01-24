import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { AuroraBackground, NeuralBackground } from '../../components/Backgrounds';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('AuroraBackground renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <AuroraBackground />);
  await expect(component).toBeVisible();
});

test('NeuralBackground renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <NeuralBackground />);
  await expect(component).toBeVisible();
});
