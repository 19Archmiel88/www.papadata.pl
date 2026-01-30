import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EntitlementsModule } from '../../common/entitlements.module';

@Module({
  imports: [EntitlementsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
