import type { AppMode } from '@papadata/shared';
import { getApiConfig } from './config';

export const getAppMode = (): AppMode => getApiConfig().appMode;
