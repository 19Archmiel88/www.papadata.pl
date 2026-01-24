import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isObservable, lastValueFrom } from "rxjs";
import { getAppMode } from "../app-mode";
import { IS_PUBLIC_KEY, FirebaseAuthGuard } from "../firebase-auth.guard";
import { JwtAuthGuard } from "../../modules/auth/jwt-auth.guard";
import { getApiConfig } from "../config";

type GuardResult = ReturnType<CanActivate["canActivate"]>;

const resolveGuard = async (result: GuardResult): Promise<boolean> => {
  if (isObservable(result)) {
    const resolved = await lastValueFrom(result);
    if (typeof resolved !== "boolean") {
      throw new TypeError("Guard returned non-boolean Observable value");
    }
    return resolved;
  }

  const resolved = await Promise.resolve(result);
  if (typeof resolved !== "boolean") {
    throw new TypeError("Guard returned non-boolean value");
  }
  return resolved;
};

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly firebaseAuthGuard: FirebaseAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (getAppMode() === "demo") {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Missing or invalid authorization header",
      );
    }

    let jwtError: unknown;
    if (getApiConfig().auth.jwtSecret) {
      try {
        const jwtResult = this.jwtAuthGuard.canActivate(context);
        if (await resolveGuard(jwtResult)) {
          return true;
        }
      } catch (error) {
        jwtError = error;
      }
    }

    if (getApiConfig().auth.firebaseProjectId) {
      try {
        const firebaseResult = this.firebaseAuthGuard.canActivate(context);
        if (await resolveGuard(firebaseResult)) {
          return true;
        }
      } catch (error) {
        if (jwtError) {
          throw jwtError;
        }
        throw error;
      }
    }

    if (jwtError) {
      throw jwtError;
    }

    throw new UnauthorizedException("Authentication not configured");
  }
}
