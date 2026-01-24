import { Controller, Get, Query, Req } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { Roles } from "../../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("ai-usage")
  @Roles("owner", "admin")
  async aiUsage(
    @Req() req: FastifyRequest,
    @Query("tenantId") tenantId?: string,
  ) {
    const resolved =
      tenantId ?? (req as any)?.user?.tenantId ?? (req as any)?.user?.uid;
    return this.adminService.getAiUsage(resolved);
  }

  @Get("sources")
  @Roles("owner", "admin")
  async sources(
    @Req() req: FastifyRequest,
    @Query("tenantId") tenantId?: string,
  ) {
    const resolved =
      tenantId ?? (req as any)?.user?.tenantId ?? (req as any)?.user?.uid;
    return this.adminService.getSourcesCount(resolved);
  }

  @Get("billing")
  @Roles("owner", "admin")
  async billing(
    @Req() req: FastifyRequest,
    @Query("tenantId") tenantId?: string,
  ) {
    const resolved =
      tenantId ?? (req as any)?.user?.tenantId ?? (req as any)?.user?.uid;
    return this.adminService.getBilling(resolved);
  }
}
