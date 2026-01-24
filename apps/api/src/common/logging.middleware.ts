import { Injectable, NestMiddleware } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import { getAppMode } from "./app-mode";
import { getLogger } from "./logger";
import { getApiConfig } from "./config";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = getLogger("HTTP");
  private readonly isDev = getApiConfig().nodeEnv !== "production";

  use(request: FastifyRequest, reply: FastifyReply, next: () => void) {
    const startedAt = Date.now();
    const requestId =
      (request.headers["x-request-id"] as string | undefined) ?? randomUUID();

    const rawReply = reply.raw ?? reply;
    if (typeof reply.header === "function") {
      reply.header("x-request-id", requestId);
    } else if (typeof rawReply?.setHeader === "function") {
      rawReply.setHeader("x-request-id", requestId);
    }

    const onFinish = () => {
      if (typeof rawReply?.off === "function") {
        rawReply.off("finish", onFinish);
      } else if (typeof rawReply?.removeListener === "function") {
        rawReply.removeListener("finish", onFinish);
      }
      if (!this.isDev) {
        return;
      }

      const durationMs = Date.now() - startedAt;
      const mode = getAppMode();
      const statusCode =
        typeof reply.statusCode === "number"
          ? reply.statusCode
          : rawReply?.statusCode;
      this.logger.info(
        {
          method: request.method,
          url: request.url,
          statusCode,
          durationMs,
          mode,
          requestId,
        },
        "http.request",
      );
    };

    if (typeof rawReply?.on === "function") {
      rawReply.on("finish", onFinish);
    }
    next();
  }
}
