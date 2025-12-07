// components/DemoDashboard.tsx
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  Theme,
  Language,
  DemoSection,
  IntegrationHealthEntry,
  IntegrationHealthMap,
  DemoTranslation,
} from '../types';
import { TRANSLATIONS } from '../constants';
import Sidebar from './demo/Sidebar';
import TopBar from './demo/TopBar';
import DashboardHome from './demo/DashboardHome';
import LiveReports from './demo/LiveReports';
import IntegrationsDemo from './demo/IntegrationsDemo';
import Academy from './demo/Academy';
import Support from './demo/Support';
import Settings from './demo/Settings';

interface Props {
  /** Funkcja do zmiany ścieżki (przekazana z App.tsx) */
  navigate: (path: string) => void;
  /** Aktualna ścieżka URL – używana do ustawiania sekcji */
  path: string;
}

type ReportView = 'sales' | 'campaigns' | 'customers' | 'technical';

const DemoDashboard: React.FC<Props> = ({ navigate, path }) => {
  const [lang, setLang] = useState<Language>('PL');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeSection, setActiveSection] = useState<DemoSection>('Dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [alwaysExpanded, setAlwaysExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'last7' | 'last30'>('last30');
  const [reportView, setReportView] = useState<ReportView>('sales');
  const [aiTrigger, setAiTrigger] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [integrationHealth, setIntegrationHealth] = useState<IntegrationHealthMap>({});
  const [dashboardToast, setDashboardToast] = useState<string | null>(null);

  const isDemo = path.startsWith('/demo');

  const t: DemoTranslation = TRANSLATIONS[lang].demo;

  const integrationIssueEntries = Object.entries(integrationHealth) as [
    string,
    IntegrationHealthEntry
  ][];
  const connectionErrorEntry = integrationIssueEntries.find(
    ([, entry]) => entry.state === 'error'
  );
  const integrationAlert = connectionErrorEntry
    ? t.dashboard.alerts.connectionLost.replace(
        '{name}',
        connectionErrorEntry[1].longName ?? connectionErrorEntry[0]
      )
    : null;
  const needsReauth = integrationIssueEntries.some(
    ([, entry]) => entry.state === 'needs_reauth'
  );

  // Synchronizacja trybu ciemnego z <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // Sidebar przypięty = zawsze rozwinięty
  useEffect(() => {
    if (alwaysExpanded) {
      setSidebarExpanded(true);
    }
  }, [alwaysExpanded]);

  // Wczytanie stanu integracji z localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('papadata_integration_health');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as IntegrationHealthEntry[];
      const map = parsed.reduce((acc, entry) => {
        acc[entry.id] = entry;
        return acc;
      }, {} as IntegrationHealthMap);

      setIntegrationHealth(map);

      const errorEntry = parsed.find((entry) => entry.state === 'error');
      const reauthEntry = parsed.find((entry) => entry.state === 'needs_reauth');

      if (errorEntry) {
        setDashboardToast(
          t.dashboard.alerts.toastError.replace(
            '{name}',
            errorEntry.longName ?? 'integracja'
          )
        );
      } else if (reauthEntry) {
        setDashboardToast(t.dashboard.alerts.toastReauth);
      }
    } catch {
      // ignorujemy błąd parsowania
    }
  }, [t.dashboard.alerts.toastError, t.dashboard.alerts.toastReauth]);

  // Auto-zamykanie toastów
  useEffect(() => {
    if (!dashboardToast) return;
    const timer = setTimeout(() => setDashboardToast(null), 4500);
    return () => clearTimeout(timer);
  }, [dashboardToast]);

  // Parsowanie URL -> ustawienie sekcji / widoku raportów / trigger AI
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const pathname = url.pathname;
      const viewParam = (url.searchParams.get('view') || 'sales').toLowerCase() as ReportView;
      const trigger = url.searchParams.get('trigger');

      if (pathname.includes('/reports')) {
        setActiveSection('LiveReports');
        setReportView(viewParam);
      } else if (pathname.includes('/academy')) {
        setActiveSection('Academy');
      } else if (pathname.includes('/support') || pathname.includes('/contact')) {
        setActiveSection('Support');
      } else if (pathname.includes('/integrations')) {
        setActiveSection('Integrations');
      } else if (pathname.includes('/settings')) {
        setActiveSection('Settings');
      } else {
        setActiveSection('Dashboard');
      }

      setAiTrigger(trigger === 'ai');

      if (pathname.includes('/demo/dashboard') && url.searchParams.get('tour')) {
        setSidebarExpanded(true);
      }
    } catch {
      // nic
    }
  }, [path]);

  const persistHealthSnapshot = (map: IntegrationHealthMap) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      'papadata_integration_health',
      JSON.stringify(Object.values(map))
    );
  };

  const handleReconnect = (id: string) => {
    setIntegrationHealth((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      const next: IntegrationHealthMap = {
        ...prev,
        [id]: {
          ...entry,
          state: 'healthy',
          message: undefined,
          updatedAt: new Date().toISOString(),
        },
      };
      persistHealthSnapshot(next);
      return next;
    });
    setDashboardToast(null);
  };

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = (to: 'home' | 'signup') => {
    setShowLogoutModal(false);
    navigate(to === 'signup' ? '/wizard' : '/');
  };

  const goToSection = (section: DemoSection) => {
    setActiveSection(section);

    const base = isDemo ? '/demo' : '';

    switch (section) {
      case 'Dashboard':
        navigate(`${base}/dashboard`);
        break;
      case 'LiveReports':
        navigate(`${base}/reports`);
        break;
      case 'Academy':
        navigate(`${base}/academy`);
        break;
      case 'Support':
        navigate(`${base}/support`);
        break;
      case 'Integrations':
        navigate(`${base}/integrations`);
        break;
      case 'Settings':
        navigate(`${base}/settings`);
        break;
      default:
        navigate(`${base}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={goToSection}
          isExpanded={sidebarExpanded}
          setIsExpanded={setSidebarExpanded}
          alwaysExpanded={alwaysExpanded}
          t={t.sidebar}
          onLogout={handleLogout}
        />

        {/* Główna kolumna */}
        <div className="flex-1 flex flex-col border-l border-slate-900/80 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950">
          {/* Topbar */}
          <TopBar
            t={t.topbar}
            activeSection={activeSection}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          {/* Pasek info: demo vs real + alerty integracji */}
          <div className="px-6 pt-3 pb-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                    isDemo
                      ? 'border-amber-400/60 text-amber-300 bg-amber-500/5'
                      : 'border-emerald-400/60 text-emerald-300 bg-emerald-500/5'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {isDemo
                    ? lang === 'PL'
                      ? 'Tryb demo – dane przykładowe'
                      : 'Demo mode – sample data'
                    : lang === 'PL'
                      ? 'Środowisko klienta – realne dane'
                      : 'Client workspace – real data'}
                </span>
                {integrationAlert && (
                  <span className="ml-2 text-xs text-amber-300/90">{integrationAlert}</span>
                )}
              </div>

              {needsReauth && (
                <button
                  type="button"
                  onClick={() => goToSection('Integrations')}
                  className="text-xs text-primary-300 hover:text-primary-100 underline underline-offset-2"
                >
                  {t.integrations.status.reconnectHint}
                </button>
              )}
            </div>
          </div>

          {/* Toast na górze kontentu */}
          {dashboardToast && (
            <div className="px-6 pt-2">
              <div className="pointer-events-auto inline-flex max-w-xl items-start gap-3 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-lg shadow-slate-900/40 px-4 py-3 text-sm">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="flex-1 text-slate-100">{dashboardToast}</p>
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-300"
                  onClick={() => setDashboardToast(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Kontent sekcji */}
          <main className="flex-1 px-6 pb-8 pt-4">
            <div className="max-w-6xl mx-auto space-y-6">
              {activeSection === 'Dashboard' && (
                <DashboardHome
                  t={t.dashboard}
                  dateRange={dateRange}
                  lang={lang}
                  highlightAI={aiTrigger}
                  integrationHealth={integrationHealth}
                  integrationAlert={integrationAlert}
                  needsReauth={needsReauth}
                />
              )}

              {activeSection === 'LiveReports' && (
                <LiveReports
                  t={t.reports}
                  initialTab={reportView}
                  onTabChange={setReportView}
                  lang={lang}
                  dateRange={dateRange}
                  integrationAlert={integrationAlert}
                />
              )}

              {activeSection === 'Integrations' && (
                <IntegrationsDemo
                  t={t.integrations}
                  integrationHealth={integrationHealth}
                  onReconnect={handleReconnect}
                  lang={lang}
                  isDemo={isDemo}
                />
              )}

              {activeSection === 'Academy' && (
                <Academy lang={lang} isDemo={isDemo} />
              )}

              {activeSection === 'Support' && (
                <Support lang={lang} isDemo={isDemo} />
              )}

              {activeSection === 'Settings' && (
                <Settings
                  t={t.settings}
                  lang={lang}
                  setLang={setLang}
                  theme={theme}
                  setTheme={setTheme}
                  alwaysExpanded={alwaysExpanded}
                  setAlwaysExpanded={setAlwaysExpanded}
                />
              )}


            </div>
          </main>
        </div>
      </div>

      {/* Modal wylogowania */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 shadow-xl shadow-black/50 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-200"
              onClick={() => setShowLogoutModal(false)}
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-semibold mb-2 text-slate-50">
              {t.logoutModal.title}
            </h3>
            <p className="text-sm text-slate-400 mb-5">{t.logoutModal.text}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => confirmLogout('signup')}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/30"
              >
                {t.logoutModal.signup}
              </button>
              <button
                type="button"
                onClick={() => confirmLogout('home')}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-100 text-sm font-semibold hover:bg-slate-900"
              >
                {t.logoutModal.back}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoDashboard;
