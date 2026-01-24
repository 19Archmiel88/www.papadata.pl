import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('landing renders hero', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Analizuje dane e-commerce/i })
  ).toBeVisible();
});
