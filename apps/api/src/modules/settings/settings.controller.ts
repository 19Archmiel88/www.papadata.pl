import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import type {
  SettingsWorkspaceResponse,
  SettingsOrgResponse,
} from "@papadata/shared";
import { SettingsService } from "./settings.service";
import { Roles } from "../../common/decorators/roles.decorator";
import type { FastifyRequest } from "fastify";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("workspace")
  workspace(): SettingsWorkspaceResponse {
    return this.settingsService.getWorkspace();
  }

  @Get("org")
  async org(): Promise<SettingsOrgResponse> {
    return this.settingsService.getOrg();
  }

  @Post("org/delete")
  @Roles("owner", "admin")
  async deleteOrg(
    @Req() req: FastifyRequest,
    @Body() payload: { tenantId?: string; reason?: string },
  ): Promise<{ status: "deleted" }> {
    const tenantId =
      payload?.tenantId ??
      (req as any)?.user?.tenantId ??
      (req as any)?.user?.uid;
    const actorId = (req as any)?.user?.uid ?? (req as any)?.user?.tenantId;
    await this.settingsService.deleteOrg({
      tenantId,
      reason: payload?.reason,
      actorId,
    });
    return { status: "deleted" };
  }
}
