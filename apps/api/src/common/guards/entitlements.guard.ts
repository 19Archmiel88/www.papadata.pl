import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  ENTITLEMENTS_KEY,
  EntitlementFeature,
} from "../decorators/entitlements.decorator";
import { EntitlementsService } from "../entitlements.service";
import { getAppMode } from "../app-mode";
import { BillingRepository } from "../billing.repository";

@Injectable()
export class EntitlementsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly entitlementsService: EntitlementsService,
    private readonly billingRepository: BillingRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const features = this.reflector.getAllAndOverride<EntitlementFeature[]>(
      ENTITLEMENTS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!features || features.length === 0) {
      return true;
    }

    if (getAppMode() === "demo") {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request?.user?.tenantId ?? request?.user?.uid ?? undefined;

    if (tenantId) {
      const status = await this.billingRepository.getTenantStatus(tenantId);
      if (status?.status === "deleted") {
        throw new ForbiddenException({
          code: "tenant_deleted",
          message: "Account has been deleted.",
        });
      }
    }

    const entitlements =
      await this.entitlementsService.getEntitlements(tenantId);

    const blocked = features.filter(
      (feature) =>
        !this.entitlementsService.isFeatureAllowed(entitlements, feature),
    );

    if (blocked.length > 0) {
      throw new ForbiddenException({
        code: "entitlements_blocked",
        message: `Access blocked for features: ${blocked.join(", ")}`,
        details: {
          blockedFeatures: blocked,
          billingStatus: entitlements.billingStatus,
          trialEndsAt: entitlements.trialEndsAt,
        },
      });
    }

    if (request) {
      request.entitlements = entitlements;
    }

    return true;
  }
}
