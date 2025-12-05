export type Language = 'PL' | 'EN';
export type Theme = 'dark' | 'light';

export enum View {
  DASHBOARD = 'dashboard',
  REPORTS = 'reports',
  ACADEMY = 'academy',
  SUPPORT = 'support',
  INTEGRATIONS = 'integrations',
  SETTINGS = 'settings',
}

export interface KPI {
  id: string;
  label: { PL: string; EN: string };
  value: string;
  trend: string;
  trendUp: boolean;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'coming_soon' | 'voting';
  votes?: number;
  icon?: string;
}

export interface AcademyItem {
  id: string;
  type: 'video' | 'article';
  title: { PL: string; EN: string };
  subtitle: { PL: string; EN: string };
  isLocked: boolean;
}

export interface Translation {
  [key: string]: {
    PL: string;
    EN: string;
  };
}
