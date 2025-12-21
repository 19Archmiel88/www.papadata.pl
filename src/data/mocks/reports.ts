export type ReportCard = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  formatKey: string;
  updated: string;
  statusKey: string;
};

export const reports: ReportCard[] = [
  {
    id: 'weekly-performance',
    titleKey: 'dashboard.reports.cards.weekly.title',
    descriptionKey: 'dashboard.reports.cards.weekly.description',
    formatKey: 'dashboard.reports.format.pdf',
    updated: '2024-08-22',
    statusKey: 'dashboard.reports.status.ready',
  },
  {
    id: 'cohort-retention',
    titleKey: 'dashboard.reports.cards.cohort.title',
    descriptionKey: 'dashboard.reports.cards.cohort.description',
    formatKey: 'dashboard.reports.format.csv',
    updated: '2024-08-20',
    statusKey: 'dashboard.reports.status.ready',
  },
  {
    id: 'marketing-spend',
    titleKey: 'dashboard.reports.cards.marketing.title',
    descriptionKey: 'dashboard.reports.cards.marketing.description',
    formatKey: 'dashboard.reports.format.xlsx',
    updated: '2024-08-18',
    statusKey: 'dashboard.reports.status.scheduled',
  },
];
