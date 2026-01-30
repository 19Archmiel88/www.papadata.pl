import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type {
  BillingCheckoutSessionRequest,
  BillingCheckoutSessionResponse,
  BillingStatusResponse,
  BillingSummary,
  BillingPortalResponse,
} from '@papadata/shared';
import type { FastifyRequest } from 'fastify';
import { Roles } from '../../common/decorators/roles.decorator';
import { getRequestBaseUrl, RequestWithUser } from '../../common/request';
import { BillingService } from './billing.service';
import { BillingWebhookService } from './billing-webhook.service';
import { getApiConfig } from '../../common/config';
import { Public } from '../../common/decorators/current-user.decorator';
import { getAppMode } from '../../common/app-mode';

const normalizeOrigins = (): string[] =>
  getApiConfig()
    .corsAllowedOrigins.map((origin) => {
      try {
        return new URL(origin).origin;
      } catch {
        return null;
      }
    })
    .filter((origin): origin is string => Boolean(origin));

const resolveConfiguredReturnUrl = (
  value: string,
  allowedOrigins: string[],
  fallbackOrigin: string
): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('//')) return null;
  if (trimmed.startsWith('/')) {
    return `${fallbackOrigin}${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    if (!/^https?:$/.test(url.protocol)) return null;
    if (allowedOrigins.length > 0 && !allowedOrigins.includes(url.origin)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
};

const resolveReturnUrl = (req: FastifyRequest) => {
  const allowedOrigins = normalizeOrigins();
  const fallbackOrigin = (allowedOrigins[0] ?? getRequestBaseUrl(req)).replace(/\/$/, '');
  const envUrl = getApiConfig().stripe.portalReturnUrl?.trim();
  const resolvedEnvUrl = envUrl
    ? resolveConfiguredReturnUrl(envUrl, allowedOrigins, fallbackOrigin)
    : null;
  if (resolvedEnvUrl) return resolvedEnvUrl;

  const requestOrigin = String(req.headers.origin ?? '').trim();

  if (requestOrigin) {
    try {
      const origin = new URL(requestOrigin).origin;
      if (allowedOrigins.includes(origin)) {
        return `${origin}/dashboard/settings/org`;
      }
    } catch {
      // ignore invalid origin header
    }
  }

  if (allowedOrigins.length > 0) {
    return `${allowedOrigins[0]}/dashboard/settings/org`;
  }

  return `${fallbackOrigin}/dashboard/settings/org`;
};

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly billingWebhookService: BillingWebhookService
  ) {}

  @Get('summary')
  async summary(@Req() req: RequestWithUser): Promise<BillingSummary> {
    const roles = Array.isArray(req.user?.roles) ? req.user.roles : [];
    const tenantId = req.user?.tenantId ?? req.user?.uid;
    return this.billingService.getSummary({ tenantId, roles });
  }

  @Post('portal')
  @Roles('owner', 'admin')
  async portal(@Req() req: RequestWithUser): Promise<BillingPortalResponse> {
    const tenantId = req.user?.tenantId ?? req.user?.uid;
    const portalUrl = await this.billingService.createPortalSession({
      tenantId,
      returnUrl: resolveReturnUrl(req),
    });
    return { portalUrl };
  }

  @Get('status')
  async status(
    @Req() req: RequestWithUser,
    @Query('tenantId') tenantId?: string
  ): Promise<BillingStatusResponse> {
    const mode = getAppMode();
    const resolvedTenantId = req.user?.tenantId ?? req.user?.uid;
    const requestedTenantId = tenantId?.trim();
    if (requestedTenantId && requestedTenantId !== resolvedTenantId && mode !== 'demo') {
      throw new BadRequestException('Tenant override is not allowed outside demo mode');
    }
    const effectiveTenantId = requestedTenantId ?? resolvedTenantId ?? undefined;
    return this.billingService.getStatus({ tenantId: effectiveTenantId });
  }

  @Post('checkout-session')
  async checkoutSession(
    @Body() payload: BillingCheckoutSessionRequest,
    @Req() req: FastifyRequest
  ): Promise<BillingCheckoutSessionResponse> {
    if (getAppMode() !== 'demo') {
      throw new ServiceUnavailableException('Stripe checkout is available only in demo mode');
    }
    return this.billingService.createCheckoutSession({
      tenantId: payload?.tenantId,
      planId: payload?.planId,
      requestBaseUrl: getRequestBaseUrl(req),
    });
  }

  @Post('webhook')
  @Public()
  async webhook(@Req() req: FastifyRequest): Promise<{ received: true }> {
    const signature = req.headers['stripe-signature'] as string | undefined;
    const rawBody = (req as any)?.rawBody as string | undefined;
    if (!rawBody) {
      throw new BadRequestException('Missing raw body for Stripe webhook');
    }
    await this.billingWebhookService.handleWebhook(rawBody, signature);
    return { received: true };
  }

  @Get('checkout-stub')
  @Header('Content-Type', 'text/html; charset=utf-8')
  checkoutStub(): string {
    if (getAppMode() !== 'demo') {
      throw new ServiceUnavailableException('Checkout stub is available only in demo mode');
    }
    return [
      '<!doctype html>',
      '<html lang="pl">',
      '<head><meta charset="utf-8"/><title>PapaData Checkout (Stub)</title></head>',
      '<body style="font-family:Arial, sans-serif; padding:24px;">',
      '<h1>PapaData Checkout (STUB)</h1>',
      '<p>Ten ekran potwierdza, że checkout-session działa w trybie stub.</p>',
      '<p>Podmień go na prawdziwą integrację Stripe w środowisku produkcyjnym.</p>',
      '</body></html>',
    ].join('');
  }
}
