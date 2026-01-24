// DashboardPrimitives.tsx
// Zbiór prymitywów UI dla dashboardu: hooki (Alt, loading, context menu),
// context menu, skeleton, empty state, prosty wykres trendu i LazySection.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InteractiveButton } from '../InteractiveButton';
import type { ContextMenuState } from './DashboardPrimitives.types';

/** Simple Context Menu Component */
export const ContextMenu: React.FC<{
  menu: ContextMenuState;
  onClose: () => void;
}> = ({ menu, onClose }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (menu) menuRef.current?.focus();
  }, [menu]);

  useEffect(() => {
    if (!menu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menu, onClose]);

  if (!menu || !menu.items) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  // pozycjonowanie uwzględnia viewport i przybliżone wymiary menu
  const MENU_W = 224; // w-56
  const MENU_H = Math.min(320, 64 + menu.items.length * 44);
  const pad = 8;

  const left = Math.min(window.innerWidth - MENU_W - pad, Math.max(pad, menu.x));
  const top = Math.min(window.innerHeight - MENU_H - pad, Math.max(pad, menu.y));

  return (
    <>
      <div
        className="fixed inset-0 z-[5000]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
        aria-hidden="true"
      />
      <div
        ref={menuRef}
        className="fixed z-[5001] w-56 bg-white dark:bg-[#0A0A0C] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-reveal p-1.5"
        style={{ left, top }}
        role="menu"
        aria-label={menu.label}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div
          className="px-3 py-2 text-2xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-1"
          role="presentation"
        >
          {menu.label}
        </div>

        {menu.items.map((item) => {
          if (!item?.id) return null;

          const isDisabled = Boolean(item.disabled);
          const toneClass = item.tone === 'primary' ? 'text-brand-start' : 'text-gray-600 dark:text-gray-300';
          const hoverClass = isDisabled
            ? ''
            : item.tone === 'primary'
            ? 'hover:bg-brand-start/5'
            : 'hover:bg-black/5 dark:hover:bg-white/5';

          return (
            <button
              key={item.id}
              type="button"
              disabled={isDisabled}
              aria-disabled={isDisabled}
              title={isDisabled ? item.disabledReason : undefined}
              role="menuitem"
              onClick={() => {
                if (isDisabled) return;
                item.onSelect?.();
                onClose();
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${toneClass} ${hoverClass} ${
                isDisabled ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

/** Skeleton Loader */
export const WidgetSkeleton: React.FC<{
  chartHeight: string;
  lines: number;
}> = ({ chartHeight, lines }) => (
  <div className="space-y-4 animate-pulse">
    <div className={`w-full rounded-2xl bg-gray-200/50 dark:bg-white/5 ${chartHeight}`} />
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200/50 dark:bg-white/5 rounded-full w-full opacity-60"
        style={{ width: `${100 - i * 15}%` }}
      />
    ))}
  </div>
);

/** Empty State */
export const WidgetEmptyState: React.FC<{
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'warning' | 'error';
}> = ({ title, desc, actionLabel, onAction, tone = 'default' }) => {
  const toneStyles = {
    default: 'bg-gray-100 dark:bg-white/5 text-gray-400',
    warning: 'bg-amber-500/10 text-amber-600',
    error: 'bg-rose-500/10 text-rose-500',
  } as const;

  return (
    <div
      className="flex flex-col items-center justify-center p-10 text-center space-y-4 rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#0b0b0f]/70 backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <div className={`p-4 rounded-full ${toneStyles[tone]}`}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.34a2 2 0 01-1.782 0l-.691-.34a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547l-.34.34a2 2 0 000 2.828l1.246 1.246a2 2 0 002.828 0l.34-.34a2 2 0 00.547-1.022l.477-2.387a6 6 0 01.517-3.86l.34-.691a2 2 0 010-1.782l-.34-.691a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00-.547-1.022l-.34-.34a2 2 0 00-2.828 0l-1.246 1.246a2 2 0 000 2.828l.34.34a2 2 0 001.022.547l2.387.477a6 6 0 003.86-.517l.691-.34a2 2 0 011.782 0l.691.34a6 6 0 003.86.517l2.387-.477a2 2 0 001.022-.547l.34-.34a2 2 0 000-2.828l-1.246-1.246a2 2 0 00-2.828 0l-.34.34a2 2 0 00-.547 1.022l-.477 2.387a6 6 0 01-.517 3.86l-.34.691a2 2 0 010 1.782l.34.691a6 6 0 015.17 3.86l-.477 2.387a2 2 0 00.547 1.022l.34.34a2 2 0 002.828 0l1.246-1.246a2 2 0 000-2.828l-.34-.34z"
          />
        </svg>
      </div>

      <h4 className="text-sm font-black uppercase text-gray-900 dark:text-white">{title}</h4>
      <p className="text-xs text-gray-500 max-w-[240px]">{desc}</p>

      {actionLabel && onAction && (
        <InteractiveButton
          variant={tone === 'error' ? 'primary' : 'secondary'}
          onClick={onAction}
          className="!h-10 !px-6 !text-2xs !font-black uppercase tracking-widest rounded-xl"
        >
          {actionLabel}
        </InteractiveButton>
      )}
    </div>
  );
};

export const WidgetErrorState: React.FC<{
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, desc, actionLabel, onAction }) => (
  <WidgetEmptyState
    title={title}
    desc={desc}
    actionLabel={actionLabel}
    onAction={onAction}
    tone="error"
  />
);

export const WidgetOfflineState: React.FC<{
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, desc, actionLabel, onAction }) => (
  <WidgetEmptyState
    title={title}
    desc={desc}
    actionLabel={actionLabel}
    onAction={onAction}
    tone="warning"
  />
);

export const WidgetPartialState: React.FC<{
  title: string;
  desc: string;
}> = ({ title, desc }) => <WidgetEmptyState title={title} desc={desc} tone="warning" />;

/** Typy dla trend chartu */
export type TrendSeries = {
  id: string;
  values: number[];
  colorClass?: string;
};

export interface TrendChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  desc: string;
  series?: TrendSeries[];
  dates?: (string | number)[];
  onOpenMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  menuAriaLabel?: string;
}

/** Trend Chart Primitive */
export const TrendChartCard: React.FC<TrendChartCardProps> = ({
  title,
  desc,
  series,
  dates,
  onOpenMenu,
  menuAriaLabel,
  className,
  ...rest
}) => {
  const safeSeries = useMemo(() => (series || []).filter((s): s is TrendSeries => Boolean(s && s.id)), [series]);

  // jeśli brak dates, budujemy oś po najdłuższej serii
  const inferredLen = safeSeries.reduce((m, s) => Math.max(m, s.values?.length ?? 0), 0);
  const axis = useMemo<(string | number)[]>(
    () => (dates?.length ? dates : Array.from({ length: inferredLen }).map((_, i) => i)),
    [dates, inferredLen],
  );

  const allValues = safeSeries.flatMap((s) => s.values ?? []);
  const maxVal = allValues.length ? Math.max(1, ...allValues.filter((v) => Number.isFinite(v))) : 100;

  const firstLabel = axis[0];
  const midLabel = axis[Math.floor((axis.length || 1) / 2)];
  const lastLabel = axis.length ? axis[axis.length - 1] : undefined;

  return (
    <div
      className={`rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl space-y-6 ${
        className ?? ''
      }`}
      {...rest}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>

        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={menuAriaLabel ?? `${title} menu`}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
            </svg>
          </button>
        )}
      </div>

      <div className="h-44 flex items-end justify-between gap-1 group/chart pt-4">
        {axis.map((d, i) => (
          <div key={String(d)} className="flex-1 flex flex-col justify-end h-full gap-0.5 relative group/bar">
            {safeSeries.map((s) => {
              const value = s.values?.[i] ?? 0;
              const safeValue = Number.isFinite(value) ? value : 0;
              const height = maxVal > 0 ? (safeValue / maxVal) * 100 : 0;
              const isBrand = (s.colorClass ?? '').includes('brand');

              return (
                <div
                  key={s.id}
                  className={`w-full rounded-t-sm transition-all duration-500 ${
                    isBrand ? 'brand-gradient-bg opacity-70' : 'bg-emerald-500 opacity-70'
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
            <div className="absolute inset-0 bg-brand-start/5 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-sm" />
          </div>
        ))}
      </div>

      <div className="flex justify-between text-3xs font-mono font-bold text-gray-400 uppercase tracking-widest pt-2 border-t border-black/5 dark:border-white/5">
        <span>{firstLabel}</span>
        <span>{midLabel}</span>
        <span>{lastLabel}</span>
      </div>
    </div>
  );
};

export const LazySection: React.FC<{
  children: React.ReactNode;
  fallback: React.ReactNode;
  className?: string;
}> = ({ children, fallback, className }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 100);
    return () => window.clearTimeout(t);
  }, []);

  return <div className={className}>{visible ? children : fallback}</div>;
};
