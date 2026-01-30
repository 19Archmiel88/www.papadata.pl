import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { ContextMenu } from './DashboardPrimitives';
import { useContextMenu } from './DashboardPrimitives.hooks';
import type { DashboardGrowth, DashboardGrowthCard } from '../../types';

type GrowthStatus = 'new' | 'approved' | 'implemented' | 'measured' | 'closed';
type Level = 'low' | 'medium' | 'high';
type GrowthBudgetItem = {
  id: string;
  label: string;
  current: number;
  suggested: number;
};

const levelClass = (level: Level) => {
  if (level === 'high') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (level === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
};

const statusClass = (status: GrowthStatus) => {
  switch (status) {
    case 'approved':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'implemented':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    case 'measured':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'closed':
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }
};

const emptyGrowth: DashboardGrowth = {
  title: '',
  desc: '',
  cards: {
    title: '',
    desc: '',
    labels: {
      impact: '',
      confidence: '',
      effort: '',
      risk: '',
      why_now: '',
      evidence: '',
      simulation: '',
      status: '',
    },
    ctas: {
      evidence: '',
      explain: '',
      save_task: '',
      add_report: '',
      open_measure: '',
    },
    statuses: {
      new: '',
      approved: '',
      implemented: '',
      measured: '',
      closed: '',
    },
    priorities: {
      low: '',
      medium: '',
      high: '',
    },
    values: {
      low: '',
      medium: '',
      high: '',
    },
    simulation: {
      before: '',
      after: '',
      delta: '',
    },
    items: [],
  },
  budget: {
    title: '',
    desc: '',
    toggle_channels: '',
    toggle_campaigns: '',
    current_label: '',
    suggested_label: '',
    aggressiveness_label: '',
    aggressiveness_steps: [],
    aggressiveness_options: {
      conservative: '',
      standard: '',
      aggressive: '',
    },
    assumptions_label: '',
    assumptions_text: '',
    channels: [],
    campaigns: [],
  },
};

export const GrowthView: React.FC = () => {
  const { t, setContextLabel, setAiDraft, isDemo } = useOutletContext<DashboardOutletContext>();
  const location = useLocation();
  const navigate = useNavigate();
  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);

  const growth = t.dashboard.growth ?? emptyGrowth;
  const growthCards = growth.cards;
  const growthBudget = growth.budget;

  const cards = useMemo(() => (growthCards.items as DashboardGrowthCard[]) ?? [], [growthCards]);
  const [cardStatus, setCardStatus] = useState<Record<string, GrowthStatus>>({});
  const [allocationMode, setAllocationMode] = useState<'channels' | 'campaigns'>('channels');
  const [aggressivenessIndex, setAggressivenessIndex] = useState(1);
  const { menu, openMenu, closeMenu } = useContextMenu();
  const demoTooltip = t.dashboard.demo_tooltip;

  interface AggressivenessOptions {
    [key: string]: string;
  }

  const aggressivenessKey: keyof AggressivenessOptions | undefined = growthBudget
    .aggressiveness_steps[aggressivenessIndex] as keyof AggressivenessOptions | undefined;

  const aggressivenessLabel =
    (growthBudget.aggressiveness_options as Record<string, string>)[aggressivenessKey ?? ''] ?? '';

  useEffect(() => {
    setCardStatus(
      cards.reduce(
        (acc, card) => {
          acc[card.id] = card.status as GrowthStatus;
          return acc;
        },
        {} as Record<string, GrowthStatus>
      )
    );
  }, [cards]);

  const allocationItems = useMemo(() => {
    const source =
      allocationMode === 'channels'
        ? (growthBudget.channels as GrowthBudgetItem[])
        : (growthBudget.campaigns as GrowthBudgetItem[]);

    const swing = aggressivenessIndex === 0 ? 0.03 : aggressivenessIndex === 2 ? 0.08 : 0.05;

    return source.map((item, idx) => {
      const modifier = idx % 2 === 0 ? swing : -swing;
      const suggested = Math.max(0.05, Math.min(0.6, item.suggested + modifier));
      return { ...item, suggested };
    });
  }, [allocationMode, aggressivenessIndex, growthBudget]);

  const handleExplain = (context: string, prompt?: string) => {
    setContextLabel?.(context);
    setAiDraft?.(prompt ?? `${t.dashboard.context_menu.explain_ai}: ${context}`);
  };

  const safeNavigateCardRoute = (route?: string) => {
    if (!route) return;
    navigateWithSearch(route);
  };

  const buildMenuItems = (context: string, route?: string, prompt?: string) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => {
        setContextLabel?.(context);
        if (route) navigateWithSearch(route);
      },
    },
    {
      id: 'explain',
      label: t.dashboard.context_menu.explain_ai,
      onSelect: () => handleExplain(context, prompt),
      tone: 'primary' as const,
    },
    {
      id: 'report',
      label: t.dashboard.context_menu.add_report,
      onSelect: () => {
        setContextLabel?.(context);
        navigateWithSearch('/dashboard/reports');
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'export',
      label: t.dashboard.context_menu.export,
      onSelect: () => {
        setContextLabel?.(context);
        setAiDraft?.(`${t.dashboard.context_menu.export}: ${context}`);
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'alert',
      label: t.dashboard.context_menu.set_alert,
      onSelect: () => {
        setContextLabel?.(context);
        navigateWithSearch('/dashboard/alerts');
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  return (
    <div className="space-y-8 animate-reveal">
      {/* Header / intro sekcja Growth */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                {'Growth Engine'}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {growth.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-[70ch]">
              {growth.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExplain(growth.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>

            <InteractiveButton
              variant="primary"
              className="!px-4 !py-2 !text-xs !font-black uppercase tracking-widest rounded-xl"
              disabled={isDemo}
              title={isDemo ? demoTooltip : undefined}
              onClick={() => {
                if (isDemo) return;
                setContextLabel?.(growth.title);
                navigateWithSearch('/dashboard/reports');
              }}
            >
              {growth.cards.ctas.open_measure}
            </InteractiveButton>

            <button
              type="button"
              onClick={(event) =>
                openMenu(event, buildMenuItems(growth.title, '/dashboard/growth'), growth.title)
              }
              aria-label={t.dashboard.context_menu.label}
              className="p-2 rounded-2xl border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Karty inicjatyw wzrostu */}
      <section className="dashboard-surface dashboard-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {growth.cards.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {growth.cards.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExplain(growth.cards.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>

            <button
              type="button"
              onClick={(event) =>
                openMenu(
                  event,
                  buildMenuItems(growth.cards.title, '/dashboard/growth'),
                  growth.cards.title
                )
              }
              aria-label={t.dashboard.context_menu.label}
              className="p-2 rounded-2xl border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {cards.map((card) => {
            const status = cardStatus[card.id] ?? (card.status as GrowthStatus);

            return (
              <div
                key={card.id}
                onContextMenu={(event) =>
                  openMenu(event, buildMenuItems(card.context, card.route, card.prompt), card.title)
                }
                className="rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-5 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {card.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {card.desc}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${levelClass(
                        card.priority as Level
                      )}`}
                    >
                      {growth.cards.priorities[card.priority as Level]}
                    </span>

                    <button
                      type="button"
                      onClick={(event) =>
                        openMenu(
                          event,
                          buildMenuItems(card.context, card.route, card.prompt),
                          card.title
                        )
                      }
                      aria-label={t.dashboard.context_menu.label}
                      className="p-2 rounded-2xl border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6h.01M12 12h.01M12 18h.01"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {card.segments.map((segment) => (
                    <span
                      key={segment}
                      className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300"
                    >
                      {segment}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {growth.cards.labels.impact}
                    </div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">
                      {card.impact}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {growth.cards.labels.confidence}
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${levelClass(
                        card.confidence as Level
                      )}`}
                    >
                      {growth.cards.values[card.confidence as Level]}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {growth.cards.labels.effort}
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${levelClass(
                        card.effort as Level
                      )}`}
                    >
                      {growth.cards.values[card.effort as Level]}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {growth.cards.labels.risk}
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${levelClass(
                        card.risk as Level
                      )}`}
                    >
                      {growth.cards.values[card.risk as Level]}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {growth.cards.labels.why_now}
                  </div>
                  <div className="text-sm font-black text-gray-900 dark:text-white">
                    {card.why_now}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {growth.cards.labels.simulation}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                        {growth.cards.simulation.before}
                      </div>
                      <div className="text-sm font-black text-gray-900 dark:text-white">
                        {card.simulation.before}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                        {growth.cards.simulation.after}
                      </div>
                      <div className="text-sm font-black text-gray-900 dark:text-white">
                        {card.simulation.after}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                        {growth.cards.simulation.delta}
                      </div>
                      <div className="text-sm font-black text-emerald-500">
                        {card.simulation.delta}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {growth.cards.labels.evidence}
                    </div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">
                      {card.evidence}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {growth.cards.labels.status}
                    </div>

                    <select
                      value={status}
                      onChange={(event) =>
                        setCardStatus((prev) => ({
                          ...prev,
                          [card.id]: event.target.value as GrowthStatus,
                        }))
                      }
                      disabled={isDemo}
                      title={isDemo ? demoTooltip : undefined}
                      className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none"
                      aria-label={growth.cards.labels.status}
                    >
                      {Object.entries(growth.cards.statuses).map(([key, label]) => (
                        <option key={key} value={key}>
                          {String(label)}
                        </option>
                      ))}
                    </select>

                    <div
                      className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${statusClass(
                        status
                      )}`}
                    >
                      {growth.cards.statuses[status]}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isDemo) return;
                      setContextLabel?.(card.context);
                      safeNavigateCardRoute(card.route);
                    }}
                    disabled={isDemo}
                    title={isDemo ? demoTooltip : undefined}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-brand-start hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {growth.cards.ctas.evidence}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (isDemo) return;
                      setContextLabel?.(card.context);
                      if (card.prompt) setAiDraft?.(card.prompt);
                      safeNavigateCardRoute(card.route);
                    }}
                    disabled={isDemo}
                    title={isDemo ? demoTooltip : undefined}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-brand-start/30 text-brand-start bg-brand-start/10 hover:bg-brand-start hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {growth.cards.ctas.explain}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (isDemo) return;
                      setContextLabel?.(`${growth.cards.ctas.save_task}: ${card.title}`);
                      setAiDraft?.(
                        `Przygotuj zadanie do backlogu dla inicjatywy wzrostu: "${card.title}".`
                      );
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-brand-start hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={isDemo}
                    title={isDemo ? demoTooltip : undefined}
                  >
                    {growth.cards.ctas.save_task}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (isDemo) return;
                      setContextLabel?.(`${growth.cards.ctas.add_report}: ${card.title}`);
                      navigateWithSearch('/dashboard/reports');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-brand-start hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={isDemo}
                    title={isDemo ? demoTooltip : undefined}
                  >
                    {growth.cards.ctas.add_report}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sekcja alokacji budżetu */}
      <section className="dashboard-surface dashboard-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {growth.budget.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {growth.budget.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExplain(growth.budget.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>

            <button
              type="button"
              onClick={() => setAllocationMode('channels')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-full border ${
                allocationMode === 'channels'
                  ? 'border-brand-start/60 text-brand-start bg-brand-start/10'
                  : 'border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              {growth.budget.toggle_channels}
            </button>

            <button
              type="button"
              onClick={() => setAllocationMode('campaigns')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-full border ${
                allocationMode === 'campaigns'
                  ? 'border-brand-start/60 text-brand-start bg-brand-start/10'
                  : 'border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              {growth.budget.toggle_campaigns}
            </button>

            <button
              type="button"
              onClick={(event) =>
                openMenu(
                  event,
                  buildMenuItems(growth.budget.title, '/dashboard/growth'),
                  growth.budget.title
                )
              }
              aria-label={t.dashboard.context_menu.label}
              className="p-2 rounded-2xl border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            {growth.budget.current_label}
          </span>

          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-start" />
            {growth.budget.suggested_label}
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-black uppercase tracking-widest">
              {growth.budget.aggressiveness_label}
            </span>

            <input
              type="range"
              min={0}
              max={2}
              value={aggressivenessIndex}
              onChange={(event) => setAggressivenessIndex(Number(event.target.value))}
              className="accent-brand-start"
              disabled={isDemo}
              title={isDemo ? demoTooltip : undefined}
              aria-label={growth.budget.aggressiveness_label}
            />

            <span className="text-gray-700 dark:text-gray-200 font-black text-xs uppercase tracking-widest">
              {aggressivenessLabel}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {allocationItems.map((item) => (
            <div
              key={item.id}
              className="space-y-2"
              onContextMenu={(event) =>
                openMenu(event, buildMenuItems(item.label, '/dashboard/growth'), item.label)
              }
            >
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-700 dark:text-gray-200">{item.label}</span>
                <span className="font-mono font-bold">{Math.round(item.suggested * 100)}%</span>
              </div>

              <div className="space-y-2">
                <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gray-400/70"
                    style={{ width: `${item.current * 100}%` }}
                  />
                </div>

                <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-brand-start"
                    style={{ width: `${item.suggested * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="font-black uppercase tracking-widest text-xs text-gray-700 dark:text-gray-200">
            {growth.budget.assumptions_label}
          </div>
          <p className="mt-1">{growth.budget.assumptions_text}</p>
        </div>
      </section>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default GrowthView;
