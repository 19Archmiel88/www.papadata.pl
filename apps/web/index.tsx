import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import {
  initConsentMode,
  applyStoredConsent,
  loadStoredConsent,
} from './utils/consent-mode';
import { initObservability } from './utils/observability.provider';
import { validateWebConfig } from './config';

// Inicjalizacja "globalnych" rzeczy przed startem Reacta
initConsentMode();
validateWebConfig();

const ensureHashRouterPath = () => {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;
  if (hash || pathname === '/') return;
  const next = `/#${pathname}${search}`;
  window.location.replace(next);
};

ensureHashRouterPath();

const storedConsent = loadStoredConsent();
if (storedConsent) {
  // Jeżeli applyStoredConsent czyta z storage, to nadal jest OK.
  // Jeśli potrafi przyjąć obiekt, warto to kiedyś ujednolicić.
  applyStoredConsent();

  // Observability uruchamiamy tylko po zgodzie na analitykę
  if (storedConsent.analytical) {
    initObservability();
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
