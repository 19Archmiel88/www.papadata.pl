import { BadRequestException, Controller, Post, Req } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { BillingWebhookService } from "./billing-webhook.service";
import { Public } from "../../common/decorators/current-user.decorator";

@Controller("webhooks")
export class WebhooksController {
  constructor(private readonly billingWebhookService: BillingWebhookService) {}

  @Post("stripe")
  @Public()
  async stripeWebhook(@Req() req: FastifyRequest): Promise<{ received: true }> {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const rawBody = (req as any)?.rawBody as string | undefined;
    if (!rawBody) {
      throw new BadRequestException("Missing raw body for Stripe webhook");
    }
    await this.billingWebhookService.handleWebhook(rawBody, signature);
    return { received: true };
  }
}
