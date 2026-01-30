import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext, GcpRegion } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { WidgetErrorState, WidgetOfflineState, WidgetSkeleton } from './DashboardPrimitives';
import { fetchSettingsWorkspace } from '../../data/api';
import type { SettingsWorkspaceResponse } from '@papadata/shared';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { captureException } from '../../utils/telemetry';

type ActiveConnector = {
  id: string | number;
  label: string;
  desc: string;
  status: string;
};

type AttributionModel = {
  id: string | number;
  label: string;
  desc: string;
  default?: boolean;
};

type AlertItem = {
  id: string | number;
  label: string;
  enabled?: boolean;
};

type ReportScheduleItem = {
  id: string | number;
  label: string;
  value: string;
};

type AiConfigItem = {
  label: string;
  value: string;
};

export const SettingsWorkspaceView: React.FC = () => {
  const {
    t,
    retentionDays,
    setRetentionDays,
    maskingEnabled,
    setMaskingEnabled,
    region,
    setRegion,
    isDemo,
    isReadOnly,
    apiAvailable,
    setContextLabel,
    setAiDraft,
  } = useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();

  const [workspaceData, setWorkspaceData] = useState<SettingsWorkspaceResponse | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const demoTooltip = t.dashboard.demo_tooltip;
  const lockTooltip = isDemo ? demoTooltip : t.dashboard.billing.read_only_tooltip;
  const isLocked = Boolean(isDemo || isReadOnly);

  useEffect(() => {
    let active = true;

    if (apiAvailable === false) {
      setWorkspaceData(null);
      setWorkspaceError(null);
      setWorkspaceLoading(false);
      return () => {
        active = false;
      };
    }

    setWorkspaceLoading(true);
    setWorkspaceError(null);

    fetchSettingsWorkspace()
      .then((data) => {
        if (!active) return;
        setWorkspaceData(data);
        setWorkspaceError(null);

        if (typeof data.retentionDays === 'number' && Number.isFinite(data.retentionDays)) {
          setRetentionDays(data.retentionDays);
        }
        if (typeof data.maskingEnabled === 'boolean') {
          setMaskingEnabled(data.maskingEnabled);
        }
        const preferredRegion = (data.regions ?? []).find(
          (value): value is GcpRegion => value === 'europe-central2' || value === 'europe-west1'
        );
        if (preferredRegion) setRegion(preferredRegion);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : t.dashboard.widget.error_desc;
        setWorkspaceError(message);
        captureException(new Error(message), { scope: 'settings_workspace' });
      })
      .finally(() => {
        if (active) setWorkspaceLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    apiAvailable,
    retryToken,
    setRetentionDays,
    setMaskingEnabled,
    setRegion,
    t.dashboard.widget.error_desc,
  ]);

  const retentionOptions = useMemo(() => {
    const baseOptions = (t.dashboard.settings_workspace_v2.data.retention_options ?? []) as Array<{
      value?: number | null;
      label?: string;
    }>;
    const apiOptions = workspaceData?.retentionOptions ?? [];
    if (!apiOptions.length) return baseOptions;

    const baseMap = new Map(
      baseOptions
        .filter((option) => typeof option?.value === 'number')
        .map((option) => [option.value as number, option])
    );

    return apiOptions.map((value) => {
      const fallback = baseMap.get(value);
      return fallback ?? { value, label: `${value} days` };
    });
  }, [t, workspaceData]);
  const retentionWarning = t.dashboard.settings_workspace_v2.data.retention_warning;

  const attributionModels = useMemo(() => {
    const baseModels = (t.dashboard.settings_workspace_v2.attribution.models ??
      []) as AttributionModel[];
    const apiModels = workspaceData?.attributionModels ?? [];
    if (!apiModels.length) return baseModels;

    const allowed = new Set(apiModels.map((model) => String(model)));
    const filtered = baseModels.filter((model) => allowed.has(String(model.id)));
    return filtered.length ? filtered : baseModels;
  }, [t, workspaceData]);

  const activeConnectors = useMemo(() => {
    const baseItems = (t.dashboard.settings_workspace_v2.integrations.items ??
      []) as ActiveConnector[];
    const apiConnectors = workspaceData?.connectors ?? [];
    if (!apiConnectors.length) return baseItems;

    const baseMap = new Map(baseItems.map((item) => [String(item.id), item]));

    return apiConnectors.map((connector) => {
      const fallback = baseMap.get(String(connector.id));
      const i18nMeta = t.integrations.items?.[connector.id as keyof typeof t.integrations.items];
      const label = fallback?.label ?? i18nMeta?.name ?? connector.name ?? String(connector.id);
      const desc = fallback?.desc ?? i18nMeta?.detail ?? '';
      const status = connector.enabled
        ? (fallback?.status ?? 'Active')
        : (fallback?.status ?? 'Disabled');
      return { id: connector.id, label, desc, status };
    });
  }, [t, workspaceData]);
  const aiConfig = (t.dashboard.settings_workspace_v2.ai.items ?? []) as AiConfigItem[];
  const notificationConfig = t.dashboard.settings_workspace_v2.notifications;

  const reportSchedules = (notificationConfig?.schedules ?? []) as ReportScheduleItem[];
  const exportFormats: string[] = notificationConfig?.export_formats ?? [];
  const alertRecipients: string[] = (notificationConfig?.recipients ?? []) as string[];
  const quietHours = notificationConfig?.quiet_hours_value ?? '';

  const regionLabel = region ?? 'europe-central2';

  const safeRetentionValues = useMemo(() => {
    const values = retentionOptions
      .map((option: { value?: number | null }) =>
        typeof option?.value === 'number' && Number.isFinite(option.value) ? option.value : null
      )
      .filter((v: number | null): v is number => v !== null);
    return values.length ? values : [retentionDays];
  }, [retentionOptions, retentionDays]);

  const handleExplain = (label: string) => {
    setContextLabel?.(label);
    setAiDraft?.(`${t.dashboard.context_menu.explain_ai}: ${label}`);
  };

  const handleAction = (label: string, context: string) => {
    if (isLocked) {
      // DEMO/read-only: zamiast "ciche nic", dajemy jasny kontekst
      setContextLabel?.(lockTooltip);
      setAiDraft?.(`${lockTooltip} • ${label}: ${context}`);
      return;
    }
    setContextLabel?.(context);
    setAiDraft?.(`${label}: ${context}`);
  };

  const handleRetentionChange = (raw: string) => {
    if (isLocked) {
      setContextLabel?.(lockTooltip);
      setAiDraft?.(`${lockTooltip}: ${t.dashboard.settings_workspace_v2.data.retention_label}`);
      return;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setContextLabel?.(t.dashboard.settings_workspace_v2.data.title);
      setAiDraft?.(`Invalid retention value: ${raw}`);
      return;
    }

    const allowed = safeRetentionValues.includes(parsed);
    const next = allowed ? parsed : safeRetentionValues[0];

    setRetentionDays(next);
    setContextLabel?.(t.dashboard.settings_workspace_v2.data.title);
    setAiDraft?.(`${t.dashboard.settings_workspace_v2.data.retention_label}: ${next}`);
  };

  const retentionCtaLabel = retentionWarning?.cta_export?.trim();
  const hasRetentionCta = Boolean(retentionCtaLabel);

  return (
    <div className="space-y-8 animate-reveal pb-20">
      {/* Header */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                {t.dashboard.settings_workspace_v2.badge_label}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.settings_workspace_v2.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.settings_workspace_v2.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleExplain(t.dashboard.settings_workspace_v2.title)}
            className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
          >
            {t.dashboard.context_menu.explain_ai}
          </button>
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

      {isOnline && workspaceError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={workspaceError || t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      {workspaceLoading && !workspaceData && (
        <section className="dashboard-surface dashboard-card">
          <WidgetSkeleton chartHeight="h-28" lines={3} />
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Data & Privacy */}
        <div className="dashboard-surface dashboard-card space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {t.dashboard.settings_workspace_v2.data.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t.dashboard.settings_workspace_v2.data.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExplain(t.dashboard.settings_workspace_v2.data.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          <div className="space-y-6">
            {/* Retention */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">
                {t.dashboard.settings_workspace_v2.data.retention_label}
              </label>
              <select
                value={retentionDays}
                onChange={(event) => handleRetentionChange(event.target.value)}
                disabled={isLocked}
                title={isLocked ? lockTooltip : undefined}
                className="w-full px-5 py-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm font-bold outline-none focus:border-brand-start/50 transition-all appearance-none"
              >
                {retentionOptions.map(
                  (option: { value?: number | null; label?: string }, index: number) => (
                    <option key={option.value ?? option.label ?? index} value={option.value ?? ''}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Retention warning */}
            <div className="p-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">
                  {retentionWarning?.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {retentionWarning?.desc}
                </div>
              </div>

              {hasRetentionCta && (
                <InteractiveButton
                  variant="secondary"
                  className="!px-5 !py-2 !text-xs font-black uppercase tracking-[0.2em] rounded-xl"
                  onClick={() =>
                    handleAction(retentionCtaLabel!, t.dashboard.settings_workspace_v2.data.title)
                  }
                  disabled={isLocked}
                  title={isLocked ? lockTooltip : undefined}
                >
                  {retentionCtaLabel}
                </InteractiveButton>
              )}
            </div>

            {/* Masking toggle */}
            <div className="p-5 rounded-2xl bg-brand-start/5 border border-brand-start/10 flex items-center justify-between group">
              <div className="space-y-1">
                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.settings_workspace_v2.privacy.masking_label}
                </div>
                <div className="text-xs-plus text-gray-500 font-medium">
                  {t.dashboard.settings_workspace_v2.privacy.masking_desc}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isLocked) {
                    setContextLabel?.(lockTooltip);
                    setAiDraft?.(
                      `${lockTooltip} • ${t.dashboard.settings_workspace_v2.privacy.masking_label}`
                    );
                    return;
                  }
                  setMaskingEnabled(!maskingEnabled);
                  setContextLabel?.(t.dashboard.settings_workspace_v2.data.title);
                  setAiDraft?.(
                    `${t.dashboard.settings_workspace_v2.privacy.masking_label}: ${
                      !maskingEnabled ? 'ON' : 'OFF'
                    }`
                  );
                }}
                disabled={isLocked}
                aria-pressed={maskingEnabled}
                aria-label={t.dashboard.settings_workspace_v2.privacy.masking_label}
                title={isLocked ? lockTooltip : undefined}
                className={`relative w-12 h-6 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                  maskingEnabled ? 'brand-gradient-bg' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-500 shadow-sm ${
                    maskingEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Region (read-only) */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">
                {t.dashboard.settings_workspace_v2.data.region_label}
              </label>
              <div className="w-full px-5 py-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm font-bold flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">{regionLabel}</span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-500">
                  EU
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attribution Models */}
        <div className="dashboard-surface dashboard-card space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {t.dashboard.settings_workspace_v2.attribution.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t.dashboard.settings_workspace_v2.attribution.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExplain(t.dashboard.settings_workspace_v2.attribution.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          <div className="space-y-4">
            {attributionModels.map((model: AttributionModel) => (
              <label
                key={model.id}
                className="flex items-start gap-4 p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-brand-start/30 transition-all cursor-pointer group"
              >
                <input
                  type="radio"
                  name="attribution"
                  defaultChecked={model.default}
                  disabled={isLocked}
                  title={isLocked ? lockTooltip : undefined}
                  className="mt-1 accent-brand-start w-4 h-4"
                />
                <div className="space-y-1">
                  <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                    {model.label}
                  </div>
                  <div className="text-xs-plus text-gray-500 font-medium leading-relaxed">
                    {model.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Active Integrations Summary */}
        <div className="dashboard-surface dashboard-card space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {t.dashboard.settings_workspace_v2.integrations.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t.dashboard.settings_workspace_v2.integrations.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExplain(t.dashboard.settings_workspace_v2.integrations.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          <div className="space-y-3">
            {activeConnectors.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between group hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-brand-start transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-1.415 1.414a4 4 0 105.657 5.657l1.414-1.415M10.172 13.828a4 4 0 005.656 0l1.415-1.414a4 4 0 10-5.657-5.657l-1.414 1.415"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {item.label}
                    </div>
                    <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-2xs font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
                    String(item.status).toLowerCase() === 'active'
                      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                      : String(item.status).toLowerCase() === 'attention'
                        ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                        : 'text-gray-400 bg-black/5 border-black/10'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="dashboard-surface dashboard-card space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {t.dashboard.settings_workspace_v2.alerts.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t.dashboard.settings_workspace_v2.alerts.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExplain(t.dashboard.settings_workspace_v2.alerts.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          <div className="space-y-4">
            {(t.dashboard.settings_workspace_v2.alerts.items ?? []).map((item: AlertItem) => (
              <label
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer group"
              >
                <input
                  type="checkbox"
                  defaultChecked={item.enabled}
                  disabled={isLocked}
                  title={isLocked ? lockTooltip : undefined}
                  className="w-4 h-4 accent-brand-start"
                />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight group-hover:text-brand-start transition-colors">
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {notificationConfig?.channels_title}
              </div>
              <label className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                  {notificationConfig?.email_label}
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  disabled={isLocked}
                  title={isLocked ? lockTooltip : undefined}
                  className="w-4 h-4 accent-brand-start"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {notificationConfig?.schedule_title}
              </div>
              <div className="space-y-2">
                {reportSchedules.map((item: ReportScheduleItem) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {notificationConfig?.recipients_title}
              </div>
              <div className="flex flex-wrap gap-2">
                {alertRecipients.map((recipient) => (
                  <span
                    key={recipient}
                    className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-xs font-black uppercase tracking-widest text-gray-500"
                  >
                    {recipient}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {notificationConfig?.quiet_hours_label}
              </div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                {quietHours}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {notificationConfig?.export_title}
              </div>
              <div className="flex flex-wrap gap-2">
                {exportFormats.map((format) => (
                  <InteractiveButton
                    key={format}
                    variant="secondary"
                    className="!px-4 !py-2 !text-xs font-black uppercase tracking-[0.2em] rounded-xl"
                    onClick={() =>
                      handleAction(
                        format,
                        t.dashboard.settings_workspace_v2.notifications?.export_title ??
                          t.dashboard.settings_workspace_v2.title
                      )
                    }
                    disabled={isLocked}
                    title={isLocked ? lockTooltip : undefined}
                  >
                    {format}
                  </InteractiveButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Settings */}
      <section className="dashboard-surface dashboard-card space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.settings_workspace_v2.ai.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.settings_workspace_v2.ai.desc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleExplain(t.dashboard.settings_workspace_v2.ai.title)}
            className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
          >
            {t.dashboard.context_menu.explain_ai}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {aiConfig.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] group hover:border-brand-start/30 transition-all"
            >
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {item.label}
              </div>
              <div className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Bar */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-start/10 flex items-center justify-center text-brand-start">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 italic max-w-md">
              {t.dashboard.settings_workspace_v2.footer_note}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleExplain(t.dashboard.settings_workspace_v2.title)}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>

            <InteractiveButton
              variant="secondary"
              className="flex-1 sm:flex-none !px-8 !py-4 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl"
              onClick={() =>
                handleAction(
                  t.dashboard.settings_workspace_v2.cta_secondary,
                  t.dashboard.settings_workspace_v2.title
                )
              }
              disabled={isLocked}
              title={isLocked ? lockTooltip : undefined}
            >
              {t.dashboard.settings_workspace_v2.cta_secondary}
            </InteractiveButton>

            <InteractiveButton
              variant="primary"
              className="flex-1 sm:flex-none !px-12 !py-4 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl"
              onClick={() =>
                handleAction(
                  t.dashboard.settings_workspace_v2.cta_primary,
                  t.dashboard.settings_workspace_v2.title
                )
              }
              disabled={isLocked}
              title={isLocked ? lockTooltip : undefined}
            >
              {t.dashboard.settings_workspace_v2.cta_primary}
            </InteractiveButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsWorkspaceView;
