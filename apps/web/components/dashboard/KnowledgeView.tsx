import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { ContextMenu, WidgetEmptyState, WidgetErrorState, WidgetOfflineState } from './DashboardPrimitives';
import { useContextMenu } from './DashboardPrimitives.hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDashboardKnowledge } from '../../data/api';
import type { DashboardKnowledgeResponse } from '@papadata/shared';
import type { DashboardKnowledgeV2 } from '../../types';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface Resource {
  id: string;

  /** Stable ids used for filtering (e.g. "all", "meta", "ga4") */
  categoryId: string;

  /** Display label (e.g. "META ADS", "GA4") */
  categoryLabel: string;

  title: string;
  desc: string;
  longContent: string;
  level: string;
  type: string;
  time: string;
  module: string;
  videoId?: string;
  author: string;
}

type KnowledgeResourceInput = {
  id?: string | number;
  categoryId?: string;
  category?: string;
  categoryLabel?: string;
  title?: string;
  desc?: string;
  longContent?: string;
  level?: string;
  type?: string;
  time?: string;
  module?: string;
  videoId?: string;
  author?: string;
  summary?: string;
  content?: string;
};

const emptyKnowledge: DashboardKnowledgeV2 = {
  title: '',
  desc: '',
  search_placeholder: '',
  ai_prompt: '',
  badge_label: '',
  resources_label: '',
  empty_title: '',
  empty_desc: '',
  clear_filters_label: '',
  filters: {
    category: [],
    level: [],
    type: [],
    module: [],
  },
  card: {
    cta_open: '',
    cta_ai: '',
  },
  detail: {
    title: '',
    empty: '',
    cta_apply: '',
    cta_report: '',
  },
  empty_list: '',
  booking: {
    title: '',
    subtitle: '',
    topic_label: '',
    topic_placeholder: '',
    date_label: '',
    budget_label: '',
    budget_options: [],
    guarantee_title: '',
    guarantee_desc: '',
    submit_cta: '',
    close_cta: '',
  },
  actions: {
    open_article: '',
    share_team: '',
    bookmark: '',
  },
  resources: [],
};

export const KnowledgeView: React.FC = () => {
  const { t, setAiDraft, setContextLabel, isDemo, apiAvailable } =
    useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();

  const { menu, openMenu, closeMenu } = useContextMenu();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [knowledgeData, setKnowledgeData] = useState<DashboardKnowledgeResponse | null>(null);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);

  const demoTooltip = t.dashboard.demo_tooltip;
  const knowledge = t.dashboard.knowledge_v2 ?? emptyKnowledge;
  const modalTitleId = 'booking-modal-title';
  const modalDescId = 'booking-modal-desc';
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  // Options list for category filter (i18n-driven)
  const categoryOptions = useMemo(() => {
    return (knowledge.filters.category ?? []).filter(Boolean) as Array<{
      id: string;
      label: string;
    }>;
  }, [knowledge.filters.category]);

  // Ensure category value always exists in options (or fallback safely)
  useEffect(() => {
    const hasAll = categoryOptions.some((o) => o.id === 'all');
    const initial = hasAll ? 'all' : categoryOptions[0]?.id ?? 'all';

    // only set when invalid/empty to avoid UI jitter
    if (!categoryOptions.length) return;
    if (!category || !categoryOptions.some((o) => o.id === category)) {
      setCategory(initial);
    }
  }, [category, categoryOptions]);

  // Mocked enriched data for Knowledge Base
  const fallbackResources: Resource[] = useMemo(() => {
    const raw = (knowledge.resources as unknown as KnowledgeResourceInput[]) ?? [];
    return raw
      .filter(Boolean)
      .map((r): Resource => {
        const id = String(r.id ?? '');
        const categoryId = String((r.categoryId ?? r.category ?? 'all') || 'all')
          .toLowerCase()
          .trim();
        const categoryLabel = String(r.categoryLabel ?? r.category ?? categoryId)
          .toUpperCase()
          .trim();

        return {
          id: id || `${categoryId}-${String(r.title ?? '').slice(0, 12)}`,
          categoryId,
          categoryLabel,
          title: String(r.title ?? ''),
          desc: String(r.desc ?? ''),
          longContent: String(r.longContent ?? r.desc ?? ''),
          level: String(r.level ?? ''),
          type: String(r.type ?? ''),
          time: String(r.time ?? ''),
          module: String(r.module ?? ''),
          videoId: r.videoId ? String(r.videoId) : undefined,
          author: String(r.author ?? ''),
        };
      });
  }, [knowledge.resources]);

  // Fetch data (but respect API availability if present)
  useEffect(() => {
    let active = true;

    // If app signals API is unavailable, skip fetch and just rely on fallback content
    if (apiAvailable === false) {
      setKnowledgeData(null);
      setKnowledgeError(null);
      return () => {
        active = false;
      };
    }

    fetchDashboardKnowledge()
      .then((data) => {
        if (!active) return;
        setKnowledgeData(data);
        setKnowledgeError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : t.dashboard.widget.error_desc;
        setKnowledgeError(message);
      });

    return () => {
      active = false;
    };
  }, [retryToken, apiAvailable, t]);

  useEffect(() => {
    if (knowledgeError) {
      console.error('KnowledgeView error:', knowledgeError);
    }
  }, [knowledgeError]);

  // Modal open/close: ESC + focus management + scroll lock + focus restore
  useEffect(() => {
    if (!isBookingOpen) return;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsBookingOpen(false);
      }
      // basic focus trap (keeps tab within modal)
      if (event.key === 'Tab') {
        const root = modalRef.current;
        if (!root) return;

        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-disabled'));

        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!current || current === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (current === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // focus modal container on open
    window.setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [isBookingOpen]);

  // Merge API resources with fallback (stable ids + safe defaults)
  const resources: Resource[] = useMemo(() => {
    if (!knowledgeData?.resources?.length) return fallbackResources;

    const apiResources = (knowledgeData?.resources ?? []) as KnowledgeResourceInput[];
    return apiResources
      .filter(Boolean)
      .map((item, idx): Resource => {
        const fallback = fallbackResources[idx] ?? fallbackResources[0];

        const id = String(item.id ?? fallback?.id ?? `${idx}`);
        const categoryId = String(
          (item.categoryId ?? item.category ?? fallback?.categoryId ?? 'all') || 'all',
        )
          .toLowerCase()
          .trim();

        // If translations for categories exist, prefer label from select options
        const optionLabel =
          categoryOptions.find((o) => String(o.id).toLowerCase() === categoryId)?.label ?? '';

        const categoryLabel = String(
          optionLabel || item.categoryLabel || item.category || fallback?.categoryLabel || categoryId,
        )
          .toUpperCase()
          .trim();

        return {
          id,
          categoryId,
          categoryLabel,
          title: String(item.title ?? fallback?.title ?? ''),
          desc: String(item.summary ?? fallback?.desc ?? ''),
          longContent: String(item.content ?? item.summary ?? fallback?.longContent ?? fallback?.desc ?? ''),
          level: String(item.level ?? fallback?.level ?? ''),
          type: String(item.type ?? fallback?.type ?? ''),
          time: String(item.time ?? fallback?.time ?? ''),
          module: String(item.module ?? fallback?.module ?? ''),
          videoId: item.videoId ? String(item.videoId) : fallback?.videoId,
          author: String(item.author ?? fallback?.author ?? ''),
        };
      });
  }, [knowledgeData, fallbackResources, categoryOptions]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    const normalizedCategory = String(category || 'all').toLowerCase().trim();

    return resources.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.desc.toLowerCase().includes(normalizedQuery);

      const matchesCategory = normalizedCategory === 'all' || item.categoryId === normalizedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [resources, query, category]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Keep selection consistent with filtering (if selected is filtered out, move to first filtered)
  useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId) {
      setSelectedId(filtered[0].id);
      return;
    }

    const stillVisible = filtered.some((r) => r.id === selectedId);
    if (!stillVisible) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selectedResource = useMemo(() => {
    if (!selectedId) return null;
    return resources.find((item) => item.id === selectedId) ?? null;
  }, [resources, selectedId]);

  const clearFilters = () => {
    setQuery('');
    const hasAll = categoryOptions.some((o) => o.id === 'all');
    setCategory(hasAll ? 'all' : categoryOptions[0]?.id ?? 'all');
  };

  const handleExplain = (title: string) => {
    setContextLabel?.(title);
    setAiDraft?.(knowledge.ai_prompt.replace('{name}', title));
  };

  const buildMenuItems = (resource: Resource) => [
    {
      id: 'drill',
      label: knowledge.actions.open_article,
      onSelect: () => setSelectedId(resource.id),
    },
    {
      id: 'explain',
      label: t.dashboard.context_menu.explain_ai,
      onSelect: () => handleExplain(resource.title),
      tone: 'primary' as const,
    },
    {
      id: 'share',
      label: knowledge.actions.share_team,
      onSelect: () => {
        // Minimal meaningful behavior instead of no-op
        setContextLabel?.(resource.title);
        setAiDraft?.(
          `${knowledge.actions.share_team}: ${resource.title}. Przygotuj krótką wiadomość do zespołu z kluczowymi punktami i rekomendowanymi next-steps.`,
        );
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'bookmark',
      label: knowledge.actions.bookmark,
      onSelect: () => {
        // Minimal meaningful behavior instead of no-op
        setContextLabel?.(resource.title);
        setAiDraft?.(
          `${knowledge.actions.bookmark}: ${resource.title}. Zapisz do zakładek i zaproponuj kiedy wrócić do tego materiału (plan tygodniowy).`,
        );
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  return (
    <div className="space-y-8 animate-reveal">
      {/* Search and Filters Header */}
      <section className="rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                {knowledge.badge_label}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {knowledge.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              {knowledge.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleExplain(knowledge.title)}
            className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
          >
            {t.dashboard.context_menu.explain_ai}
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-start transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={knowledge.search_placeholder}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 text-sm focus:border-brand-start/50 outline-none transition-all font-bold"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-black uppercase tracking-widest outline-none focus:border-brand-start/50"
            >
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {!isOnline && (
        <section className="rounded-[2.5rem] border border-amber-500/30 bg-amber-500/10 p-6 shadow-xl">
          <WidgetOfflineState
            title={t.dashboard.widget.offline_title}
            desc={t.dashboard.widget.offline_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      {isOnline && knowledgeError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
        {/* Resource List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-2 mb-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
              {knowledge.resources_label}
            </h3>
            <button
              type="button"
              onClick={() => handleExplain(knowledge.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          {filtered.length === 0 ? (
            <WidgetEmptyState
              title={knowledge.empty_title}
              desc={knowledge.empty_desc}
              onAction={clearFilters}
              actionLabel={knowledge.clear_filters_label}
            />
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedId(item.id);
                  }
                }}
                onContextMenu={(e) => openMenu(e, buildMenuItems(item), item.title)}
                className={`group relative p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden ${
                  selectedId === item.id
                    ? 'bg-white dark:bg-[#0b0b0f] border-brand-start shadow-xl translate-x-2'
                    : 'bg-white/60 dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-brand-start/30'
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={selectedId === item.id}
                aria-label={item.title}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-2xs font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      selectedId === item.id
                        ? 'bg-brand-start text-white'
                        : 'bg-black/5 dark:bg-white/10 text-gray-500'
                    }`}
                  >
                    {item.categoryLabel}
                  </span>
                  <div className="flex gap-1">
                    <span className="text-xs font-bold text-gray-400">{item.time}</span>
                  </div>
                </div>

                <h4
                  className={`text-base font-black uppercase tracking-tight mb-2 transition-colors ${
                    selectedId === item.id
                      ? 'text-brand-start'
                      : 'text-gray-900 dark:text-white group-hover:text-brand-start'
                  }`}
                >
                  {item.title}
                </h4>

                <p className="text-xs text-gray-500 font-medium line-clamp-2">{item.desc}</p>

                <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-2xs font-black uppercase tracking-widest text-brand-start">
                    Czytaj więcej →
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleExplain(item.title);
                    }}
                    className="text-2xs font-black uppercase tracking-widest text-brand-start hover:underline"
                  >
                    {knowledge.card.cta_ai}
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Expert CTA Card */}
          <div className="mt-8 rounded-[2.5rem] brand-gradient-bg p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
                  {knowledge.expert?.pill}
                </span>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]" />
              </div>
              <div>
                <h4 className="text-3xl font-black tracking-tighter uppercase leading-none mb-1">
                  {knowledge.expert?.title}
                </h4>
                <p className="text-xs font-medium opacity-80 leading-relaxed italic">
                  {knowledge.expert?.desc}
                </p>
              </div>

              <InteractiveButton
                variant="secondary"
                onClick={(e) => {
                  lastActiveRef.current = e.currentTarget as unknown as HTMLElement;
                  setIsBookingOpen(true);
                }}
                className="w-full !bg-white !text-brand-start !text-xs font-black uppercase tracking-widest !py-4 shadow-xl hover:scale-105 transition-transform"
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
              >
                {knowledge.expert?.cta_label}
              </InteractiveButton>

              <button
                type="button"
                onClick={() => handleExplain(knowledge.expert?.ai_context ?? '')}
                className="text-xs font-black uppercase tracking-widest text-white/80 hover:text-white hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
          </div>
        </div>

        {/* Detailed View */}
        <div className="lg:sticky lg:top-8">
          <AnimatePresence mode="wait">
            {!selectedResource ? (
              <div className="rounded-[2.5rem] border border-dashed border-black/10 dark:border-white/10 p-20 text-center">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  {knowledge.empty_list}
                </p>
              </div>
            ) : (
              <motion.div
                key={selectedResource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] overflow-hidden shadow-2xl"
              >
                {/* Article Header */}
                <div className="p-8 md:p-12 border-b border-black/5 dark:border-white/5 bg-black/[0.01]">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="px-3 py-1 rounded-full bg-brand-start/10 text-brand-start text-xs font-black uppercase tracking-widest border border-brand-start/20">
                      {selectedResource.type}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Poziom: {selectedResource.level}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-auto">
                      Autor: {selectedResource.author}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.95] mb-6">
                    {selectedResource.title}
                  </h1>
                  <p className="text-lg text-gray-500 font-medium italic">{selectedResource.desc}</p>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleExplain(selectedResource.title)}
                      className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                    >
                      {t.dashboard.context_menu.explain_ai}
                    </button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-8 md:p-12 space-y-10">
                  {/* Video Player Section */}
                  {selectedResource.videoId && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          Masterclass Video
                        </span>
                      </div>

                      <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black group/video cursor-pointer border border-white/5 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                          <button
                            type="button"
                            className="w-20 h-20 rounded-full brand-gradient-bg flex items-center justify-center text-white shadow-2xl group-hover/video:scale-110 transition-transform"
                            aria-label="Odtwórz wideo"
                          >
                            <svg className="w-8 h-8 fill-current translate-x-1" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-60">
                          <div className="flex gap-1 h-1 flex-1 bg-white/20 rounded-full mr-4 overflow-hidden">
                            <div className="h-full w-1/3 brand-gradient-bg" />
                          </div>
                          <span className="text-xs font-mono text-white">12:42 / 45:00</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                      {selectedResource.longContent}
                    </div>
                  </div>

                  {/* AI Action Card */}
                  <div className="p-8 rounded-[2rem] border border-brand-start/20 bg-brand-start/5 relative overflow-hidden group">
                    <div className="relative z-10">
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">
                        Analiza dedykowana AI
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mb-6">
                        Pozwól Papa AI przeanalizować ten artykuł w kontekście Twoich danych z Meta
                        Ads i Shopify.
                      </p>
                      <InteractiveButton
                        variant="primary"
                        onClick={() => handleExplain(selectedResource.title)}
                        className="!py-3 !px-8 !text-xs uppercase tracking-widest"
                      >
                        Uruchom Neural Insight
                      </InteractiveButton>
                      <button
                        type="button"
                        onClick={() => handleExplain(selectedResource.title)}
                        className="mt-3 text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                      >
                        {t.dashboard.context_menu.explain_ai}
                      </button>
                    </div>
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <svg className="w-24 h-24 text-brand-start" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Consultation Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0c] rounded-[3rem] border border-white/10 shadow-[0_50px_130px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby={modalTitleId}
              aria-describedby={modalDescId}
              tabIndex={-1}
              ref={modalRef}
            >
              <div className="brand-gradient-bg p-8 text-white">
                <h3 id={modalTitleId} className="text-2xl font-black uppercase tracking-tighter">
                  {knowledge.booking.title}
                </h3>
                <p
                  id={modalDescId}
                  className="text-xs font-medium opacity-70 mt-1 uppercase tracking-widest"
                >
                  {knowledge.booking.subtitle}
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-2xs font-black text-gray-500 uppercase tracking-widest">
                    {knowledge.booking.topic_label}
                  </label>
                  <input
                    type="text"
                    placeholder={knowledge.booking.topic_placeholder}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-2xs font-black text-gray-500 uppercase tracking-widest">
                      {knowledge.booking.date_label}
                    </label>
                    <input
                      type="date"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-2xs font-black text-gray-500 uppercase tracking-widest">
                      {knowledge.booking.budget_label}
                    </label>
                    <select className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-brand-start font-bold">
                        {knowledge.booking.budget_options.map((option: string) => (
                        <option key={option}>{option}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">
                    {knowledge.booking.guarantee_title}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {knowledge.booking.guarantee_desc}
                  </p>
                </div>

                <InteractiveButton
                  variant="primary"
                  onClick={() => {
                    setIsBookingOpen(false);
                    window.setTimeout(() => lastActiveRef.current?.focus(), 0);
                  }}
                  className="w-full !py-5 !text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl"
                  disabled={isDemo}
                  title={isDemo ? demoTooltip : undefined}
                >
                  {knowledge.booking.submit_cta}
                </InteractiveButton>

                <button
                  type="button"
                  onClick={() => {
                    setIsBookingOpen(false);
                    window.setTimeout(() => lastActiveRef.current?.focus(), 0);
                  }}
                  className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {knowledge.booking.close_cta}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default KnowledgeView;
