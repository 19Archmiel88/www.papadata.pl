'use client';

import React, { useMemo, useState } from 'react';
import { X, Search } from 'lucide-react';
import { useI18n } from '@papadata/i18n';

type IntegrationStatus = 'available' | 'coming' | 'voting';
type IntegrationCategory =
  | 'all'
  | 'marketing'
  | 'store'
  | 'marketplace'
  | 'analytics'
  | 'crm'
  | 'tools'
  | 'payment'
  | 'logistics'
  | 'accounting';

type IntegrationRow = {
  id: string;
  code: string;
  namePl: string;
  nameEn: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  votes?: number;
};

const INTEGRATIONS: IntegrationRow[] = [
  { id: 'googleAds', code: 'GO', namePl: 'Google Ads', nameEn: 'Google Ads', category: 'marketing', status: 'available' },
  { id: 'metaAds', code: 'ME', namePl: 'Meta Ads', nameEn: 'Meta Ads', category: 'marketing', status: 'available' },
  { id: 'tiktokAds', code: 'TI', namePl: 'TikTok Ads', nameEn: 'TikTok Ads', category: 'marketing', status: 'coming' },
  { id: 'microsoftAds', code: 'MI', namePl: 'Microsoft Ads', nameEn: 'Microsoft Ads', category: 'marketing', status: 'voting', votes: 23 },
  { id: 'pinterestAds', code: 'PI', namePl: 'Pinterest Ads', nameEn: 'Pinterest Ads', category: 'marketing', status: 'voting', votes: 19 },
  { id: 'linkedinAds', code: 'LI', namePl: 'LinkedIn Ads', nameEn: 'LinkedIn Ads', category: 'marketing', status: 'voting', votes: 17 },
  { id: 'klaviyo', code: 'KL', namePl: 'Klaviyo', nameEn: 'Klaviyo', category: 'marketing', status: 'coming' },
  { id: 'woocommerce', code: 'WO', namePl: 'WooCommerce', nameEn: 'WooCommerce', category: 'store', status: 'available' },
  { id: 'shopify', code: 'SH', namePl: 'Shopify', nameEn: 'Shopify', category: 'store', status: 'available' },
  { id: 'idosell', code: 'ID', namePl: 'IdoSell', nameEn: 'IdoSell', category: 'store', status: 'coming', votes: 14 },
  { id: 'skyshop', code: 'SK', namePl: 'Sky-Shop', nameEn: 'Sky-Shop', category: 'store', status: 'coming', votes: 11 },
  { id: 'allegro', code: 'AL', namePl: 'Allegro', nameEn: 'Allegro', category: 'marketplace', status: 'available' },
  { id: 'kaufland', code: 'KA', namePl: 'Kaufland', nameEn: 'Kaufland', category: 'marketplace', status: 'voting', votes: 9 },
  { id: 'empik', code: 'EM', namePl: 'Empik Place', nameEn: 'Empik Place', category: 'marketplace', status: 'coming' },
  { id: 'ga4', code: 'GA', namePl: 'Google Analytics 4', nameEn: 'Google Analytics 4', category: 'analytics', status: 'available' },
  { id: 'baselinker', code: 'BA', namePl: 'BaseLinker', nameEn: 'BaseLinker', category: 'tools', status: 'available' },
  { id: 'hubspot', code: 'HU', namePl: 'HubSpot', nameEn: 'HubSpot', category: 'crm', status: 'available' },
  { id: 'salesforce', code: 'SA', namePl: 'Salesforce', nameEn: 'Salesforce', category: 'crm', status: 'voting', votes: 15 },
  { id: 'stripe', code: 'ST', namePl: 'Stripe', nameEn: 'Stripe', category: 'payment', status: 'available' },
  { id: 'przelewy24', code: 'PR', namePl: 'Przelewy24', nameEn: 'Przelewy24', category: 'payment', status: 'available' },
  { id: 'inpost', code: 'IN', namePl: 'InPost', nameEn: 'InPost', category: 'logistics', status: 'available' },
  { id: 'fakturownia', code: 'FA', namePl: 'Fakturownia', nameEn: 'Fakturownia', category: 'accounting', status: 'available' },
  { id: 'googleSheets', code: 'GS', namePl: 'Arkusze Google', nameEn: 'Google Sheets', category: 'tools', status: 'available' },
];

const CATEGORY_FILTERS: { id: IntegrationCategory; labelPl: string; labelEn: string }[] = [
  { id: 'all', labelPl: 'Wszystkie', labelEn: 'All' },
  { id: 'marketing', labelPl: 'Marketing', labelEn: 'Marketing' },
  { id: 'store', labelPl: 'Sklep', labelEn: 'Store' },
  { id: 'marketplace', labelPl: 'Marketplace', labelEn: 'Marketplace' },
  { id: 'analytics', labelPl: 'Analityka', labelEn: 'Analytics' },
  { id: 'crm', labelPl: 'CRM', labelEn: 'CRM' },
  { id: 'tools', labelPl: 'Narzędzia', labelEn: 'Tools' },
  { id: 'payment', labelPl: 'Płatności', labelEn: 'Payment' },
  { id: 'logistics', labelPl: 'Logistyka', labelEn: 'Logistics' },
  { id: 'accounting', labelPl: 'Księgowość', labelEn: 'Accounting' },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function IntegrationsCatalogModal({ open, onClose }: Props) {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<IntegrationCategory>('all');
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.votes || 0])),
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return INTEGRATIONS.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch =
        !term ||
        item.namePl.toLowerCase().includes(term) ||
        item.nameEn.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const handleVote = (id: string) => {
    setVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="card-glass relative w-full max-w-5xl space-y-4 overflow-hidden rounded-2xl border border-brand-border bg-brand-dark p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-border bg-brand-dark/70 text-pd-muted hover:border-brand-accent hover:text-brand-accent"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1 pr-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
            {isPl ? 'Integracje' : 'Integrations'}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            {isPl ? 'Katalog integracji PapaData' : 'PapaData Integrations Catalog'}
          </h2>
          <p className="text-sm text-pd-muted">
            {isPl
              ? 'Połącz PapaData z platformami, których używasz na co dzień. Sklepy, kampanie, marketplace’y, CRM, płatności, logistyka i księgowość – w jednym widoku.'
              : 'Connect PapaData with the platforms you use every day. Stores, ads, marketplaces, CRM, payments, logistics and accounting – in one view.'}
          </p>
          <p className="text-[11px] text-pd-foreground0">
            {isPl
              ? 'Statusy: Dostępne • Wkrótce • Głosowanie (pomóż wybrać kolejne integracje).'
              : 'Statuses: Available • Coming soon • Voting (help us choose next integrations).'}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-brand-border bg-brand-dark/60 px-3 py-2">
            <Search className="h-4 w-4 text-pd-foreground0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isPl ? 'Szukaj integracji...' : 'Search integrations...'}
              className="w-full bg-transparent text-sm text-pd-foreground placeholder:text-pd-foreground0 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCategory(filter.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                  category === filter.id
                    ? 'bg-brand-accent text-pd-bg shadow-neon-cyan'
                    : 'border border-brand-border bg-brand-dark/60 text-pd-muted hover:border-brand-accent/60'
                }`}
              >
                {isPl ? filter.labelPl : filter.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-brand-border bg-brand-dark/60">
          <div className="divide-y divide-brand-border">
            {filtered.map((item) => {
              const isVoting = item.status === 'voting';
              const isComing = item.status === 'coming';
              const voteCount = votes[item.id] || item.votes || 0;
              return (
                <div
                  key={item.id}
                  className="grid items-center gap-3 px-4 py-3 text-sm text-pd-foreground md:grid-cols-[80px_1fr_140px_160px]"
                >
                  <div className="flex items-center justify-center rounded-lg bg-brand-accent/10 px-3 py-2 text-brand-accent">
                    {item.code}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold">{isPl ? item.namePl : item.nameEn}</p>
                    <p className="text-[11px] text-pd-muted">
                      {isPl ? 'Kategoria: ' : 'Category: '}
                      {CATEGORY_FILTERS.find((f) => f.id === item.category)?.[isPl ? 'labelPl' : 'labelEn']}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${
                        item.status === 'available'
                          ? 'bg-brand-accent/15 text-brand-accent'
                          : item.status === 'coming'
                          ? 'bg-brand-border text-pd-foreground'
                          : 'bg-amber-500/15 text-amber-200'
                      }`}
                    >
                      {item.status === 'available'
                        ? isPl
                          ? 'Dostępne'
                          : 'Available'
                        : item.status === 'coming'
                        ? isPl
                          ? 'Wkrótce'
                          : 'Coming soon'
                        : isPl
                        ? 'Głosowanie'
                        : 'Voting'}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-3 md:justify-start">
                    {item.status === 'available' && (
                      <button
                        type="button"
                        className="rounded-full bg-brand-accent px-3 py-1.5 text-[11px] font-semibold text-pd-bg shadow-sm hover:bg-brand-accent"
                      >
                        {isPl ? 'Połącz w PapaData' : 'Connect in PapaData'}
                      </button>
                    )}
                    {isComing && (
                      <button
                        type="button"
                        disabled
                        className="rounded-full border border-brand-border bg-brand-dark/70 px-3 py-1.5 text-[11px] font-semibold text-pd-foreground0"
                        title={isPl ? 'Ta integracja jest w trakcie wdrożenia.' : 'This integration is being developed.'}
                      >
                        {isPl ? 'Wkrótce' : 'Coming soon'}
                      </button>
                    )}
                    {isVoting && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleVote(item.id)}
                          className="rounded-full border border-amber-400/60 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-100 hover:bg-amber-500/20"
                        >
                          {isPl ? 'Zagłosuj' : 'Vote'}
                        </button>
                        <span className="text-[11px] text-pd-muted">
                          {isPl ? 'Głosy:' : 'Votes:'} {voteCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-brand-border bg-brand-dark/70 px-4 py-3 text-sm text-pd-foreground md:flex-row md:items-center">
          <div>
            <p className="font-semibold">{isPl ? 'Nie widzisz swojej platformy?' : "Don't see your platform?"}</p>
            <p className="text-xs text-pd-muted">
              {isPl
                ? 'Zaproponuj nową integrację – Twoje głosy wpływają na roadmapę.'
                : 'Suggest a new integration – your votes shape our roadmap.'}
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-brand-accent px-4 py-2 text-xs font-semibold text-pd-bg shadow-sm hover:bg-brand-accent"
            onClick={() => alert(isPl ? 'Formularz w przygotowaniu.' : 'Form coming soon.')}
          >
            {isPl ? 'Zaproponuj nową integrację' : 'Suggest a new integration'}
          </button>
        </div>
      </div>
    </div>
  );
}
