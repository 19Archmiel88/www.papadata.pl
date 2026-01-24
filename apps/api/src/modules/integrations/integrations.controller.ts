import {
  Body,
  Controller,
  Get,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type {
  IntegrationOAuthCallbackResponse,
  IntegrationOAuthStartResponse,
  IntegrationStatus,
  IntegrationSummary,
} from "@papadata/shared";
import type { FastifyRequest } from "fastify";
import { IntegrationsService } from "./integrations.service";
import { getRequestBaseUrl } from "../../common/request";
import { EntitlementsGuard } from "../../common/guards/entitlements.guard";
import { RequireEntitlements } from "../../common/decorators/entitlements.decorator";
import { EntitlementsService } from "../../common/entitlements.service";
import { BillingRepository } from "../../common/billing.repository";

type IntegrationStatusTag = "active" | "attention" | "disabled";

const mapStatusTag = (status: IntegrationStatus): IntegrationStatusTag => {
  if (status === "connected") {
    return "active";
  }
  if (status === "needs_reauth" || status === "error") {
    return "attention";
  }
  return "disabled";
};

@Controller("integrations")
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly entitlementsService: EntitlementsService,
    private readonly billingRepository: BillingRepository,
  ) {}

  @Get()
  list(): IntegrationSummary[] {
    return this.integrationsService.list();
  }

  @Get("status")
  status(): Record<string, IntegrationStatusTag> {
    const entries = this.integrationsService
      .list()
      .map((item) => [item.provider, mapStatusTag(item.status)]);
    return Object.fromEntries(entries);
  }

  @Get(":provider")
  getByProvider(@Param("provider") provider: string): IntegrationSummary {
    const integration = this.integrationsService.getByProvider(provider);
    if (!integration) {
      throw new NotFoundException("Integration not found");
    }
    return integration;
  }

  @Post(":provider/connect")
  @UseGuards(EntitlementsGuard)
  @RequireEntitlements("integrations")
  async connect(
    @Param("provider") provider: string,
    @Body()
    payload: { tenantId?: string | null; redirectUri?: string | null },
    @Req() req: FastifyRequest,
  ): Promise<IntegrationOAuthStartResponse> {
    const tenantId =
      payload?.tenantId ??
      (req as any)?.user?.tenantId ??
      (req as any)?.user?.uid;
    if (!tenantId) {
      throw new BadRequestException("Tenant ID is required");
    }
    const entitlements =
      await this.entitlementsService.getEntitlements(tenantId);
    const maxSources = entitlements.limits.maxSources;
    const existing = await this.billingRepository.getSource(tenantId, provider);
    if (!existing) {
      const activeCount =
        await this.billingRepository.countActiveSources(tenantId);
      if (activeCount >= maxSources) {
        throw new ForbiddenException({
          code: "sources_limit_reached",
          message: "Maximum number of data sources reached.",
          details: { maxSources, activeCount },
        });
      }
    }
    return {
      authUrl: this.buildAuthUrl({
        provider,
        redirectUri: payload?.redirectUri,
        req,
      }),
    };
  }

  private buildAuthUrl(args: {
    provider: string;
    redirectUri?: string | null;
    req: FastifyRequest;
  }): string {
    const { provider, redirectUri, req } = args;
    const fallbackRedirect = `${getRequestBaseUrl(req)}/app/integrations/callback/${provider}`;
    const resolvedRedirect = (redirectUri ?? "").trim() || fallbackRedirect;
    const state = `state_${provider}_${Date.now()}`;
    return `${resolvedRedirect}?provider=${encodeURIComponent(provider)}&status=connected&code=stub&state=${encodeURIComponent(state)}`;
  }

  @Post(":provider/callback")
  callback(
    @Param("provider") provider: string,
    @Body()
    payload: { tenantId?: string | null },
    @Req() req: FastifyRequest,
  ): IntegrationOAuthCallbackResponse {
    const tenantId =
      payload?.tenantId ??
      (req as any)?.user?.tenantId ??
      (req as any)?.user?.uid;
    if (tenantId) {
      void this.billingRepository.upsertSource({
        tenantId,
        provider,
        status: "connected",
      });
    }
    return { provider, status: "connected" };
  }
}
