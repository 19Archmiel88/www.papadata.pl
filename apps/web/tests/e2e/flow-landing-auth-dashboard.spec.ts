import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('landing -> auth modal -> dashboard', async ({ page }) => {
  await page.goto('/');

  const cta = page.getByTestId('hero-cta');
  await cta.scrollIntoViewIfNeeded();
  await cta.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const emailInput = dialog.getByPlaceholder(/@|email/i).first();
  await expect(emailInput).toBeVisible({ timeout: 15000 });

  await page.goto('/#/dashboard/overview?mode=demo');
  await expect(page.getByTestId('dashboard-shell')).toBeVisible();
});
