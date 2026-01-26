import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

import { useUI } from './context/useUI';
import { useModal } from './context/useModal';
import { Logo } from './components/Logo';
import { InteractiveButton } from './components/InteractiveButton';
import { OfflineBanner } from './components/OfflineBanner';
import type { FooterLink } from './types';
import type { IntegrationItem } from './data/integrations';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, lang, setLang, theme, toggleTheme } = useUI();
  const { openModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingRoute = useMemo(
    () => ['/', '/features', '/pricing', '/integrations', '/faq', '/security'].includes(location.pathname),
    [location.pathname],
  );

  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 20);
        setShowScrollTop(currentScrollY > 400);

        if (currentScrollY < 10) {
          setVisible(true);
        } else if (currentScrollY > lastScrollY.current) {
          if (currentScrollY > 150) setVisible(false);
        } else {
          setVisible(true);
        }

        lastScrollY.current = currentScrollY;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const routeToSection = (id: string) => {
    // preferujemy “ładne URL-e” (App routuje te ścieżki do LandingPage),
    // a LandingPage odpowiada za scroll do sekcji.
    const map: Record<string, string> = {
      features: '/features',
      pricing: '/pricing',
      integrations: '/integrations',
      faq: '/faq',
      security: '/security',
    };

    const targetRoute = map[id];
    if (targetRoute) {
      navigate(targetRoute);
      return;
    }

    // fallback (gdyby sekcja była tylko anchor)
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection(id), 120);
    } else {
      scrollToSection(id);
    }
  };

  const handleNavAction = (key: string) => {
    setMobileMenuOpen(false);

    if (key === 'about') {
      openModal('about');
      return;
    }

    if (key === 'knowledge') {
      // zgodnie z zasadą: demo dashboard dostępny publicznie tylko przez DEMO PRO.
      // knowledge na landing traktujemy jak feature (nie dashboard).
      routeToSection('features');
      return;
    }

    if (['pricing', 'features', 'integrations', 'faq', 'security'].includes(key)) {
      routeToSection(key);
      return;
    }

    navigate(`/${key}`);
  };

  const handleDropdownClick = (actionId: string) => {
    setMobileMenuOpen(false);
    if (actionId.startsWith('feature_')) {
      const key = actionId.replace('feature_', '') as keyof typeof t.features;
      openModal('feature', { feature: t.features[key] });
    } else if (actionId.startsWith('integrations_')) {
      const cat = actionId.replace('integrations_', '') as any;
      openModal('integrations', {
        category: cat,
        onSelectIntegration: (item: IntegrationItem) =>
          openModal('integration_connect', { integration: item }),
      });
    }
  };

  const handleFooterLinkClick = (link: FooterLink) => {
    const id = link.actionId.toLowerCase();

    if (id === 'cookie_settings') {
      window.dispatchEvent(new Event('open-cookie-settings'));
      return;
    }

    if (id === 'contact') {
      openModal('contact');
      return;
    }

    if (id.startsWith('legal_')) {
      const map: Record<string, string> = {
        legal_terms: '/legal/terms',
        legal_privacy: '/legal/privacy',
        legal_cookies: '/legal/cookies',
        legal_dpa: '/legal/dpa',
        legal_subprocessors: '/legal/subprocessors',
        legal_ai: '/legal/ai',
        legal_accessibility: '/legal/accessibility',
      };
      const target = map[id];
      if (target) {
        navigate(target);
        return;
      }
    }

    if (['about', 'features', 'pricing', 'integrations', 'faq', 'knowledge', 'security'].includes(id)) {
      handleNavAction(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg transition-colors duration-500">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] px-6 py-3 bg-brand-start text-white font-bold rounded-xl shadow-2xl ring-2 ring-white dark:ring-black outline-none"
      >
        {t.common.skip_to_content}
      </a>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 brand-gradient-bg z-[1000] origin-left shadow-[0_0_15px_rgba(34,211,238,0.5)]"
        style={{ scaleX }}
      />
      <OfflineBanner />

      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-500 flex justify-center pt-2 md:pt-6 px-4 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        aria-label={t.common.main_nav_label}
      >
        <div
          className={`transition-all duration-700 ease-in-out border flex items-center justify-between px-4 md:px-8 ${
            scrolled
              ? 'w-full max-w-6xl rounded-2xl md:rounded-[2rem] glass shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] scale-[0.98] h-14 md:h-20 border-brand-start/20'
              : 'w-full max-w-7xl rounded-none border-transparent bg-transparent scale-100 h-14 md:h-20'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (location.pathname === '/') scrollToTop();
              else navigate('/');
            }}
            className="flex items-center gap-2 md:gap-4 group bg-transparent border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-start rounded-xl cursor-pointer shrink-0"
            aria-label={t.common.home_link_label}
          >
            <Logo className="w-8 h-8 md:w-11 md:h-11 text-gray-900 dark:text-white transition-transform group-hover:scale-105" />
            <div className="flex flex-col text-left">
              <span className="font-black text-lg md:text-2xl tracking-tighter text-gray-900 dark:text-white leading-none">
                PapaData
              </span>
              <span className="font-bold text-4xs md:text-2xs tracking-[0.3em] uppercase leading-none mt-1 md:mt-1.5 animated-gradient-text">
                Intelligence
              </span>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 h-full">
            {t.nav.items.map((item) => (
              <div key={item.key} className="relative group h-full flex items-center">
                <button
                  type="button"
                  onClick={() => handleNavAction(item.key)}
                  className="text-xs-plus font-black text-gray-500 dark:text-gray-400 group-hover:text-brand-start transition-all flex items-center gap-2 cursor-pointer uppercase tracking-widest"
                >
                  {item.label}
                  {item.dropdown && (
                    <svg
                      className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 opacity-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {item.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-500 transform origin-top scale-90 group-hover:scale-100 group-focus-within:scale-100">
                    <div className="w-64 p-2 rounded-2xl bg-white/95 dark:bg-[#0a0a0c]/95 border border-black/5 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] backdrop-blur-2xl ring-1 ring-black/5">
                      <div className="flex flex-col gap-0.5">
                        {item.dropdown.map((subItem, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleDropdownClick(subItem.actionId)}
                            className="w-full text-left px-4 py-3 text-xs font-black text-gray-600 dark:text-gray-400 hover:text-brand-start dark:hover:text-white hover:bg-brand-start/5 dark:hover:bg-white/5 rounded-xl transition-all flex items-center group/item cursor-pointer uppercase tracking-widest"
                          >
                            <span className="w-1 h-1 rounded-full bg-brand-start/20 group-hover/item:bg-brand-start mr-3 transition-colors" />
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 border-r border-gray-200 dark:border-white/10 pr-4 mr-1 h-6">
              <button
                type="button"
                onClick={() => setLang(lang === 'en' ? 'pl' : 'en')}
                className="text-xs font-black font-mono tracking-widest uppercase px-1.5 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {lang}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-start/10 transition-all cursor-pointer"
                aria-label={theme === 'light' ? t.common.toggle_theme_dark : t.common.toggle_theme_light}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>

            {/* ZALOGUJ */}
            <button
              type="button"
              onClick={() => openModal('auth', { isRegistered: true })}
              className="hidden md:block text-xs-plus font-black uppercase tracking-widest text-brand-start hover:text-brand-end transition-all"
            >
              {t.nav.login}
            </button>

            {/* DEMO PRO → jedyny publiczny wejściowy punkt demo */}
            <InteractiveButton
              variant="primary"
              onClick={() => navigate('/dashboard?mode=demo')}
              className="!h-9 md:!h-11 !px-4 md:!px-7 !text-xs !font-black uppercase tracking-widest shadow-xl"
            >
              {t.nav.cta}
            </InteractiveButton>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-gray-900 dark:text-white"
              aria-label={mobileMenuOpen ? t.common.close_menu : t.common.open_menu}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d={
                    mobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-4 right-4 mt-2 p-6 rounded-3xl glass shadow-2xl border border-brand-start/20 flex flex-col gap-6 lg:hidden"
            >
              <div className="grid gap-4">
                {t.nav.items.map((item) => (
                  <div key={item.key} className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleNavAction(item.key)}
                      className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center justify-between w-full"
                    >
                      {item.label}
                      {item.dropdown && <span className="text-brand-start text-xs">{t.nav.mobile_dropdown_hint}</span>}
                    </button>
                    {item.dropdown && (
                      <div className="grid grid-cols-1 gap-2 pl-4 border-l border-brand-start/20">
                        {item.dropdown.map((sub, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleDropdownClick(sub.actionId)}
                            className="text-left py-2 text-xs font-bold text-gray-500 uppercase tracking-tighter"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  <button type="button" onClick={() => setLang(lang === 'en' ? 'pl' : 'en')} className="text-xs font-black uppercase font-mono">
                    {lang}
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="text-lg"
                    aria-label={theme === 'light' ? t.common.toggle_theme_dark : t.common.toggle_theme_light}
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal('auth', { isRegistered: true });
                  }}
                  className="text-xs font-black uppercase tracking-widest text-brand-start"
                >
                  {t.nav.login}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main id="main-content" className="flex-grow focus:outline-none" tabIndex={-1}>
        {children}
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            style={{
              bottom: isLandingRoute
                ? `calc(24px + var(--pd-floating-offset, 0px))`
                : '24px',
              right: isLandingRoute
                ? `calc(24px + var(--pd-chat-panel-offset, 0px))`
                : '24px',
            }}
            className="fixed z-[1900] w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-2xl bg-white dark:bg-[#121217] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center hover:border-brand-start/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start"
            aria-label={t.common.scroll_to_top}
          >
            <div className="absolute inset-0 bg-brand-start opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <svg className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer – bez zmian funkcjonalnych */}
      <footer className="bg-[#050507] pt-20 md:pt-32 pb-10 md:pb-16 relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 mb-16 md:mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6 md:space-y-8">
            <button type="button" onClick={scrollToTop} className="flex items-center gap-3 md:gap-4 group cursor-pointer">
              <Logo className="w-8 h-8 md:w-10 md:h-10 text-white transition-transform group-hover:scale-105" />
              <span className="font-black text-white tracking-tighter text-2xl md:text-3xl">PapaData</span>
            </button>
            <p className="text-gray-400 text-base md:text-lg max-w-md font-medium leading-relaxed italic opacity-80">
              {t.footer.tagline}
            </p>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">{t.footer.hosting}</span>
          </div>

          <div className="space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em]">{t.footer.col1_title}</h4>
            <ul className="space-y-3 md:space-y-4">
              {t.footer.col1_links.map((link) => (
                <li key={link.actionId}>
                  <button
                    type="button"
                    onClick={() => handleNavAction(link.actionId)}
                    className="text-gray-500 hover:text-brand-start transition-colors text-xs md:text-sm font-semibold uppercase tracking-widest"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em]">{t.footer.col2_title}</h4>
            <ul className="space-y-3 md:space-y-4">
              {t.footer.col2_links.map((link) => (
                <li key={link.actionId}>
                  <button
                    type="button"
                    onClick={() => handleFooterLinkClick(link)}
                    className="text-gray-500 hover:text-brand-start transition-colors text-xs md:text-sm font-semibold uppercase tracking-widest"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em]">{t.footer.col3_title}</h4>
            <ul className="space-y-3 md:space-y-4">
              {t.footer.col3_links.map((link) => (
                <li key={link.actionId}>
                  <button
                    type="button"
                    onClick={() => handleFooterLinkClick(link)}
                    className="text-gray-500 hover:text-brand-start transition-colors text-xs md:text-sm font-semibold uppercase tracking-widest"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col gap-6 text-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 md:gap-8">
              <span className="text-3xs md:text-xs font-black uppercase tracking-[0.2em]">{t.footer.copyright}</span>
              <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-3xs md:text-xs font-black uppercase tracking-[0.2em] text-emerald-500/60">
                  {t.footer.status}
                </span>
              </div>
            </div>
            <div className="flex gap-6 md:gap-8">
              <span className="text-3xs md:text-xs font-black tracking-[0.2em] uppercase">{t.footer.region}</span>
              <span className="text-3xs md:text-xs font-black tracking-[0.2em] uppercase">{t.footer.meta.protocol_level_value}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {t.footer.legal_links.map((link) => (
              <button
                key={link.actionId}
                type="button"
                onClick={() => handleFooterLinkClick(link)}
                className="text-3xs md:text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-brand-start transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
