import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { DemoNoticeModal } from '../../components/DemoNoticeModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('DemoNoticeModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <DemoNoticeModal t={t} context="Test" isOpen onClose={() => {}} onPrimary={() => {}} />
  );
  await expect(component).toBeVisible();
});
