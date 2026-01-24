export type AppMode = 'demo' | 'prod';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface HealthResponse {
  status: 'ok';
  mode?: AppMode;
  timestamp?: string;
}

export interface Pagination {
  limit: number;
  offset: number;
  total?: number;
}
