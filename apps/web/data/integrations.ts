import type {
  IntegrationAuthType,
  IntegrationOAuthCallbackResponse,
  IntegrationOAuthStartResponse,
} from '@papadata/shared';
import { apiPost } from './api';

export type IntegrationStatus = 'live' | 'beta' | 'coming_soon';

export type IntegrationCategory =
  | 'ecommerce'
  | 'marketplace'
  | 'ads'
  | 'analytics'
  | 'payments'
  | 'email'
  | 'crm'
  | 'support'
  | 'data'
  | 'logistics'
  | 'finance'
  | 'consent'
  | 'affiliate'
  | 'productivity';

export type IntegrationItem = {
  id: string;
  provider: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  auth: IntegrationAuthType;
};

export const integrationCategories: IntegrationCategory[] = [
  'ecommerce',
  'marketplace',
  'ads',
  'analytics',
  'payments',
  'email',
  'crm',
  'support',
  'data',
  'logistics',
  'finance',
  'consent',
  'affiliate',
  'productivity',
];

export const integrations: IntegrationItem[] = [
  { id: 'shopify', provider: 'shopify', category: 'ecommerce', status: 'live', auth: 'api_key' },
  {
    id: 'woocommerce',
    provider: 'woocommerce',
    category: 'ecommerce',
    status: 'live',
    auth: 'api_key',
  },
  {
    id: 'prestashop',
    provider: 'prestashop',
    category: 'ecommerce',
    status: 'live',
    auth: 'api_key',
  },
  { id: 'magento', provider: 'magento', category: 'ecommerce', status: 'beta', auth: 'api_key' },
  {
    id: 'bigcommerce',
    provider: 'bigcommerce',
    category: 'ecommerce',
    status: 'beta',
    auth: 'api_key',
  },
  { id: 'shoper', provider: 'shoper', category: 'ecommerce', status: 'beta', auth: 'api_key' },
  { id: 'idosell', provider: 'idosell', category: 'ecommerce', status: 'beta', auth: 'api_key' },
  { id: 'shopware', provider: 'shopware', category: 'ecommerce', status: 'beta', auth: 'api_key' },
  {
    id: 'comarch_esklep',
    provider: 'comarch_esklep',
    category: 'ecommerce',
    status: 'coming_soon',
    auth: 'api_key',
  },
  {
    id: 'amazon_seller',
    provider: 'amazon_seller',
    category: 'marketplace',
    status: 'beta',
    auth: 'api_key',
  },
  { id: 'allegro', provider: 'allegro', category: 'marketplace', status: 'live', auth: 'api_key' },
  { id: 'ebay', provider: 'ebay', category: 'marketplace', status: 'beta', auth: 'api_key' },
  { id: 'etsy', provider: 'etsy', category: 'marketplace', status: 'beta', auth: 'api_key' },
  {
    id: 'baselinker',
    provider: 'baselinker',
    category: 'marketplace',
    status: 'live',
    auth: 'api_key',
  },
  {
    id: 'channelengine',
    provider: 'channelengine',
    category: 'marketplace',
    status: 'beta',
    auth: 'api_key',
  },
  { id: 'google_ads', provider: 'google_ads', category: 'ads', status: 'live', auth: 'oauth2' },
  { id: 'meta_ads', provider: 'meta_ads', category: 'ads', status: 'live', auth: 'oauth2' },
  { id: 'tiktok_ads', provider: 'tiktok_ads', category: 'ads', status: 'beta', auth: 'oauth2' },
  {
    id: 'microsoft_ads',
    provider: 'microsoft_ads',
    category: 'ads',
    status: 'beta',
    auth: 'oauth2',
  },
  { id: 'linkedin_ads', provider: 'linkedin_ads', category: 'ads', status: 'beta', auth: 'oauth2' },
  { id: 'amazon_ads', provider: 'amazon_ads', category: 'ads', status: 'beta', auth: 'oauth2' },
  { id: 'allegro_ads', provider: 'allegro_ads', category: 'ads', status: 'beta', auth: 'oauth2' },
  {
    id: 'zalando_zms',
    provider: 'zalando_zms',
    category: 'ads',
    status: 'coming_soon',
    auth: 'oauth2',
  },
  { id: 'ga4', provider: 'ga4', category: 'analytics', status: 'live', auth: 'oauth2' },
  { id: 'gsc', provider: 'gsc', category: 'analytics', status: 'beta', auth: 'oauth2' },
  { id: 'gtm', provider: 'gtm', category: 'analytics', status: 'beta', auth: 'oauth2' },
  { id: 'firebase', provider: 'firebase', category: 'analytics', status: 'beta', auth: 'oauth2' },
  { id: 'stripe', provider: 'stripe', category: 'payments', status: 'live', auth: 'api_key' },
  { id: 'paypal', provider: 'paypal', category: 'payments', status: 'live', auth: 'api_key' },
  { id: 'adyen', provider: 'adyen', category: 'payments', status: 'beta', auth: 'api_key' },
  { id: 'braintree', provider: 'braintree', category: 'payments', status: 'beta', auth: 'api_key' },
  {
    id: 'przelewy24',
    provider: 'przelewy24',
    category: 'payments',
    status: 'beta',
    auth: 'api_key',
  },
  { id: 'payu', provider: 'payu', category: 'payments', status: 'beta', auth: 'api_key' },
  { id: 'klaviyo', provider: 'klaviyo', category: 'email', status: 'live', auth: 'api_key' },
  { id: 'mailchimp', provider: 'mailchimp', category: 'email', status: 'beta', auth: 'api_key' },
  {
    id: 'getresponse',
    provider: 'getresponse',
    category: 'email',
    status: 'beta',
    auth: 'api_key',
  },
  {
    id: 'salesmanago',
    provider: 'salesmanago',
    category: 'email',
    status: 'beta',
    auth: 'api_key',
  },
  { id: 'customerio', provider: 'customerio', category: 'email', status: 'beta', auth: 'api_key' },
  { id: 'smsapi', provider: 'smsapi', category: 'email', status: 'beta', auth: 'api_key' },
  { id: 'gmc', provider: 'gmc', category: 'data', status: 'beta', auth: 'service_account' },
];

export const integrationsByProvider = integrations.reduce<Record<string, IntegrationItem>>(
  (acc, item) => {
    acc[item.provider] = item;
    return acc;
  },
  {}
);

export type IntegrationOAuthStartPayload = {
  tenantId?: string | null;
  redirectUri?: string | null;
};

export type IntegrationOAuthCallbackPayload = {
  tenantId?: string | null;
  code?: string | null;
  state?: string | null;
};

export const startIntegrationOAuth = async (
  provider: string,
  payload: IntegrationOAuthStartPayload
): Promise<IntegrationOAuthStartResponse> => {
  return apiPost<IntegrationOAuthStartResponse>(
    `/integrations/${encodeURIComponent(provider)}/connect`,
    payload
  );
};

export const completeOAuth = async (
  provider: string,
  payload: IntegrationOAuthCallbackPayload
): Promise<IntegrationOAuthCallbackResponse> => {
  return apiPost<IntegrationOAuthCallbackResponse>(
    `/integrations/${encodeURIComponent(provider)}/callback`,
    payload
  );
};
