// apps/web/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  ArrowRight,
  ArrowUp,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileText,
  Gift,
  Globe,
  Moon,
  Play,
  Search,
  Sun,
  ThumbsUp,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type Language = 'PL' | 'EN';
type Theme = 'light' | 'dark';

type IntegrationCategory =
  | 'Marketing'
  | 'Store'
  | 'Marketplace'
  | 'Analytics'
  | 'CRM'
  | 'Tool'
  | 'Payment'
  | 'Logistics'
  | 'Accounting';

type IntegrationStatus = 'Available' | 'ComingSoon' | 'Voting';
type IntegrationFilter = IntegrationCategory | 'All';

interface IntegrationItem {
  id: string;
  code: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  votes: number;
}

type Translation = (typeof TRANSLATIONS)[Language];


const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  { id: 'woocommerce', code: 'WOO', name: 'WooCommerce', category: 'Store', status: 'Available', votes: 120 },
  { id: 'shopify', code: 'SH', name: 'Shopify', category: 'Store', status: 'Available', votes: 95 },
  { id: 'idosell', code: 'IDO', name: 'IdoSell', category: 'Store', status: 'Available', votes: 70 },
  { id: 'skyshop', code: 'SKY', name: 'Sky-Shop', category: 'Store', status: 'Voting', votes: 35 },
  { id: 'baselinker', code: 'BL', name: 'BaseLinker', category: 'Tool', status: 'Available', votes: 150 },
  { id: 'allegro', code: 'ALG', name: 'Allegro', category: 'Marketplace', status: 'Available', votes: 190 },
  { id: 'amazon', code: 'AMZ', name: 'Amazon', category: 'Marketplace', status: 'ComingSoon', votes: 110 },
  { id: 'ga4', code: 'GA4', name: 'Google Analytics 4', category: 'Analytics', status: 'Available', votes: 210 },
  { id: 'google_ads', code: 'GAds', name: 'Google Ads', category: 'Marketing', status: 'Available', votes: 230 },
  { id: 'meta_ads', code: 'Meta', name: 'Meta Ads', category: 'Marketing', status: 'Available', votes: 220 },
  { id: 'tiktok_ads', code: 'TT', name: 'TikTok Ads', category: 'Marketing', status: 'ComingSoon', votes: 80 },
  { id: 'salesforce', code: 'SF', name: 'Salesforce', category: 'CRM', status: 'Voting', votes: 25 },
  { id: 'hubspot', code: 'HS', name: 'HubSpot', category: 'CRM', status: 'Voting', votes: 40 },
  { id: 'klaviyo', code: 'KLA', name: 'Klaviyo', category: 'Marketing', status: 'ComingSoon', votes: 60 },
  { id: 'stripe', code: 'STR', name: 'Stripe', category: 'Payment', status: 'Voting', votes: 15 },
  { id: 'wfirma', code: 'WF', name: 'wFirma', category: 'Accounting', status: 'Voting', votes: 20 },
  { id: 'inpost', code: 'InP', name: 'InPost', category: 'Logistics', status: 'Voting', votes: 55 },
];

const TRANSLATIONS = {
  PL: {
    header: {
      nav: {
        features: 'Funkcje',
        integrations: 'Integracje',
        pricing: 'Cennik',
        resources: 'Baza wiedzy',
      },
      integrationsDropdown: {
        ecommerce: 'Platformy sklepowe',
        marketing: 'Reklama i analityka',
        viewAll: 'Zobacz wszystkie integracje',
      },
      actions: {
        themeTooltip: 'Zmień motyw',
        login: 'Zaloguj',
        signup: 'Zarejestruj się',
      },
    },
    hero: {
      tag: 'AI DLA E-COMMERCE',
      title: 'AI, które analizuje Twoje dane e-commerce.\nZobacz, skąd naprawdę bierze się Twój przychód.',
      subtitle:
        'Połącz sklep, kampanie reklamowe i analitykę w jednym miejscu. PapaData codziennie budzi się z gotowymi raportami, żebyś Ty nie musiał ich składać z Excela.',
      ctaPrimary: 'Rozpocznij 14-dniowy Trial',
      ctaSecondary: 'Zobacz demo z prawdziwymi wykresami',
      trustText: 'Bez karty, bez zobowiązań. Pierwsze raporty zobaczysz tego samego dnia.',
      mock: {
        header: 'Panel klienta – przykładowe dane',
        carousel: {
          slide1: {
            title: 'Przychód (ostatnie 30 dni)',
            value: '124 592,00 PLN',
            trend: '+12.5% vs poprzednie 30 dni',
            assistant:
              'W tym tygodniu sprzedaż z kampanii „Brand Search” wzrosła o 32%. Meta Ads przynosi 60% nowych klientów.',
          },
          slide2: {
            title: 'Analiza trendów sprzedaży',
            assistant:
              'Widzę spadek konwersji w weekendy. Sugeruję uruchomienie kampanii remarketingowej w niedzielę wieczorem.',
          },
          slide3: {
            title: 'Optymalizacja budżetu',
            subtitle: 'Budżet kampanii Brand Search zwiększony o 20%.',
            assistant:
              'Zrobione. Zwiększyłem budżet kampanii brandowej. Będę monitorował ROAS przez kolejne 24h.',
          },
        },
      },
    },
    featuresSection: {
      title: 'Funkcje PapaData',
      cards: {
        sales: {
          title: 'Wzrosty i spadki sprzedaży',
          desc: 'Analiza przyczyn zmian w przychodach dzień po dniu.',
        },
        period: {
          title: 'Raport Miesięczny / Tygodniowy',
          desc: 'Automatyczne podsumowania KPI na maila.',
        },
        products: {
          title: 'Produkty i Marża',
          desc: 'Trendy, prognozy, zwroty i koszty wysyłki.',
        },
        conversion: {
          title: 'Ścieżka Konwersji',
          desc: 'Atrybucja, budżet i punkty styku klienta.',
        },
        marketing: {
          title: 'Performance Kampanii',
          desc: 'Efektywność reklam w Google, Meta i TikToku.',
        },
        customers: {
          title: 'Klienci i LTV',
          desc: 'Analiza powracalności i segmentacja bazy.',
        },
        discounts: {
          title: 'Rabaty i Promocje',
          desc: 'Statystyki użycia kodów rabatowych.',
        },
        funnel: {
          title: 'Lejek Zakupowy',
          desc: 'Analiza etapów checkoutu (wymaga GA4).',
        },
        trends: {
          title: 'Trendy Sprzedaży',
          desc: 'Kluczowe wnioski i sezonowość.',
        },
        export: {
          title: 'Data Export',
          desc: 'Eksport danych do CSV lub Arkuszy Google.',
        },
      },
    },
    aiSection: {
      title: 'Gotowe Raporty. Asystent AI analizuje dane e-commerce',
      subtitle: 'Zadaj pytanie asystentowi, a otrzymasz odpowiedź.',
      widget: {
        title: 'Webinar Startowy',
        btn: 'Zapisz się',
      },
    },
    formsSection: {
      tabs: {
        consultation: 'Umów Konsultację',
        customReport: 'Raport Niestandardowy',
      },
      consultation: {
        checkIssue: 'Czy masz konkretną sprawę do omówienia?',
        issuePlaceholder: 'Opisz krótko problem...',
        checkAudit: 'Czy potrzebujesz audytu konta?',
        budgetLabel: 'Budżet miesięczny',
        platformsLabel: 'Platformy reklamowe',
        btnSubmit: 'Wyślij zgłoszenie',
      },
      reports: {
        checkSource: 'To samo źródło danych?',
        costLabel: 'Szacowany koszt:',
        basePrice: '500 PLN',
        extraPrice: '+200 PLN za dodatkowe źródło',
        btnSubmit: 'Zamów wycenę',
      },
      widget: {
        title: 'Webinar Ekspercki',
        desc: 'Dowiedz się jak analizować dane w Q4.',
        btn: 'Dołącz za darmo',
      },
    },
    integrationsSection: {
      title: 'Integrujemy się z platformami, których już używasz',
      subtitle:
        'PapaData łączy dane z Twojego sklepu, kampanii reklamowych, marketplace’ów i narzędzi analitycznych. Jednym kliknięciem podłączasz źródła, a my zajmujemy się resztą (ETL, hurtownia, raporty).',
      viewAllButton: 'Zobacz wszystkie integracje (30+)',
      cardSubtitles: {
        store: 'Sklep internetowy',
        marketplace: 'Marketplace',
        analytics: 'Analityka',
        marketing: 'Marketing',
        tool: 'Narzędzie',
      },
    },
    integrationsModal: {
      title: 'Katalog integracji PapaData',
      description:
        'Połącz PapaData z platformami, których używasz na co dzień. Sklepy, kampanie reklamowe, marketplace’y, CRM, płatności, logistyka i księgowość – w jednym, spójnym widoku.',
      statuses: 'Statusy: Dostępne • Wkrótce • Głosowanie (pomóż wybrać kolejne integracje).',
      searchPlaceholder: 'Szukaj integracji...',
      filters: {
        all: 'Wszystkie',
        marketing: 'Marketing',
        store: 'Sklep',
        marketplace: 'Marketplace',
        analytics: 'Analityka',
        crm: 'CRM',
        tools: 'Narzędzia',
        payment: 'Płatności',
        logistics: 'Logistyka',
        accounting: 'Księgowość',
      },
      buttons: {
        connect: 'Połącz w PapaData',
        comingSoon: 'Wkrótce',
        vote: 'Zagłosuj',
      },
      cta: {
        text: 'Nie widzisz swojej platformy?',
        button: 'Zaproponuj nową integrację',
      },
    },
    nagging: {
      title: 'Odbierz Pakiet Startowy',
      subtitle: 'Przetestuj PapaData przez 14 dni za darmo. Bez karty, bez zobowiązań.',
      button: 'Rozpocznij 14-dniowy trial',
      sideLabel: '14 DNI ZA DARMO',
    },
    scrollToTop: 'Wróć na górę',
  },
  EN: {
    header: {
      nav: {
        features: 'Features',
        integrations: 'Integrations',
        pricing: 'Pricing',
        resources: 'Resources',
      },
      integrationsDropdown: {
        ecommerce: 'E-commerce platforms',
        marketing: 'Ads & Analytics',
        viewAll: 'View all integrations',
      },
      actions: {
        themeTooltip: 'Switch theme',
        login: 'Log in',
        signup: 'Sign up',
      },
    },
    hero: {
      tag: 'AI FOR E-COMMERCE',
      title: 'AI that analyzes your e-commerce data.\nSee where your revenue really comes from.',
      subtitle:
        'Connect your store, ad platforms and analytics in one place. PapaData wakes up every morning with ready-to-use reports, so you don’t have to build them in spreadsheets.',
      ctaPrimary: 'Start 14-day trial',
      ctaSecondary: 'View live demo with charts',
      trustText: 'No card required, no commitment. Your first reports are ready the same day.',
      mock: {
        header: 'Client panel – sample data',
        carousel: {
          slide1: {
            title: 'Revenue (last 30 days)',
            value: '124 592,00 PLN',
            trend: '+12.5% vs previous 30 days',
            assistant:
              'This week, revenue from "Brand Search" grew by 32%. Meta Ads brings 60% of new customers.',
          },
          slide2: {
            title: 'Sales Trend Analysis',
            assistant:
              'I see a conversion drop on weekends. I suggest launching a remarketing campaign on Sunday evenings.',
          },
          slide3: {
            title: 'Budget Optimization',
            subtitle: 'Brand Search budget increased by 20%.',
            assistant:
              'Done. I have increased the brand campaign budget. I will monitor ROAS for the next 24h.',
          },
        },
      },
    },
    featuresSection: {
      title: 'PapaData Features',
      cards: {
        sales: {
          title: 'Sales Growth & Drop',
          desc: 'Root cause analysis of daily revenue changes.',
        },
        period: {
          title: 'Monthly / Weekly Reports',
          desc: 'Automatic KPI summaries sent to your email.',
        },
        products: {
          title: 'Products & Margin',
          desc: 'Trends, forecasts, returns, and shipping costs.',
        },
        conversion: {
          title: 'Conversion Path',
          desc: 'Attribution, budget, and customer touchpoints.',
        },
        marketing: {
          title: 'Campaign Performance',
          desc: 'Ad efficiency across Google, Meta, and TikTok.',
        },
        customers: {
          title: 'Customers & LTV',
          desc: 'Retention analysis and base segmentation.',
        },
        discounts: {
          title: 'Discounts & Promo Codes',
          desc: 'Usage statistics of discount codes.',
        },
        funnel: {
          title: 'Purchase Funnel',
          desc: 'Checkout stage analysis (GA4 required).',
        },
        trends: {
          title: 'Sales Trends',
          desc: 'Key insights and seasonality.',
        },
        export: {
          title: 'Data Export',
          desc: 'Export data to CSV or Google Sheets.',
        },
      },
    },
    aiSection: {
      title: 'Ready-to-use Reports. AI Assistant analyzes e-commerce data',
      subtitle: 'Ask the assistant a question and get an answer.',
      widget: {
        title: 'Starter Webinar',
        btn: 'Sign up',
      },
    },
    formsSection: {
      tabs: {
        consultation: 'Book Consultation',
        customReport: 'Custom Report',
      },
      consultation: {
        checkIssue: 'Do you have a specific issue?',
        issuePlaceholder: 'Briefly describe the problem...',
        checkAudit: 'Do you need an account audit?',
        budgetLabel: 'Monthly budget',
        platformsLabel: 'Ad platforms',
        btnSubmit: 'Send Request',
      },
      reports: {
        checkSource: 'Same data source?',
        costLabel: 'Estimated cost:',
        basePrice: '500 PLN',
        extraPrice: '+200 PLN per extra source',
        btnSubmit: 'Request Quote',
      },
      widget: {
        title: 'Expert Webinar',
        desc: 'Learn how to analyze Q4 data.',
        btn: 'Join for free',
      },
    },
    integrationsSection: {
      title: 'We integrate with the platforms you already use',
      subtitle:
        'PapaData connects data from your store, ad platforms, marketplaces and analytics tools. You plug in the sources, and we handle the rest (ETL, warehouse, reporting).',
      viewAllButton: 'View all integrations (30+)',
      cardSubtitles: {
        store: 'Online store',
        marketplace: 'Marketplace',
        analytics: 'Analytics',
        marketing: 'Marketing',
        tool: 'Tool',
      },
    },
    integrationsModal: {
      title: 'PapaData Integrations Catalog',
      description:
        'Connect PapaData with the platforms you use every day. Stores, ad platforms, marketplaces, CRM, payments, logistics and accounting – in one unified view.',
      statuses: 'Statuses: Available • Coming soon • Voting (help us choose next integrations).',
      searchPlaceholder: 'Search integrations...',
      filters: {
        all: 'All',
        marketing: 'Marketing',
        store: 'Store',
        marketplace: 'Marketplace',
        analytics: 'Analytics',
        crm: 'CRM',
        tools: 'Tools',
        payment: 'Payment',
        logistics: 'Logistics',
        accounting: 'Accounting',
      },
      buttons: {
        connect: 'Connect in PapaData',
        comingSoon: 'Coming soon',
        vote: 'Vote',
      },
      cta: {
        text: 'Don’t see your platform?',
        button: 'Suggest a new integration',
      },
    },
    nagging: {
      title: 'Claim your Starter Package',
      subtitle: 'Test PapaData for 14 days for free. No card, no commitment.',
      button: 'Start 14-day trial',
      sideLabel: '14 DAYS FREE',
    },
    scrollToTop: 'Back to top',
  },
} as const;

function trackEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  window.dataLayer.push({
    event,
    ...params,
  });
}

interface HeaderProps {
  lang: Language;
  theme: Theme;
  t: Translation['header'];
  setLang: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  onOpenIntegrations: (category?: IntegrationFilter) => void;
  scrollToId: (id: string) => void;
}

function Header({
  lang,
  theme,
  t,
  setLang,
  setTheme,
  onOpenIntegrations,
  scrollToId,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLangToggle = () => {
    const nextLang: Language = lang === 'PL' ? 'EN' : 'PL';
    setLang(nextLang);
    trackEvent('lang_change', { lang: nextLang });
  };

  const handleThemeToggle = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    trackEvent('theme_toggle', { theme: nextTheme });
  };

  const scrollToPricing = () => scrollToId('pricing');
  const scrollToResources = () => scrollToId('features');

  const handleFeatureScroll = (id: string) => {
    scrollToId(id);
  };

  const headerClasses = isScrolled
    ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-md py-3'
    : 'bg-transparent py-5';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerClasses}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-primary-500/30 ring-1 ring-slate-700">
            <span className="text-sm font-black tracking-tight">PD</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/20 via-transparent to-indigo-500/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="flex h-full flex-col justify-center">
            <span className="text-lg font-bold leading-none text-slate-900 transition-colors duration-300 dark:text-white">
              PapaData
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent transition-all duration-300 group-hover:text-primary-500">
              Intelligence
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* Features dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
            >
              {t.nav.features}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 translate-y-2 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="min-w-[220px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => handleFeatureScroll('features-sales')}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {lang === 'PL' ? 'Analiza sprzedaży' : 'Sales analysis'}
                </button>
                <button
                  type="button"
                  onClick={() => handleFeatureScroll('features-marketing')}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {lang === 'PL' ? 'Marketing i kampanie' : 'Marketing & campaigns'}
                </button>
                <button
                  type="button"
                  onClick={() => handleFeatureScroll('features-customers')}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {lang === 'PL' ? 'Klienci i LTV' : 'Customers & LTV'}
                </button>
              </div>
            </div>
          </div>

          {/* Integrations dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
            >
              {t.nav.integrations}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 translate-y-2 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="min-w-[230px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => onOpenIntegrations('Store')}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.integrationsDropdown.ecommerce}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenIntegrations('Marketing')}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.integrationsDropdown.marketing}
                </button>
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <button
                  type="button"
                  onClick={() => onOpenIntegrations()}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-primary-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.integrationsDropdown.viewAll}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToPricing}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
          >
            {t.nav.pricing}
          </button>

          <button
            type="button"
            onClick={scrollToResources}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
          >
            {t.nav.resources}
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLangToggle}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400"
          >
            <Globe className="h-4 w-4" />
            {lang}
          </button>

          <button
            type="button"
            onClick={handleThemeToggle}
            title={t.actions.themeTooltip}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-3 pl-4 text-sm sm:flex">
            <Link
              href="/demo/dashboard"
              className="font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300"
              onClick={() => trackEvent('nav_demo_click', { section: 'header' })}
            >
              {t.actions.login}
            </Link>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-colors hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500"
              onClick={() => trackEvent('nav_signup_click', { section: 'header' })}
            >
              {t.actions.signup}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

interface HeroProps {
  t: Translation['hero'];
  lang: Language;
}

function Hero({ t, lang }: HeroProps) {
  const lines = t.title.split('\n');

  const handlePrimary = () => {
    trackEvent('hero_cta_primary', { lang });
  };

  const handleSecondary = () => {
    trackEvent('hero_cta_secondary', { lang });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pt-28 pb-24 text-white">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full bg-primary-500/40 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-40 right-10 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        {/* Left – copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            {t.tag}
          </span>

          <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 text-base text-slate-300 sm:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/wizard"
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 transition-all hover:-translate-y-0.5 hover:bg-primary-500"
              onClick={handlePrimary}
            >
              {t.ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/demo/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 px-6 py-3 text-sm font-semibold text-slate-100 shadow-md transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-100"
              onClick={handleSecondary}
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              {t.ctaSecondary}
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400 sm:text-sm">{t.trustText}</p>
        </div>

        {/* Right – mock panel */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -top-8 left-6 h-24 w-24 rounded-3xl bg-gradient-to-br from-primary-500/50 to-indigo-500/30 blur-2xl" />
          <div className="absolute -bottom-10 right-0 h-24 w-24 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-primary-500/40 blur-2xl" />

          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-primary-500/30 backdrop-blur">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">{t.mock.header}</p>
                <p className="text-sm font-semibold text-slate-100">JD Store – Demo</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-300">
                  {lang === 'PL' ? 'Dane zsynchronizowane' : 'Data synced'}
                </span>
              </div>
            </div>

            {/* Main card */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Left – revenue card */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                <div className="absolute inset-0 -translate-x-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="relative space-y-3">
                  <p className="text-xs font-medium text-slate-400">
                    {t.mock.carousel.slide1.title}
                  </p>
                  <p className="text-2xl font-semibold text-slate-50">
                    {t.mock.carousel.slide1.value}
                  </p>
                  <p className="text-xs text-emerald-400">{t.mock.carousel.slide1.trend}</p>

                  <div className="mt-2 h-20 rounded-xl bg-slate-900/80 p-2">
                    <div className="flex items-start justify-between gap-2 text-xs text-slate-300">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          Google Ads
                        </p>
                        <p className="font-semibold text-slate-100">+18%</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          Meta Ads
                        </p>
                        <p className="font-semibold text-slate-100">+32%</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          ROAS
                        </p>
                        <p className="font-semibold text-slate-100">5.1x</p>
                      </div>
                    </div>
                    <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-primary-500 via-cyan-400 to-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Right – AI assistant */}
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-slate-700">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-500" />
                  </span>
                  {lang === 'PL' ? 'Asystent AI – live' : 'AI Assistant – live'}
                </div>
                <p className="text-xs text-slate-300">
                  {t.mock.carousel.slide1.assistant}
                </p>
                <div className="rounded-xl bg-slate-950/80 p-3 text-xs text-slate-300">
                  <p className="mb-2 font-semibold text-slate-100">
                    {t.mock.carousel.slide2.title}
                  </p>
                  <p>{t.mock.carousel.slide2.assistant}</p>
                </div>
                <div className="rounded-xl bg-slate-950/80 p-3 text-xs text-slate-300">
                  <p className="mb-1 font-semibold text-slate-100">
                    {t.mock.carousel.slide3.title}
                  </p>
                  <p className="mb-1 text-[11px] text-slate-400">
                    {t.mock.carousel.slide3.subtitle}
                  </p>
                  <p>{t.mock.carousel.slide3.assistant}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating widget */}
          <div className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 md:block">
            <div className="pointer-events-auto w-56 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                  </span>
                  Live
                </span>
                <span className="text-[10px] text-slate-500">
                  {lang === 'PL' ? 'Webinar startowy' : 'Starter webinar'}
                </span>
              </div>
              <p className="mb-2 text-xs font-semibold text-slate-50">
                {t.mock.carousel.slide1.title}
              </p>
              <button
                type="button"
                className="mt-1 w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                {lang === 'PL' ? 'Zapisz się' : 'Sign up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeaturesSectionProps {
  t: Translation['featuresSection'];
}

function FeaturesSection({ t }: FeaturesSectionProps) {
  const cards = t.cards;

  const items: Array<{
    id: string;
    key: keyof typeof cards;
  }> = [
    { id: 'features-sales', key: 'sales' },
    { id: 'features-period', key: 'period' },
    { id: 'features-products', key: 'products' },
    { id: 'features-conversion', key: 'conversion' },
    { id: 'features-marketing', key: 'marketing' },
    { id: 'features-customers', key: 'customers' },
    { id: 'features-discounts', key: 'discounts' },
    { id: 'features-funnel', key: 'funnel' },
    { id: 'features-trends', key: 'trends' },
    { id: 'features-export', key: 'export' },
  ];

  return (
    <section
      id="features"
      className="bg-white py-20 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.title}</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            KPI, ścieżka klienta, kampanie reklamowe i marża – wszystko w jednym miejscu.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ id, key }) => {
            const card = cards[key];
            return (
              <div
                key={id}
                id={id}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 h-8 w-8 rounded-xl bg-primary-500/10" />
                <h3 className="mb-2 text-sm font-semibold">{card.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{card.desc}</p>
                <div className="mt-4 h-[2px] w-12 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface IntegrationsPreviewProps {
  t: Translation['integrationsSection'];
  onOpenModal: () => void;
}

function IntegrationLogo({ code }: { code: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      {code}
    </div>
  );
}

function IntegrationsPreview({ t, onOpenModal }: IntegrationsPreviewProps) {
  const previewIds = [
    'woocommerce',
    'shopify',
    'allegro',
    'ga4',
    'google_ads',
    'meta_ads',
    'tiktok_ads',
    'idosell',
    'skyshop',
    'baselinker',
  ];
  const displayItems = INITIAL_INTEGRATIONS.filter((item) => previewIds.includes(item.id));

  const getSubtitle = (category: IntegrationCategory, isPl: boolean) => {
    const mapPl: Record<IntegrationCategory, string> = {
      Store: 'Sklep internetowy',
      Marketplace: 'Marketplace',
      Analytics: 'Analityka',
      Marketing: 'Marketing',
      Tool: 'Narzędzie',
      CRM: 'CRM',
      Payment: 'Płatności',
      Logistics: 'Logistyka',
      Accounting: 'Księgowość',
    };
    const mapEn: Record<IntegrationCategory, string> = {
      Store: 'Online store',
      Marketplace: 'Marketplace',
      Analytics: 'Analytics',
      Marketing: 'Marketing',
      Tool: 'Tool',
      CRM: 'CRM',
      Payment: 'Payment',
      Logistics: 'Logistics',
      Accounting: 'Accounting',
    };
    return (isPl ? mapPl : mapEn)[category];
  };

  const isPl = t.cardSubtitles.store === 'Sklep internetowy';

  return (
    <section
      id="integrations"
      className="bg-slate-50 py-20 dark:bg-slate-900/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            {t.subtitle}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <IntegrationLogo code={item.code} />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {item.name}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                  {getSubtitle(item.category, isPl)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition-colors hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500"
          >
            {t.viewAllButton}
          </button>
        </div>
      </div>
    </section>
  );
}

interface AISectionProps {
  t: Translation['aiSection'];
}

function AISection({ t }: AISectionProps) {
  return (
    <section className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 py-20 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">{t.subtitle}</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
              <span>
                AI tłumaczy Ci, skąd biorą się zmiany w przychodzie – nie tylko pokazuje wykres.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
              <span>Gotowe raporty dzienne, tygodniowe i miesięczne – bez klikania w Data Studio.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
              <span>W jednym widoku łączysz sprzedaż, marketing i zachowanie użytkowników.</span>
            </li>
          </ul>
        </div>

        {/* Widget / laptop */}
        <div className="relative flex-1">
          <div className="absolute -inset-6 rounded-3xl bg-primary-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500/20">
                  <SparkIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">AI Assistant</p>
                  <p className="text-[11px] text-slate-400">Last 30 days – JD Store</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                Live
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-200">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Summary
                  </p>
                  <p>
                    Revenue from your “Brand Search – Google Ads” campaign increased by 28% while
                    new customers from Meta Ads grew by 18%. I suggest increasing brand budget by
                    20% and testing new creatives on Meta.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-200">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Trends
                  </p>
                  <p>
                    Weekend conversion rate dropped by 12%. Consider launching remarketing campaigns
                    on Sunday evenings.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="rounded-xl bg-slate-950/60 p-3">
                  <p className="mb-2 text-xs font-semibold text-slate-200">
                    {t.widget.title}
                  </p>
                  <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Live session – 60 min</span>
                    <span>Q4 checklist included</span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-500"
                  >
                    {t.widget.btn}
                  </button>
                </div>
                <div className="mt-4 h-24 rounded-xl bg-gradient-to-b from-primary-500/20 via-slate-900 to-slate-950">
                  <div className="flex h-full items-center justify-center text-xs text-slate-300">
                    Mini wykres sprzedaży / ROAS (placeholder pod Recharts)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary-300"
      aria-hidden="true"
    >
      <path
        d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface FormsSectionProps {
  t: Translation['formsSection'];
}

function FormsSection({ t }: FormsSectionProps) {
  const [activeTab, setActiveTab] = useState<'consultation' | 'report'>('consultation');
  const [hasIssue, setHasIssue] = useState(false);
  const [sameSource, setSameSource] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent('forms_submit', { tab: activeTab });
    // na razie tylko mock
    // eslint-disable-next-line no-alert
    alert('Demo: formularz zostałby wysłany do zespołu PapaData.');
  };

  return (
    <section className="border-t border-slate-100 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:px-8">
        <div>
          <div className="mb-6 inline-flex rounded-xl bg-slate-100 p-1 text-sm dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveTab('consultation')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all ${
                activeTab === 'consultation'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Calendar className="h-4 w-4" />
              {t.tabs.consultation}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all ${
                activeTab === 'report'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              {t.tabs.customReport}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <AnimatePresence mode="wait">
              {activeTab === 'consultation' ? (
                <motion.form
                  key="consultation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.consultation.checkIssue}
                    </label>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                      rows={3}
                      placeholder={t.consultation.issuePlaceholder}
                      onChange={(e) => setHasIssue(e.target.value.trim().length > 0)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        checked={hasIssue}
                        onChange={(e) => setHasIssue(e.target.checked)}
                      />
                      {t.consultation.checkAudit}
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {hasIssue
                        ? 'Podpowiemy Ci, na co patrzeć w raportach.'
                        : 'Nie musisz mieć gotowego problemu – możemy go znaleźć razem.'}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t.consultation.budgetLabel}
                      </label>
                      <select className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50">
                        <option>&lt; 10 000 PLN</option>
                        <option>10 000 – 50 000 PLN</option>
                        <option>50 000 – 200 000 PLN</option>
                        <option>&gt; 200 000 PLN</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t.consultation.platformsLabel}
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        placeholder="np. Google Ads, Meta Ads, GA4, WooCommerce"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        placeholder="twoj@sklep.pl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Preferowany termin
                      </label>
                      <input
                        type="date"
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition-colors hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500"
                  >
                    {t.consultation.btnSubmit}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="report"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.reports.checkSource}
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        checked={sameSource}
                        onChange={(e) => setSameSource(e.target.checked)}
                      />
                      {sameSource
                        ? 'Wszystkie dane z jednego źródła (np. tylko GA4).'
                        : 'Chcę połączyć sprzedaż, kampanie i inne źródła.'}
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Źródła danych
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        placeholder="np. sklep, GA4, Google Ads, Meta Ads"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Zakres raportu
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        placeholder="np. Q4 2024, raport zarządczy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.reports.costLabel}
                    </label>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {t.reports.basePrice}{' '}
                      <span className="text-slate-400">({t.reports.extraPrice})</span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition-colors hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500"
                  >
                    {t.reports.btnSubmit}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side - info widget */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
              {t.widget.title}
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{t.widget.desc}</p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition-colors hover:bg-indigo-500"
            >
              {t.widget.btn}
            </button>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            W wersji produkcyjnej ten formularz łączy się z BFF i systemem ticketowym / CRM. Na
            razie to w pełni bezpieczny mock do testów UX.
          </div>
        </div>
      </div>
    </section>
  );
}

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Translation['integrationsModal'];
  initialFilter: IntegrationFilter;
}

function IntegrationsModal({
  isOpen,
  onClose,
  lang,
  t,
  initialFilter,
}: IntegrationsModalProps) {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<IntegrationFilter>('All');

  useEffect(() => {
    if (isOpen) {
      setActiveCategory(initialFilter);
      setSearchQuery('');
    }
  }, [isOpen, initialFilter]);

  if (!isOpen) return null;

  const handleVote = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item,
      ),
    );
    trackEvent('integration_vote', { id });
  };

  const filtered = integrations.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' ? true : item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: IntegrationFilter[] = [
    'All',
    'Marketing',
    'Store',
    'Marketplace',
    'Analytics',
    'CRM',
    'Tool',
    'Payment',
    'Logistics',
    'Accounting',
  ];

  const getCategoryName = (cat: IntegrationFilter) => {
    if (cat === 'All') return t.filters.all;
    if (cat === 'Tool') return t.filters.tools;
    const key = cat.toLowerCase() as keyof Translation['integrationsModal']['filters'];
    return t.filters[key] ?? cat;
  };

  const labelConnected =
    lang === 'PL' ? 'Dostępna' : 'Available';
  const labelComingSoon =
    lang === 'PL' ? 'Wkrótce' : 'Coming soon';
  const labelVoting =
    lang === 'PL' ? 'Głosowanie' : 'Voting';

  const getStatusLabel = (status: IntegrationStatus) => {
    if (status === 'Available') return labelConnected;
    if (status === 'ComingSoon') return labelComingSoon;
    return labelVoting;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          <div className="border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {t.title}
                </h2>
                <p className="mt-2 max-w-2xl text-xs text-slate-600 dark:text-slate-300">
                  {t.description}
                </p>
                <p className="mt-2 text-[11px] font-medium text-slate-500">
                  {t.statuses}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-9 py-2 text-sm text-slate-900 outline-none ring-primary-500/30 focus:border-primary-500 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border px-3 py-1 font-medium transition-colors ${
                      activeCategory === cat
                        ? 'border-primary-500 bg-primary-500/10 text-primary-700 dark:border-primary-400 dark:bg-primary-400/10 dark:text-primary-200'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300'
                    }`}
                  >
                    {getCategoryName(cat)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-950">
            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-3 md:grid-cols-2">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <IntegrationLogo code={item.code} />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-50">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                          {getCategoryName(item.category)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                          item.status === 'Available'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : item.status === 'ComingSoon'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {getStatusLabel(item.status)}
                      </span>
                      {item.status === 'Voting' && (
                        <button
                          type="button"
                          onClick={() => handleVote(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 px-2 py-1 text-[11px] font-semibold text-primary-600 transition-colors hover:bg-primary-50 dark:border-primary-900 dark:text-primary-300 dark:hover:bg-primary-900/30"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {t.buttons.vote}
                          <span className="rounded bg-primary-100 px-1 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                            {item.votes}
                          </span>
                        </button>
                      )}
                      {item.status === 'Available' && (
                        <button
                          type="button"
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500"
                        >
                          {t.buttons.connect}
                        </button>
                      )}
                      {item.status === 'ComingSoon' && (
                        <button
                          type="button"
                          disabled
                          className="cursor-not-allowed rounded-lg bg-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        >
                          {t.buttons.comingSoon}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="mt-8 text-center text-sm text-slate-500">
                  {lang === 'PL'
                    ? 'Nie znaleziono integracji dla podanych filtrów.'
                    : 'No integrations match your filters.'}
                </p>
              )}
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>{t.cta.text}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500"
                >
                  {t.cta.button}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface ScrollToTopProps {
  tooltip: string;
}

function ScrollToTopButton({ tooltip }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollTop}
      title={tooltip}
      className="group fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/40 transition-all hover:scale-110 hover:bg-primary-600 dark:bg-slate-800 dark:hover:bg-primary-600"
    >
      <ArrowUp className="h-5 w-5" />
      <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        {tooltip}
      </span>
    </button>
  );
}

interface NaggingModalProps {
  t: Translation['nagging'];
}

function NaggingModal({ t }: NaggingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
      trackEvent('nagging_open', {});
    }, 30000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
    trackEvent('nagging_close', {});
  };

  const handleReopen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    trackEvent('nagging_reopen', {});
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-40 w-full max-w-sm"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-primary-200 bg-white p-6 shadow-2xl dark:border-primary-900 dark:bg-slate-900">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-500/20 blur-2xl" />
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-50">
                    {t.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                    {t.subtitle}
                  </p>
                  <Link
                    href="/wizard"
                    className="flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-colors hover:bg-primary-500"
                    onClick={() => trackEvent('nagging_cta_click', {})}
                  >
                    {t.button}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMinimized && !isOpen && (
          <motion.button
            type="button"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            onClick={handleReopen}
            className="fixed top-1/2 left-0 z-40 -translate-y-1/2 rounded-r-lg bg-primary-600 py-6 px-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-transform hover:pl-2"
            style={{ writingMode: 'vertical-rl' }}
          >
            {t.sideLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('PL');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [modalCategoryFilter, setModalCategoryFilter] =
    useState<IntegrationFilter>('All');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleOpenIntegrations = (category: IntegrationFilter = 'All') => {
    setModalCategoryFilter(category);
    setIsIntegrationsModalOpen(true);
    trackEvent('integrations_modal_open', { category });
  };

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {gtmId && (
        <Script id="gtm-base" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
        </Script>
      )}

      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 selection:bg-primary-500/30 selection:text-primary-100">
        <Header
          lang={lang}
          theme={theme}
          t={t.header}
          setLang={setLang}
          setTheme={setTheme}
          onOpenIntegrations={handleOpenIntegrations}
          scrollToId={scrollToId}
        />

        <main>
          <Hero t={t.hero} lang={lang} />
          <FeaturesSection t={t.featuresSection} />
          <IntegrationsPreview
            t={t.integrationsSection}
            onOpenModal={() => handleOpenIntegrations('All')}
          />
          <AISection t={t.aiSection} />
          <FormsSection t={t.formsSection} />
          {/* Placeholder cennika – na później */}
          <section
            id="pricing"
            className="border-t border-slate-100 bg-slate-50 py-16 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900"
          >
            Cennik i paywall wdrożymy w kolejnej iteracji (obecnie placeholder).
          </section>
        </main>

        <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-500 dark:border-slate-800">
          &copy; {new Date().getFullYear()} PapaData. All rights reserved.
        </footer>

        <IntegrationsModal
          isOpen={isIntegrationsModalOpen}
          onClose={() => setIsIntegrationsModalOpen(false)}
          lang={lang}
          t={t.integrationsModal}
          initialFilter={modalCategoryFilter}
        />

        <NaggingModal t={t.nagging} />
        <ScrollToTopButton tooltip={t.scrollToTop} />
      </div>
    </>
  );
}
