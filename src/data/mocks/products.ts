export type ProductRow = {
  id: string;
  nameKey: string;
  sku: string;
  categoryKey: string;
  statusKey: string;
  stock: number;
  revenue: number;
};

export const products: ProductRow[] = [
  {
    id: 'nimbus',
    nameKey: 'dashboard.products.rows.nimbus.name',
    sku: 'NIM-4021',
    categoryKey: 'dashboard.products.categories.apparel',
    statusKey: 'dashboard.products.status.active',
    stock: 128,
    revenue: 84200,
  },
  {
    id: 'orbit',
    nameKey: 'dashboard.products.rows.orbit.name',
    sku: 'ORB-3197',
    categoryKey: 'dashboard.products.categories.footwear',
    statusKey: 'dashboard.products.status.lowStock',
    stock: 14,
    revenue: 56300,
  },
  {
    id: 'pulse',
    nameKey: 'dashboard.products.rows.pulse.name',
    sku: 'PUL-7731',
    categoryKey: 'dashboard.products.categories.accessories',
    statusKey: 'dashboard.products.status.active',
    stock: 92,
    revenue: 38900,
  },
  {
    id: 'halo',
    nameKey: 'dashboard.products.rows.halo.name',
    sku: 'HAL-2509',
    categoryKey: 'dashboard.products.categories.electronics',
    statusKey: 'dashboard.products.status.outOfStock',
    stock: 0,
    revenue: 27800,
  },
];
