import { Injectable } from "@nestjs/common";
import type { TenantStatusPayload, TenantSummary } from "@papadata/shared";
import { getAppMode } from "../../common/app-mode";

@Injectable()
export class TenantsService {
  private readonly tenants: TenantSummary[] = [
    {
      id: "demo",
      name: "PapaData Demo",
      mode: getAppMode(),
      status: "active",
    },
  ];

  list(): TenantSummary[] {
    return this.tenants;
  }

  getById(id: string): TenantSummary | undefined {
    return this.tenants.find((tenant) => tenant.id === id);
  }

  getStatus(id: string): TenantStatusPayload {
    const mode = getAppMode();
    const now = new Date();
    const lastSyncAt = new Date(now.getTime() - 45 * 60 * 1000).toISOString();
    const seed = Math.max(1, id.length);
    const coverage = Math.min(0.95, 0.6 + (seed % 10) * 0.03);

    if (mode === "demo") {
      return {
        mode: "demo",
        lastSyncAt: undefined,
        hasIntegrations: false,
        coverage: 0.12,
      };
    }

    return {
      mode: "live",
      lastSyncAt,
      hasIntegrations: true,
      coverage,
    };
  }
}
