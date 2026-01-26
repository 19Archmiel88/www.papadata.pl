import { Injectable } from "@nestjs/common";
import type {
  SettingsWorkspaceResponse,
  SettingsOrgResponse,
} from "@papadata/shared";
import { getAppMode } from "../../common/app-mode";
import { EntitlementsService } from "../../common/entitlements.service";
import { BillingRepository } from "../../common/billing.repository";
import { TimeProvider } from "../../common/time.provider";

@Injectable()
export class SettingsService {
  constructor(
    private readonly entitlementsService: EntitlementsService,
    private readonly billingRepository: BillingRepository,
    private readonly timeProvider: TimeProvider,
  ) {}

  getWorkspace(): SettingsWorkspaceResponse {
    const mode = getAppMode();
    const now = this.timeProvider.now();
    return {
      mode,
      generatedAt: now.toISOString(),
      retentionDays: 365,
      retentionOptions: [90, 180, 365, 730],
      regions: ["europe-central2", "europe-west1"],
      maskingEnabled: true,
      attributionModels: ["last_click", "data_driven"],
      connectors: [
        { id: "shopify", name: "Shopify", enabled: true },
        { id: "allegro", name: "Allegro", enabled: true },
        { id: "google_ads", name: "Google Ads", enabled: true },
        { id: "meta_capi", name: "Meta", enabled: true },
        { id: "ga4", name: "GA4", enabled: true },
        { id: "email", name: "Email", enabled: false },
      ],
    };
  }

  async getOrg(): Promise<SettingsOrgResponse> {
    const mode = getAppMode();
    const entitlements = await this.entitlementsService.getEntitlements();
    const planLabel = `${entitlements.plan.charAt(0).toUpperCase()}${entitlements.plan.slice(1)}`;
    const nowMs = this.timeProvider.nowMs();
    return {
      mode,
      generatedAt: new Date(nowMs).toISOString(),
      company: {
        name: "PapaData Demo",
        region: "PL",
      },
      users: [
        { id: "u-1", name: "Admin Owner", role: "owner", status: "active" },
        { id: "u-2", name: "Analyst User", role: "analyst", status: "active" },
        {
          id: "u-3",
          name: "Invite Pending",
          role: "viewer",
          status: "invited",
        },
      ],
      billing: {
        plan: planLabel,
        status: entitlements.billingStatus,
        renewalDate: new Date(nowMs + 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      entitlements,
    };
  }

  async deleteOrg(params: {
    tenantId?: string;
    reason?: string;
    actorId?: string;
  }): Promise<void> {
    const tenantId = params.tenantId;
    if (!tenantId) return;
    await this.billingRepository.setTenantDeleted(tenantId);
    await this.billingRepository.insertAuditEvent({
      tenantId,
      actorId: params.actorId ?? null,
      action: "org.delete",
      details: { reason: params.reason ?? "unspecified" },
    });
  }
}
