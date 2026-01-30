import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type {
  DashboardOverviewResponse,
  DashboardPandLResponse,
  DashboardAdsResponse,
  DashboardCustomersResponse,
  DashboardProductsResponse,
  DashboardGuardianResponse,
  DashboardAlertsResponse,
  DashboardKnowledgeResponse,
} from '@papadata/shared';
import { DashboardService } from './dashboard.service';
import { EntitlementsGuard } from '../../common/guards/entitlements.guard';
import { RequireEntitlements } from '../../common/decorators/entitlements.decorator';

@Controller('dashboard')
@UseGuards(EntitlementsGuard)
@RequireEntitlements('reports')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  overview(@Query('timeRange') timeRange?: string): DashboardOverviewResponse {
    return this.dashboardService.getOverview({ timeRange });
  }

  @Get('pandl')
  pandl(@Query('timeRange') timeRange?: string): DashboardPandLResponse {
    return this.dashboardService.getPandL({ timeRange });
  }

  @Get('ads')
  ads(@Query('timeRange') timeRange?: string): DashboardAdsResponse {
    return this.dashboardService.getAds({ timeRange });
  }

  @Get('customers')
  customers(@Query('timeRange') timeRange?: string): DashboardCustomersResponse {
    return this.dashboardService.getCustomers({ timeRange });
  }

  @Get('products')
  products(@Query('timeRange') timeRange?: string): DashboardProductsResponse {
    return this.dashboardService.getProducts({ timeRange });
  }

  @Get('guardian')
  guardian(): DashboardGuardianResponse {
    return this.dashboardService.getGuardian();
  }

  @Get('alerts')
  alerts(): DashboardAlertsResponse {
    return this.dashboardService.getAlerts();
  }

  @Get('knowledge')
  knowledge(): DashboardKnowledgeResponse {
    return this.dashboardService.getKnowledge();
  }
}
