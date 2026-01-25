import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test('trial notice modal shows for owner on trial day 3', async ({ page }) => {
  await mockApi(page, {
    health: { mode: 'prod' },
    billingSummary: { trialDaysLeft: 3 },
  });

  await page.goto('/#/dashboard/overview');

  const modal = page.getByTestId('trial-notice-modal');
  await expect(modal).toBeVisible();
  await expect(modal.getByTestId('trial-notice-primary')).toBeVisible();
});
