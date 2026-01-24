import type { FastifyRequest } from "fastify";
import type { AuthUser } from "./interfaces/auth-user.interface";

const normalizeHeaderValue = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

export interface RequestWithUser extends FastifyRequest {
  user?: AuthUser;
}

export const getRequestHost = (req: FastifyRequest): string =>
  normalizeHeaderValue(req.headers.host) ??
  normalizeHeaderValue(req.headers["x-forwarded-host"]) ??
  "localhost";

export const getRequestProtocol = (req: FastifyRequest): string =>
  req.protocol ??
  normalizeHeaderValue(req.headers["x-forwarded-proto"]) ??
  "https";

export const getRequestBaseUrl = (
  req: FastifyRequest,
  trailingPath = "",
): string =>
  `${getRequestProtocol(req)}://${getRequestHost(req)}${trailingPath}`;
