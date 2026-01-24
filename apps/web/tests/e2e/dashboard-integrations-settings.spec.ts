import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('dashboard opens integrations and settings views', async ({ page }) => {
  await page.goto('/#/dashboard/overview?mode=demo');
  await expect(page.getByTestId('dashboard-shell')).toBeVisible();

  await page.getByRole('button', { name: /Integrations|Integracje/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/integrations/i);

  await page.getByRole('button', { name: /Settings|Ustawienia/i }).click();
  await page.waitForURL(/\/dashboard\/settings\/workspace/i, { timeout: 15000 });
  await expect(page.getByRole('heading', { name: /Ustawienia Workspace|Workspace Settings/i })).toBeVisible();
});
