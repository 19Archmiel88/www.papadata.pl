/**
 * PricingModal.tsx
 * Modal porownujacy plany cenowe (Starter / Professional / Enterprise).
 * Content-only: overlay/ESC/scroll/focus obsluguje ModalContainer.
 */

import React, { useMemo, useId } from 'react';
import { InteractiveButton } from './InteractiveButton';
import type { Translation } from '../types';

interface PricingModalProps {
  t: Translation;
  isOpen?: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ t, isOpen = true, onClose }) => {
  const modalId = useId();
  const titleId = `pricing-title-${modalId}`;
  const descId = `pricing-desc-${modalId}`;

  const checkIcon = useMemo(
    () => (
      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ),
    [],
  );

  const dashIcon = useMemo(
    () => <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">—</span>,
    [],
  );

  const comparisonData = useMemo(
    () => [
      { label: t.pricing.comparison.protocol_label, starter: 'S-1 Shared', pro: 'P-1 Dedicated', ent: 'E-1 Isolated' },
      {
        label: t.pricing.comparison.data_retention,
        starter: `30 ${t.pricing.comparison.data_retention_unit}`,
        pro: `90 ${t.pricing.comparison.data_retention_unit}`,
        ent: t.pricing.comparison.unlimited,
      },
      {
        label: t.pricing.comparison.data_sources_label,
        starter: t.pricing.comparison.data_sources_starter,
        pro: t.pricing.comparison.data_sources_pro,
        ent: t.pricing.comparison.unlimited,
      },
      {
        label: t.pricing.comparison.report_frequency_label,
        starter: t.pricing.comparison.report_frequency_weekly,
        pro: t.pricing.comparison.report_frequency_daily,
        ent: t.pricing.comparison.realtime,
      },
      {
        label: t.pricing.comparison.support_label,
        starter: t.pricing.comparison.support_standard,
        pro: t.pricing.comparison.support_priority,
        ent: t.pricing.comparison.support_dedicated,
      },
      {
        label: t.pricing.comparison.ai_semantic_label,
        starter: t.pricing.comparison.ai_semantic_starter,
        pro: t.pricing.comparison.ai_semantic_pro,
        ent: t.pricing.comparison.unlimited,
      },
      { label: t.pricing.comparison.custom_etl_label, starter: dashIcon, pro: dashIcon, ent: checkIcon },
      { label: t.pricing.comparison.bigquery_export_label, starter: dashIcon, pro: checkIcon, ent: checkIcon },
      { label: t.pricing.comparison.uptime_sla_label, starter: dashIcon, pro: '99.9%', ent: '99.99%' },
    ],
    [t, checkIcon, dashIcon],
  );

  if (!isOpen) return null;

  return (
    <div
      className="relative w-full max-w-6xl glass bg-white dark:bg-[#0A0A0C]/98 rounded-[2.5rem] md:rounded-[4rem] border border-brand-start/20 shadow-[0_50px_110px_rgba(0,0,0,0.72)] overflow-hidden flex flex-col max-h-[92vh]"
      role="document"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="shrink-0 p-8 sm:p-12 border-b border-light-border dark:border-white/5 flex items-center justify-between bg-inherit z-30">
        <div className="space-y-3">
          <h3
            id={titleId}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1]"
          >
            {t.pricing.modal_title}
          </h3>

          <div id={descId} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
            <span className="text-xs sm:text-xs-plus font-mono font-bold tracking-[0.3em] uppercase text-gray-500">
              {t.pricing.comparison.header_tag}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-brand-start transition-all text-gray-400 hover:text-white group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 cursor-pointer"
          aria-label={t.common.close}
          type="button"
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar scroll-smooth px-8 sm:px-12 py-10 scroll-hint">
        <div className="min-w-[760px]">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only">{t.pricing.comparison.feature_matrix_label}</caption>

            <thead className="sticky top-0 z-20 bg-white/90 dark:bg-[#0A0A0C]/90 backdrop-blur-md">
              <tr className="border-b-2 border-black/5 dark:border-white/5">
                <th
                  scope="col"
                  className="py-6 px-4 text-xs font-black tracking-widest text-gray-400 uppercase"
                >
                  {t.pricing.comparison.feature_matrix_label}
                </th>
                <th
                  scope="col"
                  className="py-6 px-4 text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter"
                >
                  {t.pricing.starter.name}
                </th>
                <th scope="col" className="py-6 px-4 text-xl font-black text-brand-start uppercase tracking-tighter">
                  {t.pricing.professional.name}
                </th>
                <th
                  scope="col"
                  className="py-6 px-4 text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter"
                >
                  {t.pricing.enterprise.name}
                </th>
              </tr>
            </thead>

            <tbody>
              {comparisonData.map((row, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5"
                >
                  <th
                    scope="row"
                    className="py-5 px-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight"
                  >
                    {row.label}
                  </th>
                  <td className="py-5 px-4 text-sm font-black text-gray-900 dark:text-white">{row.starter}</td>
                  <td className="py-5 px-4 text-sm font-black text-brand-start">{row.pro}</td>
                  <td className="py-5 px-4 text-sm font-black text-gray-900 dark:text-white">{row.ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.pricing.modal_highlights.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-3xl bg-brand-start/5 border border-brand-start/10 transition-colors hover:bg-brand-start/10"
            >
              <div className="mt-0.5 w-6 h-6 rounded-full bg-brand-start/20 flex items-center justify-center shrink-0">
                {checkIcon}
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight leading-tight">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 p-8 bg-black/5 dark:bg-black/40 border-t border-light-border dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 z-30">
        <span className="text-xs text-gray-500 font-black uppercase tracking-[0.4em] opacity-60">
          {t.pricing.comparison.footer_system}
        </span>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 opacity-60" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            ))}
          </div>

          <span className="text-2xs font-mono font-bold tracking-[0.3em] text-gray-500 uppercase opacity-60">
            {t.pricing.comparison.footer_ssl}
          </span>

          <InteractiveButton
            variant="secondary"
            onClick={onClose}
            className="!h-9 !px-5 !text-2xs !font-black uppercase tracking-widest rounded-xl"
          >
            {t.common.close}
          </InteractiveButton>
        </div>
      </div>
    </div>
  );
};
