/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { Page } from '@playwright/test';
import { HashRouter, MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { UIProvider } from '../../context/UIContext';
import { AuthProvider } from '../../context/AuthContext';
import { ModalProvider } from '../../context/ModalContext';
import { translations } from '../../translations';
import type { Translation } from '../../types';
import type { DashboardOutletContext } from '../../components/dashboard/DashboardContext';
import { integrations, type IntegrationItem } from '../../data/integrations';

export const t = translations.pl as Translation;
export const sampleIntegration = (integrations?.[0] ?? null) as IntegrationItem | null;

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <UIProvider>
    <AuthProvider>
      <ModalProvider>{children}</ModalProvider>
    </AuthProvider>
  </UIProvider>
);

export const mountWithProviders = async (
  mount: (component: React.ReactElement) => Promise<import('@playwright/test').Locator>,
  ui: React.ReactElement
) =>
  mount(
    <HashRouter>
      <Providers>{ui}</Providers>
    </HashRouter>
  );

const DashboardOutletShell = ({ context }: { context: DashboardOutletContext }) => (
  <Outlet context={context} />
);

export const createDashboardContext = (): DashboardOutletContext => ({
  t,
  timeRange: '30d',
  isDemo: true,
  onUpgrade: () => {},
  integrationStatus: {},
  onIntegrationConnect: () => {},
  connectors: {},
  setConnectors: () => {},
  retentionDays: 30,
  setRetentionDays: () => {},
  maskingEnabled: true,
  setMaskingEnabled: () => {},
  region: 'europe-central2',
  setRegion: () => {},
  contextLabel: null,
  setContextLabel: () => {},
  aiDraft: null,
  setAiDraft: () => {},
  filters: {},
  setFilters: () => {},
  aiMode: true,
  setAiMode: () => {},
  appMode: 'demo',
  planTier: 'Starter',
  sessionStatus: 'ready',
});

export const mountDashboardView = async (
  mount: (component: React.ReactElement) => Promise<import('@playwright/test').Locator>,
  ui: React.ReactElement
) => {
  const context = createDashboardContext();

  return mount(
    <MemoryRouter initialEntries={['/']}>
      <Providers>
        <Routes>
          <Route element={<DashboardOutletShell context={context} />}>
            <Route path="/" element={ui} />
          </Route>
        </Routes>
      </Providers>
    </MemoryRouter>
  );
};

export const applyBrowserMocks = async (page: Page) => {
  await page.addInitScript(() => {
    if (!window.matchMedia) {
      window.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      });
    }

    if (!window.ResizeObserver) {
      window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as typeof ResizeObserver;
    }

    if (!window.IntersectionObserver) {
      window.IntersectionObserver = class {
        root: Element | Document | null = null;
        rootMargin = '';
        thresholds = [] as number[];
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [] as IntersectionObserverEntry[];
        }
      } as typeof IntersectionObserver;
    }
  });
};
