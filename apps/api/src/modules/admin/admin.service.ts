import { Injectable } from "@nestjs/common";
import { BillingRepository } from "../../common/billing.repository";

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
export class AdminService {
  constructor(private readonly billingRepository: BillingRepository) {}

  async getAiUsage(tenantId: string) {
    const { periodStart, periodEnd } = getPeriodWindow();
    const usage = await this.billingRepository.getAiUsage(
      tenantId,
      periodStart,
    );
    return {
      tenantId,
      periodStart,
      periodEnd,
      requestsCount: usage?.requestsCount ?? 0,
      tokensIn: usage?.tokensIn ?? 0,
      tokensOut: usage?.tokensOut ?? 0,
    };
  }

  async getSourcesCount(tenantId: string) {
    const activeCount =
      await this.billingRepository.countActiveSources(tenantId);
    return { tenantId, activeCount };
  }

  async getBilling(tenantId: string) {
    const billing = await this.billingRepository.getTenantBilling(tenantId);
    return billing;
  }
}
