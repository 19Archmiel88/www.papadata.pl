import { Injectable } from '@nestjs/common';
import type { BillingStatus, PlanId } from '@papadata/shared';
import { DbService } from './db.service';

export type TenantBillingRow = {
  tenantId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  plan: PlanId;
  billingStatus: BillingStatus;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
};

export type AiUsageRow = {
  tenantId: string;
  periodStart: string;
  periodEnd: string;
  requestsCount: number;
  tokensIn: number;
  tokensOut: number;
};

export type TenantSourceRow = {
  tenantId: string;
  provider: string;
  status: string;
};

export type TenantStatusRow = {
  tenantId: string;
  status: 'active' | 'deleted';
  deletedAt?: string | null;
};

export type WebhookEventRow = {
  eventId: string;
  eventType: string;
  status: 'received' | 'processed' | 'failed';
  attempts: number;
  lastError?: string | null;
};

export type AuditEventInput = {
  tenantId: string;
  actorId?: string | null;
  action: string;
  details?: Record<string, unknown> | null;
};

@Injectable()
export class BillingRepository {
  constructor(private readonly db: DbService) {}

  async getTenantBilling(tenantId: string): Promise<TenantBillingRow | null> {
    if (!this.db.isEnabled()) return null;
    const { rows } = await this.db.query<{
      tenant_id: string;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
      plan: PlanId;
      billing_status: BillingStatus;
      trial_ends_at: string | null;
      current_period_end: string | null;
    }>(
      `SELECT tenant_id, stripe_customer_id, stripe_subscription_id, plan, billing_status, trial_ends_at, current_period_end
       FROM tenant_billing
       WHERE tenant_id = $1`,
      [tenantId]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      tenantId: row.tenant_id,
      stripeCustomerId: row.stripe_customer_id,
      stripeSubscriptionId: row.stripe_subscription_id,
      plan: row.plan,
      billingStatus: row.billing_status,
      trialEndsAt: row.trial_ends_at,
      currentPeriodEnd: row.current_period_end,
    };
  }

  async upsertTenantBilling(input: TenantBillingRow): Promise<void> {
    if (!this.db.isEnabled()) return;
    await this.db.query(
      `INSERT INTO tenant_billing (
         tenant_id,
         stripe_customer_id,
         stripe_subscription_id,
         plan,
         billing_status,
         trial_ends_at,
         current_period_end,
         updated_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,now())
       ON CONFLICT (tenant_id) DO UPDATE SET
         stripe_customer_id = EXCLUDED.stripe_customer_id,
         stripe_subscription_id = EXCLUDED.stripe_subscription_id,
         plan = EXCLUDED.plan,
         billing_status = EXCLUDED.billing_status,
         trial_ends_at = EXCLUDED.trial_ends_at,
         current_period_end = EXCLUDED.current_period_end,
         updated_at = now()`,
      [
        input.tenantId,
        input.stripeCustomerId ?? null,
        input.stripeSubscriptionId ?? null,
        input.plan,
        input.billingStatus,
        input.trialEndsAt ?? null,
        input.currentPeriodEnd ?? null,
      ]
    );
  }

  async startTrialIfMissing(input: {
    tenantId: string;
    plan: PlanId;
    trialEndsAt: string;
  }): Promise<boolean> {
    if (!this.db.isEnabled()) return false;
    const { rowCount } = await this.db.query(
      `INSERT INTO tenant_billing (
         tenant_id,
         plan,
         billing_status,
         trial_ends_at,
         updated_at
       ) VALUES ($1,$2,'trialing',$3,now())
       ON CONFLICT (tenant_id) DO NOTHING`,
      [input.tenantId, input.plan, input.trialEndsAt]
    );
    return (rowCount ?? 0) > 0;
  }

  async getAiUsage(tenantId: string, periodStart: string): Promise<AiUsageRow | null> {
    if (!this.db.isEnabled()) return null;
    const { rows } = await this.db.query<{
      tenant_id: string;
      period_start: string;
      period_end: string;
      requests_count: number;
      tokens_in: number;
      tokens_out: number;
    }>(
      `SELECT tenant_id, period_start, period_end, requests_count, tokens_in, tokens_out
       FROM ai_usage
       WHERE tenant_id = $1 AND period_start = $2`,
      [tenantId, periodStart]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      tenantId: row.tenant_id,
      periodStart: row.period_start,
      periodEnd: row.period_end,
      requestsCount: row.requests_count,
      tokensIn: row.tokens_in,
      tokensOut: row.tokens_out,
    };
  }

  async incrementAiUsage(input: {
    tenantId: string;
    periodStart: string;
    periodEnd: string;
    requestsDelta?: number;
    tokensInDelta?: number;
    tokensOutDelta?: number;
  }): Promise<void> {
    if (!this.db.isEnabled()) return;
    const requestsDelta = input.requestsDelta ?? 1;
    const tokensInDelta = input.tokensInDelta ?? 0;
    const tokensOutDelta = input.tokensOutDelta ?? 0;

    await this.db.query(
      `INSERT INTO ai_usage (
         tenant_id,
         period_start,
         period_end,
         requests_count,
         tokens_in,
         tokens_out,
         updated_at
       ) VALUES ($1,$2,$3,$4,$5,$6,now())
       ON CONFLICT (tenant_id, period_start) DO UPDATE SET
         requests_count = ai_usage.requests_count + EXCLUDED.requests_count,
         tokens_in = ai_usage.tokens_in + EXCLUDED.tokens_in,
         tokens_out = ai_usage.tokens_out + EXCLUDED.tokens_out,
         period_end = EXCLUDED.period_end,
         updated_at = now()`,
      [
        input.tenantId,
        input.periodStart,
        input.periodEnd,
        requestsDelta,
        tokensInDelta,
        tokensOutDelta,
      ]
    );
  }

  async countActiveSources(tenantId: string): Promise<number> {
    if (!this.db.isEnabled()) return 0;
    const { rows } = await this.db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM tenant_sources
       WHERE tenant_id = $1 AND status = 'connected'`,
      [tenantId]
    );
    return Number(rows[0]?.count ?? 0);
  }

  async getSource(tenantId: string, provider: string): Promise<TenantSourceRow | null> {
    if (!this.db.isEnabled()) return null;
    const { rows } = await this.db.query<{
      tenant_id: string;
      provider: string;
      status: string;
    }>(
      `SELECT tenant_id, provider, status
       FROM tenant_sources
       WHERE tenant_id = $1 AND provider = $2`,
      [tenantId, provider]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      tenantId: row.tenant_id,
      provider: row.provider,
      status: row.status,
    };
  }

  async upsertSource(input: TenantSourceRow): Promise<void> {
    if (!this.db.isEnabled()) return;
    await this.db.query(
      `INSERT INTO tenant_sources (
         tenant_id,
         provider,
         status,
         connected_at,
         updated_at
       ) VALUES ($1,$2,$3,now(),now())
       ON CONFLICT (tenant_id, provider) DO UPDATE SET
         status = EXCLUDED.status,
         updated_at = now()`,
      [input.tenantId, input.provider, input.status]
    );
  }

  async getTenantStatus(tenantId: string): Promise<TenantStatusRow | null> {
    if (!this.db.isEnabled()) return null;
    const { rows } = await this.db.query<{
      tenant_id: string;
      status: 'active' | 'deleted';
      deleted_at: string | null;
    }>(
      `SELECT tenant_id, status, deleted_at
       FROM tenant_status
       WHERE tenant_id = $1`,
      [tenantId]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      tenantId: row.tenant_id,
      status: row.status,
      deletedAt: row.deleted_at,
    };
  }

  async setTenantDeleted(tenantId: string): Promise<void> {
    if (!this.db.isEnabled()) return;
    await this.db.query(
      `INSERT INTO tenant_status (tenant_id, status, deleted_at, updated_at)
       VALUES ($1, 'deleted', now(), now())
       ON CONFLICT (tenant_id) DO UPDATE SET
         status = 'deleted',
         deleted_at = now(),
         updated_at = now()`,
      [tenantId]
    );
  }

  async upsertWebhookEvent(input: {
    eventId: string;
    eventType: string;
    status: 'received' | 'processed' | 'failed';
    attempts?: number;
    lastError?: string | null;
  }): Promise<void> {
    if (!this.db.isEnabled()) return;
    await this.db.query(
      `INSERT INTO stripe_webhook_events (
         event_id,
         event_type,
         status,
         attempts,
         last_error,
         updated_at
       ) VALUES ($1,$2,$3,$4,$5,now())
       ON CONFLICT (event_id) DO UPDATE SET
         status = EXCLUDED.status,
         attempts = stripe_webhook_events.attempts + EXCLUDED.attempts,
         last_error = EXCLUDED.last_error,
         updated_at = now()`,
      [input.eventId, input.eventType, input.status, input.attempts ?? 0, input.lastError ?? null]
    );
  }

  async getWebhookEvent(eventId: string): Promise<WebhookEventRow | null> {
    if (!this.db.isEnabled()) return null;
    const { rows } = await this.db.query<{
      event_id: string;
      event_type: string;
      status: 'received' | 'processed' | 'failed';
      attempts: number;
      last_error: string | null;
    }>(
      `SELECT event_id, event_type, status, attempts, last_error
       FROM stripe_webhook_events
       WHERE event_id = $1`,
      [eventId]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      eventId: row.event_id,
      eventType: row.event_type,
      status: row.status,
      attempts: row.attempts,
      lastError: row.last_error,
    };
  }

  async listFailedWebhookEvents(limit = 20): Promise<WebhookEventRow[]> {
    if (!this.db.isEnabled()) return [];
    const { rows } = await this.db.query<{
      event_id: string;
      event_type: string;
      status: 'failed';
      attempts: number;
      last_error: string | null;
    }>(
      `SELECT event_id, event_type, status, attempts, last_error
       FROM stripe_webhook_events
       WHERE status = 'failed'
       ORDER BY updated_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows.map(
      (row: {
        event_id: string;
        event_type: string;
        status: 'failed';
        attempts: number;
        last_error: string | null;
      }) => ({
        eventId: row.event_id,
        eventType: row.event_type,
        status: row.status,
        attempts: row.attempts,
        lastError: row.last_error,
      })
    );
  }

  async insertAuditEvent(input: AuditEventInput): Promise<void> {
    if (!this.db.isEnabled()) return;
    await this.db.query(
      `INSERT INTO audit_events (tenant_id, actor_id, action, details, created_at)
       VALUES ($1,$2,$3,$4,now())`,
      [
        input.tenantId,
        input.actorId ?? null,
        input.action,
        input.details ? JSON.stringify(input.details) : null,
      ]
    );
  }
}
