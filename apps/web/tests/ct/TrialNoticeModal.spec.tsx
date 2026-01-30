import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { TrialNoticeModal } from '../../components/TrialNoticeModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('TrialNoticeModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <TrialNoticeModal t={t} daysLeft={3} onPrimary={() => {}} isOpen />
  );
  await expect(component).toBeVisible();
});
