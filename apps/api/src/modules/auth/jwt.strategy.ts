import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { normalizeRoles, resolveTenantId } from '../../common/auth.utils';
import { getApiConfig } from '../../common/config';
import { getAppMode } from '../../common/app-mode';

type JwtPayload = {
  sub?: string;
  uid?: string;
  email?: string;
  tenantId?: string;
  roles?: string[] | string;
  role?: string;
  [key: string]: unknown;
};

const getJwtSecret = () => {
  const secret = getApiConfig().auth.jwtSecret;
  if (!secret) {
    if (getAppMode() === 'demo') return 'demo-secret';
    throw new Error('JWT_SECRET is not defined');
  }
  return secret;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
      issuer: getApiConfig().auth.jwtIssuer,
      audience: getApiConfig().auth.jwtAudience,
    });
  }

  validate(payload: JwtPayload) {
    const roles = normalizeRoles(payload.roles ?? payload.role);
    const uid = payload.sub ?? payload.uid ?? 'unknown';
    const tenantId = resolveTenantId(payload) ?? uid;
    return {
      uid,
      email: payload.email,
      tenantId,
      roles,
      role: roles[0],
    };
  }
}
