import { Module } from "@nestjs/common";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { EntitlementsModule } from "../../common/entitlements.module";
import { BillingWebhookService } from "./billing-webhook.service";

@Module({
  imports: [EntitlementsModule],
  controllers: [BillingController],
  providers: [BillingService, BillingWebhookService],
  exports: [BillingService],
})
export class BillingModule {}
