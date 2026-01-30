import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { resetApiConfig } from '../src/common/config';
import {
  BillingRepository,
  type TenantBillingRow,
  type WebhookEventRow,
  type TenantStatusRow,
} from '../src/common/billing.repository';
import { TimeProvider } from '../src/common/time.provider';

class InMemoryBillingRepository implements Partial<BillingRepository> {
  private readonly billing = new Map<string, TenantBillingRow>();
  private readonly webhooks = new Map<string, WebhookEventRow>();
  private readonly tenantStatus = new Map<string, TenantStatusRow>();

  async getTenantBilling(tenantId: string): Promise<TenantBillingRow | null> {
    return this.billing.get(tenantId) ?? null;
  }

  async upsertTenantBilling(input: TenantBillingRow): Promise<void> {
    this.billing.set(input.tenantId, { ...input });
  }

  async startTrialIfMissing(input: {
    tenantId: string;
    plan: TenantBillingRow['plan'];
    trialEndsAt: string;
  }): Promise<boolean> {
    if (this.billing.has(input.tenantId)) return false;
    this.billing.set(input.tenantId, {
      tenantId: input.tenantId,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      plan: input.plan,
      billingStatus: 'trialing',
      trialEndsAt: input.trialEndsAt,
      currentPeriodEnd: null,
    });
    return true;
  }

  async getTenantStatus(tenantId: string): Promise<TenantStatusRow | null> {
    return this.tenantStatus.get(tenantId) ?? null;
  }

  async setTenantDeleted(tenantId: string): Promise<void> {
    this.tenantStatus.set(tenantId, {
      tenantId,
      status: 'deleted',
      deletedAt: new Date().toISOString(),
    });
  }

  async upsertWebhookEvent(input: {
    eventId: string;
    eventType: string;
    status: 'received' | 'processed' | 'failed';
    attempts?: number;
    lastError?: string | null;
  }): Promise<void> {
    this.webhooks.set(input.eventId, {
      eventId: input.eventId,
      eventType: input.eventType,
      status: input.status,
      attempts: input.attempts ?? 0,
      lastError: input.lastError ?? null,
    });
  }

  async getWebhookEvent(eventId: string): Promise<WebhookEventRow | null> {
    return this.webhooks.get(eventId) ?? null;
  }

  async insertAuditEvent(): Promise<void> {}

  async getAiUsage(): Promise<null> {
    return null;
  }

  async incrementAiUsage(): Promise<void> {}

  async countActiveSources(): Promise<number> {
    return 0;
  }

  async getSource(): Promise<null> {
    return null;
  }

  async upsertSource(): Promise<void> {}
}

describe('Billing trial + enforcement (e2e)', () => {
  let app!: INestApplication;
  let billingRepo!: InMemoryBillingRepository;
  let timeProvider!: {
    now: () => Date;
    nowMs: () => number;
    setNowMs: (v: number) => void;
  };
  let authToken: string;

  const baseNowMs = Date.parse('2026-01-01T00:00:00Z');

  beforeAll(async () => {
    process.env.APP_MODE = 'demo';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_ISSUER = 'test-issuer';
    process.env.JWT_AUDIENCE = 'test-audience';
    process.env.ENTITLEMENTS_CACHE_TTL_MS = '0';
    process.env.ENTITLEMENTS_PLAN = '';
    process.env.ENTITLEMENTS_BILLING_STATUS = '';
    process.env.ENTITLEMENTS_TRIAL_ENDS_AT = '';
    process.env.STRIPE_SECRET_KEY = '';
    process.env.STRIPE_CUSTOMER_ID = '';
    process.env.STRIPE_CUSTOMER_MAP = '';
    resetApiConfig();

    billingRepo = new InMemoryBillingRepository();
    let nowMs = baseNowMs;
    timeProvider = {
      now: () => new Date(nowMs),
      nowMs: () => nowMs,
      setNowMs: (value: number) => {
        nowMs = value;
      },
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BillingRepository)
      .useValue(billingRepo)
      .overrideProvider(TimeProvider)
      .useValue(timeProvider)
      .compile();

    app = moduleRef.createNestApplication(new FastifyAdapter());
    app.setGlobalPrefix('api');
    await app.init();
    const instance = app.getHttpAdapter().getInstance() as {
      ready?: () => Promise<void>;
    };
    if (instance?.ready) {
      await instance.ready();
    }
  });

  afterAll(async () => {
    await app?.close();
  });

  it('blocks premium when no billing data', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/ai/chat?stream=0')
      .set('Content-Type', 'application/json')
      .send({ prompt: 'Test' });

    expect(res.status).toBe(403);
    expect(res.body?.code).toBe('entitlements_blocked');
  });

  it('keeps non-premium health endpoint open even when premium is blocked', async () => {
    const res = await request(app.getHttpServer()).get('/api/health');
    expect([200, 201]).toContain(res.status);
    expect(res.body?.status).toBe('ok');
  });

  it('starts trial on registration and allows premium', async () => {
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'trial@example.com',
        password: 'Passw0rd!',
        nip: '1234563218',
        companyName: 'Test Co',
        companyAddress: 'Test Street 1',
      });

    expect([200, 201]).toContain(registerRes.status);
    const token = registerRes.body?.accessToken;
    expect(typeof token).toBe('string');
    authToken = token;

    const res = await request(app.getHttpServer())
      .post('/api/ai/chat?stream=0')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Test' });

    expect([200, 201]).toContain(res.status);
  });

  it('blocks premium after trial expires', async () => {
    timeProvider.setNowMs(baseNowMs + 15 * 24 * 60 * 60 * 1000);

    const res = await request(app.getHttpServer())
      .post('/api/ai/chat?stream=0')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Test' });

    expect(res.status).toBe(403);
    expect(res.body?.code).toBe('entitlements_blocked');
  });

  it('restores access after payment activation', async () => {
    await billingRepo.upsertTenantBilling({
      tenantId: '1234563218',
      stripeCustomerId: 'cus_123',
      stripeSubscriptionId: 'sub_123',
      plan: 'professional',
      billingStatus: 'active',
      trialEndsAt: null,
      currentPeriodEnd: null,
    });

    const res = await request(app.getHttpServer())
      .post('/api/ai/chat?stream=0')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ prompt: 'Test' });

    expect([200, 201]).toContain(res.status);
  });
});
