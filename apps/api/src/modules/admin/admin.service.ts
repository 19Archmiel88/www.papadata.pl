import { Injectable } from '@nestjs/common';
import { BillingRepository } from '../../common/billing.repository';
import { TimeProvider } from '../../common/time.provider';

const getPeriodWindow = (now: Date) => {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  return {
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10),
  };
};

@Injectable()
export class AdminService {
  constructor(
    private readonly billingRepository: BillingRepository,
    private readonly timeProvider: TimeProvider
  ) {}

  async getAiUsage(tenantId: string) {
    const { periodStart, periodEnd } = getPeriodWindow(this.timeProvider.now());
    const usage = await this.billingRepository.getAiUsage(tenantId, periodStart);
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
    const activeCount = await this.billingRepository.countActiveSources(tenantId);
    return { tenantId, activeCount };
  }

  async getBilling(tenantId: string) {
    const billing = await this.billingRepository.getTenantBilling(tenantId);
    return billing;
  }
}
