export type Language = 'PL' | 'EN';
export type Theme = 'light' | 'dark';

export type IntegrationCategory =
  | 'Marketing'
  | 'Store'
  | 'Marketplace'
  | 'Analytics'
  | 'Tool'
  | 'CRM'
  | 'Payment'
  | 'Logistics'
  | 'Accounting';

export type IntegrationStatus = 'Available' | 'ComingSoon' | 'Voting';

export interface SupportTopic {
  key: string;
  label: string;
  extraLabel?: string;
  extraOptions?: string[];
}

export interface IntegrationItem {
  id: string;
  code: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  votes: number; // For simulation
}

export type IntegrationHealthState = 'healthy' | 'error' | 'needs_reauth';

export interface IntegrationHealthInfo {
  state: IntegrationHealthState;
  message?: string;
  errorCode?: string;
  updatedAt?: string;
}

export interface IntegrationHealthEntry extends IntegrationHealthInfo {
  id: string;
  longName?: string;
}

export type IntegrationHealthMap = Record<string, IntegrationHealthEntry>;

/**
 * The structured response we expect from the Gemini analysis call.
 */
export interface AIAnalysisResult {
  summary: string;
  positiveTrends: string[];
  areasForImprovement: string[];
  strategicRecommendation: string;
}

/**
 * Describes a single chat message exchanged with Gemini.
 */
export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

/**
 * Minimal snapshot of the dashboard that is passed to Gemini for analysis.
 */
export interface DashboardData {
  period: string;
  revenue: number;
  spend: number;
  roas: number;
  orders: number;
  sessions: number;
  conversionRate: number;
  margin: number;
  avgOrderValue: number;
  returnRate?: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface CustomerData {
  date: string;
  newCustomers: number;
  returningCustomers: number;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  spend: number;
}

export interface KPIData {
  label: string;
  value: number;
  change: number;
  prefix?: string;
  suffix?: string;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export type DemoSection =
  | 'Dashboard'
  | 'LiveReports'
  | 'Academy'
  | 'Support'
  | 'Integrations'
  | 'Settings';

export interface DemoTranslation {
  sidebar: {
    dashboard: string;
    reports: string;
    academy: string;
    support: string;
    integrations: string;
    settings: string;
    logout: string;
    supportTooltip: string;
  };
  topbar: {
    titles: {
      dashboard: string;
      reports: string;
      academy: string;
      support: string;
      integrations: string;
      settings: string;
    };
    ranges: {
      today: string;
      last7: string;
      last30: string;
    };
    refreshLabel: string;
    refreshTooltip: string;
    accountTooltip: string;
  };
  dashboard: {
    ai: {
      title: string;
      subtitle: string;
      status: string;
      insight1: string;
      insight2: string;
      btnDetails: string;
      btnAsk: string;
      promptPlaceholder: string;
      answerHint: string;
    };
    kpi: {
      revenue: string;
      spend: string;
      roas: string;
      aov: string;
      margin: string;
      trend: string;
    };
    chart: {
      title: string;
      subtitle: string;
      metrics: {
        revenue: string;
        orders: string;
        spend: string;
        sessions: string;
      };
    };
    alerts: {
      connectionLost: string;
      reauthBanner: string;
      toastError: string;
      toastReauth: string;
    };
  };
  reports: {
    gated: {
      title: string;
      text: string;
      btnUnlock: string;
      btnDemo: string;
    };
    sandbox: {
      info: string;
      highlight: string;
      tabs: {
        sales: string;
        campaigns: string;
        customers: string;
        technical: string;
      };
      btnCreate: string;
    };
  };
  integrations: {
    title: string;
    text: string;
    searchPlaceholder: string;
    buttons: {
      connect: string;
      connected: string;
      comingSoon: string;
      vote: string;
    };
    categories: Record<'All' | IntegrationCategory, string>;
    votesLabel: string;
    toasts: {
      connected: string;
      vote: string;
    };
    tooltips: {
      comingSoon: string;
    };
    status: {
      needsReauth: string;
      reconnect: string;
      reconnectHint: string;
      bannerError: string;
      bannerReauth: string;
    };
  };
  academy: {
    title: string;
    text: string;
    videos: { title: string; subtitle: string; locked: boolean }[];
    articles: { title: string; subtitle: string; locked: boolean }[];
    badgePremium: string;
    lockedModal: {
      title: string;
      text: string;
      btn: string;
    };
    articleBody: string;
    videoBody: string;
  };
  support: {
    title: string;
    text: string;
    form: {
      topic: string;
      topics: {
        campaigns: string;
        budget: string;
        analytics: string;
        implementation: string;
        other: string;
      };
      budget: string;
      budgetRanges: {
        low: string;
        mid: string;
        high: string;
        huge: string;
      };
      desc: string;
      descPlaceholder: string;
      date: string;
      email: string;
      priceInfo: string;
      btn: string;
    };
    dynamicTopics: SupportTopic[];
    successToast: string;
  };
  settings: {
    title: string;
    labels: {
      lang: string;
      theme: string;
      themeOptions: {
        dark: string;
        light: string;
      };
      sidebar: string;
      sidebarOption: string;
    };
    deleteBtn: string;
    deleteModal: {
      title: string;
      text: string;
      btn: string;
    };
  };
  logoutModal: {
    title: string;
    text: string;
    signup: string;
    back: string;
  };
}

export interface Translation {
  header: {
    nav: {
      features: string;
      integrations: string;
      pricing: string;
      resources: string;
    };
    integrationsDropdown: {
      ecommerce: string;
      marketing: string;
      viewAll: string;
    };
    actions: {
      themeTooltip: string;
      login: string;
      signup: string;
    };
  };
  hero: {
    tag: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustText: string;
    mock: {
      header: string;
      carousel: {
        slide1: {
          title: string;
          value: string;
          trend: string;
          assistant: string;
        };
        slide2: {
          title: string;
          assistant: string;
        };
        slide3: {
          title: string;
          subtitle: string;
          assistant: string;
        };
      };
    };
  };
  featuresSection: {
    title: string;
    cards: {
      sales: { title: string; desc: string };
      period: { title: string; desc: string };
      products: { title: string; desc: string };
      conversion: { title: string; desc: string };
      marketing: { title: string; desc: string };
      customers: { title: string; desc: string };
      discounts: { title: string; desc: string };
      funnel: { title: string; desc: string };
      trends: { title: string; desc: string };
      export: { title: string; desc: string };
    };
  };
  aiSection: {
    title: string;
    subtitle: string;
    widget: {
      title: string;
      btn: string;
    };
  };
  formsSection: {
    tabs: {
      consultation: string;
      customReport: string;
    };
    consultation: {
      checkIssue: string;
      issuePlaceholder: string;
      checkAudit: string;
      budgetLabel: string;
      platformsLabel: string;
      btnSubmit: string;
    };
    reports: {
      checkSource: string;
      costLabel: string;
      btnSubmit: string;
      basePrice: string;
      extraPrice: string;
    };
    widget: {
      title: string;
      desc: string;
      btn: string;
    };
  };
  integrationsSection: {
    title: string;
    subtitle: string;
    viewAllButton: string;
    searchPlaceholder: string;
    cardSubtitles: {
      store: string;
      marketplace: string;
      analytics: string;
      marketing: string;
      tool: string;
    };
  };
  integrationsModal: {
    title: string;
    description: string;
    statuses: string;
    searchPlaceholder: string;
    filters: {
      all: string;
      marketing: string;
      store: string;
      marketplace: string;
      analytics: string;
      crm: string;
      tools: string;
      payment: string;
      logistics: string;
      accounting: string;
    };
    buttons: {
      connect: string;
      comingSoon: string;
      vote: string;
    };
    cta: {
      text: string;
      button: string;
    };
  };
  nagging: {
    title: string;
    subtitle: string;
    button: string;
    sideLabel: string;
  };
  scrollToTop: string;
  security: {
    title: string;
    mainCard: {
      title: string;
      desc: string;
    };
    cards: {
      infra: { title: string; desc: string };
      encryption: { title: string; desc: string };
      ai: { title: string; desc: string };
      gdpr: { title: string; desc: string };
      isolation: { title: string; desc: string };
      access: { title: string; desc: string };
    };
  };
  pricing: {
    title: string;
    calculator: {
      title: string;
      sourceLabel: string;
      supportLabel: string;
      supportDesc: string;
      priceLabel: string;
      perMonth: string;
      cta: string;
    };
  };
  faq: {
    title: string;
    items: {
      q1: { q: string; a: string };
      q2: { q: string; a: string };
      q3: { q: string; a: string };
      q4: { q: string; a: string };
      q5: { q: string; a: string };
      q6: { q: string; a: string };
      q7: { q: string; a: string };
    };
  };
  footer: {
    links: {
      privacy: string;
      terms: string;
      cookies: string;
      blog: string;
      contact: string;
    };
    socials: string;
  };
  demo: DemoTranslation;
}
