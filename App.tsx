import React, { useState, useEffect } from 'react';
import { Language, Theme, IntegrationCategory } from './types';
import { TRANSLATIONS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import IntegrationsSection from './components/IntegrationsSection';
import IntegrationsModal from './components/IntegrationsModal';
import NaggingModal from './components/NaggingModal';
import ScrollToTop from './components/ScrollToTop';
import DemoDashboard from './components/DemoDashboard';
import Footer from './components/Footer';
import ScalabilitySection from './components/ScalabilitySection';
import KeyFeatures from './components/KeyFeatures';
import Security from './components/Security';
import ValueProposition from './components/ValueProposition';
import PricingOverview from './components/PricingOverview';
import SocialProof from './components/SocialProof';
import TrustBar from './components/TrustBar';
import Wizard from './components/Wizard';

const App: React.FC = () => {
  // Routing State
  const getCurrentLocation = () => window.location.pathname + window.location.search;
  const [currentPath, setCurrentPath] = useState(getCurrentLocation());

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('papadata_token'));
    } catch {
      return false;
    }
  });

  // Landing Page State
  const [lang, setLang] = useState<Language>(() => {
    try {
      return (localStorage.getItem('papadata-lang') as Language) || 'PL';
    } catch {
      return 'PL';
    }
  });

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('papadata-theme') as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [modalCategoryFilter, setModalCategoryFilter] = useState<IntegrationCategory | 'All'>('All');

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      console.warn('History pushState blocked, using in-memory navigation:', e);
    }
    setCurrentPath(getCurrentLocation());
    window.scrollTo(0, 0);
  };

  type SmartTarget =
    | 'demo'
    | 'demo-ai'
    | 'reports-sales'
    | 'reports-technical'
    | 'academy'
    | 'academy-docs'
    | 'contact'
    | 'pricing'
    | 'privacy'
    | 'terms'
    | 'about';

  const resolveSmartPath = (target: SmartTarget) => {
    const logged = isLoggedIn;
    switch (target) {
      case 'demo':
        return logged ? '/dashboard' : '/demo/dashboard?tour=1';
      case 'demo-ai':
        return logged ? '/dashboard?trigger=ai' : '/demo/dashboard?trigger=ai';
      case 'reports-sales':
        return logged ? '/reports/sales' : '/demo/reports?view=sales';
      case 'reports-technical':
        return logged ? '/reports/technical' : '/demo/reports?view=technical';
      case 'academy':
        return logged ? '/academy' : '/demo/academy';
      case 'academy-docs':
        return logged ? '/academy/docs' : '/demo/academy?view=docs';
      case 'contact':
        return logged ? '/support/new-ticket' : '/demo/contact';
      case 'pricing':
        return logged ? '/settings/subscription' : '#pricing';
      case 'privacy':
        return logged ? '/settings/legal' : '/privacy-policy';
      case 'terms':
        return logged ? '/settings/legal' : '/terms';
      case 'about':
        return logged ? '/' : '#about';
      default:
        return '/';
    }
  };

  const smartNavigate = (target: SmartTarget) => {
    const destination = resolveSmartPath(target);
    if (destination.startsWith('#')) {
      const id = destination.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      return;
    }
    navigate(destination);
  };

  // Global Link Hijacking
  useEffect(() => {
    const normalizeText = (value: string) =>
      value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const wizardTokens = [
      'trial',
      'konto',
      'zarejestruj',
      'zaloguj',
      'odblokuj',
      'zaloz',
      'rejestr',
      'activate',
      'sign up',
      'signup',
      'create account',
      'aktywuj',
    ];

    const handleClick = (e: MouseEvent) => {
      const clickable = (e.target as HTMLElement).closest('a,button');
      if (!clickable) return;

      const text = normalizeText(clickable.textContent || '');
      const wizardMatch = wizardTokens.some((token) => text.includes(token));

      if (wizardMatch) {
        e.preventDefault();
        const href = clickable instanceof HTMLAnchorElement ? clickable.getAttribute('href') : null;
        const target = href && href.startsWith('/wizard') ? href : '/wizard';
        navigate(target);
        return;
      }

      if (clickable.tagName.toLowerCase() === 'a') {
        const href = clickable.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('http')) {
          e.preventDefault();
          navigate(href);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Sync language with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('papadata-lang', lang);
    } catch {}
  }, [lang]);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('papadata-theme', theme);
    } catch {}
  }, [theme]);

  // DEMO / APP ROUTES
  if (
    currentPath.startsWith('/demo') ||
    currentPath.startsWith('/dashboard') ||
    currentPath.startsWith('/reports') ||
    currentPath.startsWith('/academy') ||
    currentPath.startsWith('/support') ||
    currentPath.startsWith('/integrations') ||
    currentPath.startsWith('/settings') ||
    currentPath.startsWith('/app')
  ) {
    return <DemoDashboard navigate={navigate} path={currentPath} />;
  }

  // ONBOARDING WIZARD
  if (currentPath === '/wizard') {
    return <Wizard lang={lang} setLang={setLang} navigate={navigate} />;
  }

  // LANDING PAGE
  const t = TRANSLATIONS[lang];

  const handleOpenIntegrations = (category: IntegrationCategory | 'All' = 'All') => {
    setModalCategoryFilter(category);
    setIsIntegrationsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-primary-500/30 selection:text-primary-200 font-sans relative">
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only absolute top-0 left-0 z-50 rounded bg-primary-600 p-4 text-white"
      >
        {lang === 'PL' ? 'Przejdź do treści' : 'Skip to content'}
      </a>

      {/* STICKY HEADER */}
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        t={t.header}
        onOpenIntegrations={handleOpenIntegrations}
        smartNavigate={smartNavigate}
        isLoggedIn={isLoggedIn}
      />

      {/* MAIN CONTENT */}
      <main id="main">
        {/* 1. HERO */}
        <Hero t={t.hero} lang={lang} onSmartNavigate={smartNavigate} />

        {/* 2. TRUST BAR */}
        <TrustBar />

        {/* 3. VALUE PROP */}
        <ValueProposition />

        {/* 4. KEY FEATURES */}
        <div id="features" />
        <KeyFeatures />

        {/* 5. INTEGRATIONS */}
        <div id="integrations" />
        <IntegrationsSection t={t.integrationsSection} onOpenModal={() => handleOpenIntegrations('All')} />

        {/* 6. SOCIAL PROOF */}
        <SocialProof />

        {/* 7. SECURITY & SCALE */}
        <div className="bg-slate-50 dark:bg-slate-900/30">
          <Security />
          <ScalabilitySection lang={lang} />
        </div>

        {/* 8. PRICING */}
        <div id="pricing" />
        <PricingOverview />
      </main>

      {/* FOOTER */}
      <Footer smartNavigate={smartNavigate} onOpenIntegrations={handleOpenIntegrations} />

      {/* MODALS */}
      <IntegrationsModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        lang={lang}
        t={t.integrationsModal}
        initialFilter={modalCategoryFilter}
        isLoggedIn={isLoggedIn}
        navigate={navigate}
      />

      <NaggingModal t={t.nagging} />
      <ScrollToTop tooltip={t.scrollToTop} />
    </div>
  );
};

export default App;
