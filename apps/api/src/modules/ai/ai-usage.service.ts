import { Injectable } from "@nestjs/common";
import type { Entitlements } from "@papadata/shared";
import { BillingRepository } from "../../common/billing.repository";
import { getApiConfig } from "../../common/config";

const getPeriodWindow = () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0),
  );
  return {
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10),
  };
};

@Injectable()
export class AiUsageService {
  constructor(private readonly billingRepository: BillingRepository) {}

  private resolveLimit(entitlements: Entitlements): number {
    const limits = (
      getApiConfig() as {
        aiUsage: {
          limitBasic: number;
          limitPriority: number;
          limitFull: number;
        };
      }
    ).aiUsage;
    switch (entitlements.limits.aiTier) {
      case "basic":
        return limits.limitBasic;
      case "full":
        return limits.limitFull;
      default:
        return limits.limitPriority;
    }
  }

  async assertWithinLimit(
    tenantId: string | undefined,
    entitlements: Entitlements,
  ): Promise<void> {
    if (!tenantId) return;
    const limit = this.resolveLimit(entitlements);
    if (!Number.isFinite(limit) || limit <= 0) return;

    const { periodStart } = getPeriodWindow();
    const usage = await this.billingRepository.getAiUsage(
      tenantId,
      periodStart,
    );
    const used = usage?.requestsCount ?? 0;
    if (used >= limit) {
      const error: any = new Error("AI usage limit exceeded");
      error.code = "ai_limit_exceeded";
      error.details = { limit, used };
      throw error;
    }
  }

  async recordUsage(params: {
    tenantId?: string;
    tokensIn?: number;
    tokensOut?: number;
  }): Promise<void> {
    if (!params.tenantId) return;
    const { periodStart, periodEnd } = getPeriodWindow();
    await this.billingRepository.incrementAiUsage({
      tenantId: params.tenantId,
      periodStart,
      periodEnd,
      requestsDelta: 1,
      tokensInDelta: params.tokensIn ?? 0,
      tokensOutDelta: params.tokensOut ?? 0,
    });
  }
}
