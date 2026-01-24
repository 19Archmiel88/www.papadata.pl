export type DatePreset =
  | '1d'
  | '7d'
  | '30d'
  | '90d'
  | 'mtd'
  | 'qtd'
  | 'ytd'
  | 'custom';

export type ComparePreset = 'previous_period' | 'yoy' | null;

export interface DateRange {
  start: string;
  end: string;
  preset?: DatePreset;
  compare?: ComparePreset;
}

export type AttributionModel = 'last_click' | 'data_driven';

export interface GlobalFilters {
  channels?: string[];
  campaigns?: string[];
  adAccounts?: string[];
  skus?: string[];
  products?: string[];
  countries?: string[];
  devices?: string[];
  segments?: string[];
  sources?: string[];
  categories?: string[];
}

export type KPIKey =
  | 'revenue'
  | 'gross_margin'
  | 'net_margin'
  | 'roas'
  | 'cac'
  | 'ltv'
  | 'ltv_30d'
  | 'new_returning'
  | 'refund_rate'
  | 'conversion_rate'
  | 'orders'
  | 'aov'
  | 'profit'
  | 'spend'
  | 'cpa'
  | 'ctr'
  | 'cvr'
  | 'margin'
  | 'delta'
  | 'returns'
  | 'trend';

export type KPIUnit = 'pln' | 'percent' | 'ratio' | 'count';

export interface KPIValue {
  key: KPIKey;
  value: number;
  unit: KPIUnit;
  delta?: number;
  deltaPercent?: number;
}

export interface TimeseriesPoint {
  date: string;
  metrics: Partial<Record<KPIKey, number>>;
}

export interface TableRow {
  id: string;
  dimensions: Record<string, string>;
  metrics: Partial<Record<KPIKey, number>>;
}

export type FreshnessStatus = 'ok' | 'delay' | 'error';

export interface DataFreshnessSource {
  source: string;
  status: FreshnessStatus;
  lastSync?: string;
  delayMinutes?: number;
  records?: number;
}

export interface DataQuality {
  freshness: FreshnessStatus;
  coverage?: 'ok' | 'partial' | 'missing';
  sources?: DataFreshnessSource[];
  notes?: string[];
}
