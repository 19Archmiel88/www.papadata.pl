import { Body, Controller, Get, Header, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { ExportCreateRequest, ExportCreateResponse } from '@papadata/shared';
import type { FastifyRequest } from 'fastify';
import { ExportsService } from './exports.service';
import { EntitlementsGuard } from '../../common/guards/entitlements.guard';
import { RequireEntitlements } from '../../common/decorators/entitlements.decorator';
import { getRequestBaseUrl } from '../../common/request';
import { getApiConfig } from '../../common/config';

@Controller('exports')
@UseGuards(EntitlementsGuard)
@RequireEntitlements('exports', 'reports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post()
  create(@Body() payload: ExportCreateRequest, @Req() req: FastifyRequest): ExportCreateResponse {
    const baseUrl = getApiConfig().exportBaseUrl ?? getRequestBaseUrl(req, '/api');
    return this.exportsService.createExport(payload, baseUrl);
  }

  @Get(':id')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  download(@Param('id') id: string): string {
    const header = 'id,metric,value';
    const rows = [`"${id}",revenue,120000`, `"${id}",spend,35000`, `"${id}",roas,3.4`];
    return [header, ...rows].join('\n');
  }
}
