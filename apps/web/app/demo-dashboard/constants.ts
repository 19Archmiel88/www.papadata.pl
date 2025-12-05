import { Integration, KPI, AcademyItem, Translation } from './types';

export const TEXTS: Translation = {
  navDashboard: { PL: 'Pulpit', EN: 'Dashboard' },
  navReports: { PL: 'Raporty Live', EN: 'Live Reports' },
  navAcademy: { PL: 'Akademia', EN: 'Academy' },
  navSupport: { PL: 'Wsparcie', EN: 'Support' },
  navSupportTooltip: { PL: 'Konsultacje i kontakt', EN: 'Consultations and contact' },
  navIntegrations: { PL: 'Integracje', EN: 'Integrations' },
  navSettings: { PL: 'Ustawienia', EN: 'Settings' },
  navLogout: { PL: 'Wyloguj z demo', EN: 'Log out of demo' },

  titleDashboard: { PL: 'Pulpit – demo danych e-commerce', EN: 'Dashboard – e-commerce demo data' },
  titleReports: { PL: 'Raporty Live – tryb demonstracyjny', EN: 'Live Reports – demo mode' },
  titleAcademy: { PL: 'PapaData Academy – wiedza', EN: 'PapaData Academy – knowledge' },
  titleSupport: { PL: 'Wsparcie i konsultacje', EN: 'Support and consultations' },
  titleIntegrations: { PL: 'Integracje PapaData', EN: 'PapaData Integrations' },
  titleSettings: { PL: 'Ustawienia konta', EN: 'Account Settings' },

  rangeToday: { PL: 'Dziś', EN: 'Today' },
  range24h: { PL: 'Ostatnie 24h', EN: 'Last 24h' },
  range7Days: { PL: 'Ostatnie 7 dni', EN: 'Last 7 days' },
  range30Days: { PL: 'Ostatnie 30 dni', EN: 'Last 30 days' },

  lastSync: { PL: 'Ostatnia synchronizacja', EN: 'Last sync' },
  lastSyncTooltip: {
    PL: 'Dane demo są odświeżane automatycznie, aby pokazać typowe wahania.',
    EN: 'Demo data is refreshed automatically to show typical fluctuations.',
  },
  demoAccount: { PL: 'Konto demo: JD Store', EN: 'Demo account: JD Store' },

  aiTitle: { PL: 'Asystent AI – podsumowanie Twoich danych', EN: 'AI Assistant – summary of your data' },
  aiDesc: {
    PL: 'Na tej wersji demonstracyjnej widzisz przykładowe wnioski wygenerowane na podstawie danych e-commerce. W prawdziwym koncie AI analizuje Twoje kampanie i sprzedaż w czasie rzeczywistym.',
    EN: 'In this demo you see sample insights generated from e-commerce data. In your real account, the AI analyzes your campaigns and sales in real time.',
  },
  aiAnalyzing: { PL: 'Analizuję dane z ostatnich 30 dni...', EN: 'Analyzing data from the last 30 days...' },
  aiShowDetails: { PL: 'Pokaż szczegóły', EN: 'Show details' },
  aiAsk: { PL: 'Zadaj własne pytanie', EN: 'Ask your own question' },

  chartTitle: { PL: 'Sprzedaż i wydatki w czasie', EN: 'Sales and spend over time' },
  chartSubtitle: {
    PL: 'Porównaj przychód ze wszystkich kanałów z wydatkami marketingowymi.',
    EN: 'Compare total revenue from all channels with your marketing spend.',
  },

  reportsGatedTitle: { PL: 'To serce systemu PapaData', EN: 'This is the heart of PapaData' },
  reportsGatedText: {
    PL: 'W pełnym koncie zobaczysz tutaj wszystkie raporty Live – sprzedaż, kampanie, techniczne, customer journey i wiele więcej. Wersja demo pokazuje tylko przykładowe dane. Pełny dostęp odblokujesz po założeniu konta.',
    EN: 'In the full account you will see all Live Reports here – sales, campaigns, technical, customer journey and much more. The demo version shows only sample data. You will unlock full access after creating an account.',
  },
  btnUnlock: { PL: 'Odblokuj w pełnej wersji (14 dni za darmo)', EN: 'Unlock full version (14 days free)' },
  btnShowDemo: { PL: 'Zobacz, jak wygląda raport demo', EN: 'See what the demo report looks like' },
  reportsDemoBanner: {
    PL: 'Tryb demonstracyjny. Dane są przykładowe – aby zobaczyć własne raporty Live, załóż konto.',
    EN: 'Demo mode. Data is sample only – to see your own Live Reports, create an account.',
  },
  btnCreateAccount: { PL: 'Załóż konto', EN: 'Create account' },

  intHeaderTitle: { PL: 'Integracje PapaData – wersja demo', EN: 'PapaData integrations – demo mode' },
  intHeaderDesc: {
    PL: 'Tutaj zobaczysz wszystkie platformy, które możesz podłączyć do PapaData. Kliknięcie „Połącz” w wersji demo tylko symuluje działanie – prawdziwe klucze API dodasz po założeniu konta.',
    EN: 'Here you will see all platforms you can connect to PapaData. Clicking "Connect" in demo mode only simulates the action – you will add real API keys after creating an account.',
  },
  intConnect: { PL: 'Połącz (demo)', EN: 'Connect (demo)' },
  intConnected: { PL: 'Połączono', EN: 'Connected' },
  intComingSoon: { PL: 'Wkrótce', EN: 'Coming soon' },
  intVote: { PL: 'Zagłosuj', EN: 'Vote' },
  intVotes: { PL: 'Głosy', EN: 'Votes' },

  acadHeaderTitle: { PL: 'PapaData Academy – wiedza o analityce i e-commerce', EN: 'PapaData Academy – analytics and e-commerce knowledge' },
  acadHeaderDesc: {
    PL: 'W pełnej wersji PapaData znajdziesz tu nagrania, artykuły i case studies z prawdziwych wdrożeń. W wersji demo udostępniamy część materiałów.',
    EN: 'In the full PapaData version you will find recordings, articles and case studies from real implementations. In the demo version, we share some materials.',
  },
  acadPremium: { PL: 'Materiał premium – dostępny dla klientów PapaData', EN: 'Premium content – available for PapaData customers' },

  suppHeader: { PL: 'Wsparcie i konsultacje', EN: 'Support and consultations' },
  suppDesc: { PL: 'Możesz zamówić analizę specjalisty lub zadać pytanie zespołowi PapaData.', EN: 'You can order a specialist analysis or ask the PapaData team a question.' },
  suppBtn: { PL: 'Wyślij prośbę o konsultację', EN: 'Send consultation request' },
  suppMockAlert: {
    PL: 'To tylko wersja demo. W prawdziwym koncie Twoje zgłoszenie trafi bezpośrednio do zespołu PapaData.',
    EN: 'This is just a demo version. In a real account, your request would go directly to the PapaData team.',
  },

  settHeader: { PL: 'Ustawienia konta demo', EN: 'Demo account settings' },
  settLang: { PL: 'Język interfejsu', EN: 'Interface language' },
  settTheme: { PL: 'Motyw', EN: 'Theme' },
  settThemeDark: { PL: 'Ciemny (zalecany)', EN: 'Dark (recommended)' },
  settThemeLight: { PL: 'Jasny', EN: 'Light' },
  settSidebar: { PL: 'Panel boczny', EN: 'Sidebar' },
  settSidebarFixed: { PL: 'Zawsze pokazuj rozwinięty panel boczny', EN: 'Always keep the sidebar expanded' },
  settDelete: { PL: 'Usuń konto', EN: 'Delete account' },
};

export const MOCK_KPIS: KPI[] = [
  { id: 'revenue', label: { PL: 'Przychód', EN: 'Revenue' }, value: '124,592 PLN', trend: '+12.5%', trendUp: true },
  { id: 'spend', label: { PL: 'Wydatki marketingowe', EN: 'Marketing spend' }, value: '18,240 PLN', trend: '-2.1%', trendUp: false },
  { id: 'roas', label: { PL: 'ROAS', EN: 'ROAS' }, value: '683%', trend: '+5.4%', trendUp: true },
  { id: 'aov', label: { PL: 'Średnia wartość koszyka', EN: 'AOV' }, value: '342 PLN', trend: '+1.2%', trendUp: true },
  { id: 'margin', label: { PL: 'Marża szacunkowa', EN: 'Estimated margin' }, value: '38,200 PLN', trend: '+8.9%', trendUp: true },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'woo', name: 'WooCommerce', category: 'Store', status: 'available' },
  { id: 'ga4', name: 'Google Analytics 4', category: 'Analytics', status: 'available' },
  { id: 'gads', name: 'Google Ads', category: 'Marketing', status: 'available' },
  { id: 'meta', name: 'Meta Ads', category: 'Marketing', status: 'available' },
  { id: 'shopify', name: 'Shopify', category: 'Store', status: 'available' },
  { id: 'base', name: 'BaseLinker', category: 'Tools', status: 'available' },
  { id: 'allegro', name: 'Allegro', category: 'Marketplace', status: 'coming_soon' },
  { id: 'tiktok', name: 'TikTok Ads', category: 'Marketing', status: 'voting', votes: 23 },
  { id: 'pinterest', name: 'Pinterest Ads', category: 'Marketing', status: 'voting', votes: 12 },
  { id: 'klaviyo', name: 'Klaviyo', category: 'Marketing', status: 'available' },
  { id: 'stripe', name: 'Stripe', category: 'Payment', status: 'available' },
];

export const MOCK_ACADEMY: AcademyItem[] = [
  {
    id: '1',
    type: 'video',
    isLocked: false,
    title: { PL: 'Jak w 5 minut przejść przez rejestrację', EN: 'How to complete signup in 5 minutes' },
    subtitle: { PL: 'Krok po kroku: od formularza do pierwszych raportów.', EN: 'Step by step: from form to first reports.' },
  },
  {
    id: '2',
    type: 'article',
    isLocked: false,
    title: { PL: '3 najczęstsze błędy w raportowaniu', EN: '3 common reporting mistakes' },
    subtitle: { PL: 'Jak uniknąć pułapki raportów z Excela.', EN: 'How to avoid Excel reporting traps.' },
  },
  {
    id: '3',
    type: 'video',
    isLocked: true,
    title: { PL: 'Webinar: Skalowanie e-commerce', EN: 'Webinar: Scaling e-commerce' },
    subtitle: { PL: 'Strategie dla sklepów 1M+ GMV.', EN: 'Strategies for 1M+ GMV stores.' },
  },
  {
    id: '4',
    type: 'article',
    isLocked: true,
    title: { PL: 'Analiza kohortowa w praktyce', EN: 'Cohort analysis in practice' },
    subtitle: { PL: 'Zrozum LTV swoich klientów.', EN: 'Understand your customer LTV.' },
  },
  {
    id: '5',
    type: 'video',
    isLocked: true,
    title: { PL: 'Google Ads vs Meta Ads', EN: 'Google Ads vs Meta Ads' },
    subtitle: { PL: 'Gdzie alokować budżet w Q4?', EN: 'Where to allocate budget in Q4?' },
  },
  {
    id: '6',
    type: 'article',
    isLocked: true,
    title: { PL: 'Checklista wdrożeniowa GA4', EN: 'GA4 Implementation Checklist' },
    subtitle: { PL: 'Techniczna konfiguracja zdarzeń.', EN: 'Technical event configuration.' },
  },
];
