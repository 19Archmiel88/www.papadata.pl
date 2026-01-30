export type IntegrationStatus =
  | 'connected'
  | 'needs_reauth'
  | 'disconnected'
  | 'error'
  | 'disabled';

export type IntegrationAuthType = 'oauth2' | 'api_key' | 'webhook' | 'service_account' | 'partner';

export interface IntegrationSummary {
  provider: string;
  status: IntegrationStatus;
  authType: IntegrationAuthType;
  displayName?: string;
  lastSync?: string;
}

export interface IntegrationOAuthStartResponse {
  authUrl: string;
}

export interface IntegrationOAuthCallbackResponse {
  provider?: string;
  status?: string;
}
