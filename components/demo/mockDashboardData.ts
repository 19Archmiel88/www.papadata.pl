import { CategoryData, CustomerData, ChartDataPoint, ProductData, KPIData, DashboardData } from '../../types';

const REVENUE_BASE: ChartDataPoint[] = [
  { date: 'Dec 01', revenue: 180000, spend: 72000 },
  { date: 'Dec 08', revenue: 205000, spend: 78000 },
  { date: 'Dec 15', revenue: 212000, spend: 86000 },
  { date: 'Dec 22', revenue: 247000, spend: 93000 },
  { date: 'Dec 29', revenue: 264000, spend: 102000 },
];

const CATEGORY_BASE: CategoryData[] = [
  { name: 'Marketplace', value: 34, color: '#6366F1' },
  { name: 'Retail', value: 26, color: '#0EA5E9' },
  { name: 'Tools', value: 18, color: '#14B8A6' },
  { name: 'Services', value: 12, color: '#FBBF24' },
  { name: 'Others', value: 10, color: '#0F172A' },
];

const CUSTOMER_BASE: CustomerData[] = [
  { date: 'Week 1', newCustomers: 140, returningCustomers: 40 },
  { date: 'Week 2', newCustomers: 160, returningCustomers: 58 },
  { date: 'Week 3', newCustomers: 170, returningCustomers: 60 },
  { date: 'Week 4', newCustomers: 190, returningCustomers: 70 },
];

const PRODUCTS_BASE: ProductData[] = [
  { id: 'PROD-101', name: 'OmniHub Studio', category: 'Tool', sales: 1240, revenue: 68250, status: 'In Stock' },
  { id: 'PROD-208', name: 'Ascend CRM', category: 'Software', sales: 980, revenue: 54720, status: 'Low Stock' },
  { id: 'PROD-312', name: 'Pulse Analytics', category: 'Analytics', sales: 860, revenue: 49800, status: 'In Stock' },
  { id: 'PROD-417', name: 'Momentum Kit', category: 'Services', sales: 430, revenue: 31050, status: 'Out of Stock' },
];

const KPI_BASE: KPIData[] = [
  { label: 'Revenue', value: 248000, change: 12.5, prefix: 'PLN' },
  { label: 'Spend', value: 87000, change: -4.2, prefix: 'PLN' },
  { label: 'ROAS', value: 4.77, change: 8.4 },
  { label: 'Avg Order Value', value: 129, change: 3.1, prefix: 'PLN' },
  { label: 'Conversion Rate', value: 3.1, change: 0.6, suffix: '%' },
];

export const getRevenueTrend = (range: 'today' | 'last7' | 'last30'): ChartDataPoint[] => {
  switch (range) {
    case 'today':
      return [REVENUE_BASE[REVENUE_BASE.length - 1]];
    case 'last7':
      return REVENUE_BASE.slice(-2);
    default:
      return REVENUE_BASE;
  }
};

export const getCategoryBreakdown = (range: 'today' | 'last7' | 'last30'): CategoryData[] => {
  if (range === 'today') {
    return CATEGORY_BASE.map((item) => ({ ...item, value: Math.round(item.value * 0.8) }));
  }
  if (range === 'last7') {
    return CATEGORY_BASE.map((item) => ({ ...item, value: Math.round(item.value * 0.9) }));
  }
  return CATEGORY_BASE;
};

export const getCustomerAcquisition = (range: 'today' | 'last7' | 'last30'): CustomerData[] => {
  if (range === 'today') {
    return [CUSTOMER_BASE[CUSTOMER_BASE.length - 1]];
  }
  return CUSTOMER_BASE.slice(range === 'last7' ? -3 : undefined);
};

export const getTopProducts = (range: 'today' | 'last7' | 'last30'): ProductData[] => {
  if (range === 'today') {
    return PRODUCTS_BASE.map((product) => ({
      ...product,
      revenue: Math.round(product.revenue * 0.6),
      status: product.status === 'Out of Stock' ? product.status : 'Low Stock',
    }));
  }
  if (range === 'last7') {
    return PRODUCTS_BASE.map((product) => ({
      ...product,
      revenue: Math.round(product.revenue * 0.8),
    }));
  }
  return PRODUCTS_BASE;
};

export const getKpiSummary = (range: 'today' | 'last7' | 'last30', isEnglish: boolean): KPIData[] => {
  return KPI_BASE.map((item) => {
    const factor = range === 'today' ? 0.2 : range === 'last7' ? 0.6 : 1;
    const adjusted = typeof item.value === 'number' ? item.value * factor : item.value;
    const changeModifier = range === 'today' ? 0.3 : range === 'last7' ? 0.7 : 1;
    return {
      ...item,
      label: localizeKpiLabel(item.label, isEnglish),
      value: typeof adjusted === 'number' ? Number(adjusted.toFixed(2)) : adjusted,
      change: Number((item.change * changeModifier).toFixed(1)),
    };
  });
};

export const getGeminiData = (range: 'today' | 'last7' | 'last30'): DashboardData => {
  const multiplier = range === 'today' ? 0.3 : range === 'last7' ? 0.7 : 1;
  return {
    period: range === 'today' ? 'Ostatnich 24 godziny' : range === 'last7' ? 'Ostatnie 7 dni' : 'Ostatnie 30 dni',
    revenue: Math.round(248000 * multiplier),
    spend: Math.round(87000 * multiplier),
    roas: 4.77,
    orders: Math.round(1920 * multiplier),
    sessions: Math.round(31200 * multiplier),
    conversionRate: 3.1,
    margin: 42,
    avgOrderValue: 129,
    returnRate: 4.2,
  };
};

export const localizeKpiLabel = (label: string, isEnglish: boolean) => {
  switch (label) {
    case 'Revenue':
      return isEnglish ? 'Revenue' : 'Przychód';
    case 'Spend':
      return isEnglish ? 'Spend' : 'Wydatki';
    case 'ROAS':
      return 'ROAS';
    case 'Avg Order Value':
      return isEnglish ? 'Avg Order Value' : 'Średnia wartość zamówienia';
    case 'Conversion Rate':
      return isEnglish ? 'Conversion Rate' : 'Współczynnik konwersji';
    default:
      return label;
  }
};
