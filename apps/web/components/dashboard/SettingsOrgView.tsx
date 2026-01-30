import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { WidgetErrorState, WidgetOfflineState, WidgetSkeleton } from './DashboardPrimitives';
import {
  fetchAdminAiUsage,
  fetchAdminBilling,
  fetchAdminSources,
  type AdminAiUsage,
  type AdminBilling,
  type AdminSources,
} from '../../data/admin';
import { fetchSettingsOrg } from '../../data/api';
import { deleteOrganization } from '../../data/settings';
import type { SettingsOrgResponse } from '@papadata/shared';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { captureException } from '../../utils/telemetry';

type TeamMember = {
  name: string;
  email: string;
  role: string;
  status: string;
  statusTone?: string;
};

export const SettingsOrgView: React.FC = () => {
  const {
    t,
    isDemo,
    isReadOnly,
    canManageSubscription,
    onManageSubscription,
    onUpgrade,
    apiAvailable,
    setContextLabel,
    setAiDraft,
  } = useOutletContext<DashboardOutletContext>();
  const location = useLocation();
  const isOnline = useOnlineStatus();

  const [orgData, setOrgData] = useState<SettingsOrgResponse | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const [adminState, setAdminState] = useState<{
    status: 'idle' | 'loading' | 'ready' | 'error';
    error?: string;
    usage?: AdminAiUsage;
    sources?: AdminSources;
    billing?: AdminBilling;
  }>({ status: 'idle' });

  const isAdmin = useMemo(() => {
    try {
      const raw = localStorage.getItem('papadata_user_roles');
      const roles = raw ? (JSON.parse(raw) as string[]) : [];
      return roles.includes('owner') || roles.includes('admin');
    } catch {
      return false;
    }
  }, []);

  const activeTenantId = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('pd_active_tenant_id') || undefined;
  }, []);

  const [adminTenantId, setAdminTenantId] = useState<string>(activeTenantId ?? '');

  const refreshAdmin = useCallback(
    (overrideTenantId?: string) => {
      if (!isAdmin || isDemo || isReadOnly) return;
      const tenantId = overrideTenantId?.trim() || adminTenantId.trim() || activeTenantId;
      setAdminState((prev) => ({ ...prev, status: 'loading', error: undefined }));
      Promise.all([
        fetchAdminAiUsage(tenantId),
        fetchAdminSources(tenantId),
        fetchAdminBilling(tenantId),
      ])
        .then(([usage, sources, billing]) => {
          setAdminState({ status: 'ready', usage, sources, billing });
        })
        .catch((error) => {
          setAdminState({
            status: 'error',
            error: error?.message || 'Failed to load admin data.',
          });
        });
    },
    [adminTenantId, activeTenantId, isAdmin, isDemo, isReadOnly]
  );

  useEffect(() => {
    let active = true;

    if (apiAvailable === false) {
      setOrgData(null);
      setOrgError(null);
      setOrgLoading(false);
      return () => {
        active = false;
      };
    }

    setOrgLoading(true);
    setOrgError(null);

    fetchSettingsOrg()
      .then((data) => {
        if (!active) return;
        setOrgData(data);
        setOrgError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : t.dashboard.widget.error_desc;
        setOrgError(message);
        captureException(new Error(message), { scope: 'settings_org' });
      })
      .finally(() => {
        if (active) setOrgLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiAvailable, retryToken, t.dashboard.widget.error_desc]);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    if (id === 'admin' || id === 'admin-panel') {
      const el = document.getElementById('admin-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const locale = t.langCode ?? 'pl-PL';
  const demoTooltip = t.dashboard.demo_tooltip;
  const lockTooltip = isDemo ? demoTooltip : t.dashboard.billing.read_only_tooltip;
  const isLocked = Boolean(isDemo || isReadOnly);
  const mock = t.dashboard.settings_org_v2.mock;

  const safeText = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim() ? value : fallback;

  const formatDate = useCallback(
    (value?: string) => {
      if (!value) return '';
      const ts = Date.parse(value);
      if (Number.isNaN(ts)) return value;
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(new Date(ts));
    },
    [locale]
  );

  const safeInitials = (name: unknown) => {
    const n = safeText(name, '');
    if (!n) return 'U';
    const parts = n
      .split(' ')
      .map((p) => p.trim())
      .filter(Boolean);
    const initials = parts
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
    return initials || 'U';
  };

  const explain = (label: string) => {
    setContextLabel?.(label);
    setAiDraft?.(`${t.dashboard.context_menu.explain_ai}: ${label}`);
  };

  const action = (label: string, context: string) => {
    const cleanLabel = safeText(label, '');
    if (!cleanLabel) return;

    if (isLocked) {
      // DEMO/read-only: nie „ciche nic” — pokazujemy dlaczego akcja jest zablokowana
      setContextLabel?.(lockTooltip);
      setAiDraft?.(`${lockTooltip}: ${cleanLabel} → ${context}`);
      return;
    }

    setContextLabel?.(context);
    setAiDraft?.(`${cleanLabel}: ${context}`);
  };

  const handleManageSubscription = () => {
    const label = t.dashboard.settings_org_v2.billing.cta_change;
    const context = t.dashboard.settings_org_v2.billing.title;
    action(label, context);

    if (isLocked) return;
    if (canManageSubscription && onManageSubscription) {
      onManageSubscription();
      return;
    }
    onUpgrade();
  };

  const deleteOrg = async () => {
    if (isLocked) return;
    const confirmText = 'DELETE';
    const input = window.prompt('Type DELETE to confirm account deletion');
    if (input !== confirmText) return;
    try {
      await deleteOrganization({ tenantId: activeTenantId, reason: 'user_request' });
      setContextLabel?.('Account deleted');
      setAiDraft?.('Account deleted');
    } catch {
      setContextLabel?.('Delete failed');
      setAiDraft?.('Delete failed');
    }
  };

  const orgCompany = orgData?.company;
  const orgBilling = orgData?.billing;
  const orgUsers = useMemo(() => orgData?.users ?? [], [orgData?.users]);

  const baseCompanyFields = useMemo(
    () =>
      (mock?.company_fields ?? []) as Array<{
        label: string;
        value: string;
      }>,
    [mock?.company_fields]
  );
  const companyFields = useMemo(() => {
    if (!orgCompany) return baseCompanyFields;
    if (!baseCompanyFields.length) {
      return [
        { label: 'Company', value: safeText(orgCompany.name, '—') },
        { label: 'Region', value: safeText(orgCompany.region, '—') },
      ];
    }
    return baseCompanyFields.map((field, idx) => {
      if (idx === 0 && orgCompany.name) return { ...field, value: orgCompany.name };
      if (idx === 1 && orgCompany.region) return { ...field, value: orgCompany.region };
      return field;
    });
  }, [baseCompanyFields, orgCompany]);

  const baseTeamMembers = useMemo(
    () =>
      (mock?.team_members ?? []) as Array<{
        name: string;
        email: string;
        role: string;
        status: string;
      }>,
    [mock?.team_members]
  );
  const teamMembers = useMemo<TeamMember[]>(() => {
    if (!orgUsers.length) {
      return baseTeamMembers.map((member) => ({
        ...member,
        statusTone: member.status === 'Online' ? 'text-emerald-500' : 'text-gray-400',
      }));
    }
    return orgUsers.map((user, idx) => {
      const fallback = baseTeamMembers[idx];
      const statusKey = String(user.status ?? '').toLowerCase();
      const statusTone =
        statusKey === 'active'
          ? 'text-emerald-500'
          : statusKey === 'invited'
            ? 'text-amber-500'
            : 'text-gray-400';
      const statusLabel =
        statusKey === 'active' ? 'Active' : statusKey === 'invited' ? 'Invited' : 'Disabled';
      return {
        name: safeText(user.name, fallback?.name ?? '—'),
        email: safeText(fallback?.email, safeText(user.id, '—')),
        role: safeText(user.role, fallback?.role ?? '—'),
        status: statusLabel,
        statusTone,
      };
    });
  }, [baseTeamMembers, orgUsers]);

  const billingInfo = useMemo(() => {
    const base = (mock?.billing_info ?? []) as Array<{ label: string; value: string }>;
    if (!orgBilling) return base;
    return base.map((item, idx) => {
      if (idx === 0 && orgBilling.plan) return { ...item, value: orgBilling.plan };
      if (idx === 1 && orgBilling.status) return { ...item, value: orgBilling.status };
      if (idx === 2 && orgBilling.renewalDate) {
        return { ...item, value: formatDate(orgBilling.renewalDate) };
      }
      return item;
    });
  }, [mock?.billing_info, orgBilling, formatDate]);
  const billingPlans = (mock?.billing_plans ?? []) as Array<{
    id: string;
    name: string;
    note: string;
    price: string;
  }>;
  const invoices = (mock?.invoices ?? []) as Array<{
    id: string;
    label: string;
    status: string;
    amount: string;
  }>;

  const paymentIssue = false;

  const auditLogs = (mock?.audit_logs ?? []) as Array<{
    label: string;
    value: string;
  }>;
  const loginMethods = (mock?.login_methods ?? []) as string[];
  const sessions = (mock?.sessions ?? []) as Array<{
    id: string;
    label: string;
    value: string;
  }>;

  const statusCardLabel = safeText(mock?.status_card?.label);
  const statusCardValue = safeText(orgBilling?.status, safeText(mock?.status_card?.value));
  const statusCardDesc = safeText(
    formatDate(orgBilling?.renewalDate),
    safeText(mock?.status_card?.desc)
  );

  const payerLabel = safeText(mock?.payer?.label);
  const payerValue = safeText(mock?.payer?.value);

  const billingCycleLabel = safeText(mock?.billing_cycle?.label);
  const billingCycleValue = safeText(
    formatDate(orgBilling?.renewalDate),
    safeText(mock?.billing_cycle?.value)
  );

  const paymentStatusLabel = safeText(mock?.payment_status?.label);
  const paymentOk = safeText(mock?.payment_status?.ok);
  const paymentError = safeText(mock?.payment_status?.error);
  const paymentFixCta = safeText(mock?.payment_status?.fix_cta);
  const paymentOkTooltip = safeText(mock?.payment_status?.ok_tooltip);

  const cardPaymentLabel = safeText(mock?.card_payment?.label);
  const cardPaymentDesc = safeText(mock?.card_payment?.desc);

  const plansLabel = safeText(mock?.plans_label);
  const invoicesLabel = safeText(mock?.invoices_label);
  const invoicePdfCta = safeText(mock?.invoice_pdf_cta);

  const approvePlanCta = safeText(mock?.approve_plan_cta);

  const securityTitle = safeText(
    t.dashboard.settings_org_v2.security.title,
    safeText(mock?.security_title, 'Security')
  );
  const loginMethodLabel = safeText(mock?.login_method_label);
  const loginMethodValue = safeText(mock?.login_method_value);
  const loginMethodsLabel = safeText(mock?.login_methods_label);
  const mfaLabel = safeText(mock?.mfa_label);
  const mfaValue = safeText(mock?.mfa_value);
  const sessionsLabel = safeText(mock?.sessions_label);

  const complianceTitle = safeText(mock?.compliance?.title, t.dashboard.settings_org_v2.title);
  const complianceDesc = safeText(mock?.compliance?.desc);
  const ctaDpa = safeText(mock?.compliance?.cta_dpa);
  const ctaRetention = safeText(mock?.compliance?.cta_retention);
  const ctaConfirmations = safeText(mock?.compliance?.cta_confirmations);
  const ctaDeleteOrg = safeText(mock?.compliance?.cta_delete_org);

  return (
    <div className="space-y-8 animate-reveal pb-20">
      {/* Header */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                {t.dashboard.settings_org_v2.badge_label}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.settings_org_v2.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.settings_org_v2.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => explain(t.dashboard.settings_org_v2.title)}
            aria-label={`${t.dashboard.context_menu.explain_ai}: ${t.dashboard.settings_org_v2.title}`}
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

      {isOnline && orgError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={orgError || t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      {orgLoading && !orgData && (
        <section className="dashboard-surface dashboard-card">
          <WidgetSkeleton chartHeight="h-28" lines={3} />
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Company Identity */}
        <div className="dashboard-surface dashboard-card space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
              {t.dashboard.settings_org_v2.company.title}
            </h3>
            <button
              type="button"
              onClick={() => explain(t.dashboard.settings_org_v2.company.title)}
              aria-label={`${t.dashboard.context_menu.explain_ai}: ${t.dashboard.settings_org_v2.company.title}`}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          <div className="grid gap-4">
            {companyFields.map((field: { label: string; value: string }) => (
              <div
                key={field.label}
                className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 transition-all group hover:border-brand-start/30"
              >
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  {field.label}
                </div>
                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="dashboard-surface dashboard-card space-y-8 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
              {t.dashboard.settings_org_v2.users.title}
            </h3>
            <button
              type="button"
              onClick={() => explain(t.dashboard.settings_org_v2.users.title)}
              aria-label={`${t.dashboard.context_menu.explain_ai}: ${t.dashboard.settings_org_v2.users.title}`}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
            <span className="text-2xs font-black text-gray-400 uppercase tracking-[0.2em]">
              {t.dashboard.settings_org_v2.license_label}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {teamMembers.map((user) => (
              <div
                key={user.email}
                className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between group hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full brand-gradient-bg flex items-center justify-center text-white font-black text-xs shadow-lg">
                    {safeInitials(user.name)}
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
                    {user.role}
                  </div>
                  <div
                    className={`text-3xs font-black uppercase tracking-widest ${
                      user.statusTone ??
                      (user.status === 'Online' ? 'text-emerald-500' : 'text-gray-400')
                    }`}
                  >
                    {user.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <InteractiveButton
            variant="secondary"
            className="w-full !py-4 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl border-brand-start/20 text-brand-start hover:bg-brand-start hover:text-white"
            onClick={() =>
              action(
                t.dashboard.settings_org_v2.users.cta_invite,
                t.dashboard.settings_org_v2.users.title
              )
            }
            disabled={isLocked}
            title={isLocked ? lockTooltip : undefined}
          >
            {t.dashboard.settings_org_v2.users.cta_invite}
          </InteractiveButton>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Billing & Subscriptions */}
        <div className="dashboard-surface dashboard-card space-y-8 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
              {t.dashboard.settings_org_v2.billing.title}
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => explain(t.dashboard.settings_org_v2.billing.title)}
                aria-label={`${t.dashboard.context_menu.explain_ai}: ${t.dashboard.settings_org_v2.billing.title}`}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <InteractiveButton
                variant="secondary"
                className="!px-4 !py-2 !text-xs font-black uppercase tracking-[0.2em] rounded-xl"
                onClick={handleManageSubscription}
                disabled={isLocked}
                title={isLocked ? lockTooltip : undefined}
              >
                {t.dashboard.settings_org_v2.billing.cta_change}
              </InteractiveButton>
            </div>
          </div>

          <div className="grid gap-4 flex-1">
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 group hover:border-emerald-500/40 transition-all">
              <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">
                {statusCardLabel}
              </div>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                {statusCardValue}
              </div>
              <p className="text-xs text-gray-500 mt-1">{statusCardDesc}</p>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                {payerLabel}
              </div>
              <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {payerValue}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                {billingCycleLabel}
              </div>
              <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {billingCycleValue}
              </div>
            </div>

            {billingInfo.slice(1).map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] group hover:border-brand-start/30 transition-all"
              >
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  {item.label}
                </div>
                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                  {item.value}
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  {paymentStatusLabel}
                </div>
                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {paymentIssue ? paymentError : paymentOk}
                </div>
              </div>

              <InteractiveButton
                variant="secondary"
                className="!px-4 !py-2 !text-xs font-black uppercase tracking-[0.2em] rounded-xl"
                onClick={() => action(paymentFixCta, t.dashboard.settings_org_v2.billing.title)}
                disabled={isLocked || !paymentIssue || !paymentFixCta}
                title={
                  isLocked ? lockTooltip : paymentIssue ? undefined : paymentOkTooltip || undefined
                }
              >
                {paymentFixCta || '—'}
              </InteractiveButton>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                {cardPaymentLabel}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">
                {cardPaymentDesc}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] space-y-3">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {plansLabel}
              </div>
              <div className="space-y-3">
                {billingPlans.map((plan) => (
                  <div key={plan.id} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {plan.name}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">
                        {plan.note}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest text-right">
                      {plan.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                {invoicesLabel}
              </div>
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                        {invoice.label}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">
                        {invoice.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        {invoice.amount}
                      </div>
                      <InteractiveButton
                        variant="secondary"
                        className="!px-3 !py-2 !text-xs font-black uppercase tracking-[0.2em] rounded-xl"
                        onClick={() => action(invoicePdfCta, invoice.label)}
                        disabled={isLocked || !invoicePdfCta}
                        title={isLocked ? lockTooltip : undefined}
                      >
                        {invoicePdfCta || '—'}
                      </InteractiveButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <InteractiveButton
            variant="primary"
            className="w-full !py-4 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl"
            onClick={() => action(approvePlanCta, t.dashboard.settings_org_v2.billing.title)}
            disabled={isLocked || !approvePlanCta}
            title={isLocked ? lockTooltip : undefined}
          >
            {approvePlanCta || '—'}
          </InteractiveButton>
        </div>

        {/* Security & Audit Log */}
        <div className="dashboard-surface dashboard-card space-y-8 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
              {securityTitle}
            </h3>
            <button
              type="button"
              onClick={() => explain(securityTitle)}
              aria-label={`${t.dashboard.context_menu.explain_ai}: ${securityTitle}`}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          <div className="space-y-3 flex-1">
            <div className="p-4 rounded-2xl border border-brand-start/20 bg-brand-start/5 flex items-center justify-between">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                {loginMethodLabel}
              </div>
              <div className="text-xs font-mono font-black text-brand-start uppercase">
                {loginMethodValue}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {loginMethodsLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {loginMethods.map((method) => (
                  <span
                    key={method}
                    className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-xs font-black uppercase tracking-widest text-gray-500"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                {mfaLabel}
              </div>
              <div className="text-xs font-mono font-black text-gray-500 uppercase">{mfaValue}</div>
            </div>

            <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {sessionsLabel}
              </div>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                      {session.label}
                    </div>
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                      {session.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {auditLogs.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between group hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                <div className="text-xs font-bold text-gray-500 uppercase tracking-tight group-hover:text-brand-start transition-colors">
                  {item.label}
                </div>
                <div className="text-xs font-mono font-black text-gray-700 dark:text-gray-300">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <InteractiveButton
              variant="secondary"
              className="flex-1 !py-4 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl"
              onClick={() =>
                action(
                  t.dashboard.settings_org_v2.security.cta_logout_all,
                  t.dashboard.settings_org_v2.security.title
                )
              }
              disabled={isLocked}
              title={isLocked ? lockTooltip : undefined}
            >
              {t.dashboard.settings_org_v2.security.cta_logout_all}
            </InteractiveButton>

            <InteractiveButton
              variant="secondary"
              className="flex-1 !py-4 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl"
              onClick={() =>
                action(
                  t.dashboard.settings_org_v2.audit.cta_export,
                  t.dashboard.settings_org_v2.audit.title
                )
              }
              disabled={isLocked}
              title={isLocked ? lockTooltip : undefined}
            >
              {t.dashboard.settings_org_v2.audit.cta_export}
            </InteractiveButton>
          </div>
        </div>
      </div>

      {isAdmin && (
        <section id="admin-panel" className="dashboard-surface dashboard-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Admin
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
                Usage & Billing Monitor
              </h3>
            </div>
            <div className="text-2xs font-black uppercase tracking-widest text-gray-400">
              {adminState.status === 'loading'
                ? 'Loading'
                : adminState.status === 'ready'
                  ? 'Live'
                  : 'Idle'}
            </div>
          </div>

          {adminState.status === 'error' && (
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-rose-600 text-xs font-bold uppercase tracking-widest">
              {adminState.error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Tenant filter
              </div>
              <input
                value={adminTenantId}
                onChange={(event) => setAdminTenantId(event.target.value)}
                placeholder="tenant_id"
                className="w-full rounded-xl bg-transparent border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-200"
              />
              <div className="mt-2 text-2xs text-gray-500 uppercase tracking-widest">
                Leave empty to use active tenant
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                AI Requests (month)
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {adminState.usage?.requestsCount ?? '—'}
              </div>
              <div className="text-2xs text-gray-500 uppercase tracking-widest">
                {adminState.usage?.periodStart ?? '—'} → {adminState.usage?.periodEnd ?? '—'}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                Active Sources
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {adminState.sources?.activeCount ?? '—'}
              </div>
              <div className="text-2xs text-gray-500 uppercase tracking-widest">
                Tenant: {adminState.sources?.tenantId ?? '—'}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                Billing Status
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white uppercase">
                {adminState.billing?.billingStatus ?? '—'}
              </div>
              <div className="text-2xs text-gray-500 uppercase tracking-widest">
                Plan: {adminState.billing?.plan ?? '—'}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                Trial Ends / Period End
              </div>
              <div className="text-sm font-black text-gray-900 dark:text-white">
                {adminState.billing?.trialEndsAt ?? '—'}
              </div>
              <div className="text-2xs text-gray-500 uppercase tracking-widest">
                {adminState.billing?.currentPeriodEnd ?? '—'}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                Stripe IDs
              </div>
              <div className="text-2xs text-gray-500 break-all">
                Customer: {adminState.billing?.stripeCustomerId ?? '—'}
              </div>
              <div className="text-2xs text-gray-500 break-all">
                Subscription: {adminState.billing?.stripeSubscriptionId ?? '—'}
              </div>
            </div>
          </div>

          <InteractiveButton
            variant="secondary"
            className="!px-4 !py-2 !text-xs font-black uppercase tracking-[0.2em] rounded-xl"
            onClick={() => {
              action('Refresh admin data', 'Admin panel');
              refreshAdmin(adminTenantId);
            }}
            disabled={isLocked}
            title={isLocked ? lockTooltip : undefined}
          >
            Refresh
          </InteractiveButton>
        </section>
      )}

      {/* Audit & Compliance */}
      <section className="dashboard-surface dashboard-card space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
              {complianceTitle}
            </h3>
            <p className="text-xs-plus text-gray-500 font-medium italic">{complianceDesc}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => explain(complianceTitle)}
              aria-label={`${t.dashboard.context_menu.explain_ai}: ${complianceTitle}`}
              className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>

            <button
              type="button"
              onClick={() => action(ctaDpa, complianceTitle)}
              className="px-5 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
              disabled={isLocked || !ctaDpa}
              title={isLocked ? lockTooltip : undefined}
            >
              {ctaDpa || '—'}
            </button>

            <button
              type="button"
              onClick={() => action(ctaRetention, complianceTitle)}
              className="px-5 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
              disabled={isLocked || !ctaRetention}
              title={isLocked ? lockTooltip : undefined}
            >
              {ctaRetention || '—'}
            </button>

            <button
              type="button"
              onClick={() => action(ctaConfirmations, complianceTitle)}
              className="px-5 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
              disabled={isLocked || !ctaConfirmations}
              title={isLocked ? lockTooltip : undefined}
            >
              {ctaConfirmations || '—'}
            </button>

            <button
              type="button"
              onClick={() => {
                action(ctaDeleteOrg, complianceTitle);
                void deleteOrg();
              }}
              className={`px-5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-black uppercase tracking-widest text-rose-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                isLocked || !ctaDeleteOrg
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-rose-500 hover:text-white'
              }`}
              disabled={isLocked || !ctaDeleteOrg}
              title={isLocked ? lockTooltip : undefined}
            >
              {ctaDeleteOrg || '—'}
            </button>
          </div>
        </div>
      </section>

      {/* Global Save Footer */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 italic text-center sm:text-left">
            {t.dashboard.settings_org_v2.footer_note}
          </p>

          <button
            type="button"
            onClick={() => explain(t.dashboard.settings_org_v2.title)}
            aria-label={`${t.dashboard.context_menu.explain_ai}: ${t.dashboard.settings_org_v2.title}`}
            className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
          >
            {t.dashboard.context_menu.explain_ai}
          </button>

          <InteractiveButton
            variant="primary"
            className="w-full sm:w-auto !px-16 !py-5 !text-xs-plus font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl"
            onClick={() =>
              action(t.dashboard.settings_org_v2.cta_save, t.dashboard.settings_org_v2.title)
            }
            disabled={isLocked}
            title={isLocked ? lockTooltip : undefined}
          >
            {t.dashboard.settings_org_v2.cta_save}
          </InteractiveButton>
        </div>
      </section>
    </div>
  );
};

export default SettingsOrgView;
