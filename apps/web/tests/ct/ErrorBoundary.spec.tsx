import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('ErrorBoundary renders children', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <ErrorBoundary>
      <div>Child</div>
    </ErrorBoundary>
  );
  await expect(component).toContainText('Child');
});
