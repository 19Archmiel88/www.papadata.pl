import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import type {
  AuthMagicLinkRequest,
  AuthMagicLinkResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthSession,
} from '@papadata/shared';
import { getApiConfig } from '../../common/config';
import { BillingRepository } from '../../common/billing.repository';
import { TimeProvider } from '../../common/time.provider';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidNip = (nip: string) => {
  if (!/^\d{10}$/.test(nip)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = w.reduce((acc, weight, i) => acc + weight * Number(nip[i]), 0);
  const mod = sum % 11;
  if (mod === 10) return false;
  return mod === Number(nip[9]);
};

const getExpiresInSeconds = () => {
  const raw = getApiConfig().auth.jwtExpiresInSeconds;
  return Number.isFinite(raw) && raw > 0 ? raw : 3600;
};

const ensureDemoMode = () => {
  if (getApiConfig().appMode !== 'demo') {
    throw new ServiceUnavailableException('Authentication stubs are available only in demo mode');
  }
};

const resolveRoles = (email: string): string[] => {
  const { auth, appMode } = getApiConfig();
  const normalizedEmail = email.toLowerCase();
  const owners = auth.ownerEmails.map((value) => value.toLowerCase());
  const admins = auth.adminEmails.map((value) => value.toLowerCase());

  if (!owners.length && !admins.length) {
    return appMode === 'demo' ? ['owner'] : ['user'];
  }
  if (owners.includes(normalizedEmail)) return ['owner'];
  if (admins.includes(normalizedEmail)) return ['admin'];
  return ['user'];
};

const TRIAL_DAYS = 14;

@Injectable()
export class AuthService {
  private readonly expiresInSeconds = getExpiresInSeconds();

  constructor(
    private readonly jwtService: JwtService,
    private readonly billingRepository: BillingRepository,
    private readonly timeProvider: TimeProvider
  ) {}

  requestMagicLink(payload: AuthMagicLinkRequest): AuthMagicLinkResponse {
    ensureDemoMode();
    const email = payload?.email?.trim().toLowerCase() ?? '';
    if (!isValidEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }
    return {
      ok: true,
      requestId: randomUUID(),
    };
  }

  login(payload: AuthLoginRequest): AuthLoginResponse {
    ensureDemoMode();
    const email = payload?.email?.trim().toLowerCase() ?? '';
    if (!isValidEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }
    return this.createSession(email, undefined);
  }

  async register(payload: AuthRegisterRequest): Promise<AuthRegisterResponse> {
    ensureDemoMode();
    const email = payload?.email?.trim().toLowerCase() ?? '';
    const password = payload?.password ?? '';
    const nip = payload?.nip?.trim() ?? '';
    const companyName = payload?.companyName?.trim() ?? '';
    const companyAddress = payload?.companyAddress?.trim() ?? '';

    if (!isValidEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      throw new BadRequestException('Password does not meet complexity requirements');
    }
    if (!isValidNip(nip)) {
      throw new BadRequestException('Invalid NIP');
    }
    if (!companyName || !companyAddress) {
      throw new BadRequestException('Company details are required');
    }

    const session = this.createSession(email, nip);
    const tenantId = session.user.tenantId;
    await this.startTrialForTenant(tenantId);
    return session;
  }

  private createSession(email: string, tenantId?: string): AuthSession {
    const userId = randomUUID();
    const roles = resolveRoles(email);
    const resolvedTenantId = tenantId ?? userId;
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email,
        tenantId: resolvedTenantId,
        roles,
      },
      {
        expiresIn: this.expiresInSeconds,
      }
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.expiresInSeconds,
      user: {
        id: userId,
        email,
        tenantId: resolvedTenantId,
        roles,
      },
    };
  }

  private async startTrialForTenant(tenantId: string): Promise<void> {
    const trialEndsAt = new Date(
      this.timeProvider.nowMs() + TRIAL_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    const started = await this.billingRepository.startTrialIfMissing({
      tenantId,
      plan: 'professional',
      trialEndsAt,
    });
    if (started) {
      await this.billingRepository.insertAuditEvent({
        tenantId,
        action: 'trial.started',
        details: { trialEndsAt },
      });
    }
  }
}
