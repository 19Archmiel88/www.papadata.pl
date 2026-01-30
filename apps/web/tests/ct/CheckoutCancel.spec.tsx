import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { CheckoutCancel } from '../../components/billing/CheckoutCancel';
import { applyBrowserMocks } from './utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UIProvider } from '../../context/UIContext';
import { AuthProvider } from '../../context/AuthContext';
import { ModalProvider } from '../../context/ModalContext';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('CheckoutCancel renders', async ({ mount }) => {
  const component = await mount(
    <MemoryRouter initialEntries={['/billing/cancel']}>
      <UIProvider>
        <AuthProvider>
          <ModalProvider>
            <Routes>
              <Route path="/billing/cancel" element={<CheckoutCancel />} />
            </Routes>
          </ModalProvider>
        </AuthProvider>
      </UIProvider>
    </MemoryRouter>
  );
  await expect(component).toBeVisible();
});
