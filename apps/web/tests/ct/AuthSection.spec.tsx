import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { AuthSection } from '../../components/AuthSection';
import { applyBrowserMocks, mountWithProviders, t } from './utils';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('AuthSection renders', async ({ mount }) => {
  const component = await mountWithProviders(mount, <AuthSection t={t} />);
  await expect(component).toBeVisible();
});

test('AuthSection blocks register without address', async ({ mount }) => {
  const component = await mountWithProviders(mount, <AuthSection t={t} />);

  await component.getByPlaceholder(t.auth.email_placeholder_register).fill('test@example.com');
  await component.getByPlaceholder(t.auth.pass_label).fill('Strong!Pass1');

  const nextButton = component.getByRole('button', { name: t.auth.next_protocol });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  await component.getByPlaceholder(t.auth.company_name_placeholder).fill('Acme sp. z o.o.');

  const createAccountButton = component.getByRole('button', { name: t.auth.create_account_cta });
  await expect(createAccountButton).toBeDisabled();
  await expect(component.getByText(t.auth.company_address_required)).toBeVisible();
});
