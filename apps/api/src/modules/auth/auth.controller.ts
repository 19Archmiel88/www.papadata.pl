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
import { AuthService } from "./auth.service";

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
    const safeRedirect = (redirectUri ?? "").trim();
    const authUrl = safeRedirect
      ? `${safeRedirect}?provider=${encodeURIComponent(provider)}&status=connected&code=stub`
      : `/auth/oauth/${encodeURIComponent(provider)}/stub`;
    return { authUrl };
  }
}
