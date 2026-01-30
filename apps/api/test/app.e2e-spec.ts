import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { resetApiConfig } from '../src/common/config';

describe('API e2e', () => {
  let app!: INestApplication;

  beforeAll(async () => {
    process.env.APP_MODE = 'demo';
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    process.env.JWT_ISSUER = process.env.JWT_ISSUER ?? 'test-issuer';
    process.env.JWT_AUDIENCE = process.env.JWT_AUDIENCE ?? 'test-audience';
    process.env.ENTITLEMENTS_PLAN = 'professional';
    process.env.ENTITLEMENTS_BILLING_STATUS = 'active';
    process.env.ENTITLEMENTS_FEATURE_AI = 'true';
    process.env.ENTITLEMENTS_CACHE_TTL_MS = '0';
    resetApiConfig();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  it('GET /api/health returns ok', async () => {
    const res = await request(app.getHttpServer()).get('/api/health');
    expect([200, 201]).toContain(res.status);
    expect(res.body?.status).toBe('ok');
  });

  it('POST /api/ai/chat?stream=0 returns JSON', async () => {
    const payload = {
      prompt: 'Podsumuj status sprzedaży',
      messages: [],
      context: {
        view: 'overview',
        dateRange: { start: '2026-01-01', end: '2026-01-20', preset: '30d' },
      },
    };

    const res = await request(app.getHttpServer())
      .post('/api/ai/chat?stream=0')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect([200, 201]).toContain(res.status);
    expect(res.headers['content-type']).toContain('application/json');
    expect(typeof res.body?.text).toBe('string');
    expect(typeof res.body?.finishReason).toBe('string');
  });

  it('POST /api/ai/chat?stream=1 returns SSE', async () => {
    const payload = {
      prompt: 'Wygeneruj 2 zalecenia',
      messages: [],
      context: {
        view: 'overview',
        dateRange: { start: '2026-01-01', end: '2026-01-20', preset: '30d' },
      },
    };

    const res = await request(app.getHttpServer())
      .post('/api/ai/chat?stream=1')
      .set('Accept', 'text/event-stream')
      .set('Content-Type', 'application/json')
      .send(payload)
      .buffer(true)
      .parse((response, callback) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk.toString('utf8');
        });
        response.on('end', () => callback(null, data));
      });

    const contentType = res.headers['content-type'] ?? (res as { type?: string }).type ?? '';
    const bodyText = typeof res.body === 'string' ? res.body : (res.text ?? '');

    expect([200, 201]).toContain(res.status);
    expect(contentType).toContain('text/event-stream');
    expect(bodyText).toContain('data:');
    expect(bodyText).toContain('[DONE]');
  });

  it('POST /api/ai/chat without prompt returns 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/ai/chat?stream=0')
      .set('Content-Type', 'application/json')
      .send({ prompt: '' });

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body?.message).toBe('Prompt is required');
  });
});
