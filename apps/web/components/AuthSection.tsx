import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InteractiveButton } from './InteractiveButton';
import { Logo } from './Logo';
import type { Translation } from '../types';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/useAuth';
import { useModal } from '../context/useModal';
import { normalizeApiError } from '../hooks/useApiError';
import { useCompanyLookup } from '../hooks/useCompanyLookup';
import type { AuthSession } from '@papadata/shared';
import { safeLocalStorage } from '../utils/safeLocalStorage';

interface AuthSectionProps {
  t: Translation;
  /** JeĹ›li modal otwierany z intencjÄ… "login" (np. przycisk w headerze) */
  isRegistered?: boolean;
}

type AuthMode = 'login' | 'register';
type EmailVerifyContext = 'login' | 'register';

const OTP_LEN = 6;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidNip = (nip: string) => {
  if (!/^\d{10}$/.test(nip)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = w.reduce((acc, weight, i) => acc + weight * Number(nip[i]), 0);
  const mod = sum % 11;
  if (mod === 10) return false;
  return mod === Number(nip[9]);
};

const isAuthSessionLike = (v: any): v is AuthSession =>
  Boolean(v && typeof v === 'object' && typeof v.accessToken === 'string' && v.user);

export const AuthSection: React.FC<AuthSectionProps> = ({ t, isRegistered = false }) => {
  const api = useApi();
  const { setIsAuthenticated, setToken } = useAuth();
  const { closeModal, openModal } = useModal();

  const [mode, setMode] = useState<AuthMode>(isRegistered ? 'login' : 'register');

  // wspĂłlne pola
  const [email, setEmail] = useState('');
  const [submitAction, setSubmitAction] = useState<
    'oauth_google' | 'oauth_ms' | 'email_start' | 'email_verify' | 'register' | null
  >(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = submitAction !== null;

  // register
  const [password, setPassword] = useState('');
  const [nip, setNip] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyStreet, setCompanyStreet] = useState('');
  const [companyPostalCode, setCompanyPostalCode] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyRegon, setCompanyRegon] = useState('');
  const [companyKrs, setCompanyKrs] = useState('');
  const [regStep, setRegStep] = useState(1);

  // UX: Ĺ›ledzimy czy dane firmy zostaĹ‚y auto-uzupeĹ‚nione (ĹĽeby nie kasowaÄ‡ rÄ™cznych zmian)
  const [isCompanyAutofilled, setIsCompanyAutofilled] = useState(false);
  const [isCompanyManualOverride, setIsCompanyManualOverride] = useState(false);
  const [autofillSource, setAutofillSource] = useState<{ gus: boolean; mf: boolean } | null>(null);
  const [autofilledNip, setAutofilledNip] = useState<string | null>(null);

  // email verify step (OTP)
  const [codeSent, setCodeSent] = useState(false);
  const [emailFlow, setEmailFlow] = useState<'otp' | 'magic_link' | null>(null);
  const [verifyContext, setVerifyContext] = useState<EmailVerifyContext>('login');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial mode with modal open props
  useEffect(() => {
    setMode(isRegistered ? 'login' : 'register');
    setRegStep(1);

    setCodeSent(false);
    setEmailFlow(null);
    setVerifyContext(isRegistered ? 'login' : 'register');
    setOtp('');
    setOtpError(null);

    setSubmitError(null);
    setSubmitAction(null);
    setResendIn(0);

    // Reset register fields when opening fresh
    setPassword('');
    setNip('');
    setCompanyName('');
    setCompanyStreet('');
    setCompanyPostalCode('');
    setCompanyCity('');
    setCompanyRegon('');
    setCompanyKrs('');
    setIsCompanyAutofilled(false);
    setIsCompanyManualOverride(false);
    setAutofillSource(null);
    setAutofilledNip(null);
  }, [isRegistered]);

  // countdown resend
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [resendIn]);

  // autofocus OTP
  useEffect(() => {
    if (!codeSent) return;
    const id = window.setTimeout(() => otpInputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [codeSent]);

  const emailError = useMemo(() => {
    if (!email) return null;
    if (!isValidEmail(email)) return t.auth.email_invalid;
    return null;
  }, [email, t.auth.email_invalid]);

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const passwordScore = useMemo(() => {
    const score = Object.values(passwordChecks).filter(Boolean).length;
    if (score <= 1) return t.auth.pass_strength_weak;
    if (score === 2) return t.auth.pass_strength_fair;
    return t.auth.pass_strength_strong;
  }, [
    passwordChecks,
    t.auth.pass_strength_fair,
    t.auth.pass_strength_strong,
    t.auth.pass_strength_weak,
  ]);

  const isPasswordValid =
    passwordChecks.length && passwordChecks.uppercase && passwordChecks.special;

  const nipError = useMemo(() => {
    if (nip.length === 0) return null;
    if (nip.length < 10) return null;
    if (!isValidNip(nip)) return t.auth.nip_invalid;
    return null;
  }, [nip, t.auth.nip_invalid]);

  const trimmedCompanyName = companyName.trim();
  const trimmedCompanyStreet = companyStreet.trim();
  const trimmedCompanyPostalCode = companyPostalCode.trim();
  const trimmedCompanyCity = companyCity.trim();

  const hasCompanyName = Boolean(trimmedCompanyName);
  const isAddressValid = Boolean(
    trimmedCompanyStreet || (trimmedCompanyPostalCode && trimmedCompanyCity)
  );

  const addressError =
    !isAddressValid &&
    (trimmedCompanyStreet ||
      trimmedCompanyPostalCode ||
      trimmedCompanyCity ||
      hasCompanyName ||
      nip.length > 0)
      ? t.auth.company_address_required
      : null;

  const storeAuthToken = (accessToken: string) => {
    // Produkcyjnie: preferuj httpOnly cookie z backendu (anti-XSS).
    if (typeof window === 'undefined') return;
    safeLocalStorage.setItem('papadata_auth_token', accessToken);
  };

  const storeAuthSession = (session: AuthSession) => {
    storeAuthToken(session.accessToken);
    safeLocalStorage.setItem('papadata_user_id', session.user.id);
    safeLocalStorage.setItem('papadata_user_roles', JSON.stringify(session.user.roles ?? []));
    if (session.user?.tenantId) {
      safeLocalStorage.setItem('pd_active_tenant_id', session.user.tenantId);
    }
  };

  const finalizeAuth = (session: AuthSession) => {
    storeAuthSession(session);
    setToken(session.accessToken);
    setIsAuthenticated(true);
    closeModal();
    try {
      const redirect = safeLocalStorage.getItem('pd_post_login_redirect');
      if (redirect) {
        safeLocalStorage.removeItem('pd_post_login_redirect');
        window.location.assign(redirect);
      }
    } catch {
      // ignore
    }
  };

  const renderButtonLabel = (label: string, isLoading: boolean) => (
    <span className="inline-flex items-center gap-2">
      {isLoading && (
        <span
          className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </span>
  );

  const handleComingSoon = (context: string) => {
    if (isSubmitting) return;
    openModal('coming_soon', { context });
  };

  const resetEmailVerification = (nextContext: EmailVerifyContext) => {
    setCodeSent(false);
    setEmailFlow(null);
    setVerifyContext(nextContext);
    setOtp('');
    setOtpError(null);
    setResendIn(0);
  };

  const resetRegisterFields = () => {
    setPassword('');
    setNip('');
    setCompanyName('');
    setCompanyStreet('');
    setCompanyPostalCode('');
    setCompanyCity('');
    setCompanyRegon('');
    setCompanyKrs('');
    setIsCompanyAutofilled(false);
    setAutofillSource(null);
    setAutofilledNip(null);
    setRegStep(1);
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setSubmitAction(null);
    setSubmitError(null);

    // reset per flow
    resetEmailVerification(next);

    // UX: unikamy "duchĂłw formularza" â€” resetujemy pola rejestracji przy wejĹ›ciu w register
    if (next === 'register') {
      resetRegisterFields();
    } else {
      // przy wejĹ›ciu w login teĹĽ czyĹ›cimy pola rejestracji
      resetRegisterFields();
    }
  };

  const isLogin = mode === 'login';

  // === SSO redirects (production) ===
  const getApiBaseUrl = () => {
    const v = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
    return (v ?? '').replace(/\/+$/, '');
  };

  const startOAuth = async (provider: 'google' | 'microsoft') => {
    if (isSubmitting) return;
    setSubmitError(null);
    setSubmitAction(provider === 'google' ? 'oauth_google' : 'oauth_ms');

    try {
      const base = getApiBaseUrl();
      if (!base) {
        handleComingSoon(provider === 'google' ? t.auth.oauth_google : t.auth.oauth_ms);
        setSubmitAction(null);
        return;
      }
      // ZakĹ‚adamy endpointy: /auth/oauth/{provider}/start
      window.location.assign(`${base}/auth/oauth/${provider}/start`);
      // zwykle nastÄ™puje nawigacja, ale zostawiamy bezpiecznie:
    } catch (e) {
      setSubmitError(normalizeApiError(e, t.common.error_desc));
      setSubmitAction(null);
    }
  };

  // === Email OTP start/verify ===
  // Obecny backend: POST /auth/magic-link (start), POST /auth/login (verify)
  // Opcjonalnie: POST /auth/email/start, POST /auth/email/verify
  const startEmailVerification = async (context: EmailVerifyContext) => {
    if (!isValidEmail(email) || isSubmitting) return;

    setSubmitError(null);
    setOtpError(null);
    setSubmitAction('email_start');

    try {
      const emailTrim = email.trim();

      // Preferowane: api.authEmailStart({ email, context })
      const authEmailStart = (api as any).authEmailStart as
        | ((p: { email: string; context?: string }) => Promise<any>)
        | undefined;

      // Fallback: Twoje obecne api.authMagicLink({ email })
      const authMagicLink = (api as any).authMagicLink as
        | ((p: { email: string }) => Promise<any>)
        | undefined;

      if (authEmailStart) {
        await authEmailStart({ email: emailTrim, context });
        setEmailFlow('otp');
      } else if (authMagicLink) {
        await authMagicLink({ email: emailTrim });
        setEmailFlow('magic_link');
      } else {
        throw new Error('Missing email start method in useApi()');
      }

      setVerifyContext(context);
      setCodeSent(true);
      setResendIn(45); // enterprise: anti-spam UX
    } catch (error) {
      setSubmitError(normalizeApiError(error, t.common.error_desc));
    } finally {
      setSubmitAction(null);
    }
  };

  const verifyEmailCode = async () => {
    if (!isValidEmail(email) || isSubmitting) return;
    if (emailFlow !== 'otp') return;
    const code = otp.replace(/\D/g, '').slice(0, OTP_LEN);
    if (code.length !== OTP_LEN) {
      setOtpError(t.auth.code_invalid);
      return;
    }

    setSubmitError(null);
    setOtpError(null);
    setSubmitAction('email_verify');

    try {
      const emailTrim = email.trim();

      // Preferowane: api.authEmailVerify({ email, code, context }) -> AuthSession
      const authEmailVerify = (api as any).authEmailVerify as
        | ((p: { email: string; code: string; context?: string }) => Promise<any>)
        | undefined;

      // Fallback: Twoje obecne api.authLogin({ email, code }) -> AuthSession (tymczasowe)
      const authLogin = (api as any).authLogin as
        | ((p: { email: string; code?: string }) => Promise<any>)
        | undefined;

      let result: any;

      if (authEmailVerify) {
        result = await authEmailVerify({ email: emailTrim, code, context: verifyContext });
      } else if (authLogin) {
        result = await authLogin({ email: emailTrim, code });
      } else {
        throw new Error('Missing email verify method in useApi()');
      }

      if (!isAuthSessionLike(result)) {
        throw new Error('Invalid auth session payload');
      }

      finalizeAuth(result);
    } catch (error) {
      setOtpError(normalizeApiError(error, t.common.error_desc));
    } finally {
      setSubmitAction(null);
    }
  };

  // === Register submit ===
  // Obecny backend: POST /auth/register
  const handleRegister = async () => {
    if (
      !isValidEmail(email) ||
      !isPasswordValid ||
      !hasCompanyName ||
      !isAddressValid ||
      isSubmitting
    ) {
      return;
    }

    setSubmitError(null);
    setSubmitAction('register');

    try {
      const addressLine = [
        trimmedCompanyStreet,
        [trimmedCompanyPostalCode, trimmedCompanyCity].filter(Boolean).join(' '),
      ]
        .filter(Boolean)
        .join(', ');

      const payload = {
        email: email.trim(),
        password,
        nip,
        companyName: trimmedCompanyName,
        companyAddress: addressLine,
      };

      // Preferowane: api.authRegisterStart(payload)
      const authRegisterStart = (api as any).authRegisterStart as
        | ((p: any) => Promise<any>)
        | undefined;

      // Fallback: api.authRegister(payload) -> AuthSession
      const authRegister = (api as any).authRegister as ((p: any) => Promise<any>) | undefined;
      const usesOtpRegister = Boolean(authRegisterStart);

      const result = authRegisterStart
        ? await authRegisterStart(payload)
        : authRegister
          ? await authRegister(payload)
          : null;

      if (isAuthSessionLike(result)) {
        finalizeAuth(result);
        return;
      }

      setVerifyContext('register');
      setEmailFlow(usesOtpRegister ? 'otp' : 'magic_link');
      setCodeSent(true);
      setResendIn(45);
    } catch (error) {
      setSubmitError(normalizeApiError(error, t.common.error_desc));
    } finally {
      setSubmitAction(null);
    }
  };

  // === NIP lookup ===
  const companyLookup = useCompanyLookup(nip);

  useEffect(() => {
    if (!companyLookup.data) return;

    if (autofilledNip === companyLookup.data.nip && isCompanyManualOverride) return;

    setCompanyName(companyLookup.data.name ?? '');
    setCompanyStreet(companyLookup.data.address?.street ?? '');
    setCompanyPostalCode(companyLookup.data.address?.postalCode ?? '');
    setCompanyCity(companyLookup.data.address?.city ?? '');
    setCompanyRegon(companyLookup.data.regon ?? '');
    setCompanyKrs(companyLookup.data.krs ?? '');
    setAutofillSource(companyLookup.data.source ?? null);
    setIsCompanyAutofilled(true);
    setIsCompanyManualOverride(false);
    setAutofilledNip(companyLookup.data.nip ?? nip);
  }, [autofilledNip, companyLookup.data, isCompanyManualOverride, nip]);

  useEffect(() => {
    if (!companyLookup.notFound || !isCompanyAutofilled || isCompanyManualOverride) return;
    setCompanyName('');
    setCompanyStreet('');
    setCompanyPostalCode('');
    setCompanyCity('');
    setCompanyRegon('');
    setCompanyKrs('');
    setIsCompanyAutofilled(false);
    setIsCompanyManualOverride(false);
    setAutofillSource(null);
    setAutofilledNip(null);
  }, [companyLookup.notFound, isCompanyAutofilled, isCompanyManualOverride]);

  useEffect(() => {
    if (nip.length === 10) return;
    if (!isCompanyAutofilled) return;
    setCompanyName('');
    setCompanyStreet('');
    setCompanyPostalCode('');
    setCompanyCity('');
    setCompanyRegon('');
    setCompanyKrs('');
    setIsCompanyAutofilled(false);
    setIsCompanyManualOverride(false);
    setAutofillSource(null);
    setAutofilledNip(null);
  }, [isCompanyAutofilled, nip.length]);

  const onOtpChange = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, OTP_LEN);
    setOtp(clean);
    if (otpError) setOtpError(null);
  };

  const onOtpPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const pasted = e.clipboardData.getData('text') ?? '';
    const clean = pasted.replace(/\D/g, '').slice(0, OTP_LEN);
    if (clean) {
      e.preventDefault();
      setOtp(clean);
      setOtpError(null);
    }
  };

  const codeStepTitle =
    verifyContext === 'register' ? t.auth.code_title_register : t.auth.code_title_login;

  const codeStepDesc = t.auth.code_desc;
  const magicLinkTitle = t.auth.login_link_sent_title;
  const magicLinkDesc = t.auth.login_link_sent_desc.replace('{email}', email.trim());
  const resendLabel = emailFlow === 'magic_link' ? t.auth.resend_link : t.auth.resend_code;

  const emailErrorId = isLogin ? 'auth-email-error-login' : 'auth-email-error-register';

  const autofillBadgeLabel = useMemo(() => {
    const base = t.auth.company_autofill_badge ?? 'Auto-filled';
    const withSources = t.auth.company_autofill_badge_gus_mf ?? base;
    if (autofillSource?.gus || autofillSource?.mf) return withSources;
    return base;
  }, [autofillSource, t.auth.company_autofill_badge, t.auth.company_autofill_badge_gus_mf]);

  return (
    <div
      className="relative w-full max-w-xl bg-white dark:bg-[#08080A] rounded-[3rem] border border-brand-start/20 shadow-[0_50px_130px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      role="document"
      aria-label={isLogin ? t.auth.login_tab : t.auth.register_tab}
      aria-busy={isSubmitting}
    >
      <div className="absolute top-0 left-0 right-0 h-1 brand-gradient-bg" />

      <button
        type="button"
        onClick={closeModal}
        disabled={isSubmitting}
        className="absolute top-6 right-6 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-brand-start hover:text-white transition-all text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
        aria-label={t.common.close}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="px-10 md:px-14 pt-14 text-center">
        <Logo className="w-14 h-14 mx-auto mb-8 text-gray-900 dark:text-white" />

        <div className="flex p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-xl">
          {(['login', 'register'] as AuthMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              disabled={isSubmitting}
              className={`flex-1 py-3 text-xs md:text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${
                mode === m
                  ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-xl ring-1 ring-brand-start/20'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60`}
              aria-pressed={mode === m}
            >
              {m === 'login' ? t.auth.login_tab : t.auth.register_tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-10 md:px-14 py-10">
        {/* SSO (always visible) */}
        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={() => startOAuth('google')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-brand-start/40 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
              {renderButtonLabel(
                `${t.auth.oauth_google} ${t.auth.oauth_account_suffix}`,
                submitAction === 'oauth_google'
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => startOAuth('microsoft')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-brand-start/40 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
          >
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
              {renderButtonLabel(
                `${t.auth.oauth_ms} ${t.auth.oauth_account_suffix}`,
                submitAction === 'oauth_ms'
              )}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8 opacity-40" aria-hidden="true">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <span className="text-2xs font-mono font-black uppercase tracking-widest">
            {t.auth.oauth_divider}
          </span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>

        {submitError && (
          <div
            className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs font-semibold text-rose-500"
            aria-live="polite"
          >
            {submitError}
          </div>
        )}

        {/* === EMAIL AUTH STEP === */}
        {codeSent ? (
          emailFlow === 'magic_link' ? (
            <div className="space-y-6 animate-reveal" aria-live="polite">
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-600">
                  {magicLinkTitle}
                </div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80 mt-1">
                  {magicLinkDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <InteractiveButton
                  variant="primary"
                  className="w-full !py-5"
                  onClick={() => startEmailVerification(verifyContext)}
                  disabled={isSubmitting || resendIn > 0}
                >
                  {renderButtonLabel(
                    resendIn > 0 ? `${t.auth.resend_in} ${resendIn}s` : resendLabel,
                    submitAction === 'email_start'
                  )}
                </InteractiveButton>

                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setEmailFlow(null);
                    setResendIn(0);
                  }}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
                >
                  {t.auth.back}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-reveal" aria-live="polite">
              <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10">
                <div className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                  {codeStepTitle}
                </div>
                <p className="text-xs text-gray-500 mt-1">{codeStepDesc}</p>
                <p className="text-xs text-gray-500 mt-2">{magicLinkDesc}</p>
              </div>

              <div className="space-y-2">
                <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                  {t.auth.code_label}
                </label>
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => onOtpChange(e.target.value)}
                  onPaste={onOtpPaste}
                  disabled={isSubmitting}
                  maxLength={OTP_LEN}
                  className={`w-full bg-black/5 dark:bg-white/5 border rounded-2xl py-4 px-6 text-sm outline-none transition-all font-black tracking-[0.35em] text-center ${
                    otpError ? 'border-rose-500' : 'border-black/10 dark:border-white/10'
                  } focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40`}
                  placeholder={t.auth.code_placeholder}
                  aria-invalid={Boolean(otpError)}
                  aria-describedby={otpError ? 'auth-otp-error' : undefined}
                />
                {otpError && (
                  <p
                    id="auth-otp-error"
                    className="text-xs text-rose-500 font-semibold"
                    aria-live="polite"
                  >
                    {otpError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <InteractiveButton
                  variant="primary"
                  className="w-full !py-5"
                  onClick={verifyEmailCode}
                  disabled={isSubmitting || otp.replace(/\D/g, '').length !== OTP_LEN}
                >
                  {renderButtonLabel(t.auth.verify_session, submitAction === 'email_verify')}
                </InteractiveButton>

                <button
                  type="button"
                  onClick={() => startEmailVerification(verifyContext)}
                  disabled={isSubmitting || resendIn > 0}
                  className="w-full py-3 rounded-2xl border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-brand-start/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resendIn > 0 ? `${t.auth.resend_in} ${resendIn}s` : resendLabel}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setEmailFlow(null);
                    setOtp('');
                    setOtpError(null);
                    setResendIn(0);
                  }}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
                >
                  {t.auth.back}
                </button>
              </div>
            </div>
          )
        ) : isLogin ? (
          // === LOGIN EMAIL START ===
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                {t.auth.email_label} {t.auth.email_work_hint}
              </label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                placeholder={t.auth.email_placeholder_login}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? emailErrorId : undefined}
              />
              {emailError && (
                <p
                  id={emailErrorId}
                  className="text-xs text-rose-500 font-semibold"
                  aria-live="polite"
                >
                  {emailError}
                </p>
              )}
            </div>

            <InteractiveButton
              variant="primary"
              className="w-full !py-5 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl"
              onClick={() => startEmailVerification('login')}
              disabled={!isValidEmail(email) || isSubmitting}
            >
              {renderButtonLabel(t.auth.send_login_link, submitAction === 'email_start')}
            </InteractiveButton>

            {!isValidEmail(email) && email.length > 0 && (
              <p className="text-xs text-gray-500 font-medium" aria-live="polite">
                {t.auth.email_invalid_hint}
              </p>
            )}
          </div>
        ) : (
          // === REGISTER ===
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8" aria-hidden="true">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                      regStep >= s
                        ? 'bg-brand-start border-brand-start text-white shadow-lg'
                        : 'border-black/10 dark:border-white/10 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 2 && (
                    <div
                      className={`h-0.5 w-16 ${regStep > s ? 'bg-brand-start' : 'bg-black/5 dark:bg-white/5'}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {regStep === 1 && (
              <div className="space-y-6 animate-reveal">
                <div className="space-y-2">
                  <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                    {t.auth.email_label} {t.auth.email_work_hint}
                  </label>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                    placeholder={t.auth.email_placeholder_register}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? emailErrorId : undefined}
                  />
                  {emailError && (
                    <p
                      id={emailErrorId}
                      className="text-xs text-rose-500 font-semibold"
                      aria-live="polite"
                    >
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                    {t.auth.pass_label}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                    placeholder={t.auth.pass_label}
                    aria-describedby="auth-password-strength"
                  />
                  <div id="auth-password-strength" className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                      <span>{t.auth.entropy_analysis}</span>
                      <span className="text-brand-start">{passwordScore}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-2xs font-black uppercase tracking-widest">
                      <span
                        className={passwordChecks.length ? 'text-emerald-500' : 'text-gray-400'}
                      >
                        {t.auth.password_req_length}
                      </span>
                      <span
                        className={passwordChecks.uppercase ? 'text-emerald-500' : 'text-gray-400'}
                      >
                        {t.auth.password_req_uppercase}
                      </span>
                      <span
                        className={passwordChecks.special ? 'text-emerald-500' : 'text-gray-400'}
                      >
                        {t.auth.password_req_special}
                      </span>
                    </div>
                  </div>
                </div>

                <InteractiveButton
                  variant="primary"
                  className="w-full !py-5"
                  onClick={() => setRegStep(2)}
                  disabled={!isValidEmail(email) || !isPasswordValid || isSubmitting}
                >
                  {t.auth.next_protocol}
                </InteractiveButton>

                {!isValidEmail(email) && email.length > 0 && (
                  <p className="text-xs text-gray-500 font-medium" aria-live="polite">
                    {t.auth.email_invalid_hint}
                  </p>
                )}
                {!isPasswordValid && password.length > 0 && (
                  <p className="text-xs text-gray-500 font-medium" aria-live="polite">
                    {t.auth.password_invalid_hint}
                  </p>
                )}
              </div>
            )}

            {regStep === 2 && (
              <div className="space-y-6 animate-reveal">
                <div className="space-y-2 relative">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest">
                      {t.auth.nip_label}
                    </label>
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    value={nip}
                    onChange={(e) => {
                      setNip(e.target.value.replace(/\D/g, ''));
                      setIsCompanyManualOverride(false);
                    }}
                    disabled={isSubmitting}
                    className={`w-full bg-black/5 dark:bg-white/5 border rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold ${
                      nip.length === 10
                        ? nipError
                          ? 'border-rose-500'
                          : 'border-emerald-500'
                        : 'border-black/10 dark:border-white/10'
                    } focus-visible:ring-2 focus-visible:ring-brand-start/40`}
                    placeholder={t.auth.nip_placeholder}
                    aria-invalid={Boolean(nipError)}
                  />

                  {companyLookup.loading && (
                    <div
                      className="mt-2 flex items-center gap-2 text-xs text-gray-500"
                      aria-live="polite"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-start animate-pulse" />
                      <span>{t.auth.entity_validating}</span>
                    </div>
                  )}

                  {nipError && !companyLookup.loading && (
                    <p className="mt-2 text-xs text-rose-500 font-semibold" aria-live="polite">
                      {nipError}
                    </p>
                  )}

                  {companyLookup.notFound && !companyLookup.loading && !nipError && (
                    <p className="mt-2 text-xs text-amber-600 font-semibold" aria-live="polite">
                      {t.auth.company_not_found}
                    </p>
                  )}

                  {companyLookup.error && !companyLookup.loading && (
                    <p className="mt-2 text-xs text-rose-500 font-semibold" aria-live="polite">
                      {companyLookup.error.message}
                      {companyLookup.error.requestId
                        ? ` (Request ID: ${companyLookup.error.requestId})`
                        : ''}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {companyName && isCompanyAutofilled && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-2xs font-black uppercase tracking-widest">
                      {autofillBadgeLabel}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                      {t.auth.company_name_label}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setIsCompanyAutofilled(false);
                        setIsCompanyManualOverride(true);
                      }}
                      disabled={isSubmitting}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                      placeholder={t.auth.company_name_placeholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                      {t.auth.company_street_label}
                    </label>
                    <input
                      type="text"
                      value={companyStreet}
                      onChange={(e) => {
                        setCompanyStreet(e.target.value);
                        setIsCompanyAutofilled(false);
                        setIsCompanyManualOverride(true);
                      }}
                      disabled={isSubmitting}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                      placeholder={t.auth.company_street_placeholder}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                        {t.auth.company_postal_code_label}
                      </label>
                      <input
                        type="text"
                        value={companyPostalCode}
                        onChange={(e) => {
                          setCompanyPostalCode(e.target.value);
                          setIsCompanyAutofilled(false);
                          setIsCompanyManualOverride(true);
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                        placeholder={t.auth.company_postal_code_placeholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                        {t.auth.company_city_label}
                      </label>
                      <input
                        type="text"
                        value={companyCity}
                        onChange={(e) => {
                          setCompanyCity(e.target.value);
                          setIsCompanyAutofilled(false);
                          setIsCompanyManualOverride(true);
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                        placeholder={t.auth.company_city_placeholder}
                      />
                    </div>
                  </div>

                  {addressError && (
                    <p className="text-xs text-rose-500 font-semibold" aria-live="polite">
                      {addressError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                        {t.auth.company_regon_label}
                      </label>
                      <input
                        type="text"
                        value={companyRegon}
                        onChange={(e) => {
                          setCompanyRegon(e.target.value);
                          setIsCompanyAutofilled(false);
                          setIsCompanyManualOverride(true);
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                        placeholder={t.auth.company_regon_placeholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-2xs font-mono font-black text-gray-500 uppercase tracking-widest ml-1">
                        {t.auth.company_krs_label}
                      </label>
                      <input
                        type="text"
                        value={companyKrs}
                        onChange={(e) => {
                          setCompanyKrs(e.target.value);
                          setIsCompanyAutofilled(false);
                          setIsCompanyManualOverride(true);
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start/50 focus-visible:ring-2 focus-visible:ring-brand-start/40 transition-all font-bold"
                        placeholder={t.auth.company_krs_placeholder}
                      />
                    </div>
                  </div>
                </div>

                <InteractiveButton
                  variant="primary"
                  className="w-full !py-5"
                  onClick={handleRegister}
                  disabled={
                    !hasCompanyName ||
                    !isAddressValid ||
                    isSubmitting ||
                    !isValidEmail(email) ||
                    !isPasswordValid
                  }
                >
                  {renderButtonLabel(t.auth.create_account_cta, submitAction === 'register')}
                </InteractiveButton>

                {!hasCompanyName && nip.length > 0 && !companyLookup.loading && (
                  <p className="text-xs text-gray-500 font-medium" aria-live="polite">
                    {t.auth.nip_required_hint}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="p-8 border-t border-black/5 dark:border-white/5 text-center opacity-40"
        aria-hidden="true"
      >
        <span className="text-3xs font-mono font-bold uppercase tracking-[0.3em]">
          SECURE_ACCESS_GATEWAY_V2
        </span>
      </div>
    </div>
  );
};
