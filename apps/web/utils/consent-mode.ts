import { getWebConfig } from '../config';
import { safeLocalStorage } from './safeLocalStorage';

export type ConsentSettings = {
  necessary: boolean;
  analytical: boolean;
  marketing: boolean;
  functional: boolean;
};

type ConsentGrant = 'granted' | 'denied';

type ConsentModeState = {
  ad_storage: ConsentGrant;
  ad_user_data: ConsentGrant;
  ad_personalization: ConsentGrant;
  analytics_storage: ConsentGrant;
  functionality_storage: ConsentGrant;
  personalization_storage: ConsentGrant;
  security_storage: 'granted';
};

type ConsentDefaultPayload = ConsentModeState & {
  wait_for_update?: number;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const CONSENT_STORAGE_KEY = 'cookie_consent';

const ensureGtagExists = (): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
  }
};

const mapSettingsToConsentMode = (settings: ConsentSettings): ConsentModeState => ({
  ad_storage: settings.marketing ? 'granted' : 'denied',
  ad_user_data: settings.marketing ? 'granted' : 'denied',
  ad_personalization: settings.marketing ? 'granted' : 'denied',
  analytics_storage: settings.analytical ? 'granted' : 'denied',
  functionality_storage: settings.functional ? 'granted' : 'denied',
  personalization_storage: settings.functional ? 'granted' : 'denied',
  security_storage: 'granted',
});

export const initConsentMode = (): void => {
  if (typeof window === 'undefined') return;

  ensureGtagExists();

  const defaults: ConsentDefaultPayload = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  };

  // Google Consent Mode v2 default = denied (before any tags load)
  window.gtag('consent', 'default', defaults);
};

export const updateConsentMode = (settings: ConsentSettings): void => {
  if (typeof window === 'undefined') return;

  ensureGtagExists();

  const consentState = mapSettingsToConsentMode(settings);
  window.gtag('consent', 'update', consentState);

  applyConsentTags(settings);
};

export const loadStoredConsent = (): ConsentSettings | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = safeLocalStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<ConsentSettings> | null;

    if (
      parsed &&
      typeof parsed.necessary === 'boolean' &&
      typeof parsed.analytical === 'boolean' &&
      typeof parsed.marketing === 'boolean' &&
      typeof parsed.functional === 'boolean'
    ) {
      return {
        necessary: parsed.necessary,
        analytical: parsed.analytical,
        marketing: parsed.marketing,
        functional: parsed.functional,
      };
    }
  } catch {
    return null;
  }

  return null;
};

/**
 * Wymuszona, bezpieczna sekwencja:
 * 1) initConsentMode() - default denied
 * 2) jeĹ›li jest zapis - updateConsentMode() i doĹ‚aduj tagi wg zgĂłd
 */
export const applyStoredConsent = (): boolean => {
  if (typeof window === 'undefined') return false;

  // zawsze ustaw default denied ASAP
  initConsentMode();

  const stored = loadStoredConsent();
  if (stored) {
    updateConsentMode(stored);
    return true;
  }

  return false;
};

type TagConfig = {
  gtmId?: string;
  ga4Id?: string;
  googleAdsId?: string;
  metaPixelId?: string;
};

const getTagConfig = (): TagConfig => {
  const { analytics } = getWebConfig();
  return {
    gtmId: analytics.gtmId,
    ga4Id: analytics.ga4Id,
    googleAdsId: analytics.googleAdsId,
    metaPixelId: analytics.metaPixelId,
  };
};

const loadScriptOnce = (id: string, src: string) => {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`script[data-consent-tag="${id}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  script.dataset.consentTag = id;
  document.head.appendChild(script);
};

const loadGtm = (gtmId: string) => {
  ensureGtagExists();
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  loadScriptOnce(`gtm-${gtmId}`, src);
};

const loadGtag = (id: string) => {
  ensureGtagExists();
  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  loadScriptOnce(`gtag-${id}`, src);
  window.gtag('js', new Date());
};

const loadGa4 = (ga4Id: string) => {
  loadGtag(ga4Id);
  window.gtag('config', ga4Id, { anonymize_ip: true });
};

const loadGoogleAds = (adsId: string) => {
  loadGtag(adsId);
  window.gtag('config', adsId);
};

const ensureMetaPixelStub = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    const wfbq = window.fbq as any;
    if (wfbq && wfbq.callMethod) {
      wfbq.callMethod.apply(wfbq, args);
    } else {
      wfbq.queue.push(args);
    }
  } as any;

  window.fbq = fbq;
  window._fbq = fbq;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
};

const loadMetaPixel = (pixelId: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  ensureMetaPixelStub();

  loadScriptOnce('meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');

  // init moĹĽe byÄ‡ woĹ‚any wielokrotnie, meta sama to ogarnia, ale nie spamujemy
  try {
    (window.fbq as any)('init', pixelId);
  } catch {
    // no-op
  }
};

/**
 * Soft-disable dla Meta Pixel (nie usuwamy skryptu z DOM, ale wycofujemy consent).
 */
const revokeMetaPixelConsent = () => {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;

  try {
    (window.fbq as any)('consent', 'revoke');
  } catch {
    // no-op
  }
};

const grantMetaPixelConsentAndTrackPageView = () => {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;

  try {
    (window.fbq as any)('consent', 'grant');
    (window.fbq as any)('track', 'PageView');
  } catch {
    // no-op
  }
};

/**
 * Minimalny "state" Ĺ‚adowania tagĂłw.
 * Nie usuwamy GTM/gtag przy cofniÄ™ciu zgody (Consent Mode robi swoje),
 * ale Meta Pixel warto soft-disable przez revoke.
 */
const loadedTags = {
  gtm: new Set<string>(),
  gtag: new Set<string>(),
  meta: new Set<string>(),
};

export const applyConsentTags = (settings: ConsentSettings): void => {
  if (typeof window === 'undefined') return;

  const { gtmId, ga4Id, googleAdsId, metaPixelId } = getTagConfig();

  // GTM: Ĺ‚aduj tylko jeĹ›li cokolwiek poza necessary ma sens (analytics/marketing)
  if (gtmId && (settings.analytical || settings.marketing)) {
    if (!loadedTags.gtm.has(gtmId)) {
      loadGtm(gtmId);
      loadedTags.gtm.add(gtmId);
    }
  }

  // GA4: tylko analytical
  if (ga4Id) {
    if (settings.analytical) {
      if (!loadedTags.gtag.has(ga4Id)) {
        loadGa4(ga4Id);
        loadedTags.gtag.add(ga4Id);
      } else {
        // jeĹ›li juĹĽ zaĹ‚adowane, wystarczy update consent (robione w updateConsentMode)
      }
    }
    // przy cofniÄ™ciu zgody analytics nie usuwamy skryptĂłw â€” Consent Mode + brak nowych eventĂłw
  }

  // Google Ads: tylko marketing
  if (googleAdsId) {
    if (settings.marketing) {
      if (!loadedTags.gtag.has(googleAdsId)) {
        loadGoogleAds(googleAdsId);
        loadedTags.gtag.add(googleAdsId);
      }
    }
    // przy cofniÄ™ciu zgody marketing â€” Consent Mode zatrzyma personalizacjÄ™ i storage
  }

  // Meta Pixel: tylko marketing (plus revoke przy wycofaniu)
  if (metaPixelId) {
    if (settings.marketing) {
      if (!loadedTags.meta.has(metaPixelId)) {
        loadMetaPixel(metaPixelId);
        loadedTags.meta.add(metaPixelId);
      }
      // grant + PageView dopiero przy marketing=true
      grantMetaPixelConsentAndTrackPageView();
    } else {
      revokeMetaPixelConsent();
    }
  }
};

