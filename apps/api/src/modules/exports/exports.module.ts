import { Module } from '@nestjs/common';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';
import { EntitlementsModule } from '../../common/entitlements.module';

@Module({
  imports: [EntitlementsModule],
  controllers: [ExportsController],
  providers: [ExportsService],
})
export class ExportsModule {}
