import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { VideoModal } from '../../components/VideoModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('VideoModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <VideoModal
      t={t}
      onClose={() => {}}
      isOpen
      src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    />
  );
  await expect(component).toBeVisible();
});
