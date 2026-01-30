import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AiController } from '../src/modules/ai/ai.controller';
import { AiService } from '../src/modules/ai/ai.service';
import { EntitlementsGuard } from '../src/common/guards/entitlements.guard';
import { AiUsageService } from '../src/modules/ai/ai-usage.service';
import { EntitlementsService } from '../src/common/entitlements.service';

describe('AiController /ai/chat', () => {
  let app: NestFastifyApplication;
  const respondMock = jest.fn();
  const aiUsageMock = {
    assertWithinLimit: jest.fn(),
    recordUsage: jest.fn(),
  };
  const entitlementsMock = {
    getEntitlements: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: {
            respond: respondMock,
          },
        },
        {
          provide: AiUsageService,
          useValue: aiUsageMock,
        },
        {
          provide: EntitlementsService,
          useValue: entitlementsMock,
        },
      ],
    })
      .overrideGuard(EntitlementsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication(new FastifyAdapter()) as NestFastifyApplication;
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    respondMock.mockReset();
    aiUsageMock.assertWithinLimit.mockReset();
    aiUsageMock.recordUsage.mockReset();
    entitlementsMock.getEntitlements.mockReset();

    respondMock.mockResolvedValue({
      text: 'PL:\nTest odpowiedzi\n\nEN:\nTest response',
      finishReason: 'stop',
    });
    aiUsageMock.assertWithinLimit.mockResolvedValue(undefined);
    aiUsageMock.recordUsage.mockResolvedValue(undefined);
    entitlementsMock.getEntitlements.mockResolvedValue({
      isPremiumAllowed: true,
      plan: 'professional',
      billingStatus: 'active',
      trialEndsAt: undefined,
      reason: undefined,
      limits: {
        maxSources: 15,
        reportCadence: 'daily',
        aiTier: 'priority',
      },
      features: {
        ai: true,
        exports: true,
        integrations: true,
        reports: true,
      },
    });
  });

  it('returns JSON when stream=0', async () => {
    const response = await request(app.getHttpServer())
      .post('/ai/chat?stream=0')
      .set('Accept', 'application/json')
      .send({ prompt: 'Hello' });

    expect([200, 201]).toContain(response.status);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual({
      text: 'PL:\nTest odpowiedzi\n\nEN:\nTest response',
      finishReason: 'stop',
    });
  });

  it('returns SSE stream when stream=1', async () => {
    const response = await request(app.getHttpServer())
      .post('/ai/chat?stream=1')
      .set('Accept', 'text/event-stream')
      .send({ prompt: 'Hello' });

    expect([200, 201]).toContain(response.status);
    expect(response.headers['content-type']).toMatch(/text\/event-stream/);
    expect(response.text).toContain('data: ');
    expect(response.text).toContain('data: [DONE]');
  });

  it('rejects empty prompts', async () => {
    const response = await request(app.getHttpServer())
      .post('/ai/chat')
      .set('Accept', 'application/json')
      .send({ prompt: '  ' });

    expect(response.status).toBe(400);
  });
});
