export type KpiTrend = 'up' | 'down' | 'neutral';
export type KpiFormat = 'currency' | 'number';

export type KpiMetric = {
  id: string;
  labelKey: string;
  value: number;
  change: number;
  trend: KpiTrend;
  helperKey: string;
  format: KpiFormat;
};

export const overviewKpis: KpiMetric[] = [
  {
    id: 'revenue',
    labelKey: 'dashboard.kpis.revenue',
    value: 1245800,
    change: 0.12,
    trend: 'up',
    helperKey: 'dashboard.kpis.helper.vsLastPeriod',
    format: 'currency',
  },
  {
    id: 'orders',
    labelKey: 'dashboard.kpis.orders',
    value: 14820,
    change: 0.08,
    trend: 'up',
    helperKey: 'dashboard.kpis.helper.vsLastPeriod',
    format: 'number',
  },
  {
    id: 'customers',
    labelKey: 'dashboard.kpis.customers',
    value: 3890,
    change: 0.05,
    trend: 'up',
    helperKey: 'dashboard.kpis.helper.vsLastPeriod',
    format: 'number',
  },
  {
    id: 'aov',
    labelKey: 'dashboard.kpis.aov',
    value: 86.4,
    change: -0.03,
    trend: 'down',
    helperKey: 'dashboard.kpis.helper.vsLastPeriod',
    format: 'currency',
  },
];
