import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('landing -> auth modal -> dashboard', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('hero-cta').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: /email/i })).toBeVisible({ timeout: 10000 });

  await page.goto('/#/dashboard/overview?mode=demo');
  await expect(page.getByTestId('dashboard-shell')).toBeVisible();
});
