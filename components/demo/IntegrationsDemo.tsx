// components/demo/IntegrationsDemo.tsx
import React from 'react';
import {
  PlugZap,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Clock,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Language, IntegrationHealthMap } from '../../types';

interface Props {
  /** Teksty z tłumaczeń – nie używamy bezpośrednio, ale zostawiamy dla zgodności z DemoDashboard */
  t: unknown;
  /** Mapowanie id integracji -> stan zdrowia (zapisany po wizzardzie) */
  integrationHealth: IntegrationHealthMap;
  /** Callback z DemoDashboard – “naprawia” integrację (ustawia na healthy) */
  onReconnect: (id: string) => void;
  /** Aktualny język (PL/EN) */
  lang: Language;
  /** Czy tryb demo (nie zapisujemy prawdziwych zmian) */
  isDemo?: boolean;
}

type IntegrationGroup = 'store' | 'ads' | 'analytics' | 'marketplace' | 'tool';

type IntegrationMeta = {
  id: string;
  code: string;
  namePL: string;
  nameEN: string;
  group: IntegrationGroup;
};

const cardBase =
  'rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_18px_45px_rgba(15,23,42,0.85)]';

const INTEGRATIONS: IntegrationMeta[] = [
  {
    id: 'woocommerce',
    code: 'Woo',
    namePL: 'WooCommerce',
    nameEN: 'WooCommerce',
    group: 'store',
  },
  {
    id: 'shopify',
    code: 'Shp',
    namePL: 'Shopify',
    nameEN: 'Shopify',
    group: 'store',
  },
  {
    id: 'idosell',
    code: 'Ido',
    namePL: 'IdoSell',
    nameEN: 'IdoSell',
    group: 'store',
  },
  {
    id: 'allegro',
    code: 'All',
    namePL: 'Allegro',
    nameEN: 'Allegro',
    group: 'marketplace',
  },
  {
    id: 'baselinker',
    code: 'BL',
    namePL: 'BaseLinker',
    nameEN: 'BaseLinker',
    group: 'tool',
  },
  {
    id: 'google_ads',
    code: 'GAds',
    namePL: 'Google Ads',
    nameEN: 'Google Ads',
    group: 'ads',
  },
  {
    id: 'meta_ads',
    code: 'Meta',
    namePL: 'Meta Ads',
    nameEN: 'Meta Ads',
    group: 'ads',
  },
  {
    id: 'tiktok_ads',
    code: 'TT',
    namePL: 'TikTok Ads',
    nameEN: 'TikTok Ads',
    group: 'ads',
  },
  {
    id: 'ga4',
    code: 'GA4',
    namePL: 'Google Analytics 4',
    nameEN: 'Google Analytics 4',
    group: 'analytics',
  },
];

const IntegrationsDemo: React.FC<Props> = ({
  integrationHealth,
  onReconnect,
  lang,
  isDemo = true,
}) => {
  const isPL = lang === 'PL';

  const withState = INTEGRATIONS.map((meta) => {
    const health = integrationHealth[meta.id];
    const state = (health?.state as string | undefined) ?? 'pending';
    return { meta, health, state };
  });

  const healthyCount = withState.filter((i) => i.state === 'healthy').length;
  const errorCount = withState.filter((i) => i.state === 'error').length;
  const reauthCount = withState.filter((i) => i.state === 'needs_reauth').length;
  const pendingCount = withState.filter(
    (i) => !['healthy', 'error', 'needs_reauth'].includes(i.state),
  ).length;

  const labelGroup = (group: IntegrationGroup) => {
    if (isPL) {
      switch (group) {
        case 'store':
          return 'Sklep';
        case 'ads':
          return 'Reklamy';
        case 'analytics':
          return 'Analityka';
        case 'marketplace':
          return 'Marketplace';
        case 'tool':
          return 'Narzędzie';
      }
    } else {
      switch (group) {
        case 'store':
          return 'Store';
        case 'ads':
          return 'Ads';
        case 'analytics':
          return 'Analytics';
        case 'marketplace':
          return 'Marketplace';
        case 'tool':
          return 'Tool';
      }
    }
  };

  const statusChip = (state: string) => {
    if (state === 'healthy') {
      return {
        label: isPL ? 'Połączono' : 'Connected',
        cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
        dot: 'bg-emerald-400',
      };
    }
    if (state === 'needs_reauth') {
      return {
        label: isPL ? 'Wymaga ponownego logowania' : 'Needs re-auth',
        cls: 'bg-amber-500/10 text-amber-200 border-amber-500/40',
        dot: 'bg-amber-400',
      };
    }
    if (state === 'error') {
      return {
        label: isPL ? 'Błąd połączenia' : 'Connection error',
        cls: 'bg-rose-500/10 text-rose-200 border-rose-500/50',
        dot: 'bg-rose-400',
      };
    }
    return {
      label: isPL ? 'Nie skonfigurowano' : 'Not configured',
      cls: 'bg-slate-900 text-slate-300 border-slate-700',
      dot: 'bg-slate-500',
    };
  };

  const headerTitle = isPL ? 'Integracje i źródła danych' : 'Integrations & data sources';
  const headerSubtitle = isPL
    ? 'Zobacz, które systemy są podłączone, a które wymagają uwagi. W trybie demo pokazujemy przykładowy stan integracji.'
    : 'See which systems are connected and which require attention. In demo we show an example state.';

  const demoBadge = isDemo
    ? isPL
      ? 'Tryb demo – zmiany nie są zapisywane'
      : 'Demo mode – changes are not persisted'
    : isPL
      ? 'Środowisko klienta – pracujesz na realnych danych'
      : 'Client workspace – you work on real data';

  const reconnectLabel = isPL ? 'Odśwież połączenie' : 'Reconnect';
  const fixLabel = isPL ? 'Spróbuj ponownie' : 'Retry';
  const etlTitle = isPL ? 'Harmonogram pobierania danych' : 'Data loading schedule';
  const etlText = isPL
    ? 'Standardowo synchronizujemy dane kilka razy dziennie. Integracje sklep + reklamy są priorytetowe.'
    : 'By default we sync data a few times a day. Store + ads integrations have priority.';
  const etlBullets = isPL
    ? [
        '06:00 – pełne odświeżenie danych za ostatnie 3 dni',
        '12:00 – dogranie nowych zamówień i kosztów kampanii',
        '18:00 – aktualizacja raportów Live przed końcem dnia',
      ]
    : [
        '06:00 – full refresh of last 3 days',
        '12:00 – mid-day sync of orders and ad spend',
        '18:00 – Live Reports refresh before end of day',
      ];

  const premiumTitle = isPL
    ? 'Zaawansowana konfiguracja po 14 dniach'
    : 'Advanced configuration after 14 days';
  const premiumText = isPL
    ? 'Indywidualne ustawienia częstotliwości ETL, dodatkowe źródła oraz własne transformacje danych udostępniamy po zakończeniu triala i przedłużeniu współpracy.'
    : 'Custom ETL frequency, extra sources and custom transformations are available after trial when you extend the cooperation.';

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-6 md:px-6 md:py-8 text-slate-50">
      {/* Nagłówek sekcji */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-slate-900/80 px-3 py-1 text-xs font-medium text-primary-300 mb-3">
            <PlugZap className="h-4 w-4" />
            <span>{isPL ? 'Integracje danych' : 'Data integrations'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 tracking-tight mb-2">
            {headerTitle}
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">{headerSubtitle}</p>
        </div>

        <div className={`${cardBase} px-4 py-3 flex items-center gap-3 max-w-xs w-full`}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700">
            <Cloud className="h-4 w-4 text-primary-300" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400">
              {isPL ? 'Status środowiska' : 'Workspace status'}
            </p>
            <p className="text-[11px] font-medium text-slate-100">{demoBadge}</p>
          </div>
        </div>
      </div>

      {/* Główna siatka */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Kolumna 1 – podsumowanie stanu */}
        <div className="space-y-4 lg:col-span-1">
          {/* Podsumowanie liczbowe */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary-300" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                {isPL ? 'Stan integracji' : 'Integrations health'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-950/70 border border-emerald-500/40 px-3 py-2.5 flex flex-col gap-1">
                <span className="text-slate-400">
                  {isPL ? 'Połączone' : 'Connected'}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-emerald-300">
                    {healthyCount}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    / {INTEGRATIONS.length}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/70 border border-amber-500/40 px-3 py-2.5 flex flex-col gap-1">
                <span className="text-slate-400">
                  {isPL ? 'Wymagają uwagi' : 'Need attention'}
                </span>
                <div className="flex items-baseline gap-2 text-[11px] text-slate-300">
                  <span>
                    {isPL ? 'Re-auth:' : 'Re-auth:'} {reauthCount}
                  </span>
                  <span>
                    {isPL ? 'Błędy:' : 'Errors:'} {errorCount}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2.5 flex flex-col gap-1">
                <span className="text-slate-400">
                  {isPL ? 'Jeszcze nie podłączone' : 'Not connected yet'}
                </span>
                <span className="text-lg font-semibold text-slate-100">
                  {pendingCount}
                </span>
              </div>

              <div className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2.5 flex flex-col gap-1">
                <span className="text-slate-400">
                  {isPL ? 'Główne źródła' : 'Core sources'}
                </span>
                <span className="text-xs text-slate-300">
                  {isPL
                    ? 'Min. 1 sklep + 1 źródło reklamowe – to baza raportów.'
                    : 'At least 1 store + 1 ads source – base for reports.'}
                </span>
              </div>
            </div>
          </div>

          {/* Informacja o bezpieczeństwie */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {isPL ? 'Gdzie lądują dane?' : 'Where does the data go?'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {isPL
                ? 'Dane z integracji trafiają do hurtowni w Google BigQuery (region europe-central2), a następnie do raportów i Analityka AI.'
                : 'Data from integrations is stored in Google BigQuery (region europe-central2) and then used in reports and the AI analyst.'}
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1">
              <li>• {isPL ? 'Szyfrowanie po stronie Google Cloud.' : 'Encryption handled by Google Cloud.'}</li>
              <li>
                •{' '}
                {isPL
                  ? 'Oddzielne środowiska dla klientów – brak mieszania danych.'
                  : 'Separate workspaces per client – no data mixing.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Kolumna 2 – lista integracji */}
        <div className="lg:col-span-1">
          <div className={`${cardBase} p-5 h-full flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PlugZap className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {isPL ? 'Podłączone systemy' : 'Connected systems'}
                </h2>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {withState.map(({ meta, health, state }) => {
                const chip = statusChip(state);
                const displayName = isPL ? meta.namePL : meta.nameEN;
                const groupLabel = labelGroup(meta.group);

                const hasIssue = state === 'error' || state === 'needs_reauth';

                return (
                  <div
                    key={meta.id}
                    className={`rounded-xl border px-3.5 py-3 text-xs transition-colors ${
                      hasIssue
                        ? state === 'error'
                          ? 'border-rose-500/60 bg-rose-950/40'
                          : 'border-amber-500/60 bg-amber-950/30'
                        : state === 'healthy'
                          ? 'border-emerald-500/40 bg-slate-950/70'
                          : 'border-slate-800 bg-slate-950/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700 text-[11px] font-semibold text-primary-200">
                          {meta.code}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-50">
                              {displayName}
                            </p>
                            <span className="text-[10px] uppercase tracking-wide text-slate-500">
                              {groupLabel}
                            </span>
                          </div>
                          {health?.message && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {health.message}
                            </p>
                          )}
                          {!health?.message && state === 'healthy' && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {isPL
                                ? 'Dane spływają poprawnie – widoczne w raportach.'
                                : 'Data flows correctly – visible in reports.'}
                            </p>
                          )}
                          {!health && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {isPL
                                ? 'Nie skonfigurowano jeszcze połączenia.'
                                : 'Connection not configured yet.'}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${chip.cls}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${chip.dot}`}
                        />
                        {chip.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-2">
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>
                          {isPL ? 'Ostatnia aktualizacja:' : 'Last updated:'}{' '}
                          {health?.updatedAt
                            ? health.updatedAt
                            : isPL
                              ? 'jeszcze brak synchronizacji'
                              : 'no sync yet'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {(state === 'needs_reauth' || state === 'error') && (
                          <button
                            type="button"
                            onClick={() => onReconnect(meta.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-primary-500/70 bg-primary-500/10 px-2.5 py-1 text-[11px] font-medium text-primary-100 hover:bg-primary-500/20"
                          >
                            {state === 'error' ? fixLabel : reconnectLabel}
                            <RefreshCw className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-amber-300" />
              <span>
                {isPL
                  ? 'Zmiany w integracjach wpływają na raporty po kolejnym przebiegu ETL.'
                  : 'Changes to integrations affect reports after the next ETL run.'}
              </span>
            </div>
          </div>
        </div>

        {/* Kolumna 3 – ETL + 14 dni */}
        <div className="space-y-4 lg:col-span-1">
          {/* Harmonogram ETL */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">{etlTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">{etlText}</p>
            <ul className="text-[11px] text-slate-400 space-y-1.5 mb-3">
              {etlBullets.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-4 rounded-full bg-slate-600" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-[11px] text-slate-400 flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 mt-0.5" />
              <span>
                {isPL
                  ? 'Krytyczne błędy integracji (brak danych) oznaczamy w pulpicie i Raportach Live.'
                  : 'Critical integration errors (no data) are surfaced in the dashboard and Live Reports.'}
              </span>
            </div>
          </div>

          {/* Zaawansowana konfiguracja po 14 dniach */}
          <div className={`${cardBase} p-5 border-dashed border-primary-500/60 bg-slate-950/80`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-primary-500/60">
                <Database className="h-4 w-4 text-primary-300" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-50">
                  {premiumTitle}
                </h3>
                <p className="text-xs text-slate-400">{premiumText}</p>
                <button
                  type="button"
                  className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-300 hover:text-primary-200"
                >
                  {isPL ? 'Porozmawiaj z nami o konfiguracji' : 'Talk with us about setup'}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Mały hint o kolejności integracji */}
          <div className={`${cardBase} p-4`}>
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
              <p className="text-xs font-semibold text-slate-100">
                {isPL ? 'Najpierw sklep, potem reklamy' : 'Store first, then ads'}
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              {isPL
                ? 'Raporty marży i ROAS działają najlepiej, gdy połączysz najpierw sklep (sprzedaż), a chwilę później źródła reklamowe.'
                : 'Margin and ROAS reports work best when you connect the store (sales) first, then ad sources.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsDemo;
