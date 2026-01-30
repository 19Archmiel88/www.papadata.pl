import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Throttle } from '@nestjs/throttler';
import type { AIChatRequest, AIChatResponse } from '@papadata/shared';
import { AiService } from './ai.service';
import { getAppMode } from '../../common/app-mode';
import { EntitlementsGuard } from '../../common/guards/entitlements.guard';
import { RequireEntitlements } from '../../common/decorators/entitlements.decorator';
import { getLogger } from '../../common/logger';
import { getApiConfig } from '../../common/config';
import { AiUsageService } from './ai-usage.service';
import { EntitlementsService } from '../../common/entitlements.service';

const getRateLimitConfig = () => {
  const { rateLimitWindowMs, rateLimitMax } = getApiConfig().ai;
  return {
    windowMs: Number.isFinite(rateLimitWindowMs) ? rateLimitWindowMs : 60000,
    max: Number.isFinite(rateLimitMax) ? rateLimitMax : 30,
  };
};

@Controller('ai')
export class AiController {
  private readonly logger = getLogger(AiController.name);

  constructor(
    private readonly aiService: AiService,
    private readonly aiUsageService: AiUsageService,
    private readonly entitlementsService: EntitlementsService
  ) {}

  @Post('chat')
  @UseGuards(EntitlementsGuard)
  @RequireEntitlements('ai')
  @Throttle({
    default: {
      ttl: getRateLimitConfig().windowMs,
      limit: getRateLimitConfig().max,
    },
  })
  async chat(
    @Body() payload: AIChatRequest,
    @Req() req: FastifyRequest,
    @Res({ passthrough: false }) reply: FastifyReply,
    @Query('stream') stream?: string,
    @Query('smoke') smoke?: string
  ): Promise<AIChatResponse> {
    if (!payload?.prompt || !payload.prompt.trim()) {
      throw new BadRequestException('Prompt is required');
    }

    const isSmoke = smoke === '1' || smoke === 'true';

    const tenantId = (req as any)?.user?.tenantId ?? (req as any)?.user?.uid ?? 'anonymous';

    const entitlements =
      (req as any)?.entitlements ?? (await this.entitlementsService.getEntitlements(tenantId));

    if (!isSmoke) {
      try {
        await this.aiUsageService.assertWithinLimit(tenantId, entitlements);
      } catch (error: any) {
        if (error?.code === 'ai_limit_exceeded') {
          throw new HttpException(
            {
              code: 'ai_limit_exceeded',
              message: 'AI usage limit exceeded',
              details: error?.details ?? {},
            },
            HttpStatus.TOO_MANY_REQUESTS
          );
        }
        throw error;
      }
    }

    const mode = getAppMode();
    const startedAt = Date.now();

    const response = await this.aiService.respond({
      ...payload,
      mode,
      smoke: isSmoke,
    } as any);
    const durationMs = Date.now() - startedAt;
    const finishReason = response.finishReason ?? 'stop';
    const requestId =
      (req.headers['x-request-id'] as string | undefined) ?? (req as any)?.id ?? 'unknown';

    this.logger.info(
      {
        finishReason,
        mode,
        durationMs,
        requestId,
        smoke: isSmoke,
      },
      'ai.chat'
    );

    if (!isSmoke) {
      await this.aiUsageService.recordUsage({ tenantId });
    }

    const acceptHeader = String(req.headers.accept ?? '').toLowerCase();
    const acceptAllowsStream =
      !acceptHeader || acceptHeader.includes('text/event-stream') || acceptHeader.includes('*/*');
    const wantsStream = stream !== '0' && (stream === '1' || acceptAllowsStream);

    if (!wantsStream) {
      reply.send(response);
      return response;
    }

    reply.header('Content-Type', 'text/event-stream; charset=utf-8');
    reply.header('Cache-Control', 'no-cache, no-transform');
    reply.header('Connection', 'keep-alive');
    reply.header('X-Accel-Buffering', 'no');

    const raw = reply.raw;
    raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    raw.setHeader('Cache-Control', 'no-cache, no-transform');
    raw.setHeader('Connection', 'keep-alive');
    raw.setHeader('X-Accel-Buffering', 'no');

    const text = response.text ?? '';
    const chunkSize = 120;
    let closed = false;
    const heartbeatMs = 20_000;

    req.raw.on('close', () => {
      closed = true;
    });

    const heartbeat = setInterval(() => {
      if (closed) return;
      raw.write(': ping\n\n');
    }, heartbeatMs);

    try {
      for (let i = 0; i < text.length; i += chunkSize) {
        if (closed) break;
        const chunk = text.slice(i, i + chunkSize);
        raw.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      if (!closed) {
        raw.write('data: [DONE]\n\n');
      }
      raw.end();
    } finally {
      clearInterval(heartbeat);
    }

    return response;
  }
}
