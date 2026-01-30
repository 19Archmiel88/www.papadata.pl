import pino from 'pino';
import { getApiConfig } from './config';

const resolveLogLevel = (): pino.LevelWithSilent => {
  const env = (getApiConfig().nodeEnv ?? 'development').toLowerCase();
  if (env === 'production') return 'info';
  if (env === 'test') return 'silent';
  return 'debug';
};

const createBaseLogger = (): pino.Logger => {
  const level = resolveLogLevel();
  const env = (getApiConfig().nodeEnv ?? 'development').toLowerCase();

  if (env === 'production') {
    return pino({ level });
  }

  return pino(
    { level },
    pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    })
  );
};

const baseLogger = createBaseLogger();

export const getLogger = (context?: string): pino.Logger =>
  context ? baseLogger.child({ context }) : baseLogger;

export type AppLogger = ReturnType<typeof getLogger>;
