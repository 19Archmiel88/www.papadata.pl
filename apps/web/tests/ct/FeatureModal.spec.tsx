import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { FeatureModal } from '../../components/FeatureModal';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

const feature = (Object.values(t.features) as any[])[0] ?? {
  title: 'Feature',
  desc: 'Desc',
  details: [],
  tag: 'Tag',
};

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('FeatureModal renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <FeatureModal t={t} feature={feature} onClose={() => {}} isOpen />,
  );
  await expect(component).toBeVisible();
});
