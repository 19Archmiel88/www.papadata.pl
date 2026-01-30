import { test, expect, APIRequestContext } from '@playwright/test';

const waitForApi = async (
  request: APIRequestContext,
  apiBase: string,
  retries = 10,
  delayMs = 1000
) => {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const res = await request.get(`${apiBase}/health`);
      if (res.ok()) return res;
    } catch {
      // ignore and retry
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`API not ready at ${apiBase}`);
};

test('smoke: health + UI load @smoke', async ({ page, request }) => {
  const apiBase = process.env.API_BASE_URL ?? 'http://127.0.0.1:4000/api';
  const health = await waitForApi(request, apiBase);
  expect(health.ok()).toBeTruthy();

  const consoleErrors: string[] = [];
  page.on('pageerror', (err) => consoleErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('/#/dashboard/overview?mode=demo');
  await expect(page).toHaveURL(/dashboard\/overview/i);

  expect(consoleErrors).toEqual([]);
});

test('smoke: contact form handles API error @smoke', async ({ page }) => {
  await page.route('**/api/support/contact', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Server error' }),
    });
  });

  await page.goto('/');

  // Dismiss potential modals/overlays (Cookie banner has 1.5s delay)
  const cookieAccept = page.getByRole('button', { name: /Accept all|Akceptuj/i });
  try {
    await cookieAccept.waitFor({ state: 'visible', timeout: 4000 });
    await cookieAccept.click();
    await expect(cookieAccept).not.toBeVisible({ timeout: 5000 });
  } catch {
    // Ignore if not found
  }

  // Handle Demo/Promo modal if present
  const closePromo = page
    .locator('button[aria-label="Close"], button.absolute.top-4.right-4')
    .filter({ hasText: '' })
    .first();
  if (await closePromo.isVisible()) {
    try {
      await closePromo.click({ timeout: 2000 });
    } catch {
      // ignore if it disappeared
    }
  }

  // Handle "Ustawienia" (Settings) button if it's intercepting (likely Cookie Settings Modal still open or animating)
  const saveSettings = page.getByRole('button', { name: /Save settings|Zapisz ustawienia/i });
  if (await saveSettings.isVisible()) {
    await saveSettings.click();
  }

  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();

  const contactButton = page.getByRole('button', { name: /Contact|Kontakt/i }).first();
  await contactButton.click();

  await page.getByPlaceholder(/Full name|Imię i nazwisko/i).fill('Test User');
  await page.getByPlaceholder(/Work email|E-mail firmowy/i).fill('test@example.com');
  await page
    .getByPlaceholder(/How can we help\?|W czym możemy pomóc\?/i)
    .fill('Test message for API error.');

  const submitButton = page.getByRole('button', { name: /Send request|Wyślij zapytanie/i });
  await submitButton.click();

  const errorNotice = page
    .locator('[aria-live="polite"]')
    .filter({ hasText: /Request failed|HTTP 500|Server error|Wystąpił/i });
  await expect(errorNotice).toBeVisible();
});
