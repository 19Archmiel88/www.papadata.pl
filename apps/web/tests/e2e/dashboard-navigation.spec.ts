import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('dashboard navigation switches views', async ({ page }) => {
  await page.goto('/#/dashboard/overview?mode=demo');
  await expect(page.getByTestId('dashboard-shell')).toBeVisible();
  await expect(page.getByText(/E2E_ENCRYPTED/i)).toBeVisible();

  await page.getByRole('button', { name: /Analytics|Analityka/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/ads/i);

  await page.getByRole('button', { name: /Products|Produkty/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/products/i);
});
