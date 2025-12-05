'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Cloud,
  HelpCircle,
  Loader2,
  Lock,
  Server,
  Shield,
} from 'lucide-react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function trackEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push({ event, ...params });
}

type WizardStep = 1 | 2 | 3 | 4;
type View = 'wizard' | 'terminal';

interface CompanyData {
  nip: string;
  name: string;
  address: string;
  industry: string;
  currency: 'PLN' | 'EUR' | 'USD';
  adminEmail: string;
  notifyIncidents: boolean;
  acceptedRules: boolean;
}

interface IntegrationsData {
  store: 'woocommerce' | 'shopify' | 'idosell' | 'other' | '';
  analyticsGa4: boolean;
  adsGoogle: boolean;
  adsMeta: boolean;
  marketplaceAllegro: boolean;
  marketplaceAmazon: boolean;
  wantHistorical12m: boolean;
  comment: string;
}

interface KeysData {
  hasOwnGcp: boolean;
  projectId: string;
  datasetName: string;
  serviceAccountJson: string;
  expertHelp: boolean;
  readonlyAccess: boolean;
}

interface ValidationErrors {
  nip?: string;
  name?: string;
  address?: string;
  industry?: string;
  adminEmail?: string;
  acceptedRules?: string;
  projectId?: string;
  datasetName?: string;
  serviceAccountJson?: string;
}

const INITIAL_COMPANY: CompanyData = {
  nip: '',
  name: '',
  address: '',
  industry: '',
  currency: 'PLN',
  adminEmail: '',
  notifyIncidents: true,
  acceptedRules: false,
};

const INITIAL_INTEGRATIONS: IntegrationsData = {
  store: '',
  analyticsGa4: true,
  adsGoogle: true,
  adsMeta: true,
  marketplaceAllegro: false,
  marketplaceAmazon: false,
  wantHistorical12m: true,
  comment: '',
};

const INITIAL_KEYS: KeysData = {
  hasOwnGcp: false,
  projectId: '',
  datasetName: 'papadata_reporting',
  serviceAccountJson: '',
  expertHelp: true,
  readonlyAccess: true,
};

const TERMINAL_LOGS: string[] = [
  'Sprawdzanie konfiguracji formularza...',
  'Tworzenie projektu GCP w regionie europe-central2...',
  'Konfiguracja datasetu BigQuery (papadata_reporting)...',
  'Tworzenie bucketu Cloud Storage na pliki tymczasowe...',
  'Tworzenie konta serwisowego i nadawanie ról IAM...',
  'Konfiguracja pipeline ETL dla sklepu i źródeł marketingowych...',
  'Wgrywanie przykładowych danych demonstracyjnych...',
  'Budowanie dashboardów startowych w Looker Studio...',
  'Konfiguracja alertów e-mail dla awarii integracji...',
  'Finalizacja – środowisko gotowe do pierwszej synchronizacji.',
];

function Stepper({ activeStep }: { activeStep: WizardStep }) {
  const steps: Array<{ id: WizardStep; label: string }> = [
    { id: 1, label: 'Firma' },
    { id: 2, label: 'Integracje' },
    { id: 3, label: 'Klucze' },
    { id: 4, label: 'Podsumowanie' },
  ];

  return (
    <ol className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isDone = step.id < activeStep;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <div
              className={[
                'flex h-7 w-7 items-center justify-center rounded-full border text-xs',
                isDone
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : isActive
                  ? 'border-cyan-500 bg-cyan-500/20 text-white'
                  : 'border-slate-700 bg-slate-900 text-slate-500',
              ].join(' ')}
            >
              {isDone ? <Check className="h-3 w-3" /> : step.id}
            </div>
            <span className={isActive ? 'text-slate-100' : 'text-slate-500'}>
              {step.id}. {step.label}
            </span>
            {index < steps.length - 1 && (
              <span className="mx-1 h-px w-6 bg-slate-700/70" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ExpertsAside() {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-5 shadow-neon-cyan">
        <div className="mb-3 flex items-start gap-3">
          <div className="rounded-xl bg-sky-500/15 p-2 text-sky-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
              Eksperci od wdrożeń
            </p>
            <p className="mt-1 text-sm font-medium text-slate-50">
              Zespół PapaData skonfiguruje ETL, BigQuery i raporty za Ciebie.
            </p>
          </div>
        </div>
        <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
          <li>• Audyt obecnych raportów przed startem.</li>
          <li>• Propozycja struktury dashboardów pod zarząd / marketing.</li>
          <li>• Wsparcie przy testach danych i odbiorze wdrożenia.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="mb-3 flex items-start gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-50">Bezpieczeństwo danych</p>
            <p className="mt-1 text-xs text-slate-400">
              Dane trzymamy w Twoim projekcie GCP (brak lock-inu do naszego konta).
            </p>
          </div>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300">
          <li>• Klucze szyfrowane w Google Secret Manager.</li>
          <li>• Logi ETL dostępne do audytu technicznego.</li>
        </ul>
      </div>
    </aside>
  );
}

interface StepCompanyProps {
  data: CompanyData;
  onChange: (patch: Partial<CompanyData>) => void;
  errors: ValidationErrors;
}

function StepCompany({ data, onChange, errors }: StepCompanyProps) {
  const [nipSuccess, setNipSuccess] = useState(false);
  const [nipError, setNipError] = useState<string | null>(null);
  const [isValidatingNip, setIsValidatingNip] = useState(false);

  useEffect(() => {
    if (data.nip.length === 10) {
      setIsValidatingNip(true);
      setNipError(null);
      setNipSuccess(false);

      const timer = window.setTimeout(() => {
        // Mock "GUS" lookup
        if (data.nip === '5252217463') {
          onChange({
            name: 'Przykładowy Sklep Sp. z o.o.',
            address: 'ul. Przykładowa 10, 00-838 Warszawa',
            industry: 'E-commerce (B2C)',
          });
        }
        setIsValidatingNip(false);
        setNipSuccess(true);
      }, 1500);

      return () => window.clearTimeout(timer);
    }

    setIsValidatingNip(false);
    setNipSuccess(false);
    setNipError(null);
    return undefined;
  }, [data.nip, onChange]);

  const handleNipChange = (e: ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    onChange({ nip: onlyDigits });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Dane firmy</h2>
          <p className="mt-1 text-sm text-slate-400">
            Uzupełnij podstawowe informacje. Dane posłużą do konfiguracji projektu GCP i
            fakturowania.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-cyan-900/70 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 md:flex">
          <Server className="h-3 w-3" />
          Region: europe-central2
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                NIP
              </label>
              <input
                value={data.nip}
                onChange={handleNipChange}
                maxLength={10}
                placeholder="Tylko cyfry, bez spacji"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm font-mono tracking-[0.2em] text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              />
              {!nipError && !isValidatingNip && (
                <p className="mt-1 text-xs text-slate-500">Wpisz NIP bez spacji i kresek.</p>
              )}
              {isValidatingNip && (
                <p className="mt-1 flex items-center gap-2 text-xs text-cyan-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Weryfikacja w GUS...
                </p>
              )}
              {nipSuccess && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Dane pobrane.
                </p>
              )}
              {nipError && <p className="mt-1 text-xs text-rose-400">{nipError}</p>}
              {errors.nip && !nipError && (
                <p className="mt-1 text-xs text-rose-400">{errors.nip}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Nazwa firmy
              </label>
              <input
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Pełna nazwa prawna"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Adres rejestrowy
              </label>
              <input
                value={data.address}
                onChange={(e) => onChange({ address: e.target.value })}
                placeholder="Ulica, numer, kod pocztowy, miasto"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              />
              {errors.address && <p className="mt-1 text-xs text-rose-400">{errors.address}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Branża
              </label>
              <div className="relative">
                <select
                  value={data.industry}
                  onChange={(e) => onChange({ industry: e.target.value })}
                  className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
                >
                  <option value="">Wybierz z listy</option>
                  <option value="ecommerce_b2c">E-commerce (B2C)</option>
                  <option value="ecommerce_b2b">E-commerce (B2B)</option>
                  <option value="omnichannel">Omnichannel (online + retail)</option>
                  <option value="marketplace_seller">Marketplace seller</option>
                  <option value="other">Inna</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  ▼
                </div>
              </div>
              {errors.industry && (
                <p className="mt-1 text-xs text-rose-400">{errors.industry}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Waluta
              </label>
              <div className="relative">
                <select
                  value={data.currency}
                  onChange={(e) =>
                    onChange({ currency: e.target.value as CompanyData['currency'] })
                  }
                  className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
                >
                  <option value="PLN">PLN (Polski Złoty)</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  ▼
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                E-mail administratora
              </label>
              <input
                type="email"
                value={data.adminEmail}
                onChange={(e) => onChange({ adminEmail: e.target.value })}
                placeholder="admin@firma.pl"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              />
              {errors.adminEmail && (
                <p className="mt-1 text-xs text-rose-400">{errors.adminEmail}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/5 pt-4 text-xs text-slate-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.notifyIncidents}
                onChange={(e) => onChange({ notifyIncidents: e.target.checked })}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Chcę otrzymywać powiadomienia systemowe (awarie ETL, problemy z integracjami).</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.acceptedRules}
                onChange={(e) => onChange({ acceptedRules: e.target.checked })}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span>
                Akceptuję{' '}
                <Link href="/terms" className="text-cyan-400 underline underline-offset-2">
                  Regulamin
                </Link>{' '}
                i{' '}
                <Link href="/privacy-policy" className="text-cyan-400 underline underline-offset-2">
                  Politykę Prywatności
                </Link>
                .
              </span>
            </label>
            {errors.acceptedRules && (
              <p className="text-xs text-rose-400">{errors.acceptedRules}</p>
            )}
          </div>

          <div className="mt-2 space-y-1 text-xs text-amber-300/90">
            <p>• NIP musi mieć dokładnie 10 cyfr.</p>
            <p>• Podaj nazwę firmy i adres rejestrowy.</p>
            <p>• Podaj e-mail administratora.</p>
            <p>• Musisz zaakceptować Regulamin i Politykę Prywatności.</p>
          </div>
        </div>

        <ExpertsAside />
      </div>
    </div>
  );
}

interface StepIntegrationsProps {
  data: IntegrationsData;
  onChange: (patch: Partial<IntegrationsData>) => void;
}

function StepIntegrations({ data, onChange }: StepIntegrationsProps) {
  const toggle = (field: keyof IntegrationsData) => {
    const current = data[field];
    if (typeof current === 'boolean') {
      onChange({ [field]: !current } as Partial<IntegrationsData>);
    }
  };

  const storeOptions: Array<{ value: IntegrationsData['store']; label: string }> = [
    { value: '', label: 'Wybierz z listy' },
    { value: 'woocommerce', label: 'WooCommerce' },
    { value: 'shopify', label: 'Shopify' },
    { value: 'idosell', label: 'IdoSell' },
    { value: 'other', label: 'Inna platforma / custom' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Źródła danych</h2>
          <p className="mt-1 text-sm text-slate-400">
            Wersja demo zakłada przykładowy sklep i główne kanały performance (Google + Meta).
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
          <Cloud className="h-3 w-3" />
          ETL + hurtownia w cenie Trialu
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Section: Store */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Platforma sklepu
            </label>
            <div className="relative">
              <select
                value={data.store}
                onChange={(e) =>
                  onChange({ store: e.target.value as IntegrationsData['store'] })
                }
                className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              >
                {storeOptions.map((opt) => (
                  <option key={opt.value || 'none'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                ▼
              </div>
            </div>
            <p className="text-xs text-slate-500">
              W pełnej wersji możesz podłączyć wiele sklepów jednocześnie (np. WooCommerce +
              Shopify).
            </p>
          </div>

          {/* Section: Marketing & Analytics */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">
                Analityka i kampanie reklamowe
              </p>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                GA4 + Google Ads + Meta
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={data.analyticsGa4}
                  onChange={() => toggle('analyticsGa4')}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                GA4 (zalecane) – lejek zakupowy i atrybucja
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={data.adsGoogle}
                  onChange={() => toggle('adsGoogle')}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                Google Ads – Search, Performance Max, Brand
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={data.adsMeta}
                  onChange={() => toggle('adsMeta')}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                Meta Ads – Prospecting + Remarketing
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={data.wantHistorical12m}
                  onChange={() => toggle('wantHistorical12m')}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                Wczytaj dane historyczne z ostatnich 12 miesięcy
              </label>
            </div>
          </div>

          {/* Section: Marketplaces */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Marketplace&apos;y (opcjonalnie)
            </label>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => toggle('marketplaceAllegro')}
                className={[
                  'flex items-center gap-2 rounded-full border px-3 py-1.5',
                  data.marketplaceAllegro
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                    : 'border-slate-700 bg-slate-900 text-slate-300',
                ].join(' ')}
              >
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Allegro
              </button>
              <button
                type="button"
                onClick={() => toggle('marketplaceAmazon')}
                className={[
                  'flex items-center gap-2 rounded-full border px-3 py-1.5',
                  data.marketplaceAmazon
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                    : 'border-slate-700 bg-slate-900 text-slate-300',
                ].join(' ')}
              >
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Amazon
              </button>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Dodatkowe informacje / uwagi
            </label>
            <textarea
              rows={3}
              value={data.comment}
              onChange={(e) => onChange({ comment: e.target.value })}
              placeholder="Np. osobne konta Google Ads dla różnych krajów, specyficzne integracje, itp."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
            />
          </div>
        </div>

        <ExpertsAside />
      </div>
    </div>
  );
}

interface StepKeysProps {
  data: KeysData;
  onChange: (patch: Partial<KeysData>) => void;
  errors: ValidationErrors;
}

function StepKeys({ data, onChange, errors }: StepKeysProps) {
  const toggleBoolean = (field: keyof KeysData) => {
    const current = data[field];
    if (typeof current === 'boolean') {
      onChange({ [field]: !current } as Partial<KeysData>);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Dostęp i klucze</h2>
          <p className="mt-1 text-sm text-slate-400">
            W wersji demo możesz zasymulować dwa scenariusze: własny projekt GCP lub pełna
            konfiguracja po stronie PapaData.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
          <Lock className="h-3 w-3" />
          Dostęp tylko do odczytu (read-only)
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-100">
                Jak chcesz skonfigurować środowisko?
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => onChange({ hasOwnGcp: false })}
                className={[
                  'flex flex-col items-start gap-2 rounded-xl border p-4 text-left text-sm transition-all',
                  !data.hasOwnGcp
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-slate-50 shadow-neon-cyan'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  <Shield className="h-3 w-3" />
                  PapaData zakłada projekt
                </div>
                <p>Rekomendowane – nasz zespół tworzy projekt GCP i nadaje dostęp administratorowi.</p>
              </button>
              <button
                type="button"
                onClick={() => onChange({ hasOwnGcp: true })}
                className={[
                  'flex flex-col items-start gap-2 rounded-xl border p-4 text-left text-sm transition-all',
                  data.hasOwnGcp
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-slate-50 shadow-neon-cyan'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  <Cloud className="h-3 w-3" />
                  Użyj mojego projektu GCP
                </div>
                <p>
                  Podasz identyfikator projektu i konto serwisowe z dostępem do BigQuery oraz Cloud
                  Storage.
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                ID projektu GCP
              </label>
              <input
                value={data.projectId}
                onChange={(e) => onChange({ projectId: e.target.value })}
                placeholder={data.hasOwnGcp ? 'np. moj-sklep-production' : 'Zostanie utworzony automatycznie'}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              />
              {errors.projectId && (
                <p className="mt-1 text-xs text-rose-400">{errors.projectId}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Dataset BigQuery
              </label>
              <input
                value={data.datasetName}
                onChange={(e) => onChange({ datasetName: e.target.value })}
                placeholder="papadata_reporting"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              />
              {errors.datasetName && (
                <p className="mt-1 text-xs text-rose-400">{errors.datasetName}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Klucz JSON konta serwisowego (opcjonalnie w demo)
              </label>
              <textarea
                rows={4}
                value={data.serviceAccountJson}
                onChange={(e) => onChange({ serviceAccountJson: e.target.value })}
                placeholder="{ ... }"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-mono text-slate-100 outline-none ring-1 ring-transparent focus:border-cyan-500 focus:ring-cyan-500/40"
              />
              {errors.serviceAccountJson && (
                <p className="mt-1 text-xs text-rose-400">{errors.serviceAccountJson}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                W wersji demo nie wysyłamy żadnych danych do Google – to tylko pole treningowe.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/5 pt-4 text-xs text-slate-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.readonlyAccess}
                onChange={() => toggleBoolean('readonlyAccess')}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.expertHelp}
                onChange={() => toggleBoolean('expertHelp')}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Poproś eksperta PapaData o weryfikację konfiguracji (w cenie Trial).</span>
            </label>
          </div>
        </div>

        <ExpertsAside />
      </div>
    </div>
  );
}

interface StepSummaryProps {
  company: CompanyData;
  integrations: IntegrationsData;
  keys: KeysData;
}

function StepSummary({ company, integrations, keys }: StepSummaryProps) {
  const storeLabel = useMemo(() => {
    const map: Record<IntegrationsData['store'], string> = {
      '': 'Nie wybrano',
      woocommerce: 'WooCommerce',
      shopify: 'Shopify',
      idosell: 'IdoSell',
      other: 'Inna / custom',
    };
    return map[integrations.store];
  }, [integrations.store]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Podsumowanie</h2>
          <p className="mt-1 text-sm text-slate-400">
            Sprawdź, czy wszystkie dane wyglądają poprawnie. W wersji demo to tylko symulacja, ale
            proces jest taki sam jak w produkcji.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
          <CheckCircle2 className="h-3 w-3" />
          Konfiguracja gotowa do uruchomienia
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 lg:col-span-2">
          <h3 className="mb-2 text-sm font-semibold text-slate-100">Firma</h3>
          <dl className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Nazwa</dt>
              <dd className="font-medium text-slate-100">{company.name || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">NIP</dt>
              <dd className="font-mono text-slate-100">{company.nip || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Adres rejestrowy</dt>
              <dd className="font-medium text-slate-100">{company.address || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Branża</dt>
              <dd className="font-medium text-slate-100">{company.industry || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Waluta</dt>
              <dd className="font-medium text-slate-100">{company.currency}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Administrator</dt>
              <dd className="font-medium text-slate-100">{company.adminEmail || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-100">Integracje</h3>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>
              • Sklep: <span className="font-medium text-slate-100">{storeLabel}</span>
            </li>
            <li>• GA4: {integrations.analyticsGa4 ? 'tak' : 'nie'}</li>
            <li>• Google Ads: {integrations.adsGoogle ? 'tak' : 'nie'}</li>
            <li>• Meta Ads: {integrations.adsMeta ? 'tak' : 'nie'}</li>
            <li>• Allegro: {integrations.marketplaceAllegro ? 'tak' : 'nie'}</li>
            <li>• Amazon: {integrations.marketplaceAmazon ? 'tak' : 'nie'}</li>
            <li>
              • Dane historyczne 12m:{' '}
              {integrations.wantHistorical12m ? 'tak, pobierz' : 'nie, od momentu wdrożenia'}
            </li>
          </ul>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-100">Środowisko techniczne</h3>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Projekt GCP: {keys.projectId || 'do utworzenia'}</li>
            <li>• Dataset BigQuery: {keys.datasetName || 'papadata_reporting'}</li>
            <li>• Tryb: {keys.hasOwnGcp ? 'Twój projekt GCP' : 'Projekt zarządzany przez PapaData'}</li>
            <li>• Dostęp: {keys.readonlyAccess ? 'read-only' : 'pełny (demo)'}</li>
            <li>• Ekspert: {keys.expertHelp ? 'tak, poproś o weryfikację' : 'nie, samodzielnie'}</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-700/70 bg-emerald-950/40 p-4 text-xs text-emerald-100">
        Po kliknięciu <span className="font-semibold">„Uruchom konto demo”</span> zobaczysz ekran
        terminala z symulacją tworzenia projektu, ETL i raportów. W realnym wdrożeniu ten etap
        trwa zwykle od kilkunastu minut do kilku godzin – w zależności od liczby integracji i
        wolumenu danych.
      </div>
    </div>
  );
}

interface TerminalProps {
  company: CompanyData;
  onDone: () => void;
}

function TerminalView({ company, onDone }: TerminalProps) {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    trackEvent('onboarding_terminal_open', { nip: company.nip });

    const totalLines = TERMINAL_LOGS.length;
    const interval = window.setInterval(() => {
      setCurrentLine((prev) => {
        const next = prev + 1;
        setProgress(Math.min(100, Math.round((next / totalLines) * 100)));
        if (next >= totalLines) {
          window.clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            trackEvent('onboarding_terminal_done', {});
          }, 800);
        }
        return Math.min(next, totalLines);
      });
    }, 900);

    return () => window.clearInterval(interval);
  }, [company.nip]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-10 pt-10">
        <header className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Onboarding
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">
              Uruchamiamy Twoje środowisko PapaData
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Ten ekran symuluje proces tworzenia projektu GCP, datasetów BigQuery oraz konfiguracji
              ETL.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
            <Server className="h-3 w-3" />
            {company.name || 'Nowe konto demo'}
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl border border-slate-800 bg-black/70 p-4 font-mono text-xs text-slate-200 shadow-[0_0_40px_rgba(8,47,73,0.7)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-300">LIVE DEPLOY</span>
              </div>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                europe-central2
              </span>
            </div>

            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-1.5">
              {TERMINAL_LOGS.slice(0, currentLine).map((line, index) => (
                <p key={line} className="flex items-start gap-2 text-[11px]">
                  <span className="text-slate-600">papadata@etl</span>
                  <span className="text-slate-500">➜</span>
                  <span
                    className={
                      index === currentLine - 1 && !isDone
                        ? 'text-cyan-300'
                        : index === TERMINAL_LOGS.length - 1 && isDone
                        ? 'text-emerald-300'
                        : 'text-slate-200'
                    }
                  >
                    {line}
                  </span>
                </p>
              ))}
              {!isDone && (
                <p className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
                  Przygotowujemy środowisko demo...
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
                Co się dzieje w tle?
              </p>
              <ul className="mt-2 space-y-1.5">
                <li>• Tworzymy strukturę tabel w BigQuery pod raporty sprzedaży i marketingu.</li>
                <li>• Konfigurujemy konektory ETL do sklepu, GA4 oraz kont reklamowych.</li>
                <li>• Generujemy dashboardy startowe pod zarząd, marketing i e-commerce.</li>
              </ul>
            </div>

            {isDone && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-700/70 bg-emerald-950/40 p-5 text-center text-sm text-emerald-50">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                <p className="text-base font-semibold">
                  Konfiguracja zapisana. Środowisko demo jest gotowe.
                </p>
                <p className="text-xs text-emerald-100/90">
                  Twoje dashboardy są przygotowywane. W prawdziwym koncie otrzymasz powiadomienie
                  e-mail, gdy dane zostaną w pełni zsynchronizowane.
                </p>
                <button
                  type="button"
                  onClick={onDone}
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-neon-cyan transition-transform hover:-translate-y-0.5 hover:bg-sky-400"
                >
                  Przejdź do dashboardu
                </button>
              </div>
            )}

            {!isDone && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-400">
                W wersji demo ten proces jest skrócony. W produkcji czas zależy od liczby integracji
                i wolumenu danych – zwykle od kilkunastu minut do kilku godzin.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function WizardPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('wizard');
  const [step, setStep] = useState<WizardStep>(1);
  const [company, setCompany] = useState<CompanyData>(INITIAL_COMPANY);
  const [integrations, setIntegrations] = useState<IntegrationsData>(INITIAL_INTEGRATIONS);
  const [keys, setKeys] = useState<KeysData>(INITIAL_KEYS);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const goHome = () => {
    router.push('/');
  };

  const validateStep = (currentStep: WizardStep): boolean => {
    const nextErrors: ValidationErrors = {};
    if (currentStep === 1) {
      if (company.nip.length !== 10) {
        nextErrors.nip = 'NIP musi mieć dokładnie 10 cyfr.';
      }
      if (!company.name.trim()) {
        nextErrors.name = 'Podaj nazwę firmy.';
      }
      if (!company.address.trim()) {
        nextErrors.address = 'Podaj adres rejestrowy.';
      }
      if (!company.industry) {
        nextErrors.industry = 'Wybierz branżę.';
      }
      if (!company.adminEmail.trim()) {
        nextErrors.adminEmail = 'Podaj e-mail administratora.';
      }
      if (!company.acceptedRules) {
        nextErrors.acceptedRules = 'Musisz zaakceptować Regulamin i Politykę Prywatności.';
      }
    }

    if (currentStep === 3) {
      if (keys.hasOwnGcp && !keys.projectId.trim()) {
        nextErrors.projectId = 'Podaj ID istniejącego projektu GCP lub przełącz na tryb zarządzany.';
      }
      if (!keys.datasetName.trim()) {
        nextErrors.datasetName = 'Podaj nazwę datasetu BigQuery.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      trackEvent('onboarding_step_error', { step });
      return;
    }
    if (step === 4) {
      // Start terminal simulation
      trackEvent('onboarding_activate', { nip: company.nip });
      setView('terminal');
      return;
    }
    const nextStep = (step + 1) as WizardStep;
    setStep(nextStep);
    trackEvent('onboarding_step_next', { step: nextStep });
  };

  const handlePrev = () => {
    if (step === 1) return;
    const prevStep = (step - 1) as WizardStep;
    setStep(prevStep);
    setErrors({});
    trackEvent('onboarding_step_prev', { step: prevStep });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  if (view === 'terminal') {
    return <TerminalView company={company} onDone={() => router.push('/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-8">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-xs font-bold text-white shadow-neon-cyan ring-1 ring-slate-700">
              PD
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Onboarding
              </p>
              <p className="text-sm font-medium text-slate-200">
                Konfiguracja konta PapaData
                <span className="text-slate-500"> (demo)</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
          >
            <ArrowLeft className="h-3 w-3" />
            Wróć na stronę główną
          </button>
        </header>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Krok {step}/4
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight text-white">
                {step === 1 && 'Dane firmy'}
                {step === 2 && 'Integracje i źródła danych'}
                {step === 3 && 'Dostęp i klucze'}
                {step === 4 && 'Podsumowanie i start'}
              </h1>
            </div>
            <Stepper activeStep={step} />
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <StepCompany
                data={company}
                onChange={(patch) => setCompany((prev) => ({ ...prev, ...patch }))}
                errors={errors}
              />
            )}
            {step === 2 && (
              <StepIntegrations
                data={integrations}
                onChange={(patch) => setIntegrations((prev) => ({ ...prev, ...patch }))}
              />
            )}
            {step === 3 && (
              <StepKeys
                data={keys}
                onChange={(patch) => setKeys((prev) => ({ ...prev, ...patch }))}
                errors={errors}
              />
            )}
            {step === 4 && (
              <StepSummary company={company} integrations={integrations} keys={keys} />
            )}

            <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/5 pt-4 text-xs md:flex-row">
              <div className="flex items-center gap-2 text-slate-500">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>
                  W razie pytań odezwij się na{' '}
                  <a
                    href="mailto:hello@papadata.pl"
                    className="text-cyan-400 underline underline-offset-2"
                  >
                    hello@papadata.pl
                  </a>
                  .
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-200 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:border-slate-500 hover:bg-slate-900"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Wstecz
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2 text-xs font-semibold text-white shadow-neon-cyan transition-transform hover:-translate-y-0.5 hover:bg-cyan-400"
                >
                  {step === 4 ? 'Uruchom konto demo' : 'Dalej'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
