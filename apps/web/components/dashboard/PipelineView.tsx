import React from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { ContextMenu } from './DashboardPrimitives';
import { useContextMenu } from './DashboardPrimitives.hooks';
import type { DashboardPipelineV2 } from '../../types';

const emptyPipeline: DashboardPipelineV2 = {
  title: '',
  desc: '',
  ai_prompt: '',
  actions: {
    open_guardian: '',
  },
  sources: {
    title: '',
    desc: '',
    columns: {
      source: '',
      status: '',
      last_sync: '',
      delay: '',
      records: '',
      action: '',
    },
    items: [],
    actions: {
      test: '',
      sync: '',
      explain: '',
    },
  },
  transforms: {
    title: '',
    desc: '',
    items: [],
    actions: {
      run: '',
    },
  },
  rag: {
    title: '',
    desc: '',
    cta: '',
    status_label: '',
    status_value: '',
    last_update_label: '',
    last_update_value: '',
    coverage_label: '',
    coverage_value: '',
  },
  bigquery: {
    title: '',
    desc: '',
    cta_open: '',
    cta_export: '',
    lineage_cta: '',
    columns: {
      table: '',
      desc: '',
      freshness: '',
      action: '',
    },
    items: [],
  },
};

export const PipelineView: React.FC = () => {
  const { t, setAiDraft, setContextLabel, isDemo } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();
  const location = useLocation();
  const { menu, openMenu, closeMenu } = useContextMenu();
  const demoTooltip = t.dashboard.demo_tooltip;
  const pipeline = t.dashboard.pipeline_v2 ?? emptyPipeline;

  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);

  const handleExplain = (label: string) => {
    setContextLabel?.(label);
    setAiDraft?.(pipeline.ai_prompt.replace('{name}', label));
  };

  const handleAction = (label: string, context: string) => {
    if (isDemo) return;
    setContextLabel?.(context);
    setAiDraft?.(`${label}: ${context}`);
  };

  const buildMenuItems = (context: string) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => {
        setContextLabel?.(context);
        // Zachowujemy querystring (np. timeRange) i dajemy realny efekt "drill"
        navigateWithSearch('/dashboard/pipeline');
      },
    },
    {
      id: 'explain',
      label: t.dashboard.context_menu.explain_ai,
      onSelect: () => handleExplain(context),
      tone: 'primary' as const,
    },
    {
      id: 'report',
      label: t.dashboard.context_menu.add_report,
      onSelect: () => handleAction(t.dashboard.context_menu.add_report, context),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'export',
      label: t.dashboard.context_menu.export,
      onSelect: () => handleAction(t.dashboard.context_menu.export, context),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'alert',
      label: t.dashboard.context_menu.set_alert,
      onSelect: () => handleAction(t.dashboard.context_menu.set_alert, context),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  return (
    <div className="space-y-8 animate-reveal">
      <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pipeline.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExplain(pipeline.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
            <InteractiveButton
              variant="secondary"
              className="!px-4 !py-2 !text-xs rounded-full"
              onClick={() => navigateWithSearch('/dashboard/guardian')}
            >
              {pipeline.actions.open_guardian}
            </InteractiveButton>
            <button
              type="button"
              onClick={(event) => openMenu(event, buildMenuItems(pipeline.title), pipeline.title)}
              aria-label={t.dashboard.context_menu.label}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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

      <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pipeline.sources.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.sources.desc}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleExplain(pipeline.sources.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
            <InteractiveButton
              variant="secondary"
              className="!px-3 !py-2 !text-xs rounded-full"
              onClick={() => handleAction(pipeline.sources.actions.test, pipeline.sources.title)}
              disabled={isDemo}
              title={isDemo ? demoTooltip : undefined}
            >
              {pipeline.sources.actions.test}
            </InteractiveButton>
            <InteractiveButton
              variant="secondary"
              className="!px-3 !py-2 !text-xs rounded-full"
              onClick={() => handleAction(pipeline.sources.actions.sync, pipeline.sources.title)}
              disabled={isDemo}
              title={isDemo ? demoTooltip : undefined}
            >
              {pipeline.sources.actions.sync}
            </InteractiveButton>
            <button
              type="button"
              onClick={(event) =>
                openMenu(event, buildMenuItems(pipeline.sources.title), pipeline.sources.title)
              }
              aria-label={t.dashboard.context_menu.label}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-gray-500">
              <tr>
                {(Object.values(pipeline.sources.columns) as string[]).map((col) => (
                  <th key={col} className="py-2 pr-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {pipeline.sources.items.map(
                (item: {
                  id: React.Key | null | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  status:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  last_sync:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  delay:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  records:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }) => (
                  <tr
                    key={item.id}
                    onContextMenu={(event) =>
                      openMenu(
                        event,
                        buildMenuItems(String(item.name ?? '')),
                        String(item.name ?? '')
                      )
                    }
                    className="hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-3 pr-4">{item.status}</td>
                    <td className="py-3 pr-4">{item.last_sync}</td>
                    <td className="py-3 pr-4">{item.delay}</td>
                    <td className="py-3 pr-4">{item.records}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleExplain(String(item.name ?? ''))}
                        className="text-xs text-brand-start hover:underline"
                      >
                        {pipeline.sources.actions.explain}
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {pipeline.transforms.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.transforms.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExplain(pipeline.transforms.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <InteractiveButton
                variant="secondary"
                className="!px-3 !py-2 !text-xs rounded-full"
                onClick={() =>
                  handleAction(pipeline.transforms.actions.run, pipeline.transforms.title)
                }
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
              >
                {pipeline.transforms.actions.run}
              </InteractiveButton>
              <button
                type="button"
                onClick={(event) =>
                  openMenu(
                    event,
                    buildMenuItems(pipeline.transforms.title),
                    pipeline.transforms.title
                  )
                }
                aria-label={t.dashboard.context_menu.label}
                className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
          <div className="mt-4 space-y-3">
            {pipeline.transforms.items.map(
              (item: {
                id: React.Key | null | undefined;
                name:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                  | Iterable<React.ReactNode>
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                status:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                desc:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
              }) => (
                <div
                  key={item.id}
                  onContextMenu={(event) =>
                    openMenu(
                      event,
                      buildMenuItems(String(item.name ?? '')),
                      String(item.name ?? '')
                    )
                  }
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <span className="text-xs text-gray-500">{item.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {pipeline.rag.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.rag.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExplain(pipeline.rag.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <InteractiveButton
                variant="secondary"
                className="!px-3 !py-2 !text-xs rounded-full"
                onClick={() => handleAction(pipeline.rag.cta, pipeline.rag.title)}
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
              >
                {pipeline.rag.cta}
              </InteractiveButton>
              <button
                type="button"
                onClick={(event) =>
                  openMenu(event, buildMenuItems(pipeline.rag.title), pipeline.rag.title)
                }
                aria-label={t.dashboard.context_menu.label}
                className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 text-sm">
              <div className="text-xs text-gray-500">{pipeline.rag.status_label}</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {pipeline.rag.status_value}
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 text-sm">
              <div className="text-xs text-gray-500">{pipeline.rag.last_update_label}</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {pipeline.rag.last_update_value}
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 text-sm">
              <div className="text-xs text-gray-500">{pipeline.rag.coverage_label}</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {pipeline.rag.coverage_value}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pipeline.bigquery.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.bigquery.desc}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleExplain(pipeline.bigquery.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
            {isDemo ? (
              <span
                title={demoTooltip}
                className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-400"
              >
                Podgląd statyczny (DEMO)
              </span>
            ) : (
              <>
                <InteractiveButton
                  variant="secondary"
                  className="!px-3 !py-2 !text-xs rounded-full"
                  onClick={() => handleAction(pipeline.bigquery.cta_open, pipeline.bigquery.title)}
                >
                  {pipeline.bigquery.cta_open}
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  className="!px-3 !py-2 !text-xs rounded-full"
                  onClick={() =>
                    handleAction(pipeline.bigquery.cta_export, pipeline.bigquery.title)
                  }
                >
                  {pipeline.bigquery.cta_export}
                </InteractiveButton>
                <button
                  type="button"
                  onClick={(event) =>
                    openMenu(
                      event,
                      buildMenuItems(pipeline.bigquery.title),
                      pipeline.bigquery.title
                    )
                  }
                  aria-label={t.dashboard.context_menu.label}
                  className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
              </>
            )}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-gray-500">
              <tr>
                {(Object.values(pipeline.bigquery.columns) as string[]).map((col) => (
                  <th key={col} className="py-2 pr-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {pipeline.bigquery.items.map(
                (item: {
                  id: React.Key | null | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  desc:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  freshness:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }) => (
                  <tr
                    key={item.id}
                    onContextMenu={(event) =>
                      openMenu(
                        event,
                        buildMenuItems(String(item.name ?? '')),
                        String(item.name ?? '')
                      )
                    }
                    className="hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{item.desc}</td>
                    <td className="py-3 pr-4">{item.freshness}</td>
                    <td className="py-3">
                      {isDemo ? (
                        <span className="text-xs text-gray-400">
                          {pipeline.bigquery.lineage_cta}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleExplain(String(item.name ?? ''))}
                          className="text-xs text-brand-start hover:underline"
                        >
                          {pipeline.bigquery.lineage_cta}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default PipelineView;
