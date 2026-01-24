import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as admin from "firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getAppMode } from "./app-mode";
import { normalizeRoles, resolveTenantId } from "./auth.utils";
import type { RequestWithUser } from "./request";
import { getLogger } from "./logger";
import { getApiConfig } from "./config";

export const IS_PUBLIC_KEY = "isPublic";

let firebaseInitialized = false;

const initFirebase = (): boolean => {
  if (firebaseInitialized) return true;
  const projectId = getApiConfig().auth.firebaseProjectId;
  if (!projectId) {
    return false;
  }
  try {
    admin.initializeApp({
      projectId,
    });
    firebaseInitialized = true;
    return true;
  } catch {
    return false;
  }
};

type FirebaseClaims = DecodedIdToken & {
  roles?: string[] | string;
  role?: string;
};

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = getLogger(FirebaseAuthGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const mode = getAppMode();
    if (mode === "demo") {
      return true;
    }

    if (!initFirebase()) {
      this.logger.warn("Firebase not configured, allowing request in dev mode");
      if (getApiConfig().nodeEnv !== "production") {
        return true;
      }
      throw new UnauthorizedException("Authentication service unavailable");
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Missing or invalid authorization header",
      );
    }

    const token = authHeader.substring(7);

    try {
      const decodedToken = (await admin
        .auth()
        .verifyIdToken(token)) as FirebaseClaims;
      const roles = normalizeRoles(decodedToken.roles ?? decodedToken.role);
      const uid = decodedToken.uid ?? decodedToken.sub ?? "unknown";
      const tenantId = resolveTenantId(decodedToken) ?? uid;
      request.user = {
        uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        tenantId,
        roles,
        role: roles[0],
      };
      return true;
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      this.logger.warn(
        { code: code ?? "unknown" },
        "Token verification failed",
      );
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
