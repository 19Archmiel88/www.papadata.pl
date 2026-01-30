import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CacheModule } from '../../common/cache.module';
import { EntitlementsModule } from '../../common/entitlements.module';

@Module({
  imports: [CacheModule, EntitlementsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
