import { Injectable } from "@nestjs/common";
import type {
  ExportCreateRequest,
  ExportCreateResponse,
} from "@papadata/shared";

@Injectable()
export class ExportsService {
  createExport(
    payload: ExportCreateRequest,
    baseUrl: string,
  ): ExportCreateResponse {
    const id = `exp_${Math.random().toString(36).slice(2, 10)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const safeBaseUrl = baseUrl.replace(/\/$/, "");
    return {
      id,
      status: "ready",
      downloadUrl: `${safeBaseUrl}/exports/${id}`,
      expiresAt,
    };
  }
}
