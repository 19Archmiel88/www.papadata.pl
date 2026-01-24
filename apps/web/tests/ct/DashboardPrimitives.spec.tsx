import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import {
  ContextMenu,
  LazySection,
  WidgetSkeleton,
  WidgetErrorState,
  WidgetOfflineState,
  WidgetEmptyState,
  TrendChartCard,
} from '../../components/dashboard/DashboardPrimitives';
import { applyBrowserMocks, mountWithProviders } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('ContextMenu renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <ContextMenu
      menu={{ x: 10, y: 10, label: 'Menu', items: [{ id: 'a', label: 'Item' }] }}
      onClose={() => {}}
    />,
  );
  await expect(component).toBeVisible();
});

test('Widget states render', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <div>
      <WidgetSkeleton />
      <WidgetErrorState title="Error" desc="Desc" />
      <WidgetOfflineState title="Offline" desc="Desc" />
      <WidgetEmptyState title="Empty" desc="Desc" />
    </div>,
  );
  await expect(component).toBeVisible();
});

test('LazySection renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <LazySection title="Title" desc="Desc" />,
  );
  await expect(component).toBeVisible();
});

test('TrendChartCard renders', async ({ mount }) => {
  const component = await mountWithProviders(
    mount,
    <TrendChartCard title="Trend" series={[{ id: 's1', label: 'S1', points: [1, 2, 3] }]} />,
  );
  await expect(component).toBeVisible();
});
