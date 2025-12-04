'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Circle,
  Cloud,
  Globe2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { useI18n } from '@papadata/i18n';

type WizardStep = 'company' | 'integrations' | 'keys' | 'summary';
type NipStatus = 'idle' | 'checking' | 'ok' | 'error';
type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'testing' | 'ok' | 'error';

type ApiIntegrationId = 'woocommerce' | 'shopify' | 'allegro' | 'baselinker';
type OAuthIntegrationId = 'googleAds' | 'ga4' | 'metaAds' | 'tiktokAds';

type ApiConnection = {
  url?: string;
  key?: string;
  secret?: string;
  token?: string;
  status: ConnectionStatus;
  message?: string;
};

const wizardSteps: WizardStep[] = ['company', 'integrations', 'keys', 'summary'];

const integrationDefinitions = [
  {
    id: 'woocommerce',
    group: 'store',
    status: 'available',
    description: {
      pl: 'Sklep internetowy na WordPress. Pobieramy zamówienia, produkty, klientów i statusy.',
      en: 'WordPress-based store. We sync orders, products, customers and statuses.',
    },
  },
  {
    id: 'shopify',
    group: 'store',
    status: 'available',
    description: {
      pl: 'Nowoczesny sklep SaaS. Pobieramy zamówienia, produkty i klientów.',
      en: 'Modern SaaS store. We pull orders, products and customers.',
    },
  },
  {
    id: 'allegro',
    group: 'marketplace',
    status: 'available',
    description: {
      pl: 'Marketplace Allegro. Pobieramy zamówienia i dane o ofertach.',
      en: 'Allegro marketplace. We fetch orders and offer data.',
    },
  },
  {
    id: 'ga4',
    group: 'analytics',
    status: 'available',
    description: {
      pl: 'Analityka Google Analytics 4 dla lejka i zdarzeń e-commerce.',
      en: 'Google Analytics 4 for funnels and e-commerce events.',
    },
  },
  {
    id: 'googleAds',
    group: 'ads',
    status: 'available',
    description: {
      pl: 'Kampanie Google Ads: koszty, kliknięcia, konwersje.',
      en: 'Google Ads campaigns: costs, clicks and conversions.',
    },
  },
  {
    id: 'metaAds',
    group: 'ads',
    status: 'available',
    description: {
      pl: 'Kampanie Meta Ads (Facebook/Instagram): wydatki i wyniki.',
      en: 'Meta Ads campaigns (Facebook/Instagram): spend and results.',
    },
  },
  {
    id: 'tiktokAds',
    group: 'ads',
    status: 'comingSoon',
    description: {
      pl: 'TikTok Ads – logowanie przez OAuth i raporty efektywności.',
      en: 'TikTok Ads – OAuth login and performance reports.',
    },
  },
  {
    id: 'baselinker',
    group: 'tool',
    status: 'available',
    description: {
      pl: 'BaseLinker – synchronizacja zamówień i stanów magazynowych.',
      en: 'BaseLinker – orders and stock sync.',
    },
  },
] as const;

const apiIntegrationFields: Record<
  ApiIntegrationId,
  { key: keyof ApiConnection; labelPl: string; labelEn: string; placeholder?: string }[]
> = {
  woocommerce: [
    { key: 'url', labelPl: 'Adres sklepu (URL)', labelEn: 'Store URL', placeholder: 'https://twoj-sklep.pl' },
    { key: 'key', labelPl: 'Consumer Key', labelEn: 'Consumer Key' },
    { key: 'secret', labelPl: 'Consumer Secret', labelEn: 'Consumer Secret' },
  ],
  shopify: [
    { key: 'url', labelPl: 'Storefront URL', labelEn: 'Storefront URL', placeholder: 'https://your-store.myshopify.com' },
    { key: 'token', labelPl: 'API token', labelEn: 'API token' },
  ],
  allegro: [
    { key: 'key', labelPl: 'Client ID', labelEn: 'Client ID' },
    { key: 'secret', labelPl: 'Client Secret', labelEn: 'Client Secret' },
  ],
  baselinker: [{ key: 'token', labelPl: 'API token', labelEn: 'API token' }],
};

export default function WizardPage() {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<'form' | 'provisioning'>('form');
  const [prefillSources, setPrefillSources] = useState<string[]>([]);
  const [policyModal, setPolicyModal] = useState<'terms' | 'privacy' | 'dpa' | null>(null);

  const [company, setCompany] = useState({
    nip: '',
    name: '',
    address: '',
    industry: 'ecommerce',
    currency: 'PLN',
    timezone: 'Europe/Warsaw',
    contactEmail: '',
    notify: true,
    marketing: false,
    acceptPolicies: false,
    nipStatus: 'idle' as NipStatus,
    nipMessage: '',
  });

  const [summaryChecks, setSummaryChecks] = useState({
    ownership: false,
    gcp: false,
  });

  const [selectedIntegrations, setSelectedIntegrations] = useState<Set<string>>(new Set());

  const [oauthConnections, setOauthConnections] = useState<Record<OAuthIntegrationId, ConnectionStatus>>({
    googleAds: 'idle',
    ga4: 'idle',
    metaAds: 'idle',
    tiktokAds: 'idle',
  });

  const [apiConnections, setApiConnections] = useState<Record<ApiIntegrationId, ApiConnection>>({
    woocommerce: { status: 'idle' },
    shopify: { status: 'idle' },
    allegro: { status: 'idle' },
    baselinker: { status: 'idle' },
  });

  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [logProgress, setLogProgress] = useState(0);

  const currentStep = wizardSteps[stepIndex];

  useEffect(() => {
    const sourcesParam = searchParams.get('sources');
    const sessionSources =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem('papadata.pricing.sources')
        : null;

    const raw = sourcesParam || sessionSources || '';
    const normalized = raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (normalized.length) {
      const valid = normalized.filter((id) =>
        integrationDefinitions.some((def) => def.id === id),
      );
      setSelectedIntegrations(new Set(valid));
      setPrefillSources(valid);
    }
  }, [searchParams]);

  useEffect(() => {
    if (phase !== 'provisioning') return;

    const slug = (company.name || 'mojafirma')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const logsPl = [
      `> Inicjalizuję środowisko klienta: ${slug || 'mojafirma-spzoo'}`,
      '> Tworzę projekt GCP i dataset: ... (region: europe-central2)... [OK]',
      '> Konfiguruję integracje: ' +
        Array.from(selectedIntegrations).join(', ') +
        '... [OK]',
      '> Szyfruję klucze w Google Secret Manager... [OK]',
      '> Uruchamiam potoki ETL (pobieranie danych historycznych 365 dni)... [W TOKU]',
      '> Konfiguruję dashboardy domyślne i widok Raportów Live... [OK]',
      '> Twoja platforma jest gotowa. Za chwilę przejdziesz do pulpitu.',
    ];

    const logsEn = [
      `> Initialising customer workspace: ${slug || 'my-company'}`,
      '> Creating GCP project and datasets (region: europe-central2)... [OK]',
      '> Configuring integrations: ' +
        Array.from(selectedIntegrations).join(', ') +
        '... [OK]',
      '> Encrypting keys in Google Secret Manager... [OK]',
      '> Running ETL pipelines (365 days of historical data)... [IN PROGRESS]',
      '> Preparing default dashboards and Live Reports view... [OK]',
      '> Your platform is ready. Redirecting to your dashboard.',
    ];

    const logList = isPl ? logsPl : logsEn;
    setLogEntries([]);
    setLogProgress(0);

    let index = 0;
    const interval = window.setInterval(() => {
      setLogEntries((prev) => [...prev, logList[index]]);
      setLogProgress(Math.round(((index + 1) / logList.length) * 100));
      index += 1;
      if (index >= logList.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          router.push('/dashboard');
        }, 1600);
      }
    }, 900);

    return () => window.clearInterval(interval);
  }, [phase, isPl, company.name, selectedIntegrations, router]);

  const canProceed = useMemo(() => {
    if (currentStep === 'company') {
      return (
        company.nip.trim().length >= 10 &&
        company.contactEmail.trim().length > 3 &&
        company.acceptPolicies
      );
    }
    if (currentStep === 'integrations') {
      return selectedIntegrations.size > 0;
    }
    if (currentStep === 'summary') {
      return summaryChecks.ownership && summaryChecks.gcp;
    }
    return true;
  }, [company, currentStep, selectedIntegrations.size, summaryChecks]);

  const goNext = () => {
    if (stepIndex < wizardSteps.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  };

  const handleNipBlur = () => {
    const normalized = company.nip.replace(/[^0-9]/g, '');
    if (normalized.length < 10) {
      setCompany((prev) => ({
        ...prev,
        nipStatus: 'error',
        nipMessage: isPl
          ? 'Nie udało się pobrać danych firmy. Sprawdź NIP lub uzupełnij pola ręcznie.'
          : 'Could not fetch company data. Check the tax ID or fill the fields manually.',
      }));
      return;
    }

    setCompany((prev) => ({
      ...prev,
      nipStatus: 'checking',
      nipMessage: isPl
        ? 'Sprawdzam dane w rejestrze GUS...'
        : 'Checking data in the registry...',
    }));

    window.setTimeout(() => {
      setCompany((prev) => ({
        ...prev,
        nipStatus: 'ok',
        nipMessage: isPl
          ? 'Dane zostały pobrane automatycznie. Możesz je edytować.'
          : 'Data fetched automatically. You can edit before moving on.',
        name: prev.name || (isPl ? 'Moja Firma sp. z o.o.' : 'My Company LLC'),
        address:
          prev.address ||
          (isPl
            ? 'ul. Przykładowa 10, 00-000 Warszawa, Polska'
            : 'Example Street 10, 00-000 Warsaw, Poland'),
      }));
    }, 1100);
  };

  const toggleIntegration = (id: string) => {
    const definition = integrationDefinitions.find((def) => def.id === id);
    if (definition?.status === 'comingSoon') return;

    setSelectedIntegrations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleOauthAction = (id: OAuthIntegrationId, action: 'connect' | 'test') => {
    setOauthConnections((prev) => ({
      ...prev,
      [id]: action === 'connect' ? 'connecting' : 'testing',
    }));

    window.setTimeout(() => {
      setOauthConnections((prev) => ({
        ...prev,
        [id]: action === 'connect' ? 'connected' : 'ok',
      }));
    }, 900);
  };

  const handleApiChange = (id: ApiIntegrationId, field: keyof ApiConnection, value: string) => {
    setApiConnections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleApiTest = (id: ApiIntegrationId, name: string) => {
    setApiConnections((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: 'testing', message: '' },
    }));

    window.setTimeout(() => {
      const success =
        (apiConnections[id].url || apiConnections[id].token || apiConnections[id].key) !== '';

      setApiConnections((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          status: success ? 'ok' : 'error',
          message: success
            ? isPl
              ? `Połączenie poprawne – ${name} gotowe do importu.`
              : `Connection successful – ${name} is ready.`
            : isPl
            ? 'Nie udało się połączyć. Sprawdź adres i klucze API.'
            : 'Connection failed. Check the URL and API keys.',
        },
      }));
    }, 1000);
  };

  const selectedApiIntegrations = useMemo(
    () =>
      Array.from(selectedIntegrations).filter((id): id is ApiIntegrationId =>
        ['woocommerce', 'shopify', 'allegro', 'baselinker'].includes(id),
      ),
    [selectedIntegrations],
  );

  const selectedOAuthIntegrations = useMemo(
    () =>
      Array.from(selectedIntegrations).filter((id): id is OAuthIntegrationId =>
        ['googleAds', 'ga4', 'metaAds', 'tiktokAds'].includes(id),
      ),
    [selectedIntegrations],
  );

  const integrationGroupLabels = {
    stores: isPl ? 'Sklepy' : 'Stores',
    ads: isPl ? 'Reklama i kampanie' : 'Ads & campaigns',
    marketplace: isPl ? 'Marketplace' : 'Marketplace',
    analytics: isPl ? 'Analityka' : 'Analytics',
    tools: isPl ? 'Narzędzia / CRM / Płatności' : 'Tools / CRM / Payments',
  };

  const wizardCopy = {
    companyTitle: isPl ? 'Dane Twojej firmy' : 'Your company details',
    companyLead: isPl
      ? 'Na podstawie NIP automatycznie uzupełnimy dane firmy i przygotujemy osobne środowisko w Google Cloud.'
      : 'We will auto-fill your company details from the tax ID and prepare a separate Google Cloud workspace.',
    contactLabel: isPl ? 'E-mail do kontaktu i powiadomień' : 'Contact & notifications email',
    contactHint: isPl
      ? 'Na ten adres wyślemy podsumowanie konfiguracji i alerty o integracjach.'
      : 'We will send configuration summary and integration alerts here.',
    industryLabel: isPl ? 'Branża / Industry' : 'Industry',
    currencyLabel: isPl ? 'Waluta raportowania' : 'Reporting currency',
    timezoneLabel: isPl ? 'Strefa czasowa' : 'Time zone',
    securityTitle: isPl ? 'Bezpieczeństwo Twoich danych' : 'Your data security',
    securityBullets: isPl
      ? [
          'Dane firmy i konfiguracja integracji są w Google Cloud (region: europe-central2).',
          'Klucze API i tokeny zapisujemy w zaszyfrowanym Secrecie.',
          'Nie udostępniamy kluczy innym klientom ani osobom trzecim.',
        ]
      : [
          'Company data and integration settings live in Google Cloud (region: europe-central2).',
          'API keys and tokens are stored in encrypted secrets.',
          'We never expose keys to other customers or third parties.',
        ],
    acceptLabel: isPl
      ? 'Zapoznałem się i akceptuję Regulamin oraz Politykę Prywatności.'
      : 'I have read and accept the Terms of Service and Privacy Policy.',
    integrationsTitle: isPl ? 'Wybierz systemy, które chcesz podłączyć' : 'Select the systems you want to connect',
    integrationsLead: isPl
      ? 'Te integracje określą, jakie dane pobierzemy i jakie raporty przygotujemy.'
      : 'These integrations define what data we ingest and which reports we prepare.',
    integrationsInfo: isPl
      ? 'Możesz wybrać minimum 1 integrację sklepową oraz dowolną liczbę źródeł reklamowych.'
      : 'Select at least one store integration and any ad sources you use.',
    keysTitle: isPl ? 'Połącz swoje konta i dodaj klucze' : 'Connect your accounts and add keys',
    keysLead: isPl
      ? 'Dane logowania służą wyłącznie do pobierania danych do Twojej prywatnej hurtowni.'
      : 'Credentials are used only to fetch data into your private warehouse.',
    summaryTitle: isPl ? 'Podsumowanie konfiguracji' : 'Configuration summary',
    summaryLead: isPl
      ? 'Sprawdź dane przed startem. Po aktywacji przygotujemy środowisko analityczne.'
      : 'Review the setup. After activation we will prepare your analytics workspace.',
    activateCta: isPl ? 'Aktywuj platformę' : 'Activate platform',
    back: isPl ? 'Wstecz' : 'Back',
    next: isPl ? 'Dalej' : 'Next',
  };

  if (phase === 'provisioning') {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/80 p-6 shadow-neon-emerald">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {isPl ? 'Provisioning' : 'Provisioning'}
                </p>
                <h1 className="text-xl font-semibold">
                  {isPl ? 'Tworzymy Twoją instancję PapaData' : 'We’re creating your PapaData workspace'}
                </h1>
              </div>
            </div>

            <div className="mt-6 h-2 rounded-full bg-slate-900">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all"
                style={{ width: `${logProgress}%` }}
              />
            </div>

            <div className="mt-6 space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-xs text-emerald-200">
              {logEntries.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500">➜</span>
                  <span>{entry}</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              {isPl
                ? 'Gotowe! Przechodzimy do Twojego pulpitu.'
                : 'All set! Redirecting you to your dashboard.'}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isPl ? 'Onboarding' : 'Onboarding'}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {isPl
              ? 'Zapisz konfigurację, aby wrócić do niej później – zapamiętamy ją w tej sesji.'
              : 'You can come back to this setup later – we keep it in this session.'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 shadow-lg">
          <div className="border-b border-slate-800 px-4 py-4 md:px-6">
            <div className="flex flex-wrap items-center gap-3">
              {wizardSteps.map((step, idx) => {
                const isActive = idx === stepIndex;
                const isDone = idx < stepIndex;
                const label =
                  step === 'company'
                    ? isPl
                      ? 'Dane firmy'
                      : 'Company details'
                    : step === 'integrations'
                    ? isPl
                      ? 'Integracje'
                      : 'Integrations'
                    : step === 'keys'
                    ? isPl
                      ? 'Klucze i dostęp'
                      : 'Keys & access'
                    : isPl
                    ? 'Podsumowanie'
                    : 'Summary & launch';

                return (
                  <div key={step} className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                        isDone
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                          : isActive
                          ? 'border-emerald-500/60 bg-slate-900 text-emerald-100'
                          : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </span>
                    <span className={isActive ? 'text-slate-50 font-semibold' : 'text-slate-400'}>
                      {label}
                    </span>
                    {idx < wizardSteps.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-4 py-6 md:px-6 md:py-8">
            {currentStep === 'company' && (
              <CompanyStep
                company={company}
                setCompany={setCompany}
                onNipBlur={handleNipBlur}
                wizardCopy={wizardCopy}
                setPolicyModal={setPolicyModal}
                isPl={isPl}
                t={t}
              />
            )}

            {currentStep === 'integrations' && (
              <IntegrationsStep
                isPl={isPl}
                t={t}
                integrationGroupLabels={integrationGroupLabels}
                integrationDefinitions={integrationDefinitions}
                selectedIntegrations={selectedIntegrations}
                toggleIntegration={toggleIntegration}
                wizardCopy={wizardCopy}
                prefillSources={prefillSources}
              />
            )}

            {currentStep === 'keys' && (
              <KeysStep
                isPl={isPl}
                t={t}
                wizardCopy={wizardCopy}
                selectedOAuthIntegrations={selectedOAuthIntegrations}
                oauthConnections={oauthConnections}
                handleOauthAction={handleOauthAction}
                selectedApiIntegrations={selectedApiIntegrations}
                apiConnections={apiConnections}
                apiIntegrationFields={apiIntegrationFields}
                handleApiChange={handleApiChange}
                handleApiTest={handleApiTest}
              />
            )}

            {currentStep === 'summary' && (
              <SummaryStep
                isPl={isPl}
                wizardCopy={wizardCopy}
                company={company}
                t={t}
                selectedIntegrations={selectedIntegrations}
                oauthConnections={oauthConnections}
                apiConnections={apiConnections}
                summaryChecks={summaryChecks}
                setSummaryChecks={setSummaryChecks}
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-800 px-4 py-4 md:px-6">
            <div className="text-[11px] text-slate-500">
              {currentStep === 'keys' && isPl
                ? 'Najpierw podłącz kluczowe źródła – resztę możesz dodać później.'
                : currentStep === 'keys' && !isPl
                ? 'Connect the critical sources first – you can add more later.'
                : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={stepIndex === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                {wizardCopy.back}
              </button>

              {currentStep !== 'summary' && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {wizardCopy.next}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {currentStep === 'summary' && (
                <button
                  type="button"
                  disabled={!canProceed}
                  onClick={() => setPhase('provisioning')}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-neon-emerald transition hover:from-emerald-400 hover:to-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <BadgeCheck className="h-4 w-4" />
                  {wizardCopy.activateCta}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {policyModal && (
        <PolicyModal isPl={isPl} type={policyModal} onClose={() => setPolicyModal(null)} />
      )}
    </main>
  );
}

// Komponenty szczegółowe znajdują się poniżej.

function CompanyStep({
  company,
  setCompany,
  onNipBlur,
  wizardCopy,
  setPolicyModal,
  isPl,
  t,
}: {
  company: any;
  setCompany: React.Dispatch<React.SetStateAction<any>>;
  onNipBlur: () => void;
  wizardCopy: Record<string, string | string[]>;
  setPolicyModal: (value: 'terms' | 'privacy' | 'dpa' | null) => void;
  isPl: boolean;
  t: ReturnType<typeof useI18n>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_minmax(0,0.9fr)]">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{wizardCopy.companyTitle as string}</h2>
          <p className="mt-1 text-sm text-slate-300">{wizardCopy.companyLead as string}</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <label className="text-sm font-medium text-slate-100">
            {isPl ? 'NIP firmy / Company tax ID' : 'Company tax ID (NIP)'}
          </label>
          <input
            value={company.nip}
            onChange={(e) => setCompany((prev: any) => ({ ...prev, nip: e.target.value }))}
            onBlur={onNipBlur}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder={isPl ? 'Wpisz NIP bez spacji i kresek' : 'Enter tax ID without spaces'}
          />
          {company.nipStatus !== 'idle' && (
            <p
              className={`text-xs ${
                company.nipStatus === 'ok'
                  ? 'text-emerald-300'
                  : company.nipStatus === 'checking'
                  ? 'text-slate-300'
                  : 'text-amber-300'
              }`}
            >
              {company.nipStatus === 'checking' && <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />}
              {company.nipMessage}
            </p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label={isPl ? 'Nazwa firmy' : 'Company name'}
            value={company.name}
            onChange={(v: string) => setCompany((prev: any) => ({ ...prev, name: v }))}
            placeholder={isPl ? 'np. Moja Firma sp. z o.o.' : 'e.g. My Company LLC'}
          />
          <Field
            label={isPl ? 'Branża / Industry' : 'Industry'}
            value={company.industry}
            onChange={(v: string) => setCompany((prev: any) => ({ ...prev, industry: v }))}
            as="select"
            options={[
              { value: 'ecommerce', label: isPl ? 'E-commerce (sklep internetowy)' : 'E-commerce (online store)' },
              { value: 'omnichannel', label: 'Omnichannel' },
              { value: 'b2b', label: 'B2B' },
            ]}
          />
        </div>

        <Field
          label={isPl ? 'Adres firmy' : 'Company address'}
          value={company.address}
          onChange={(v: string) => setCompany((prev: any) => ({ ...prev, address: v }))}
          placeholder={isPl ? 'ulica, kod, miasto, kraj' : 'street, postal code, city, country'}
          as="textarea"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label={wizardCopy.currencyLabel as string}
            value={company.currency}
            onChange={(v: string) => setCompany((prev: any) => ({ ...prev, currency: v }))}
            as="select"
            options={[
              { value: 'PLN', label: 'PLN' },
              { value: 'EUR', label: 'EUR' },
              { value: 'USD', label: 'USD' },
            ]}
          />
          <Field
            label={wizardCopy.timezoneLabel as string}
            value={company.timezone}
            onChange={(v: string) => setCompany((prev: any) => ({ ...prev, timezone: v }))}
            as="select"
            options={[
              { value: 'Europe/Warsaw', label: 'Europe/Warsaw' },
              { value: 'Europe/London', label: 'Europe/London' },
              { value: 'UTC', label: 'UTC' },
            ]}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label={wizardCopy.contactLabel as string}
            value={company.contactEmail}
            onChange={(v: string) => setCompany((prev: any) => ({ ...prev, contactEmail: v }))}
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4 text-slate-500" />}
            helper={wizardCopy.contactHint as string}
          />
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={company.notify}
                onChange={(e) =>
                  setCompany((prev: any) => ({ ...prev, notify: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <span>
                {isPl
                  ? 'Chcę otrzymywać powiadomienia o stanie integracji i okresie próbnym.'
                  : 'I want to receive notifications about integration status and trial period.'}
              </span>
            </label>
            <label className="inline-flex items-center gap-2 text-slate-400">
              <input
                type="checkbox"
                checked={company.marketing}
                onChange={(e) =>
                  setCompany((prev: any) => ({ ...prev, marketing: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <span>{isPl ? 'Zgoda marketingowa (opcjonalnie)' : 'Marketing updates (optional)'}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-300" />
          <p className="text-sm font-semibold text-slate-50">
            {wizardCopy.securityTitle as string}
          </p>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          {(wizardCopy.securityBullets as string[]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 text-xs text-emerald-300">
          <button
            type="button"
            onClick={() => setPolicyModal('privacy')}
            className="underline decoration-emerald-500/60 underline-offset-4 hover:text-emerald-200"
          >
            {t('landing.header.nav.resources.label')}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setPolicyModal('terms')}
            className="underline decoration-emerald-500/60 underline-offset-4 hover:text-emerald-200"
          >
            {isPl ? 'Regulamin' : 'Terms'}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setPolicyModal('dpa')}
            className="underline decoration-emerald-500/60 underline-offset-4 hover:text-emerald-200"
          >
            {isPl ? 'Polityka przetwarzania danych' : 'Data Processing Policy'}
          </button>
        </div>

        <label className="mt-2 inline-flex items-start gap-2 rounded-xl bg-slate-950/70 p-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={company.acceptPolicies}
            onChange={(e) =>
              setCompany((prev: any) => ({ ...prev, acceptPolicies: e.target.checked }))
            }
            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
          />
          <span>{wizardCopy.acceptLabel as string}</span>
        </label>
      </div>
    </div>
  );
}

function IntegrationsStep({
  isPl,
  t,
  integrationGroupLabels,
  integrationDefinitions,
  selectedIntegrations,
  toggleIntegration,
  wizardCopy,
  prefillSources,
}: any) {
  const grouped = {
    store: integrationDefinitions.filter((i: any) => i.group === 'store'),
    marketplace: integrationDefinitions.filter((i: any) => i.group === 'marketplace'),
    ads: integrationDefinitions.filter((i: any) => i.group === 'ads'),
    analytics: integrationDefinitions.filter((i: any) => i.group === 'analytics'),
    tool: integrationDefinitions.filter((i: any) => i.group === 'tool'),
  };

  const renderGroup = (title: string, items: any[]) => {
    if (!items.length) return null;
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => {
            const selected = selectedIntegrations.has(item.id);
            const disabled = item.status === 'comingSoon';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleIntegration(item.id)}
                className={`relative flex h-full flex-col gap-2 rounded-2xl border p-4 text-left transition hover:border-emerald-500/60 hover:bg-slate-900 ${
                  selected
                    ? 'border-emerald-500/70 bg-slate-900/70 shadow-neon-emerald'
                    : 'border-slate-800 bg-slate-950/70'
                } ${disabled ? 'opacity-60' : ''}`}
                disabled={disabled}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                      {item.id.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{t(`landing.integrations.items.${item.id}.name` as any)}</span>
                  </div>
                  <span
                    className={`text-[11px] ${
                      item.status === 'available' ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {item.status === 'available'
                      ? isPl
                        ? 'Dostępne'
                        : 'Available'
                      : isPl
                      ? 'Wkrótce'
                      : 'Coming soon'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{item.description[isPl ? 'pl' : 'en']}</p>
                {selected && (
                  <span className="absolute right-3 top-3 text-emerald-300">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{wizardCopy.integrationsTitle as string}</h2>
        <p className="text-sm text-slate-300">{wizardCopy.integrationsLead as string}</p>
      </div>

      {prefillSources.length > 0 && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-100">
          {isPl ? 'Na podstawie konfiguracji z Cennika zaznaczyliśmy: ' : 'Pre-selected from Pricing: '}
          {prefillSources.join(', ')}. {isPl ? 'Możesz to zmienić.' : 'You can adjust this.'}
        </div>
      )}

      <div className="space-y-4">
        {renderGroup(integrationGroupLabels.stores, grouped.store)}
        {renderGroup(integrationGroupLabels.marketplace, grouped.marketplace)}
        {renderGroup(integrationGroupLabels.ads, grouped.ads)}
        {renderGroup(integrationGroupLabels.analytics, grouped.analytics)}
        {renderGroup(integrationGroupLabels.tools, grouped.tool)}
      </div>

      <p className="text-xs text-slate-400">{wizardCopy.integrationsInfo as string}</p>
    </div>
  );
}

function KeysStep({
  isPl,
  t,
  wizardCopy,
  selectedOAuthIntegrations,
  oauthConnections,
  handleOauthAction,
  selectedApiIntegrations,
  apiConnections,
  apiIntegrationFields,
  handleApiChange,
  handleApiTest,
}: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{wizardCopy.keysTitle as string}</h2>
        <p className="text-sm text-slate-300">{wizardCopy.keysLead as string}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold text-slate-100">
              {isPl ? 'Logowanie przez dostawcę (OAuth)' : 'Login via provider (OAuth)'}
            </p>
          </div>

          {selectedOAuthIntegrations.length === 0 && (
            <p className="text-xs text-slate-400">
              {isPl
                ? 'Wybierz integracje reklamowe w poprzednim kroku, aby je podłączyć.'
                : 'Pick ad integrations in the previous step to connect them here.'}
            </p>
          )}

          <div className="space-y-3">
            {selectedOAuthIntegrations.map((id: OAuthIntegrationId) => {
              const status = oauthConnections[id];
              const name = t(`landing.integrations.items.${id}.name` as any);
              const connectLabel =
                id === 'googleAds'
                  ? isPl
                    ? 'Zaloguj przez Google'
                    : 'Sign in with Google'
                  : id === 'metaAds'
                  ? isPl
                    ? 'Zaloguj przez Meta'
                    : 'Sign in with Meta'
                  : isPl
                  ? 'Połącz konto'
                  : 'Connect account';

              return (
                <div
                  key={id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-emerald-300" />
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-[11px] text-slate-400">
                          {id === 'ga4'
                            ? isPl
                              ? 'Lejek, zdarzenia e-commerce'
                              : 'Funnels, e-commerce events'
                            : isPl
                            ? 'Kampanie, koszty, konwersje'
                            : 'Campaigns, costs, conversions'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOauthAction(id, 'connect')}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-slate-950 shadow-sm hover:bg-emerald-400"
                      >
                        {status === 'connecting' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          connectLabel
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOauthAction(id, 'test')}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-500"
                      >
                        {status === 'testing' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isPl ? (
                          'Testuj połączenie'
                        ) : (
                          'Test connection'
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-emerald-300">
                    {status === 'connected'
                      ? isPl
                        ? 'Połączono – token zapisany w zaszyfrowanym magazynie.'
                        : 'Connected – token stored in encrypted vault.'
                      : status === 'ok'
                      ? isPl
                        ? 'Połączenie działa. Możemy pobrać dane historyczne.'
                        : 'Connection works. We can fetch historical data.'
                      : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold text-slate-100">
              {isPl ? 'Klucze API i adresy' : 'API keys and URLs'}
            </p>
          </div>

          {selectedApiIntegrations.length === 0 && (
            <p className="text-xs text-slate-400">
              {isPl
                ? 'Wybierz przynajmniej jedną integrację sklepową, aby dodać klucze.'
                : 'Pick at least one store integration to add keys.'}
            </p>
          )}

          <div className="space-y-4">
            {selectedApiIntegrations.map((id: ApiIntegrationId) => {
              const name = t(`landing.integrations.items.${id}.name` as any);
              const conn = apiConnections[id];
              const fields = apiIntegrationFields[id] || [];

              return (
                <div
                  key={id}
                  className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-300" />
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-[11px] text-slate-400">
                          {isPl
                            ? 'Klucze są szyfrowane i przechowywane w projekcie GCP.'
                            : 'Keys are encrypted and stored in your GCP project.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApiTest(id, name)}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-500"
                    >
                      {conn.status === 'testing' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPl ? (
                        'Testuj połączenie'
                      ) : (
                        'Test connection'
                      )}
                    </button>
                  </div>

                  <div className="grid gap-2">
                    {fields.map((field: any) => (
                      <div key={field.labelEn} className="space-y-1">
                        <label className="text-xs text-slate-300">
                          {isPl ? field.labelPl : field.labelEn}
                        </label>
                        <input
                          value={(conn as any)[field.key] || ''}
                          onChange={(e) => handleApiChange(id, field.key, e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[13px] text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  {conn.message && (
                    <p
                      className={`text-[11px] ${
                        conn.status === 'ok' ? 'text-emerald-300' : 'text-amber-300'
                      }`}
                    >
                      {conn.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-300">
            <p className="font-semibold text-slate-100">
              {isPl ? 'Jak przetwarzamy Twoje klucze' : 'How we process your keys'}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>{isPl ? 'Szyfrowanie (AES-256) przed zapisaniem.' : 'Encrypted (AES-256) before saving.'}</li>
              <li>
                {isPl
                  ? 'Przechowywanie w Google Secret Manager w projekcie dedykowanym Twojej firmie.'
                  : 'Stored in Google Secret Manager inside your dedicated project.'}
              </li>
              <li>
                {isPl
                  ? 'Używane wyłącznie do pobierania danych do Twojego datasetu.'
                  : 'Used only to pull data into your dataset.'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryStep({
  isPl,
  wizardCopy,
  company,
  t,
  selectedIntegrations,
  oauthConnections,
  apiConnections,
  summaryChecks,
  setSummaryChecks,
}: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{wizardCopy.summaryTitle as string}</h2>
        <p className="text-sm text-slate-300">{wizardCopy.summaryLead as string}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {isPl ? 'Dane firmy' : 'Company data'}
          </p>
          <SummaryRow label="NIP" value={company.nip} />
          <SummaryRow label={isPl ? 'Nazwa' : 'Name'} value={company.name} />
          <SummaryRow label={isPl ? 'Adres' : 'Address'} value={company.address} />
          <SummaryRow label={isPl ? 'Waluta' : 'Currency'} value={company.currency} />
          <SummaryRow label={isPl ? 'Strefa czasowa' : 'Time zone'} value={company.timezone} />
          <SummaryRow label={isPl ? 'Kontakt' : 'Contact'} value={company.contactEmail} />
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {isPl ? 'Wybrane integracje' : 'Selected integrations'}
          </p>
          {Array.from<string>(selectedIntegrations).map((id) => {
            const name = t(`landing.integrations.items.${id}.name` as any);
            const apiState = (apiConnections as Record<string, ApiConnection>)[id];
            const oauthState = (oauthConnections as Record<string, ConnectionStatus>)[id];
            const ok = apiState?.status === 'ok' || oauthState === 'connected' || oauthState === 'ok';
            return (
              <div key={id} className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{name}</p>
                  <p className="text-[11px] text-slate-400">
                    {ok
                      ? isPl
                        ? 'Klucze / dostęp OK'
                        : 'Keys / access OK'
                      : isPl
                      ? 'Brak połączenia – przetestuj integrację'
                      : 'No connection yet – please test the integration'}
                  </p>
                </div>
                {ok ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-300" />
                )}
              </div>
            );
          })}

          {selectedIntegrations.size === 0 && (
            <p className="text-xs text-slate-400">
              {isPl ? 'Brak integracji do podsumowania.' : 'No integrations selected.'}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {isPl ? 'Przed startem' : 'Before launch'}
        </p>
        <label className="flex items-start gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={summaryChecks.ownership}
            onChange={(e) => setSummaryChecks((prev: any) => ({ ...prev, ownership: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
          />
          <span>
            {isPl
              ? 'Potwierdzam, że mam prawo technicznie zarządzać tymi kontami (sklep, kampanie).'
              : 'I confirm I am allowed to manage these accounts (store, campaigns).'}
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={summaryChecks.gcp}
            onChange={(e) => setSummaryChecks((prev: any) => ({ ...prev, gcp: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
          />
          <span>
            {isPl
              ? 'Rozumiem, że PapaData utworzy osobny projekt i hurtownię danych w Google Cloud w moim imieniu.'
              : 'I understand PapaData will create a separate Google Cloud project and warehouse for me.'}
          </span>
        </label>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  as = 'input',
  options,
  helper,
  icon,
}: any) {
  if (as === 'select') {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-100">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {(options || []).map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (as === 'textarea') {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-100">{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-100">{label}</label>
      <div className="relative">
        {icon && <div className="pointer-events-none absolute left-3 top-2.5">{icon}</div>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
            icon ? 'pl-9' : ''
          }`}
          placeholder={placeholder}
        />
      </div>
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-50">{value || '—'}</span>
    </div>
  );
}

function PolicyModal({
  isPl,
  type,
  onClose,
}: {
  isPl: boolean;
  type: 'terms' | 'privacy' | 'dpa';
  onClose: () => void;
}) {
  const title =
    type === 'terms'
      ? isPl
        ? 'Regulamin (wersja skrócona)'
        : 'Terms of Service (summary)'
      : type === 'privacy'
      ? isPl
        ? 'Polityka Prywatności (wersja skrócona)'
        : 'Privacy Policy (summary)'
      : isPl
      ? 'Polityka przetwarzania danych (DPA)'
      : 'Data Processing Policy (DPA)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-800 p-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-200"
          >
            <Circle className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <p>
            {isPl
              ? 'Tu wkleimy pełną treść dokumentu. Wersja skrócona: Twoje dane są szyfrowane, separowane per klient i przetwarzane w regionie UE.'
              : 'Full legal text will be placed here. Short version: your data is encrypted, isolated per tenant and processed in the EU region.'}
          </p>
          <p>
            {isPl
              ? 'Kliknięcie na Zamknij nie przerwie konfiguracji.'
              : 'Closing this modal will not interrupt your configuration.'}
          </p>
        </div>
      </div>
    </div>
  );
}
