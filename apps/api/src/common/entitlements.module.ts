import { Module } from "@nestjs/common";
import { EntitlementsService } from "./entitlements.service";
import { EntitlementsGuard } from "./guards/entitlements.guard";
import { DbModule } from "./db.module";
import { BillingRepository } from "./billing.repository";

@Module({
  imports: [DbModule],
  providers: [EntitlementsService, EntitlementsGuard, BillingRepository],
  exports: [EntitlementsService, EntitlementsGuard, BillingRepository],
})
export class EntitlementsModule {}
