import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiUsageService } from './ai-usage.service';
import { EntitlementsModule } from '../../common/entitlements.module';

@Module({
  imports: [EntitlementsModule],
  controllers: [AiController],
  providers: [AiService, AiUsageService],
})
export class AiModule {}
