import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Theme, Language, DemoSection, IntegrationHealthEntry, IntegrationHealthMap } from '../types';
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
  /** Function to navigate to a different path */
  navigate: (path: string) => void;
  /** Current URL path to determine active section */
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

  const t = TRANSLATIONS[lang].demo;
  const integrationIssueEntries = Object.entries(integrationHealth) as [string, IntegrationHealthEntry][];
  const connectionErrorEntry = integrationIssueEntries.find(([, entry]) => entry.state === "error");
  const integrationAlert =
    connectionErrorEntry
      ? t.dashboard.alerts.connectionLost.replace("{name}", connectionErrorEntry[1].longName ?? connectionErrorEntry[0])
      : null;
  const needsReauth = integrationIssueEntries.some(([, entry]) => entry.state === "needs_reauth");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    if (alwaysExpanded) {
      setSidebarExpanded(true);
    } else {
      setSidebarExpanded(false);
    }
  }, [alwaysExpanded]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("papadata_integration_health");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as IntegrationHealthEntry[];
      const map = parsed.reduce<IntegrationHealthMap>((acc, entry) => {
        acc[entry.id] = entry;
        return acc;
      }, {});
      setIntegrationHealth(map);
      const errorEntry = parsed.find((entry) => entry.state === "error");
      const reauthEntry = parsed.find((entry) => entry.state === "needs_reauth");
      if (errorEntry) {
        setDashboardToast(
          t.dashboard.alerts.toastError.replace("{name}", errorEntry.longName ?? "integration"),
        );
      } else if (reauthEntry) {
        setDashboardToast(t.dashboard.alerts.toastReauth);
      }
    } catch {
      // ignore
    }
  }, [t.dashboard.alerts.toastError, t.dashboard.alerts.toastReauth]);

  useEffect(() => {
    if (!dashboardToast) return;
    const timer = setTimeout(() => setDashboardToast(null), 4500);
    return () => clearTimeout(timer);
  }, [dashboardToast]);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const pathname = url.pathname;
      const view = (url.searchParams.get('view') || 'sales').toLowerCase();
      const trigger = url.searchParams.get('trigger');

      if (pathname.includes('/reports')) {
        setActiveSection('LiveReports');
        if (view === 'technical') setReportView('technical');
        else if (view === 'campaigns') setReportView('campaigns');
        else if (view === 'customers') setReportView('customers');
        else setReportView('sales');
      } else if (pathname.includes('/academy')) {
        setActiveSection('Academy');
      } else if (pathname.includes('/contact') || pathname.includes('/support')) {
        setActiveSection('Support');
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
      // ignore
    }
  }, [path]);

  const persistHealthSnapshot = (map: IntegrationHealthMap) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("papadata_integration_health", JSON.stringify(Object.values(map)));
  };

  const handleReconnect = (id: string) => {
    setIntegrationHealth((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      const next = {
        ...prev,
        [id]: {
          ...entry,
          state: "healthy",
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

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isExpanded={sidebarExpanded}
          setIsExpanded={setSidebarExpanded}
          alwaysExpanded={alwaysExpanded}
          t={t.sidebar}
          onLogout={handleLogout}
        />

        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{ marginLeft: sidebarExpanded || alwaysExpanded ? 240 : 64 }}
        >
          <TopBar t={t.topbar} activeSection={activeSection} dateRange={dateRange} setDateRange={setDateRange} />

          <main className="flex-1 overflow-y-auto">
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
                integrationHealth={integrationHealth}
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
            {activeSection === 'Academy' && <Academy t={t.academy} />}
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
          </main>
        </div>
      </div>

      {dashboardToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] rounded-2xl bg-slate-900 text-white px-5 py-3 shadow-2xl shadow-black/40 opacity-95">
          {dashboardToast}
        </div>
      )}

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.logoutModal.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{t.logoutModal.text}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => confirmLogout('signup')}
                className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
              >
                {t.logoutModal.signup}
              </button>
              <button
                onClick={() => confirmLogout('home')}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t.logoutModal.back}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoDashboard;
