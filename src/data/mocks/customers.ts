export type CustomerRow = {
  id: string;
  nameKey: string;
  email: string;
  planKey: string;
  statusKey: string;
  ltv: number;
  lastOrder: string;
};

export const customers: CustomerRow[] = [
  {
    id: 'nova',
    nameKey: 'dashboard.customers.rows.nova.name',
    email: 'ops@novamarket.com',
    planKey: 'landing.pricing.tiers.scale.name',
    statusKey: 'dashboard.customers.status.active',
    ltv: 182400,
    lastOrder: '2024-08-18',
  },
  {
    id: 'urban',
    nameKey: 'dashboard.customers.rows.urban.name',
    email: 'hello@urbanpath.io',
    planKey: 'landing.pricing.tiers.starter.name',
    statusKey: 'dashboard.customers.status.new',
    ltv: 48250,
    lastOrder: '2024-08-20',
  },
  {
    id: 'helios',
    nameKey: 'dashboard.customers.rows.helios.name',
    email: 'data@helioswear.com',
    planKey: 'landing.pricing.tiers.scale.name',
    statusKey: 'dashboard.customers.status.atRisk',
    ltv: 99500,
    lastOrder: '2024-08-12',
  },
  {
    id: 'bright',
    nameKey: 'dashboard.customers.rows.bright.name',
    email: 'team@brighthome.eu',
    planKey: 'landing.pricing.tiers.enterprise.name',
    statusKey: 'dashboard.customers.status.active',
    ltv: 415000,
    lastOrder: '2024-08-21',
  },
];
