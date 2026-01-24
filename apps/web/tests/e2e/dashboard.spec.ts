import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('dashboard overview loads in demo mode', async ({ page }) => {
  await page.goto('/#/dashboard/overview?mode=demo');
  await expect(page.getByTestId('dashboard-shell')).toBeVisible();
  await expect(page.getByRole('button', { name: /overview|przegląd/i })).toBeVisible();
});
