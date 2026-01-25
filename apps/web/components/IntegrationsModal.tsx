import React, { useEffect, useId, useMemo, useState, useCallback } from 'react';
import type { Translation } from '../types';
import {
  integrations,
  integrationCategories,
  type IntegrationCategory,
  type IntegrationItem,
  type IntegrationStatus,
} from '../data/integrations';
import { InteractiveButton } from './InteractiveButton';

export type { IntegrationCategory } from '../data/integrations';
export type IntegrationModalCategory = IntegrationCategory | 'all';

interface IntegrationsModalProps {
  t: Translation;
  category?: IntegrationModalCategory;
  isOpen?: boolean;
  onClose?: () => void;

  onSelectIntegration?: (item: IntegrationItem) => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  t,
  category: initialCategory = 'all',
  isOpen = true,
  onClose,
  onSelectIntegration,
}) => {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<IntegrationModalCategory>(initialCategory);

  const rid = useId();
  const titleId = `integrations-modal-title-${rid}`;
  const descId = `integrations-modal-desc-${rid}`;

  useEffect(() => {
    if (!isOpen) return;
    setSearchTerm('');
    setActiveTab(initialCategory);
  }, [initialCategory, isOpen]);

  const filteredConnectors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return (integrations || [])
      .filter(Boolean)
      .filter((item) => {
        const meta = t.integrations.items[item.id];
        const name = (meta?.name ?? item.id).toLowerCase();
        const detail = (meta?.detail ?? '').toLowerCase();

        const matchesSearch = q.length === 0 || name.includes(q) || detail.includes(q);
        const matchesCategory = activeTab === 'all' || item.category === activeTab;

        return matchesSearch && matchesCategory;
      });
  }, [searchTerm, activeTab, t]);

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'live':
        return (
          <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-2xs font-extrabold uppercase tracking-[0.2em] border border-green-500/20">
            {t.integrations.status_live}
          </span>
        );
      case 'beta':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-2xs font-extrabold uppercase tracking-[0.2em] border border-amber-500/20">
            {t.integrations.status_beta}
          </span>
        );
      case 'coming_soon':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-2xs font-extrabold uppercase tracking-[0.2em] border border-white/10">
            {t.integrations.status_soon}
          </span>
        );
    }
  };

  const tabLabels: Record<IntegrationCategory, string> = {
    ecommerce: t.integrations.tab_ecommerce,
    marketplace: t.integrations.tab_marketplace,
    ads: t.integrations.tab_ads,
    analytics: t.integrations.tab_analytics,
    payments: t.integrations.tab_payments,
    email: t.integrations.tab_email,
    crm: t.integrations.tab_crm,
    support: t.integrations.tab_support,
    data: t.integrations.tab_data,
    logistics: t.integrations.tab_logistics,
    finance: t.integrations.tab_finance,
    consent: t.integrations.tab_consent,
    affiliate: t.integrations.tab_affiliate,
    productivity: t.integrations.tab_productivity,
  };

  const handleSelect = useCallback(
    (item: IntegrationItem) => {
      if (item.status === 'coming_soon') return;

      if (onSelectIntegration) {
        onSelectIntegration(item);
        return;
      }

      // fallback: bez callbacka po prostu zamknij (nie zakładamy ModalContext)
      handleClose();
    },
    [handleClose, onSelectIntegration],
  );

  if (!isOpen) return null;

  return (
    <div
      role="document"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="relative w-full max-w-6xl glass-modal rounded-3xl md:rounded-[2.75rem] border border-gray-200 dark:border-white/10 shadow-[0_0_150px_rgba(78,38,226,0.2)] overflow-hidden flex flex-col max-h-[95vh] md:max-h-[92vh] bg-white dark:bg-[#0a0a0c]"
    >
      <div className="p-6 md:p-10 pb-5 border-b border-gray-200 dark:border-white/5 bg-black/5 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-black/50 border border-brand-start/40 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-white/70">
                {t.integrations.pill}
              </span>
            </div>

            <h3
              id={titleId}
              className="font-black text-gray-900 dark:text-white tracking-tighter leading-[1.2] py-1"
              style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
            >
              {t.integrations.modal_title}
            </h3>

            <p id={descId} className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-xl">
              {t.integrations.modal_desc}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
            aria-label={t.common.close}
            type="button"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
          <div className="relative w-full md:w-[420px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-start transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="search"
              placeholder={t.integrations.modal_search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-brand-start/50 focus:bg-brand-start/5 outline-none transition-all text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
            />
          </div>

          <div className="flex gap-1.5 p-1.5 bg-black/5 dark:bg-black/35 rounded-2xl border border-gray-200 dark:border-white/5 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 md:px-5 py-2.5 rounded-xl text-sm2 font-semibold transition-all duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 ${
                activeTab === 'all'
                  ? 'brand-gradient-bg text-white shadow-[0_8px_18px_rgba(78,38,226,0.28)]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {t.integrations.tab_all}
            </button>

            {integrationCategories.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-5 py-2.5 rounded-xl text-sm2 font-semibold transition-all duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 ${
                    isActive
                      ? 'brand-gradient-bg text-white shadow-[0_8px_18px_rgba(78,38,226,0.28)]'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 pt-6 overflow-y-auto no-scrollbar scroll-smooth">
        {filteredConnectors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredConnectors.map((item) => {
              const isSoon = item.status === 'coming_soon';
              const meta = t.integrations.items[item.id];
              const name = meta?.name ?? item.id;
              const detail = meta?.detail;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isSoon}
                  onClick={() => handleSelect(item)}
                  className={`group relative p-5 md:p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center text-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 ${
                    isSoon
                      ? 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/5 opacity-70 hover:opacity-100 cursor-not-allowed'
                      : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-brand-start/35 hover:bg-brand-start/5 hover:-translate-y-1 shadow-lg hover:shadow-brand-start/10'
                  }`}
                  aria-disabled={isSoon}
                >
                  <div className="absolute top-4 right-4">{getStatusBadge(item.status)}</div>

                  <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-black/35 flex items-center justify-center text-brand-start group-hover:text-white transition-all duration-300 border border-gray-200 dark:border-white/5 group-hover:border-brand-start/25 group-hover:shadow-[0_0_34px_rgba(78,38,226,0.18)]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v18m9-9H3" />
                    </svg>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-sm md:text-base font-extrabold text-gray-900 dark:text-white group-hover:text-brand-start transition-colors tracking-tight">
                      {name}
                    </span>

                    {detail && (
                      <span className="block text-xs font-black text-gray-500 uppercase tracking-[0.18em]">
                        {detail}
                      </span>
                    )}

                    <span className="block text-2xs font-extrabold text-gray-500 uppercase tracking-[0.2em] opacity-80">
                      {t.integrations.categories[item.category]}
                    </span>

                    {isSoon && <span className="sr-only">{t.integrations.status_soon}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center" aria-live="polite">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5 border border-white/5">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{t.integrations.empty_state}</p>
            <p className="text-sm mt-2 text-gray-500 font-medium">{t.integrations.empty_state_sub}</p>
          </div>
        )}
      </div>

      <div className="px-6 md:px-10 py-4 border-t border-gray-200 dark:border-white/5 bg-black/5 dark:bg-black/55 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-gray-500">
            {t.integrations.modal_footer_tag}
          </span>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <InteractiveButton
            variant="secondary"
            onClick={handleClose}
            className="!h-9 !px-5 !text-2xs !font-black uppercase tracking-widest rounded-xl"
          >
            {t.common.close}
          </InteractiveButton>

          <div className="hidden md:flex items-center gap-8" aria-hidden="true">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.22em]">
                {t.integrations.status_live}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <span className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.22em]">
                {t.integrations.status_beta}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <span className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.22em]">
                {t.integrations.status_soon}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
