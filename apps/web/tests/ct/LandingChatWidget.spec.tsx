import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { LandingChatWidget } from '../../components/LandingChatWidget';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('LandingChatWidget renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <LandingChatWidget lang="pl" onStartTrial={() => {}} />,
  );
  await expect(component).toBeVisible();
});
