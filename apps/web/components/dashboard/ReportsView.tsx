// ReportsView.tsx
// Widok "Reports": zarządzanie raportami zarządczymi – nagłówek,
// ostatni raport, historia raportów i kreator generowania, z akcjami Papa AI
// podpiętymi do menu kontekstowego.

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { ContextMenu, WidgetEmptyState } from './DashboardPrimitives';
import { useContextMenu } from './DashboardPrimitives.hooks';

type ExportHistoryItem = {
  id: string;
  name: string;
  format: string;
  range: string;
  created: string;
  urlLabel: string;
};

type GenerateField = {
  label: string;
  value: string;
};

type ReportListItem = {
  id: string;
  name: string;
  range: string;
  status: string;
};

export const ReportsView: React.FC = () => {
  const { t, setContextLabel, setAiDraft, isDemo } =
    useOutletContext<DashboardOutletContext>();
  const { menu, openMenu, closeMenu } = useContextMenu();
  const demoTooltip = t.dashboard.demo_tooltip;

  const exportFormats = t.dashboard.reports_v2?.export_formats ?? [];
  const exportHistory = t.dashboard.reports_v2?.export_history ?? [];
  const diffItems = t.dashboard.reports_v2?.diff?.items ?? [];
  const listItems: ReportListItem[] = t.dashboard.reports_v2?.list?.items ?? [];
  const generateFields: GenerateField[] = t.dashboard.reports_v2?.generate?.fields ?? [];
  const generateSections = t.dashboard.reports_v2?.generate?.sections ?? [];

  const handleExplain = (context: string) => {
    setContextLabel?.(context);
    setAiDraft?.(`${t.dashboard.context_menu.explain_ai}: ${context}`);
  };

  const handleDemoBlocked = (label: string, context: string) => {
    // W DEMO: nie rób „cichego nic” — daj feedback i kontekst dla AI.
    setContextLabel?.(demoTooltip || context);
    setAiDraft?.(`${label}: ${context}\n\n${demoTooltip || ''}`.trim());
  };

  const handleAction = (label: string, context: string) => {
    if (isDemo) return handleDemoBlocked(label, context);
    setContextLabel?.(context);
    setAiDraft?.(`${label}: ${context}`);
  };

  const buildMenuItems = (context: string) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => setContextLabel?.(context),
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
              {t.dashboard.reports_v2.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.dashboard.reports_v2.desc}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExplain(t.dashboard.reports_v2.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
            <InteractiveButton
              variant="primary"
              className="!px-4 !py-2 !text-xs rounded-full"
              onClick={() =>
                handleAction(t.dashboard.reports_v2.generate.cta, t.dashboard.reports_v2.title)
              }
              disabled={isDemo}
              title={isDemo ? demoTooltip : undefined}
            >
              {t.dashboard.reports_v2.generate.cta}
            </InteractiveButton>
            <button
              type="button"
              onClick={(event) =>
                openMenu(event, buildMenuItems(t.dashboard.reports_v2.title), t.dashboard.reports_v2.title)
              }
              aria-label={`${t.dashboard.context_menu.label}: ${t.dashboard.reports_v2.title}`}
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

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.dashboard.reports_v2.last_report.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.dashboard.reports_v2.last_report.desc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExplain(t.dashboard.reports_v2.last_report.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <button
                type="button"
                onClick={(event) =>
                  openMenu(
                    event,
                    buildMenuItems(t.dashboard.reports_v2.last_report.title),
                    t.dashboard.reports_v2.last_report.title
                  )
                }
                aria-label={`${t.dashboard.context_menu.label}: ${t.dashboard.reports_v2.last_report.title}`}
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

          <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {t.dashboard.reports_v2.last_report.name}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {t.dashboard.reports_v2.last_report.range_label}:{' '}
              {t.dashboard.reports_v2.last_report.range_value}
            </div>
            <div className="text-xs text-gray-500">
              {t.dashboard.reports_v2.last_report.date_label}:{' '}
              {t.dashboard.reports_v2.last_report.date_value}
            </div>
            <div className="text-xs text-gray-500">
              {t.dashboard.reports_v2.last_report.language_label}:{' '}
              {t.dashboard.reports_v2.last_report.language_value}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <InteractiveButton
                variant="secondary"
                className="!px-3 !py-2 !text-xs rounded-full"
                onClick={() =>
                  handleAction(
                    t.dashboard.reports_v2.last_report.cta_preview,
                    t.dashboard.reports_v2.last_report.name
                  )
                }
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
              >
                {t.dashboard.reports_v2.last_report.cta_preview}
              </InteractiveButton>

              {exportFormats.map((format: string) => (
                <InteractiveButton
                  key={format}
                  variant="secondary"
                  className="!px-3 !py-2 !text-xs rounded-full"
                  onClick={() => handleAction(format, t.dashboard.reports_v2.last_report.name)}
                  disabled={isDemo}
                  title={isDemo ? demoTooltip : undefined}
                >
                  {format}
                </InteractiveButton>
              ))}

              <InteractiveButton
                variant="secondary"
                className="!px-3 !py-2 !text-xs rounded-full"
                onClick={() =>
                  handleAction(
                    t.dashboard.reports_v2.last_report.cta_resend,
                    t.dashboard.reports_v2.last_report.name
                  )
                }
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
              >
                {t.dashboard.reports_v2.last_report.cta_resend}
              </InteractiveButton>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t.dashboard.reports_v2.diff.title}
            </h4>
            {diffItems.length === 0 ? (
              <div className="mt-3 text-xs text-gray-500">
                —
              </div>
            ) : (
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                {diffItems.map((item: string) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-start" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.dashboard.reports_v2.list.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExplain(t.dashboard.reports_v2.list.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <button
                type="button"
                onClick={(event) =>
                  openMenu(event, buildMenuItems(t.dashboard.reports_v2.list.title), t.dashboard.reports_v2.list.title)
                }
                aria-label={`${t.dashboard.context_menu.label}: ${t.dashboard.reports_v2.list.title}`}
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
            {listItems.length === 0 ? (
              <WidgetEmptyState
                title={t.dashboard.reports_v2?.list?.empty_title ?? 'Brak raportów'}
                desc={
                  t.dashboard.reports_v2?.list?.empty_desc ??
                  'Nie masz jeszcze żadnych raportów. Wygeneruj pierwszy raport zarządczy.'
                }
                actionLabel={t.dashboard.reports_v2.generate.cta}
                onAction={() => handleAction(t.dashboard.reports_v2.generate.cta, t.dashboard.reports_v2.generate.title)}
              />
            ) : (
              listItems.map((report) => (
                <div
                  key={report.id}
                  onContextMenu={(event) => openMenu(event, buildMenuItems(report.name), report.name)}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {report.name}
                      </div>
                      <div className="text-xs text-gray-500">{report.range}</div>
                    </div>
                    <span className="text-xs text-gray-500">{report.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-xs text-brand-start hover:underline"
                      onClick={() =>
                        handleAction(t.dashboard.reports_v2.list.actions.preview, report.name)
                      }
                      disabled={isDemo}
                      title={isDemo ? demoTooltip : undefined}
                    >
                      {t.dashboard.reports_v2.list.actions.preview}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      onClick={() =>
                        handleAction(t.dashboard.reports_v2.list.actions.download, report.name)
                      }
                      disabled={isDemo}
                      title={isDemo ? demoTooltip : undefined}
                    >
                      {t.dashboard.reports_v2.list.actions.download}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => handleAction(t.dashboard.reports_v2.list.actions.open, report.name)}
                      disabled={isDemo}
                      title={isDemo ? demoTooltip : undefined}
                    >
                      {t.dashboard.reports_v2.list.actions.open}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
            <div className="text-xs font-semibold text-gray-900 dark:text-white">
              {t.dashboard.reports_v2?.history_title ?? 'Historia eksportów'}
            </div>

            <div className="mt-3 space-y-2 text-xs text-gray-500">
              {exportHistory.length === 0 ? (
                <div className="text-xs text-gray-500">—</div>
              ) : (
                exportHistory.map((item: ExportHistoryItem) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">
                        {item.name} • {item.format}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.range} • {item.created}
                      </div>
                    </div>
                    <InteractiveButton
                      variant="secondary"
                      className="!px-3 !py-2 !text-xs rounded-full"
                      onClick={() => handleAction(item.urlLabel, item.name)}
                      disabled={isDemo}
                      title={isDemo ? demoTooltip : undefined}
                    >
                      {item.urlLabel}
                    </InteractiveButton>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.dashboard.reports_v2.generate.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.dashboard.reports_v2.generate.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExplain(t.dashboard.reports_v2.generate.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
            <button
              type="button"
              onClick={(event) =>
                openMenu(
                  event,
                  buildMenuItems(t.dashboard.reports_v2.generate.title),
                  t.dashboard.reports_v2.generate.title
                )
              }
              aria-label={`${t.dashboard.context_menu.label}: ${t.dashboard.reports_v2.generate.title}`}
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

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {generateFields.map((field: GenerateField) => (
            <div
              key={field.label}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4"
            >
              <div className="text-xs text-gray-500">{field.label}</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {field.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {generateSections.map((section: string) => (
            <label key={section} className="flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                defaultChecked
                name="report_sections"
                value={section}
                className="accent-brand-start"
              />
              {section}
            </label>
          ))}
        </div>

        <div className="mt-6">
          <InteractiveButton
            variant="primary"
            className="!px-5 !py-2 !text-xs rounded-full"
            onClick={() => handleAction(t.dashboard.reports_v2.generate.cta, t.dashboard.reports_v2.generate.title)}
            disabled={isDemo}
            title={isDemo ? demoTooltip : undefined}
          >
            {t.dashboard.reports_v2.generate.cta}
          </InteractiveButton>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Eksport:</span>
          {exportFormats.map((format: string) => (
            <InteractiveButton
              key={format}
              variant="secondary"
              className="!px-3 !py-2 !text-xs rounded-full"
              onClick={() => handleAction(format, t.dashboard.reports_v2.generate.title)}
              disabled={isDemo}
              title={isDemo ? demoTooltip : undefined}
            >
              {format}
            </InteractiveButton>
          ))}
        </div>
      </section>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default ReportsView;
