
import React, { useState, useEffect } from 'react';
import { Language, Theme, IntegrationCategory } from './types';
import { TRANSLATIONS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
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
import IntegrationHighlights from './components/IntegrationHighlights';
import Wizard from './components/Wizard';

const App: React.FC = () => {
  // Routing State
  const getCurrentLocation = () => window.location.pathname + window.location.search;
  const [currentPath, setCurrentPath] = useState(getCurrentLocation());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('papadata_token'));
    } catch {
      return false;
    }
  });

  // Landing Page State
  const [lang, setLang] = useState<Language>('PL');
  const [theme, setTheme] = useState<Theme>('dark');
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
      console.warn("History pushState blocked, using in-memory navigation:", e);
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

  // Global Link Hijacking for smooth SPA feel
  useEffect(() => {
    const normalizeText = (value: string) =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const wizardTokens = ['trial', 'konto', 'zarejestruj', 'zaloguj', 'odblokuj', 'zaloz', 'rejestr', 'activate', 'sign up', 'signup', 'create account', 'aktywuj'];
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
// Theme Handling (Landing Page - Demo handles its own theme locally for independent state, but syncs on mount if shared logic existed. Here they are separate.)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Render Logic
  if (
    currentPath.startsWith('/demo') ||
    currentPath.startsWith('/dashboard') ||
    currentPath.startsWith('/reports') ||
    currentPath.startsWith('/academy') ||
    currentPath.startsWith('/support') ||
    currentPath.startsWith('/settings') ||
    currentPath.startsWith('/app')
  ) {
    return <DemoDashboard navigate={navigate} path={currentPath} />;
  }

  if (currentPath === '/wizard') {
    return <Wizard lang={lang} setLang={setLang} navigate={navigate} />;
  }

  // Landing Page Render
  const t = TRANSLATIONS[lang];

  const handleOpenIntegrations = (category: IntegrationCategory | 'All' = 'All') => {
    setModalCategoryFilter(category);
    setIsIntegrationsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary-500/30 selection:text-primary-200 font-sans">
      
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

      <main>
        <Hero t={t.hero} onSmartNavigate={smartNavigate} />

        <KeyFeatures />
        <ValueProposition />
        <Security />
        <PricingOverview />
        <SocialProof />
        <TrustBar />
        <IntegrationHighlights />

        {/* Placeholder for Features ID used in header for smooth scrolling */}
        <div id="features" />
        <FeaturesSection t={t.featuresSection} />

        <IntegrationsSection
          t={t.integrationsSection}
          onOpenModal={() => handleOpenIntegrations('All')}
        />

        <ScalabilitySection lang={lang} />

        {/* Placeholder for Academy Link on Home */}
        <div id="academy"></div>

        {/* Placeholder for About anchor */}
        <div id="about"></div>
      </main>

      <Footer smartNavigate={smartNavigate} onOpenIntegrations={handleOpenIntegrations} />

      <IntegrationsModal 
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        lang={lang}
        t={t.integrationsModal}
        initialFilter={modalCategoryFilter}
      />
      
      <NaggingModal t={t.nagging} />
      
      <ScrollToTop tooltip={t.scrollToTop} />
    </div>
  );
};

export default App;

