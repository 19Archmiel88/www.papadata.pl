export type ExportFormat = 'pdf' | 'csv' | 'json';
export type ExportReport =
  | 'overview'
  | 'pandl'
  | 'ads'
  | 'customers'
  | 'products'
  | 'guardian'
  | 'alerts'
  | 'knowledge';

export interface ExportCreateRequest {
  report: ExportReport;
  format: ExportFormat;
  timeRange?: string;
  filters?: Record<string, string>;
}

export interface ExportCreateResponse {
  id: string;
  status: 'processing' | 'ready';
  downloadUrl?: string;
  expiresAt?: string;
}
