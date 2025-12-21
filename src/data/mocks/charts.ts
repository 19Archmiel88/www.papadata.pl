export type ChartSeriesDefinition = {
  id: string;
  labelKey: string;
  data: number[];
};

export type ChartSegmentDefinition = {
  id: string;
  labelKey: string;
  value: number;
};

export const overviewRevenueSeries: ChartSeriesDefinition[] = [
  {
    id: 'revenue',
    labelKey: 'dashboard.charts.revenue',
    data: [118, 126, 133, 128, 142, 151, 162, 170, 182],
  },
];

export const overviewChannelSegments: ChartSegmentDefinition[] = [
  { id: 'direct', labelKey: 'dashboard.charts.channels.direct', value: 42 },
  { id: 'paid', labelKey: 'dashboard.charts.channels.paid', value: 34 },
  { id: 'retention', labelKey: 'dashboard.charts.channels.retention', value: 24 },
];

export const analyticsTrafficSeries: ChartSeriesDefinition[] = [
  {
    id: 'sessions',
    labelKey: 'dashboard.charts.sessions',
    data: [52, 59, 61, 57, 66, 72, 78, 83, 79],
  },
];

export const analyticsCampaignSeries: ChartSeriesDefinition[] = [
  {
    id: 'conversion',
    labelKey: 'dashboard.charts.conversion',
    data: [22, 28, 31, 26, 35, 38, 42],
  },
];
