import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { EntitlementsModule } from '../../common/entitlements.module';

@Module({
  imports: [EntitlementsModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
