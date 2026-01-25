import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import type {
  AuthMagicLinkRequest,
  AuthMagicLinkResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthSession,
} from "@papadata/shared";
import { getApiConfig } from "../../common/config";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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

const resolveRoles = (email: string): string[] => {
  const { auth, appMode } = getApiConfig();
  const normalizedEmail = email.toLowerCase();
  const owners = auth.ownerEmails.map((value) => value.toLowerCase());
  const admins = auth.adminEmails.map((value) => value.toLowerCase());

  if (!owners.length && !admins.length) {
    return appMode === "demo" ? ["owner"] : ["user"];
  }
  if (owners.includes(normalizedEmail)) return ["owner"];
  if (admins.includes(normalizedEmail)) return ["admin"];
  return ["user"];
};

@Injectable()
export class AuthService {
  private readonly expiresInSeconds = getExpiresInSeconds();

  constructor(private readonly jwtService: JwtService) {}

  requestMagicLink(payload: AuthMagicLinkRequest): AuthMagicLinkResponse {
    const email = payload?.email?.trim().toLowerCase() ?? "";
    if (!isValidEmail(email)) {
      throw new BadRequestException("Invalid email address");
    }
    return {
      ok: true,
      requestId: randomUUID(),
    };
  }

  login(payload: AuthLoginRequest): AuthLoginResponse {
    const email = payload?.email?.trim().toLowerCase() ?? "";
    if (!isValidEmail(email)) {
      throw new BadRequestException("Invalid email address");
    }
    return this.createSession(email, undefined);
  }

  register(payload: AuthRegisterRequest): AuthRegisterResponse {
    const email = payload?.email?.trim().toLowerCase() ?? "";
    const password = payload?.password ?? "";
    const nip = payload?.nip?.trim() ?? "";
    const companyName = payload?.companyName?.trim() ?? "";
    const companyAddress = payload?.companyAddress?.trim() ?? "";

    if (!isValidEmail(email)) {
      throw new BadRequestException("Invalid email address");
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      throw new BadRequestException(
        "Password does not meet complexity requirements",
      );
    }
    if (!isValidNip(nip)) {
      throw new BadRequestException("Invalid NIP");
    }
    if (!companyName || !companyAddress) {
      throw new BadRequestException("Company details are required");
    }

    return this.createSession(email, nip);
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
      },
    );

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.expiresInSeconds,
      user: {
        id: userId,
        email,
        tenantId: resolvedTenantId,
        roles,
      },
    };
  }
}
