import React, { useMemo, useState } from 'react';
import { Search, Grid2X2, ArrowRight } from 'lucide-react';
import {
  Translation,
  IntegrationItem,
  IntegrationCategory,
} from '../types';
import { INITIAL_INTEGRATIONS } from '../constants';
import IntegrationLogo from './IntegrationLogo';

interface Props {
  t: Translation['integrationsSection'];
  onOpenModal: () => void;
}

const previewOrder = [
  'woocommerce',
  'shopify',
  'idosell',
  'allegro',
  'ga4',
  'google_ads',
  'meta_ads',
  'tiktok_ads',
  'baselinker',
];

const IntegrationsSection: React.FC<Props> = ({ t, onOpenModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered: IntegrationItem[] = useMemo(() => {
    const base = INITIAL_INTEGRATIONS.filter((item) =>
      previewOrder.includes(item.id)
    );
    if (!searchQuery.trim()) return base;

    const q = searchQuery.toLowerCase();
    return INITIAL_INTEGRATIONS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const subtitleByCategory = (category: IntegrationCategory): string => {
    const map = (t.cardSubtitles as any) ?? {};
    return map[category.toLowerCase()] ?? category;
  };

  return (
    <section id="integrations" className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-400 mb-2">
              Pokaż jak to działa
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
              {t.title}
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400">
              {t.subtitle}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[260px]">
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 hover:border-primary-500 hover:bg-slate-900/80 transition-colors"
            >
              <Grid2X2 className="w-4 h-4 text-primary-400" />
              <span>{t.viewAllButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-500 leading-snug">
              Minimum <span className="text-slate-200">jeden sklep</span> +
              dowolne źródła reklamowe. Resztę możesz dołączyć w trakcie
              współpracy.
            </p>
          </div>
        </div>

        {/* Wyszukiwarka */}
        <div className="mt-6 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder ?? 'Szukaj integracji...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-800 bg-slate-950 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/70"
          />
        </div>

        {/* Lista integracji */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 hover:border-primary-500/80 hover:bg-slate-900 transition-colors"
            >
              <IntegrationLogo
                code={item.code}
                size="sm"
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-50 truncate">
                    {item.name}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {item.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400 truncate">
                  {subtitleByCategory(item.category)}
                </p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-6 text-sm text-slate-400">
              {t.noResultsLabel ??
                `Brak integracji dla frazy „${searchQuery}”. Spróbuj innego zapisu lub otwórz pełny katalog.`}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
