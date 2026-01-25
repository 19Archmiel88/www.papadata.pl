import { Injectable, OnModuleDestroy } from "@nestjs/common";
import {
  Pool,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from "pg";
import { getApiConfig } from "./config";
import { getLogger } from "./logger";

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly logger = getLogger(DbService.name);
  private readonly pool: Pool | null;

  constructor() {
    const { url, poolMax, sslEnabled, sslRejectUnauthorized } = (
      getApiConfig() as {
        database: {
          url?: string;
          poolMax: number;
          sslEnabled: boolean;
          sslRejectUnauthorized: boolean;
        };
      }
    ).database;
    if (!url) {
      if (getApiConfig().appMode !== "demo") {
        this.logger.error("DATABASE_URL missing; refusing to start in prod.");
        throw new Error("DATABASE_URL is required outside demo mode");
      }
      this.pool = null;
      this.logger.warn("DATABASE_URL missing; DB features disabled.");
      return;
    }
    this.pool = new Pool({
      connectionString: url,
      max: poolMax,
      ssl: sslEnabled
        ? {
            rejectUnauthorized: sslRejectUnauthorized,
          }
        : undefined,
    });
  }

  isEnabled(): boolean {
    return Boolean(this.pool);
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error("Database is not configured");
    }
    return this.pool.query<T>(text, params);
  }

  async withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error("Database is not configured");
    }
    const client = await this.pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
