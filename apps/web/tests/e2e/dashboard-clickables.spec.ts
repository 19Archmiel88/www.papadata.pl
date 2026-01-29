import { test, expect } from '@playwright/test';
import { mockApi } from './mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

const gotoDashboard = async (page: any, path = 'overview') => {
  await page.goto(`/#/dashboard/${path}?mode=demo`);
  await expect(page.getByTestId('dashboard-shell')).toBeVisible();
  await expect(page.getByText(/E2E_ENCRYPTED/i)).toBeVisible();
};

test.describe('dashboard clickables', () => {
  test('sidebar navigates through core views', async ({ page }) => {
    await gotoDashboard(page, 'overview');
    const sidebar = page.locator('aside');

    const items = [
      { name: /Overview|Przegląd/i, url: /dashboard\/overview/i },
      { name: /Analytics|Analityka/i, url: /dashboard\/ads/i },
      { name: /Reports|Raporty/i, url: /dashboard\/reports/i },
      { name: /Customers|Klienci|Klient/i, url: /dashboard\/customers/i },
      { name: /Products|Produkty/i, url: /dashboard\/products/i },
      { name: /Integrations|Integracje/i, url: /dashboard\/integrations/i },
      { name: /Support|Wsparcie|Knowledge/i, url: /dashboard\/knowledge/i },
      { name: /Guardian/i, url: /dashboard\/guardian/i },
      { name: /Alerts|Alerty/i, url: /dashboard\/alerts/i },
      { name: /Pipeline|Lejek/i, url: /dashboard\/pipeline/i },
      { name: /Settings|Ustawienia/i, url: /dashboard\/settings\/workspace/i },
    ];

    for (const item of items) {
      await sidebar.getByRole('button', { name: item.name }).click();
      await expect(page).toHaveURL(item.url);
    }
  });

  test('overview actions and AI input respond', async ({ page }) => {
    await gotoDashboard(page, 'overview');

    await page.getByRole('button', { name: /See All|Zobacz Wszystkie/i }).first().click();
    await expect(page).toHaveURL(/dashboard\/alerts/i);

    await gotoDashboard(page, 'overview');
    await page.getByRole('button', { name: /View All Ads/i }).click();
    await expect(page).toHaveURL(/dashboard\/ads/i);

    await gotoDashboard(page, 'overview');
    await page.getByRole('button', { name: /Inventory Hub/i }).click();
    await expect(page).toHaveURL(/dashboard\/products/i);

    await gotoDashboard(page, 'overview');
    const aiInput = page.getByPlaceholder(/Zapytaj|Ask/i);
    const aiSubmit = page.getByRole('button', { name: /Zapytaj|Ask/i });
    await expect(aiSubmit).toBeDisabled();
    await aiInput.fill('Test AI');
    await expect(aiSubmit).toBeEnabled();
    await aiSubmit.click();
    await expect(aiInput).toHaveValue('');
  });

  test('ads view opens context menu and shows demo locks', async ({ page }) => {
    await gotoDashboard(page, 'ads');
    await page
      .getByText(/Summer 2024 Collection/i)
      .first()
      .click({ button: 'right' });
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('growth view toggles budget mode and opens menu', async ({ page }) => {
    await gotoDashboard(page, 'growth');
    const campaignsToggle = page.getByRole('button', { name: /Kampanie|Campaigns/i });
    await campaignsToggle.click();
    await expect(campaignsToggle).toHaveClass(/text-brand-start/);

    await page
      .getByRole('button', { name: /Opcje|Options/i })
      .first()
      .click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('customers view toggles cohort mode', async ({ page }) => {
    await gotoDashboard(page, 'customers');
    await expect(page.getByRole('heading', { name: /Cohort|Kohort/i })).toBeVisible();
    const weeklyToggle = page.getByRole('button', { name: /Weekly|Tygodniowo/i });
    await weeklyToggle.click();
    await expect(weeklyToggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('products view opens context menu from table row', async ({ page }) => {
    await gotoDashboard(page, 'products');
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    await rows.first().click({ button: 'right' });
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('integrations view filters and opens menu', async ({ page }) => {
    await gotoDashboard(page, 'integrations');
    const search = page.getByPlaceholder(/Szukaj|Search/i);
    await search.fill('Shopify');
    await expect(page.getByText(/Shopify/i)).toBeVisible();
    await search.fill('');
    await page
      .getByText(/Shopify/i)
      .first()
      .click({ button: 'right' });
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('reports view menus and demo CTA state', async ({ page }) => {
    await gotoDashboard(page, 'reports');
    const optionsButton = page.getByRole('button', { name: /Opcje|Options/i }).first();
    await optionsButton.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(page.getByTitle('To jest DEMO').first()).toBeDisabled();
  });

  test('pipeline view links to guardian and opens menu', async ({ page }) => {
    await gotoDashboard(page, 'pipeline');
    await page.getByRole('button', { name: /Uruchom Guardian|Run Guardian/i }).click();
    await expect(page).toHaveURL(/dashboard\/guardian/i);

    await gotoDashboard(page, 'pipeline');
    await page
      .getByRole('button', { name: /Opcje|Options/i })
      .first()
      .click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('knowledge view opens booking modal and context menu', async ({ page }) => {
    await gotoDashboard(page, 'knowledge');
    await expect(page.getByRole('button', { name: /Zarezerwuj termin/i })).toBeDisabled();

    await page
      .getByText(/Skalowanie Meta Ads/i)
      .first()
      .click({ button: 'right' });
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('guardian view opens context menu', async ({ page }) => {
    await gotoDashboard(page, 'guardian');
    await page.locator('table tbody tr').first().click({ button: 'right' });
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('alerts view shows demo-locked actions', async ({ page }) => {
    await gotoDashboard(page, 'alerts');
    await expect(page.getByTitle('To jest DEMO').first()).toBeDisabled();
  });

  test('settings workspace + org have demo-locked controls', async ({ page }) => {
    await gotoDashboard(page, 'settings/workspace');
    const demoSelects = page.locator('select[title="To jest DEMO"]');
    await expect(demoSelects).toHaveCount(1);
    await expect(demoSelects.first()).toBeDisabled();
    await expect(page.getByRole('button', { name: /Wdróż w trybie produkcyjnym/i })).toBeDisabled();

    await gotoDashboard(page, 'settings/org');
    await expect(page.getByRole('button', { name: /Zaproś/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /Zatwierdź Plan Subskrypcji/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /Usuń Organizację/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /Zapisz zmiany/i })).toBeDisabled();
  });
});
