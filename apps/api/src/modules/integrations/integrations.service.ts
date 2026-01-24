import { Injectable } from "@nestjs/common";
import type { IntegrationSummary } from "@papadata/shared";
import { getAppMode } from "../../common/app-mode";

@Injectable()
export class IntegrationsService {
  private readonly integrations: IntegrationSummary[] = [
    {
      provider: "ga4",
      status: getAppMode() === "demo" ? "disconnected" : "connected",
      authType: "oauth2",
      displayName: "Google Analytics 4",
      lastSync: getAppMode() === "demo" ? undefined : new Date().toISOString(),
    },
    {
      provider: "meta_ads",
      status: getAppMode() === "demo" ? "disconnected" : "connected",
      authType: "oauth2",
      displayName: "Meta Ads",
      lastSync: getAppMode() === "demo" ? undefined : new Date().toISOString(),
    },
  ];

  list(): IntegrationSummary[] {
    return this.integrations;
  }

  getByProvider(provider: string): IntegrationSummary | undefined {
    return this.integrations.find((item) => item.provider === provider);
  }
}
