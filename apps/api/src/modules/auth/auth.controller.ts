import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  SetMetadata,
} from "@nestjs/common";
import type {
  AuthMagicLinkRequest,
  AuthMagicLinkResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
} from "@papadata/shared";
import { IS_PUBLIC_KEY } from "../../common/firebase-auth.guard";
import { getApiConfig } from "../../common/config";
import { AuthService } from "./auth.service";

const resolveRedirectUri = (redirectUri?: string): string | null => {
  const trimmed = redirectUri?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const url = new URL(trimmed);
    if (!/^https?:$/.test(url.protocol)) return null;
    const allowedOrigins = getApiConfig()
      .corsAllowedOrigins.map((origin) => {
        try {
          return new URL(origin).origin;
        } catch {
          return null;
        }
      })
      .filter((origin): origin is string => Boolean(origin));
    if (!allowedOrigins.includes(url.origin)) return null;
    return url.toString();
  } catch {
    return null;
  }
};

const buildOAuthStubUrl = (redirectUri: string, provider: string): string => {
  const isRelative = redirectUri.startsWith("/");
  const url = new URL(redirectUri, "http://localhost");
  url.searchParams.set("provider", provider);
  url.searchParams.set("status", "connected");
  url.searchParams.set("code", "stub");
  if (isRelative) {
    return `${url.pathname}${url.search}${url.hash}`;
  }
  return url.toString();
};

@Controller("auth")
@SetMetadata(IS_PUBLIC_KEY, true)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("magic-link")
  magicLink(@Body() payload: AuthMagicLinkRequest): AuthMagicLinkResponse {
    return this.authService.requestMagicLink(payload);
  }

  @Post("login")
  login(@Body() payload: AuthLoginRequest): AuthLoginResponse {
    return this.authService.login(payload);
  }

  @Post("register")
  register(@Body() payload: AuthRegisterRequest): AuthRegisterResponse {
    return this.authService.register(payload);
  }

  @Get("oauth/:provider/start")
  oauthStart(
    @Param("provider") provider: string,
    @Query("redirectUri") redirectUri?: string,
  ): { authUrl: string } {
    const safeRedirect = resolveRedirectUri(redirectUri);
    const authUrl = safeRedirect
      ? buildOAuthStubUrl(safeRedirect, provider)
      : `/auth/oauth/${encodeURIComponent(provider)}/stub`;
    return { authUrl };
  }
}
