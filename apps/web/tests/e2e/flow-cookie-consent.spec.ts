import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test('cookie consent reject optional stores decision', async ({ page }) => {
  await mockApi(page, { consent: 'unset', auth: { enabled: false } });

  await page.goto('/');

  const banner = page.getByRole('dialog');
  await expect(banner).toBeVisible({ timeout: 5000 });

  await banner.getByRole('button', { name: /odrzu|reject/i }).click();
  await expect(banner).toBeHidden();

  const stored = await page.evaluate(() => {
    const raw = window.localStorage.getItem('cookie_consent');
    return raw ? JSON.parse(raw) : null;
  });

  expect(stored?.analytical).toBe(false);
  expect(stored?.marketing).toBe(false);
  expect(stored?.functional).toBe(false);
});
