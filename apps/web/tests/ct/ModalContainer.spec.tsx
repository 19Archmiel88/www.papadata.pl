import React, { useEffect } from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { ModalContainer } from '../../components/modals/ModalContainer';
import { UIProvider } from '../../context/UIContext';
import { AuthProvider } from '../../context/AuthContext';
import { ModalProvider } from '../../context/ModalContext';
import { useModal } from '../../context/useModal';
import { applyBrowserMocks } from './utils';
import { HashRouter } from 'react-router-dom';

const OpenAboutModal = () => {
  const { openModal } = useModal();

  useEffect(() => {
    openModal('about');
  }, [openModal]);

  return null;
};

test.beforeEach(async ({ page }) => {
  await applyBrowserMocks(page);
});

test('ModalContainer renders active modal', async ({ mount }) => {
  const component = await mount(
    <HashRouter>
      <UIProvider>
        <AuthProvider>
          <ModalProvider>
            <OpenAboutModal />
            <ModalContainer />
          </ModalProvider>
        </AuthProvider>
      </UIProvider>
    </HashRouter>,
  );
  await expect(component).toBeVisible();
});
