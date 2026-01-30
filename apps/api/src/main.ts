import 'reflect-metadata';
import { existsSync } from 'fs';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { initObservability } from './common/observability.provider';
import { PinoLoggerService } from './common/pino-logger.service';
import { getApiConfig, resetApiConfig, validateApiConfig } from './common/config';

async function bootstrap(): Promise<void> {
  const envCandidates = [
    resolve(process.cwd(), '.env.local'),
    resolve(process.cwd(), 'apps', 'api', '.env.local'),
  ];
  const envPath = envCandidates.find((candidate) => existsSync(candidate));
  if (envPath) {
    const overrideEnv = process.env.ENV_OVERRIDE !== '0';
    loadEnv({ path: envPath, override: overrideEnv });
    resetApiConfig();
  }

  const logger = new PinoLoggerService('Bootstrap');
  const issues = validateApiConfig();
  issues.forEach((issue) => logger.warn(issue));
  const hasCriticalIssues = issues.some((issue) => issue.startsWith('CRITICAL:'));
  const apiConfig = getApiConfig();
  if (apiConfig.appMode === 'prod' && hasCriticalIssues) {
    throw new Error('Critical configuration issues detected');
  }
  const observability = initObservability();
  if (observability) {
    logger.log(
      `Observability enabled provider=${observability.provider} env=${observability.environment}`
    );
  }

  const adapter = new FastifyAdapter() as any;
  const app = (await NestFactory.create(AppModule, adapter, {
    logger,
  })) as NestFastifyApplication;
  app.useLogger(logger);

  const fastify = app.getHttpAdapter().getInstance();

  const rawBodyModule = await import('fastify-raw-body');
  const rawBodyPlugin = (rawBodyModule as { default?: unknown }).default ?? rawBodyModule;
  await fastify.register(rawBodyPlugin as any, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
    routes: ['/api/billing/webhook', '/api/webhooks/stripe'],
  });

  const scriptSrc = ["'self'", 'https://www.googletagmanager.com'];
  const styleSrc = ["'self'", 'https://fonts.googleapis.com'];
  if (apiConfig.appMode !== 'prod') {
    scriptSrc.push("'unsafe-inline'");
    styleSrc.push("'unsafe-inline'");
  }

  const helmet = (await import('@fastify/helmet')).default;
  await fastify.register(helmet as any, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc,
        styleSrc,
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://www.google-analytics.com',
          'https://region1.google-analytics.com',
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  });

  const cors = (await import('@fastify/cors')).default;
  await fastify.register(cors as any, {
    origin: apiConfig.corsAllowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  app.setGlobalPrefix('api');

  const port = apiConfig.port;
  await app.listen(port, '0.0.0.0');
}

void bootstrap().catch((error) => {
  const logger = new PinoLoggerService('Bootstrap');
  logger.error({ err: error }, 'Bootstrap failed');
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
