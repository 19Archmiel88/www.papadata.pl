// apps/web/App.tsx
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UIProvider } from './context/UIContext';
import { useUI } from './context/useUI';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { ModalContainer } from './components/modals/ModalContainer';
import { LandingPage } from './LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import { LegalDocPage } from './components/LegalDocPage';
import { getWebConfig } from './config';
import { CheckoutSuccess } from './components/billing/CheckoutSuccess';
import { CheckoutCancel } from './components/billing/CheckoutCancel';
import { IntegrationCallback } from './components/integrations/IntegrationCallback';

// Lazy: layout + views – zakładamy **nazwane** eksporty w plikach
const DashboardLayout = React.lazy(() =>
  import('./components/dashboard/DashboardSection').then((m) => ({
    default: m.DashboardSection,
  }))
);

const OverviewViewV2 = React.lazy(() =>
  import('./components/dashboard/OverviewViewV2').then((m) => ({
    default: m.OverviewViewV2,
  }))
);

const AdsViewV2 = React.lazy(() =>
  import('./components/dashboard/AdsViewV2').then((m) => ({
    default: m.AdsViewV2,
  }))
);

const GrowthView = React.lazy(() =>
  import('./components/dashboard/GrowthView').then((m) => ({
    default: m.GrowthView,
  }))
);

const CustomersViewV2 = React.lazy(() =>
  import('./components/dashboard/CustomersViewV2').then((m) => ({
    default: m.CustomersViewV2,
  }))
);

const ProductsViewV2 = React.lazy(() =>
  import('./components/dashboard/ProductsViewV2').then((m) => ({
    default: m.ProductsViewV2,
  }))
);

const PandLViewV2 = React.lazy(() =>
  import('./components/dashboard/PandLViewV2').then((m) => ({
    default: m.PandLViewV2,
  }))
);

const ReportsView = React.lazy(() =>
  import('./components/dashboard/ReportsView').then((m) => ({
    default: m.ReportsView,
  }))
);

const PipelineView = React.lazy(() =>
  import('./components/dashboard/PipelineView').then((m) => ({
    default: m.PipelineView,
  }))
);

const GuardianViewV2 = React.lazy(() =>
  import('./components/dashboard/GuardianViewV2').then((m) => ({
    default: m.GuardianViewV2,
  }))
);

const AlertsViewV2 = React.lazy(() =>
  import('./components/dashboard/AlertsViewV2').then((m) => ({
    default: m.AlertsViewV2,
  }))
);

const IntegrationsViewV2 = React.lazy(() =>
  import('./components/dashboard/IntegrationsViewV2').then((m) => ({
    default: m.IntegrationsViewV2,
  }))
);

const KnowledgeView = React.lazy(() =>
  import('./components/dashboard/KnowledgeView').then((m) => ({
    default: m.KnowledgeView,
  }))
);

const SettingsWorkspaceView = React.lazy(() =>
  import('./components/dashboard/SettingsWorkspaceView').then((m) => ({
    default: m.SettingsWorkspaceView,
  }))
);

const SettingsOrgView = React.lazy(() =>
  import('./components/dashboard/SettingsOrgView').then((m) => ({
    default: m.SettingsOrgView,
  }))
);

// --- pomocnicze redirecty ---

const DashboardIndexRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/dashboard/overview${location.search}`} replace />;
};

const DashboardSettingsRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/dashboard/settings/workspace${location.search}`} replace />;
};

const AppRootRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/dashboard/overview${location.search}`} replace />;
};

const AppViewRedirect: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const view = params.view || 'overview';
  return <Navigate to={`/dashboard/${view}${location.search}`} replace />;
};

const LegalRoute: React.FC<{ docPath: string; fallbackTitle: string }> = ({
  docPath,
  fallbackTitle,
}) => {
  const { t } = useUI();
  const navigate = useNavigate();

  const [content, setContent] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  const docUrl = useMemo(() => {
    const base = getWebConfig().legalDocsBaseUrl;
    if (base && base.trim()) {
      return `${base.replace(/\/+$/, '')}/${docPath}`;
    }
    return `/legal/${docPath}`;
  }, [docPath]);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);
    setContent('');

    fetch(docUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Document fetch failed');
        return response.text();
      })
      .then((text) => {
        if (isMounted) setContent(text);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [docUrl]);

  const resolvedContent = useMemo(() => {
    if (content) return content;
    if (hasError) {
      return `# ${fallbackTitle}\n\nDocument unavailable.`;
    }
    return `# ${fallbackTitle}\n\nLoading...`;
  }, [content, fallbackTitle, hasError]);

  return (
    <LegalDocPage
      t={t}
      content={resolvedContent}
      fallbackTitle={fallbackTitle}
      onBack={() => navigate('/')}
    />
  );
};

const App: React.FC = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <ModalProvider>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="min-h-screen bg-[#030305] flex items-center justify-center text-white/20 uppercase tracking-[0.4em] font-black">
                  PapaData
                </div>
              }
            >
              <Routes>
                <Route
                  path="/health"
                  element={
                    <main className="min-h-screen bg-white dark:bg-[#050507] text-gray-900 dark:text-gray-100 flex items-center justify-center">
                      <pre className="text-xs opacity-70">{JSON.stringify({ status: 'ok' })}</pre>
                    </main>
                  }
                />
                {/* Landing */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/features" element={<LandingPage />} />
                <Route path="/pricing" element={<LandingPage />} />
                <Route path="/integrations" element={<LandingPage />} />
                <Route path="/faq" element={<LandingPage />} />
                <Route path="/security" element={<LandingPage />} />

                {/* Billing checkout callbacks */}
                <Route path="/billing/success" element={<CheckoutSuccess />} />
                <Route path="/billing/cancel" element={<CheckoutCancel />} />

                {/* App alias */}
                <Route
                  path="/app/integrations/callback/:provider"
                  element={<IntegrationCallback />}
                />
                <Route path="/app" element={<AppRootRedirect />} />
                <Route path="/app/:view" element={<AppViewRedirect />} />

                {/* Legal */}
                <Route
                  path="/legal/terms"
                  element={<LegalRoute docPath="terms-of-service.md" fallbackTitle="Terms" />}
                />
                <Route
                  path="/legal/privacy"
                  element={<LegalRoute docPath="privacy-policy.md" fallbackTitle="Privacy Policy" />}
                />
                <Route
                  path="/legal/cookies"
                  element={<LegalRoute docPath="cookies-policy.md" fallbackTitle="Cookies Policy" />}
                />
                <Route
                  path="/legal/dpa"
                  element={<LegalRoute docPath="dpa.md" fallbackTitle="DPA" />}
                />
                <Route
                  path="/legal/subprocessors"
                  element={<LegalRoute docPath="privacy-and-data.md" fallbackTitle="Subprocessors" />}
                />
                <Route
                  path="/legal/ai"
                  element={<LegalRoute docPath="ai-disclaimer.md" fallbackTitle="AI Disclaimer" />}
                />
                <Route
                  path="/legal/accessibility"
                  element={
                    <LegalRoute
                      docPath="accessibility-statement.md"
                      fallbackTitle="Accessibility Statement"
                    />
                  }
                />

                {/* Dashboard + nested routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardIndexRedirect />} />
                  <Route path="overview" element={<ErrorBoundary><OverviewViewV2 /></ErrorBoundary>} />
                  <Route path="ads" element={<ErrorBoundary><AdsViewV2 /></ErrorBoundary>} />
                  <Route path="growth" element={<ErrorBoundary><GrowthView /></ErrorBoundary>} />
                  <Route path="pandl" element={<ErrorBoundary><PandLViewV2 /></ErrorBoundary>} />
                  <Route path="reports" element={<ErrorBoundary><ReportsView /></ErrorBoundary>} />
                  <Route path="customers" element={<ErrorBoundary><CustomersViewV2 /></ErrorBoundary>} />
                  <Route path="products" element={<ErrorBoundary><ProductsViewV2 /></ErrorBoundary>} />
                  <Route path="pipeline" element={<ErrorBoundary><PipelineView /></ErrorBoundary>} />
                  <Route path="guardian" element={<ErrorBoundary><GuardianViewV2 /></ErrorBoundary>} />
                  <Route path="alerts" element={<ErrorBoundary><AlertsViewV2 /></ErrorBoundary>} />
                  <Route path="integrations" element={<ErrorBoundary><IntegrationsViewV2 /></ErrorBoundary>} />
                  <Route path="knowledge" element={<ErrorBoundary><KnowledgeView /></ErrorBoundary>} />

                  {/* Settings */}
                  <Route path="settings" element={<DashboardSettingsRedirect />} />
                  <Route path="settings/workspace" element={<ErrorBoundary><SettingsWorkspaceView /></ErrorBoundary>} />
                  <Route path="settings/org" element={<ErrorBoundary><SettingsOrgView /></ErrorBoundary>} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>

          <ModalContainer />
        </ModalProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default App;
