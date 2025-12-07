import React, { useEffect, useState, useMemo } from 'react';
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
  // --- Stan Aplikacji ---
  const [lang, setLang] = useState<Language>('PL');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeSection, setActiveSection] = useState<DemoSection>('Dashboard');
  
  // --- Stan UI ---
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [alwaysExpanded, setAlwaysExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [dashboardToast, setDashboardToast] = useState<string | null>(null);

  // --- Stan Danych ---
  const [dateRange, setDateRange] = useState<'today' | 'last7' | 'last30'>('last30');
  const [reportView, setReportView] = useState<ReportView>('sales');
  const [aiTrigger, setAiTrigger] = useState(false);
  const [integrationHealth, setIntegrationHealth] = useState<IntegrationHealthMap>({});

  const isDemo = path.startsWith('/demo');
  const t: DemoTranslation = TRANSLATIONS[lang].demo;

// Obliczenia pochodne dla integracji
  const { integrationAlert, needsReauth } = useMemo(() => {
    // POPRAWKA: Dodajemy rzutowanie typu (as ...), aby TS wiedział, co jest w środku
    const entries = Object.entries(integrationHealth) as [string, IntegrationHealthEntry][];
    
    const errorEntry = entries.find(([, entry]) => entry.state === 'error');
    const reauth = entries.some(([, entry]) => entry.state === 'needs_reauth');

    let alert = null;
    if (errorEntry) {
      alert = t.dashboard.alerts.connectionLost.replace(
        '{name}',
        // Teraz TS wie, że errorEntry[1] ma pole longName
        errorEntry[1].longName ?? errorEntry[0]
      );
    }
    return { integrationAlert: alert, needsReauth: reauth };
  }, [integrationHealth, t.dashboard.alerts.connectionLost]);
  // --- Efekty (Logic) ---

  // 1. Synchronizacja trybu ciemnego z HTML
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // 2. Obsługa Sidebara (Always Expanded)
  useEffect(() => {
    // Ustawiamy expanded tylko jeśli wymuszenie jest włączone, a sidebar jest zwinięty
    if (alwaysExpanded && !sidebarExpanded) {
      setSidebarExpanded(true);
    }
  }, [alwaysExpanded, sidebarExpanded]);

  // 3. Wczytanie stanu integracji z localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('papadata_integration_health');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      
      // Walidacja czy to na pewno tablica, żeby uniknąć crasha
      if (Array.isArray(parsed)) {
        const map = parsed.reduce((acc, entry: IntegrationHealthEntry) => {
          if (entry && entry.id) acc[entry.id] = entry;
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
      }
    } catch (e) {
      console.warn('Failed to parse integration health from localStorage', e);
    }
  }, []); // Pusty dependency array - tylko przy montowaniu

  // 4. Auto-zamykanie toastów
  useEffect(() => {
    if (!dashboardToast) return;
    const timer = setTimeout(() => setDashboardToast(null), 4500);
    return () => clearTimeout(timer);
  }, [dashboardToast]);

  // 5. Parsowanie URL (Routing) - oparte o prop 'path', nie window.location
  useEffect(() => {
    try {
      // Tworzymy obiekt URL bazując na aktualnym origin i przekazanym path
      // Dzięki temu 'path' może być względny (np. /demo/reports)
      const mockBase = window.location.origin;
      const urlObj = new URL(path, mockBase);
      
      const pathname = urlObj.pathname;
      const searchParams = urlObj.searchParams;

      const viewParam = (searchParams.get('view') || 'sales').toLowerCase() as ReportView;
      const trigger = searchParams.get('trigger');

      // Logika routingu
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

      // Obsługa query params dla Demo Tour
      if (pathname.includes('/demo/dashboard') && searchParams.get('tour')) {
        setSidebarExpanded(true);
      }
    } catch (e) {
      console.error('URL parsing error:', e);
    }
  }, [path]);

  // --- Handlery ---

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

    const routes: Record<DemoSection, string> = {
      Dashboard: `${base}/dashboard`,
      LiveReports: `${base}/reports`,
      Academy: `${base}/academy`,
      Support: `${base}/support`,
      Integrations: `${base}/integrations`,
      Settings: `${base}/settings`,
    };

    navigate(routes[section] || `${base}/dashboard`);
  };

  // --- Render ---

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
                />
              )}

              {activeSection === 'Academy' && (
                <Academy lang={lang} isDemo={isDemo} />
              )}

              {activeSection === 'Support' && <Support t={t.support} />}

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