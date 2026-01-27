// apps/web/LandingPage.tsx

import React, { useCallback, useMemo, Suspense, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from './context/useUI';
import { useModal } from './context/useModal';
import { useInView } from './hooks/useLazyResource';

// Shared UI
import { AuroraBackground, NeuralBackground } from './components/Backgrounds';
import { MainLayout } from './MainLayout';
import { CookieBanner } from './components/CookieBanner';
import { LandingChatWidget } from './components/LandingChatWidget';
import { AnimatedHero } from './components/AnimatedHero';
import { ShadcnShowcase } from './components/ShadcnShowcase';
import { Button } from './components/ui/button';

// Features (lazy)
const FeaturesSection = React.lazy(() =>
  import('./components/FeatureSection').then((m) => ({
    default: m.FeaturesSection,
  })),
);

const IntegrationsMarquee = React.lazy(() =>
  import('./components/IntegrationsMarquee').then((m) => ({
    default: m.IntegrationsMarquee,
  })),
);

const RoiSection = React.lazy(() =>
  import('./components/RoiSection').then((m) => ({
    default: m.RoiSection,
  })),
);

// Lazy Loaded Features
const VertexPlayer = React.lazy(() =>
  import('./components/VertexPlayer').then((m) => ({
    default: m.VertexPlayer,
  })),
);

const IntegrationsSection = React.lazy(() =>
  import('./components/IntegrationsSection').then((m) => ({
    default: m.IntegrationsSection,
  })),
);

const SecuritySection = React.lazy(() =>
  import('./components/SecuritySection').then((m) => ({
    default: m.SecuritySection,
  })),
);

const PricingSection = React.lazy(() =>
  import('./components/PricingSection').then((m) => ({
    default: m.PricingSection,
  })),
);

const FaqSection = React.lazy(() =>
  import('./components/FaqSection').then((m) => ({
    default: m.FaqSection,
  })),
);

type LazyWrapperProps = {
  children: React.ReactNode;
  minHeight?: number;
  fallbackHeight?: number;
  label?: string;
};

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  minHeight = 240,
  fallbackHeight,
  label,
}) => {
  const [ref, inView] = useInView({ rootMargin: '600px', triggerOnce: true });
  const height = fallbackHeight ?? minHeight;
  const placeholder = (
    <div
      role="status"
      aria-label={label}
      aria-busy="true"
      className="w-full animate-pulse bg-gray-100 dark:bg-white/5 rounded-[2.5rem]"
      style={{ height }}
    />
  );

  return (
    <div ref={ref} className="w-full" style={{ minHeight }}>
      {inView ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  );
};

const setCssVar = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
};

export const LandingPage: React.FC = () => {
  const { t, theme, lang } = useUI();
  const { openModal, activeModal } = useModal();
  const location = useLocation();

  const [hasCookieResolution, setHasCookieResolution] = useState(false);
  const [showPromoTeaser, setShowPromoTeaser] = useState(false);
  const [chatPanelWidth, setChatPanelWidth] = useState(0);
  const promoSnoozeKey = 'pd_promo_snooze_until';
  const promoCooldownMs = 1000 * 60 * 60 * 24 * 7;

  // Dock (prawy dół) – tylko czat. Offset dla strzałki wyliczamy dynamicznie.
  const dockRef = useRef<HTMLDivElement | null>(null);

  // Śledzenie zamknięcia promo (żeby teaser pokazał się także po ESC / klik w tło)
  const prevActiveModalRef = useRef<string | null>(null);
  const isPromoSnoozed = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const raw = window.localStorage.getItem(promoSnoozeKey);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  }, [promoSnoozeKey]);

  const snoozePromo = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(promoSnoozeKey, String(Date.now() + promoCooldownMs));
  }, [promoCooldownMs, promoSnoozeKey]);

  useEffect(() => {
    const prev = prevActiveModalRef.current;
    const next = (activeModal ?? null) as string | null;

    if (prev === 'promo' && next !== 'promo') {
      setShowPromoTeaser(true);
      snoozePromo();
    }

    prevActiveModalRef.current = next;
  }, [activeModal, snoozePromo]);

  useEffect(() => {
    setCssVar('--pd-floating-offset', '0px');
    setCssVar('--pd-chat-panel-offset', '0px');

    if (!dockRef.current || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const h = entry?.contentRect?.height ?? 0;
      setCssVar('--pd-floating-offset', `${Math.max(0, Math.round(h + 12))}px`);
    });

    ro.observe(dockRef.current);

    return () => {
      ro.disconnect();
      setCssVar('--pd-floating-offset', '0px');
      setCssVar('--pd-chat-panel-offset', '0px');
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (chatPanelWidth <= 0) {
      setCssVar('--pd-chat-panel-offset', '0px');
      return;
    }
    const gap = 12;
    const maxShift = Math.max(0, window.innerWidth - 90);
    const resolved = Math.min(chatPanelWidth + gap, maxShift);
    setCssVar('--pd-chat-panel-offset', `${Math.round(resolved)}px`);
  }, [chatPanelWidth]);

  // CTA z promo – zgodnie z zasadą: NIE idziemy do demo, tylko do auth.
  const handleSelectPlan = useCallback((plan: 'starter' | 'professional') => {
    try {
      window.localStorage.setItem('pd_selected_plan', plan);
    } catch {
      // ignore
    }
    openModal('auth', { isRegistered: false });
  }, [openModal]);


  const handleCookieResolution = () => {
    setHasCookieResolution(true);
  };

  // cookies → po resolution odpalamy timer 30s do promo (modal systemowy)
  useEffect(() => {
    if (!hasCookieResolution) return;
    if (isPromoSnoozed()) return;

    const timer = window.setTimeout(() => {
      setShowPromoTeaser(false);

      openModal(
        'promo',
        {
          mode: 'main',
          onSelectPlan: handleSelectPlan,
          onDemo: () => openModal('auth', { isRegistered: false }),
          shell: {
            size: 'xl',
            // Jeśli chcesz zablokować zamykanie kliknięciem w tło:
            // disableOverlayClose: true,
          },
        },
        { stack: false },
      );
    }, 30000);

    return () => window.clearTimeout(timer);
  }, [handleSelectPlan, hasCookieResolution, isPromoSnoozed, openModal]);

  useEffect(() => {
    const sectionMap: Record<string, string> = {
      '/features': 'features',
      '/pricing': 'pricing',
      '/integrations': 'integrations',
      '/faq': 'faq',
      '/security': 'security',
    };
    const targetId = sectionMap[location.pathname];
    if (!targetId) return;

    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  const heroHighlightWords = useMemo(
    () => ({
      pl: new Set(['ai', 'dane', 'rekomendacje', 'wzrostu']),
      en: new Set(['ai', 'data', 'recommendations', 'growth']),
    }),
    [],
  );

  const heroLines = useMemo(
    () => ({
      part1: t.hero.h1_part1,
      part2: t.hero.h1_part2,
      part3: t.hero.h1_part3,
    }),
    [t],
  );

  const renderHeroLine = (line: string) => {
    const highlightSet =
      heroHighlightWords[lang as keyof typeof heroHighlightWords] ?? heroHighlightWords.en;
    const tokens = (line || '').split(/\s+/).filter(Boolean);

    return tokens.map((token, index) => {
      const normalized = token
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z]/g, '');
      const isHighlight = highlightSet.has(normalized);

      return (
        <React.Fragment key={`${token}-${index}`}>
          {index > 0 && ' '}
          <span className={isHighlight ? 'animated-gradient-text font-black' : undefined}>{token}</span>
        </React.Fragment>
      );
    });
  };

  return (
    <MainLayout>
      <div className="relative overflow-hidden">
        <AuroraBackground {...({ theme } as any)} />
        <NeuralBackground {...({ theme } as any)} />

        <section className="relative z-10 pt-24 xs:pt-28 md:pt-40 pb-16 md:pb-20 px-4 xs:px-5 md:px-8 max-w-7xl mx-auto min-h-[78vh] portrait:min-h-[70vh] flex flex-col justify-center">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
            <div className="space-y-6 md:space-y-8 animate-reveal text-center lg:text-left">
              {t.hero.pill && (
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-start/10 border border-brand-start/20 text-xs font-black uppercase tracking-[0.2em] leading-none text-brand-start mb-2">
                  {t.hero.pill}
                </span>
              )}

              <h1
                className="font-black text-gray-900 dark:text-white tracking-tight leading-[1.3] flex flex-col items-center lg:items-start py-1"
                style={{ fontSize: 'clamp(22px, 3.5vw, 38px)' }}
                aria-label={`${heroLines.part1} ${heroLines.part2} ${heroLines.part3}`}
              >
                <span className="block whitespace-pre-line" aria-hidden="true">
                  {renderHeroLine(heroLines.part1)}
                </span>
                <span className="block whitespace-pre-line" aria-hidden="true">
                  {renderHeroLine(heroLines.part2)}
                </span>
                <span className="block opacity-80 whitespace-pre-line" aria-hidden="true">
                  {renderHeroLine(heroLines.part3)}
                </span>
              </h1>

              <div className="space-y-6">
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[55ch] mx-auto lg:mx-0 text-base md:text-lg italic opacity-90">
                  {t.hero.desc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start items-stretch sm:items-center">
                <Button
                  onClick={() => openModal('auth', { isRegistered: false })}
                  data-testid="hero-cta"
                  size="lg"
                  className="!h-14 !px-10 shadow-2xl"
                >
                  {t.hero.primary}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => openModal('video')}
                  size="lg"
                  className="!h-14 !px-8"
                >
                  <svg className="w-5 h-5 mr-2.5 text-brand-start fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {t.hero.secondary}
                </Button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 pt-6">
                {t.hero.badges?.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    <span className="text-xs font-black text-gray-500 dark:text-white/40 uppercase tracking-[0.2em]">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <AnimatedHero>
              <div className="relative animate-reveal hidden lg:block" style={{ animationDelay: '0.2s' }}>
                <Suspense
                  fallback={
                    <div className="w-full max-w-xl mx-auto h-[480px] rounded-[3rem] bg-gray-100/50 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-pulse flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-brand-start/20 border-t-brand-start animate-spin" />
                    </div>
                  }
                >
                  <VertexPlayer {...({ t } as any)} />
                </Suspense>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-start/[0.05] blur-[140px] rounded-full pointer-events-none" />
              </div>
            </AnimatedHero>
          </div>
        </section>

        <LazyWrapper minHeight={420} label="Loading ROI section">
          <RoiSection t={t} onCtaClick={() => openModal('auth', { isRegistered: false })} />
        </LazyWrapper>

        <div className="w-full bg-white/50 dark:bg-[#050507]/40 backdrop-blur-3xl border-y border-black/5 dark:border-white/5 py-8 md:py-10 px-8 shadow-2xl relative overflow-hidden">
          <LazyWrapper minHeight={160} label="Loading integrations marquee">
            <IntegrationsMarquee t={t} />
          </LazyWrapper>
        </div>

        <LazyWrapper minHeight={520} label="Loading features section">
          <FeaturesSection t={t} onFeatureClick={(f) => openModal('feature', { feature: f })} />
        </LazyWrapper>

        <LazyWrapper minHeight={520} label="Loading integrations section">
          <IntegrationsSection {...({ t } as any)} />
        </LazyWrapper>

        <LazyWrapper minHeight={420} label="Loading security section">
          <SecuritySection {...({ t } as any)} />
        </LazyWrapper>

        <LazyWrapper minHeight={520} label="Loading pricing section">
          <PricingSection
            {...({
              t,
              onCompare: () => openModal('pricing'),
            } as any)}
          />
        </LazyWrapper>

        <LazyWrapper minHeight={420} label="Loading FAQ section">
          <FaqSection {...({ t } as any)} />
        </LazyWrapper>

        <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
          <ShadcnShowcase />
        </section>

        <CookieBanner onResolution={handleCookieResolution} t={t} />

        {/* Teaser po zamknięciu promo – LEWY dół */}
        {showPromoTeaser && activeModal !== 'promo' && (
          <aside
            className="fixed bottom-6 left-6 landscape:bottom-4 landscape:left-4 portrait:bottom-4 portrait:left-4 z-[1850] flex items-center gap-2"
            role="complementary"
            aria-label="Promo teaser"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <button
              type="button"
              onClick={() => openModal('auth', { isRegistered: false })}
              className="px-4 py-3 rounded-2xl glass border border-brand-start/25 shadow-[0_18px_45px_rgba(0,0,0,0.22)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.55)] flex items-center gap-3 text-xs-plus font-black tracking-[0.14em] text-gray-800 dark:text-gray-100 cursor-pointer hover:border-brand-start/55 hover:scale-[1.02] active:scale-[0.985] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start"
              aria-label={t.hero.primary}
            >
              <span className="w-2 h-2 rounded-full bg-brand-start animate-pulse" />
              <span className="hidden sm:inline">{t.hero.primary}</span>
              <span className="sm:hidden">TRIAL</span>
              <svg className="w-4 h-4 text-brand-start" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setShowPromoTeaser(false)}
              className="w-10 h-10 rounded-2xl glass border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:border-brand-start/40 transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start"
              aria-label={t.common.close}
              title={t.common.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </aside>
        )}

        {/* Dock: prawy dół – czat Papa AI */}
        <aside
          ref={dockRef}
          className="fixed bottom-6 right-6 landscape:bottom-4 landscape:right-4 portrait:bottom-4 portrait:right-4 z-[1900] flex flex-col items-end gap-3"
          role="complementary"
          aria-label="Chat"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <LandingChatWidget
            lang={lang}
            onStartTrial={() => openModal('auth', { isRegistered: false })}
            onPanelResize={setChatPanelWidth}
          />
        </aside>
      </div>
    </MainLayout>
  );
};
