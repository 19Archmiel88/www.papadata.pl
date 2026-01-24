import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  BadRequestException,
} from "@nestjs/common";
import type {
  BillingCheckoutSessionRequest,
  BillingCheckoutSessionResponse,
  BillingStatusResponse,
  BillingSummary,
  BillingPortalResponse,
} from "@papadata/shared";
import type { FastifyRequest } from "fastify";
import { Roles } from "../../common/decorators/roles.decorator";
import { getRequestBaseUrl, RequestWithUser } from "../../common/request";
import { BillingService } from "./billing.service";
import { BillingWebhookService } from "./billing-webhook.service";
import { getApiConfig } from "../../common/config";
import { Public } from "../../common/decorators/current-user.decorator";

const resolveReturnUrl = (req: FastifyRequest) => {
  const envUrl = getApiConfig().stripe.portalReturnUrl?.trim();
  if (envUrl) return envUrl;
  return getRequestBaseUrl(req, "/dashboard/settings/org");
};

@Controller("billing")
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly billingWebhookService: BillingWebhookService,
  ) {}

  @Get("summary")
  async summary(@Req() req: RequestWithUser): Promise<BillingSummary> {
    const roles = Array.isArray(req.user?.roles) ? req.user.roles : [];
    const tenantId = req.user?.tenantId ?? req.user?.uid;
    return this.billingService.getSummary({ tenantId, roles });
  }

  @Post("portal")
  @Roles("owner", "admin")
  async portal(@Req() req: RequestWithUser): Promise<BillingPortalResponse> {
    const tenantId = req.user?.tenantId ?? req.user?.uid;
    const portalUrl = await this.billingService.createPortalSession({
      tenantId,
      returnUrl: resolveReturnUrl(req),
    });
    return { portalUrl };
  }

  @Get("status")
  async status(
    @Req() req: RequestWithUser,
    @Query("tenantId") tenantId?: string,
  ): Promise<BillingStatusResponse> {
    const resolvedTenantId = tenantId ?? req.user?.tenantId ?? req.user?.uid;
    return this.billingService.getStatus({ tenantId: resolvedTenantId });
  }

  @Post("checkout-session")
  async checkoutSession(
    @Body() payload: BillingCheckoutSessionRequest,
    @Req() req: FastifyRequest,
  ): Promise<BillingCheckoutSessionResponse> {
    return this.billingService.createCheckoutSession({
      tenantId: payload?.tenantId,
      planId: payload?.planId,
      requestBaseUrl: getRequestBaseUrl(req),
    });
  }

  @Post("webhook")
  @Public()
  async webhook(@Req() req: FastifyRequest): Promise<{ received: true }> {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const rawBody = (req as any)?.rawBody as string | undefined;
    if (!rawBody) {
      throw new BadRequestException("Missing raw body for Stripe webhook");
    }
    await this.billingWebhookService.handleWebhook(rawBody, signature);
    return { received: true };
  }

  @Get("checkout-stub")
  @Header("Content-Type", "text/html; charset=utf-8")
  checkoutStub(): string {
    return [
      "<!doctype html>",
      '<html lang="pl">',
      '<head><meta charset="utf-8"/><title>PapaData Checkout (Stub)</title></head>',
      '<body style="font-family:Arial, sans-serif; padding:24px;">',
      "<h1>PapaData Checkout (STUB)</h1>",
      "<p>Ten ekran potwierdza, że checkout-session działa w trybie stub.</p>",
      "<p>Podmień go na prawdziwą integrację Stripe w środowisku produkcyjnym.</p>",
      "</body></html>",
    ].join("");
  }
}
