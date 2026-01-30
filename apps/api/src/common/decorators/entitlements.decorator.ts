import { SetMetadata } from '@nestjs/common';
import type { Entitlements } from '@papadata/shared';

export type EntitlementFeature = keyof Entitlements['features'];

export const ENTITLEMENTS_KEY = 'entitlements';

export const RequireEntitlements = (...features: EntitlementFeature[]) =>
  SetMetadata(ENTITLEMENTS_KEY, features);
