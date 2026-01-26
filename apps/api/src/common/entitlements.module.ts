import { Module } from "@nestjs/common";
import { EntitlementsService } from "./entitlements.service";
import { EntitlementsGuard } from "./guards/entitlements.guard";
import { DbModule } from "./db.module";
import { BillingRepository } from "./billing.repository";
import { TimeProvider } from "./time.provider";

@Module({
  imports: [DbModule],
  providers: [
    EntitlementsService,
    EntitlementsGuard,
    BillingRepository,
    TimeProvider,
  ],
  exports: [
    EntitlementsService,
    EntitlementsGuard,
    BillingRepository,
    TimeProvider,
  ],
})
export class EntitlementsModule {}
