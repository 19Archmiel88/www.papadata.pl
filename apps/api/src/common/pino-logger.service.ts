import type { LoggerService } from '@nestjs/common';
import type { Logger } from 'pino';
import { getLogger } from './logger';

const toMessage = (message: unknown): string =>
  typeof message === 'string' ? message : JSON.stringify(message);

export class PinoLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly context?: string) {
    this.logger = getLogger(context);
  }

  log(message: unknown, context?: string) {
    this.logger.info({
      context: context ?? this.context,
      msg: toMessage(message),
    });
  }

  error(message: unknown, trace?: string, context?: string) {
    this.logger.error({
      context: context ?? this.context,
      trace,
      msg: toMessage(message),
    });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn({
      context: context ?? this.context,
      msg: toMessage(message),
    });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug({
      context: context ?? this.context,
      msg: toMessage(message),
    });
  }

  verbose(message: unknown, context?: string) {
    this.logger.trace({
      context: context ?? this.context,
      msg: toMessage(message),
    });
  }
}
