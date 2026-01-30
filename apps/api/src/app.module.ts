import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
  getOptionsToken,
  getStorageToken,
  type ThrottlerModuleOptions,
  type ThrottlerStorage,
} from '@nestjs/throttler';
import Redis from 'ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { AiModule } from './modules/ai/ai.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ExportsModule } from './modules/exports/exports.module';
import { SupportModule } from './modules/support/support.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminModule } from './modules/admin/admin.module';
import { LoggingMiddleware } from './common/logging.middleware';
import { AppAuthGuard } from './common/guards/app-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { FirebaseAuthGuard } from './common/firebase-auth.guard';
import { RedisThrottlerStorage } from './common/redis-throttler.storage';
import { ThrottlerMemoryStorage } from './common/throttler-memory.storage';
import { CacheModule } from './common/cache.module';
import { getApiConfig } from './common/config';

const getThrottlerConfig = () => {
  const { ttlMs, limit } = getApiConfig().throttling;
  return {
    ttl: Number.isFinite(ttlMs) ? ttlMs : 60000,
    limit: Number.isFinite(limit) ? limit : 100,
  };
};

const getRedisStorage = (): ThrottlerStorage | null => {
  const redisUrl = getApiConfig().throttling.redisUrl;
  if (!redisUrl) {
    return null;
  }
  try {
    const redis = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
    return new RedisThrottlerStorage(redis);
  } catch {
    return null;
  }
};

const getThrottlerStorage = (): ThrottlerStorage =>
  getRedisStorage() ?? new ThrottlerMemoryStorage();

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (): ThrottlerModuleOptions => ({
        throttlers: [
          {
            name: 'default',
            ttl: getThrottlerConfig().ttl,
            limit: getThrottlerConfig().limit,
          },
        ],
        storage: getThrottlerStorage(),
      }),
    }),
    CacheModule,
    AuthModule,
    TenantsModule,
    IntegrationsModule,
    AiModule,
    DashboardModule,
    SettingsModule,
    ExportsModule,
    SupportModule,
    BillingModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FirebaseAuthGuard,
    {
      provide: APP_GUARD,
      useFactory: (
        options: ThrottlerModuleOptions,
        storage: ThrottlerStorage,
        reflector: Reflector
      ) => new ThrottlerGuard(options, storage, reflector),
      inject: [getOptionsToken(), getStorageToken(), Reflector],
    },
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
