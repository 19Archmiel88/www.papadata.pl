import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConsentProvider } from './contexts/ConsentContext';
import { AuthProvider } from './contexts/AuthContext';
import i18n from './i18n/config';
import './styles/theme.css';
import './styles/main.css';
import './styles/shell.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ConsentProvider>
            <App />
          </ConsentProvider>
        </AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  </StrictMode>,
)
