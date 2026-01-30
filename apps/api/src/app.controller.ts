import { Controller, Get, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { CompanyLookupResponse, HealthResponse } from '@papadata/shared';
import { AppService } from './app.service';
import { Public } from './common/decorators/current-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  @SkipThrottle()
  health(): HealthResponse {
    return this.appService.health();
  }

  @Get('public/company')
  @Public()
  @SkipThrottle()
  lookupCompany(@Query('nip') nip: string): CompanyLookupResponse {
    return this.appService.lookupCompany(nip);
  }
}
