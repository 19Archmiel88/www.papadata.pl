import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { CheckoutSuccess } from '../../components/billing/CheckoutSuccess';
import { applyBrowserMocks } from './utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UIProvider } from '../../context/UIContext';
import { AuthProvider } from '../../context/AuthContext';
import { ModalProvider } from '../../context/ModalContext';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('CheckoutSuccess renders', async ({ mount }) => {
  const component = await mount(
    <MemoryRouter initialEntries={['/billing/success']}>
      <UIProvider>
        <AuthProvider>
          <ModalProvider>
            <Routes>
              <Route path="/billing/success" element={<CheckoutSuccess />} />
            </Routes>
          </ModalProvider>
        </AuthProvider>
      </UIProvider>
    </MemoryRouter>,
  );
  await expect(component).toBeVisible();
});
