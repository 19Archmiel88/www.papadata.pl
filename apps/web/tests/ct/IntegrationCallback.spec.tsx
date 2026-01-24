import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { IntegrationCallback } from '../../components/integrations/IntegrationCallback';
import { applyBrowserMocks } from './utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UIProvider } from '../../context/UIContext';
import { AuthProvider } from '../../context/AuthContext';
import { ModalProvider } from '../../context/ModalContext';

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('IntegrationCallback renders', async ({ mount }) => {
  const component = await mount(
    <MemoryRouter initialEntries={["/app/integrations/callback/google?code=demo&state=1"]}>
      <UIProvider>
        <AuthProvider>
          <ModalProvider>
            <Routes>
              <Route path="/app/integrations/callback/:provider" element={<IntegrationCallback />} />
            </Routes>
          </ModalProvider>
        </AuthProvider>
      </UIProvider>
    </MemoryRouter>,
  );
  await expect(component).toBeVisible();
});
