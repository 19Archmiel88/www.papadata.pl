export type IntegrationStatus = 'live' | 'beta' | 'soon';
export type IntegrationCategory = 'all' | 'ecommerce' | 'databases' | 'marketing' | 'communication';

export type IntegrationCategoryOption = {
  id: IntegrationCategory;
  labelKey: string;
};

export type IntegrationItem = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  status: IntegrationStatus;
  categories: IntegrationCategory[];
};

export const integrationCategories: IntegrationCategoryOption[] = [
  { id: 'all', labelKey: 'landing.integrations.categories.all' },
  { id: 'ecommerce', labelKey: 'landing.integrations.categories.ecommerce' },
  { id: 'databases', labelKey: 'landing.integrations.categories.databases' },
  { id: 'marketing', labelKey: 'landing.integrations.categories.marketing' },
  { id: 'communication', labelKey: 'landing.integrations.categories.communication' },
];

export const integrations: IntegrationItem[] = [
  {
    id: 'bigquery',
    nameKey: 'landing.integrations.items.bigquery.title',
    descriptionKey: 'landing.integrations.items.bigquery.description',
    status: 'live',
    categories: ['databases'],
  },
  {
    id: 'google-ads',
    nameKey: 'landing.integrations.items.googleAds.title',
    descriptionKey: 'landing.integrations.items.googleAds.description',
    status: 'live',
    categories: ['marketing'],
  },
  {
    id: 'meta-ads',
    nameKey: 'landing.integrations.items.metaAds.title',
    descriptionKey: 'landing.integrations.items.metaAds.description',
    status: 'beta',
    categories: ['marketing'],
  },
  {
    id: 'ga4',
    nameKey: 'landing.integrations.items.ga4.title',
    descriptionKey: 'landing.integrations.items.ga4.description',
    status: 'live',
    categories: ['marketing'],
  },
  {
    id: 'shopify',
    nameKey: 'landing.integrations.items.shopify.title',
    descriptionKey: 'landing.integrations.items.shopify.description',
    status: 'live',
    categories: ['ecommerce'],
  },
  {
    id: 'woocommerce',
    nameKey: 'landing.integrations.items.woocommerce.title',
    descriptionKey: 'landing.integrations.items.woocommerce.description',
    status: 'beta',
    categories: ['ecommerce'],
  },
  {
    id: 'magento',
    nameKey: 'landing.integrations.items.magento.title',
    descriptionKey: 'landing.integrations.items.magento.description',
    status: 'soon',
    categories: ['ecommerce'],
  },
  {
    id: 'baselinker',
    nameKey: 'landing.integrations.items.baselinker.title',
    descriptionKey: 'landing.integrations.items.baselinker.description',
    status: 'soon',
    categories: ['ecommerce'],
  },
];
