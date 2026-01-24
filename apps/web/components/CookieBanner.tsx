import React, { useState, useEffect, useId, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveButton } from './InteractiveButton';
import type { Translation } from '../types';
import { updateConsentMode, type ConsentSettings } from '../utils/consent-mode';
import { initObservability } from '../utils/observability.provider';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CookieBannerProps {
  onResolution: () => void;
  t: Translation;
}

type CookieSettings = ConsentSettings;

const STORAGE_KEY = 'cookie_consent';
const CONSENT_VERSION = 1;

const defaultSettings: CookieSettings = {
  necessary: true,
  analytical: false,
  marketing: false,
  functional: false,
};

type StoredConsent = CookieSettings & {
  timestamp?: number;
  sid?: string;
  v?: number;
};

const canUseBrowserStorage = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

const safeGetItem = (key: string) => {
  if (!canUseBrowserStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  if (!canUseBrowserStorage()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // noop
  }
};

const readStoredConsent = (): StoredConsent | null => {
  const raw = safeGetItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent> | null;
    if (!parsed) return null;

    // jeśli zmienisz kiedyś strukturę → wersjonowanie pozwoli na bezpieczny reset
    if (parsed.v && parsed.v !== CONSENT_VERSION) return null;

    return {
      ...defaultSettings,
      ...parsed,
      necessary: true,
      v: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
};

const persistConsent = (settings: CookieSettings, sessionId: string) => {
  const payload: StoredConsent = {
    ...defaultSettings,
    ...settings,
    necessary: true,
    timestamp: Date.now(),
    sid: sessionId,
    v: CONSENT_VERSION,
  };

  safeSetItem(STORAGE_KEY, JSON.stringify(payload));
};

const PrivacyTag = memo(({ label, color = 'brand' }: { label: string; color?: 'brand' | 'gray' }) => (
  <span
    className={`text-4xs md:text-3xs font-mono font-black tracking-[0.2em] px-2 py-0.5 rounded uppercase border ${
      color === 'brand'
        ? 'bg-brand-start/10 border-brand-start/30 text-brand-start'
        : 'bg-gray-500/10 border-gray-500/30 text-gray-500'
    }`}
  >
    {label}
  </span>
));
PrivacyTag.displayName = 'PrivacyTag';

// prosty guard, żeby initObservability nie odpalało się wielokrotnie
let observabilityInitialized = false;

export const CookieBanner: React.FC<CookieBannerProps> = ({ onResolution, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>(() => {
    const stored = readStoredConsent();
    return stored ?? { ...defaultSettings };
  });
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 12).toUpperCase());

  const focusTrapRef = useFocusTrap(isVisible);
  const titleId = useId();
  const descId = useId();

  const applyChoice = useCallback(
    (choice: CookieSettings) => {
      const normalized: CookieSettings = {
        ...defaultSettings,
        ...choice,
        necessary: true,
      };

      persistConsent(normalized, sessionId);

      updateConsentMode(normalized);
      if (normalized.analytical && !observabilityInitialized) {
        observabilityInitialized = true;
        initObservability();
      }

      setSettings(normalized);
      setIsVisible(false);
      setShowSettings(false);
      onResolution();
    },
    [onResolution, sessionId],
  );

  const handleAcceptAll = useCallback(() => {
    applyChoice({
      necessary: true,
      analytical: true,
      marketing: true,
      functional: true,
    });
  }, [applyChoice]);

  const handleRejectOptional = useCallback(() => {
    applyChoice({
      necessary: true,
      analytical: false,
      marketing: false,
      functional: false,
    });
  }, [applyChoice]);

  const handleSaveSettings = useCallback(() => {
    applyChoice({
      ...defaultSettings,
      ...settings,
      necessary: true,
    });
  }, [applyChoice, settings]);

  // Pierwsze wyświetlenie banera + aplikacja istniejącej zgody (PROD!)
  useEffect(() => {
    const stored = readStoredConsent();

    if (!stored) {
      const timer = window.setTimeout(() => setIsVisible(true), 1500);
      return () => window.clearTimeout(timer);
    }

    const normalized: CookieSettings = {
      ...defaultSettings,
      ...stored,
      necessary: true,
    };

    setSettings(normalized);

    // kluczowe: po refreshu musimy odtworzyć consent + ewentualnie observability
    updateConsentMode(normalized);
    if (normalized.analytical && !observabilityInitialized) {
      observabilityInitialized = true;
      initObservability();
    }

    onResolution();
  }, [onResolution]);

  // Globalny event z footeru: "Ustawienia cookies"
  useEffect(() => {
    const handleOpenSettings = () => {
      const stored = readStoredConsent();
      if (stored) {
        setSettings({
          ...defaultSettings,
          ...stored,
          necessary: true,
        });
      }
      setShowSettings(true);
      setIsVisible(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings as EventListener);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings as EventListener);
  }, []);

  // ESC: zamknij (odrzuć lub wyjdź z ustawień)
  useEffect(() => {
    if (!isVisible) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else {
          handleRejectOptional();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isVisible, showSettings, handleRejectOptional]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[4000] flex items-end lg:items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Tło */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            onClick={() => !showSettings && handleRejectOptional()}
          />

          {/* Główne okno */}
          <motion.div
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            className={`relative w-full overflow-hidden flex flex-col transition-all duration-500 bg-white dark:bg-[#08080A] border border-brand-start/20 shadow-[0_50px_130px_rgba(0,0,0,0.8)] ${
              showSettings ? 'max-w-4xl rounded-[3rem] max-h-[92vh]' : 'max-w-2xl rounded-[2.5rem]'
            }`}
          >
            <div className="p-8 md:p-12 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {!showSettings ? (
                  <motion.div
                    key="banner"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8 relative"
                  >
                    <button
                      type="button"
                      onClick={handleRejectOptional}
                      className="absolute right-0 top-0 p-2 rounded-xl bg-black/5 dark:bg-white/5 text-gray-400 hover:text-brand-start transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
                      aria-label={t.common.close}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl brand-gradient-bg flex items-center justify-center text-white shadow-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <h3
                        id={titleId}
                        className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter"
                      >
                        {t.cookies.title}
                      </h3>
                    </div>

                    <p
                      id={descId}
                      className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium"
                    >
                      {t.cookies.desc}
                    </p>

                    <a
                      href={t.cookies.policy_link}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-start hover:text-brand-end transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 rounded"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-start/70" />
                      {t.cookies.policy_text}
                    </a>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <InteractiveButton
                        variant="primary"
                        onClick={handleAcceptAll}
                        className="flex-[1.5] !h-14 !text-xs-plus uppercase tracking-[0.2em] font-black shadow-2xl"
                      >
                        {t.cookies.accept_all}
                      </InteractiveButton>

                      <InteractiveButton
                        variant="secondary"
                        onClick={handleRejectOptional}
                        className="flex-1 !h-14 !text-xs-plus uppercase tracking-[0.2em] font-black"
                      >
                        {t.cookies.reject_optional}
                      </InteractiveButton>

                      <button
                        type="button"
                        onClick={() => setShowSettings(true)}
                        className="flex-1 !h-14 rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs-plus font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300 hover:bg-brand-start hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
                      >
                        {t.cookies.settings}
                      </button>
                    </div>

                    <p className="text-center text-xs font-black text-gray-400 uppercase tracking-widest opacity-60">
                      {t.cookies.footer_note}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <h3 id={titleId} className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                          {t.cookies.title}
                        </h3>
                        <p
                          id={descId}
                          className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed italic"
                        >
                          {t.cookies.lead}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowSettings(false)}
                        className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-gray-400 hover:text-brand-start transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
                        aria-label={t.cookies.back}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          id: 'necessary',
                          label: t.cookies.necessary_label,
                          desc: t.cookies.necessary_desc,
                          tag: t.cookies.necessary_tag,
                          fixed: true,
                        },
                        {
                          id: 'analytical',
                          label: t.cookies.analytical_label,
                          desc: t.cookies.analytical_desc,
                          tag: t.cookies.analytical_tag,
                          fixed: false,
                        },
                        {
                          id: 'marketing',
                          label: t.cookies.marketing_label,
                          desc: t.cookies.marketing_desc,
                          tag: t.cookies.marketing_tag,
                          fixed: false,
                        },
                        {
                          id: 'functional',
                          label: t.cookies.functional_label,
                          desc: t.cookies.functional_desc,
                          tag: t.cookies.functional_tag,
                          fixed: false,
                        },
                      ].map((item) => {
                        const enabled = Boolean(settings[item.id as keyof CookieSettings]);

                        return (
                          <div
                            key={item.id}
                            className="p-6 rounded-[2rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex flex-col justify-between group hover:border-brand-start/30 transition-all"
                          >
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                  {item.label}
                                </span>
                                <PrivacyTag label={item.tag} color={item.fixed ? 'gray' : 'brand'} />
                              </div>
                              <p className="text-xs-plus text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                {item.desc}
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={item.fixed}
                              onClick={() =>
                                setSettings((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id as keyof CookieSettings],
                                }))
                              }
                              className={`relative w-12 h-6 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 ${
                                enabled ? 'brand-gradient-bg shadow-lg shadow-brand-start/20' : 'bg-gray-200 dark:bg-gray-800'
                              } ${item.fixed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              role="switch"
                              aria-checked={enabled}
                              aria-label={item.label}
                            >
                              <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-500 shadow-sm ${
                                  enabled ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                          {t.cookies.providers_title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">
                          {t.cookies.providers_desc}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {[t.cookies.provider_ga4, t.cookies.provider_ads, t.cookies.provider_meta, t.cookies.provider_gtm].map((p, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-4 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-start mt-1.5 shrink-0" />
                            <span className="text-xs-plus text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                              {p}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-dashed border-black/10 dark:border-white/10">
                        <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                          {t.cookies.cookie_ids_label}
                        </div>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                          {t.cookies.cookie_ids_desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                      <InteractiveButton
                        variant="primary"
                        onClick={handleSaveSettings}
                        className="flex-1 !h-14 !text-xs-plus font-black uppercase tracking-widest shadow-2xl"
                      >
                        {t.cookies.save_choice}
                      </InteractiveButton>

                      <InteractiveButton
                        variant="secondary"
                        onClick={handleAcceptAll}
                        className="flex-1 !h-14 !text-xs-plus font-black uppercase tracking-widest"
                      >
                        {t.cookies.accept_all}
                      </InteractiveButton>

                      <InteractiveButton
                        variant="secondary"
                        onClick={handleRejectOptional}
                        className="flex-1 !h-14 !text-xs-plus font-black uppercase tracking-widest"
                      >
                        {t.cookies.reject_optional}
                      </InteractiveButton>
                    </div>

                    <div className="flex justify-center gap-8 pt-4 opacity-40">
                      <a
                        href={t.cookies.policy_privacy_link}
                        className="text-2xs font-black text-gray-500 hover:text-brand-start uppercase tracking-widest underline decoration-brand-start/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 rounded"
                      >
                        {t.cookies.policy_privacy_label}
                      </a>
                      <a
                        href={t.cookies.policy_cookies_link}
                        className="text-2xs font-black text-gray-500 hover:text-brand-start uppercase tracking-widest underline decoration-brand-start/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 rounded"
                      >
                        {t.cookies.policy_cookies_label}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-10 py-5 border-t border-black/5 dark:border-white/5 bg-black/[0.03] dark:bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-30 select-none">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-3xs font-mono font-bold uppercase tracking-[0.3em]">{t.cookies.footer_left}</span>
              </div>
              <span className="text-3xs font-mono font-bold uppercase tracking-[0.3em]">{t.cookies.footer_right}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
