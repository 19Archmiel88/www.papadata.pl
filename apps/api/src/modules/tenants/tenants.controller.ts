import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import type { TenantStatusPayload, TenantSummary } from "@papadata/shared";
import { TenantsService } from "./tenants.service";

@Controller("tenants")
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  list(): TenantSummary[] {
    return this.tenantsService.list();
  }

  @Get(":id")
  getById(@Param("id") id: string): TenantSummary {
    const tenant = this.tenantsService.getById(id);
    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }
    return tenant;
  }

  @Get(":id/status")
  getStatus(@Param("id") id: string): TenantStatusPayload {
    const tenant = this.tenantsService.getById(id);
    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }
    return this.tenantsService.getStatus(id);
  }
}
