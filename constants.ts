import { IntegrationItem, Translation, Language, DemoTranslation } from './types';

export const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * Initial list of integrations available in the platform.
 * Contains both available and coming-soon integrations, with vote counts.
 */
export const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  { id: 'google_ads', code: 'GAds', name: 'Google Ads', category: 'Marketing', status: 'Available', votes: 120 },
  { id: 'meta_ads', code: 'Meta', name: 'Meta Ads (Facebook)', category: 'Marketing', status: 'Available', votes: 150 },
  { id: 'tiktok_ads', code: 'TT', name: 'TikTok Ads', category: 'Marketing', status: 'Available', votes: 80 },
  { id: 'ga4', code: 'GA4', name: 'Google Analytics 4', category: 'Analytics', status: 'Available', votes: 200 },
  { id: 'shopify', code: 'Sh', name: 'Shopify', category: 'Store', status: 'Available', votes: 180 },
  { id: 'woocommerce', code: 'Woo', name: 'WooCommerce', category: 'Store', status: 'Available', votes: 160 },
  { id: 'magento', code: 'Mg', name: 'Magento 2', category: 'Store', status: 'ComingSoon', votes: 45 },
  { id: 'shoper', code: 'S', name: 'Shoper', category: 'Store', status: 'Available', votes: 90 },
  { id: 'idosell', code: 'Ido', name: 'IdoSell', category: 'Store', status: 'Available', votes: 70 },
  { id: 'skyshop', code: 'Sky', name: 'SkyShop', category: 'Store', status: 'Available', votes: 30 },
  { id: 'baselinker', code: 'BL', name: 'BaseLinker', category: 'Tool', status: 'Available', votes: 210 },
  { id: 'allegro', code: 'All', name: 'Allegro', category: 'Marketplace', status: 'Available', votes: 190 },
  { id: 'amazon', code: 'Amz', name: 'Amazon', category: 'Marketplace', status: 'ComingSoon', votes: 110 },
  { id: 'salesforce', code: 'SF', name: 'Salesforce', category: 'CRM', status: 'Voting', votes: 25 },
  { id: 'hubspot', code: 'HS', name: 'HubSpot', category: 'CRM', status: 'Voting', votes: 40 },
  { id: 'klaviyo', code: 'Kla', name: 'Klaviyo', category: 'Marketing', status: 'ComingSoon', votes: 60 },
  { id: 'stripe', code: 'Str', name: 'Stripe', category: 'Payment', status: 'Voting', votes: 15 },
  { id: 'wfirma', code: 'WF', name: 'wFirma', category: 'Accounting', status: 'Voting', votes: 20 },
  { id: 'inpost', code: 'InP', name: 'InPost', category: 'Logistics', status: 'Voting', votes: 55 },
];

const DEMO_TRANSLATION_PL: DemoTranslation = {
  sidebar: {
    dashboard: 'Pulpit',
    reports: 'Raporty Live',
    academy: 'Akademia',
    support: 'Wsparcie',
    integrations: 'Integracje',
    settings: 'Ustawienia',
    logout: 'Wyloguj z demo',
    supportTooltip: 'Konsultacje i kontakt',
  },
  topbar: {
    titles: {
      dashboard: 'Pulpit – demo danych e-commerce',
      reports: 'Raporty Live – tryb demonstracyjny',
      academy: 'Akademia – wiedza i materiały',
      support: 'Wsparcie i konsultacje',
      integrations: 'Integracje – wersja demo',
      settings: 'Ustawienia konta demo',
    },
    ranges: {
      today: 'Dziś',
      last7: 'Ostatnie 7 dni',
      last30: 'Ostatnie 30 dni',
    },
    refreshLabel: 'Ostatnia synchronizacja:',
    refreshTooltip: 'Dane demo są odświeżane automatycznie, aby pokazać typowe wahania.',
    accountTooltip: 'Konto demo: JD Store',
  },
  dashboard: {
    ai: {
      title: 'Asystent AI – podsumowanie Twoich danych',
      subtitle:
        'Na tej wersji demonstracyjnej widzisz przykładowe wnioski wygenerowane na podstawie danych e-commerce. W prawdziwym koncie AI analizuje Twoje kampanie i sprzedaż w czasie rzeczywistym.',
      status: 'Analizuję dane z ostatnich 30 dni...',
      insight1:
        'Przychód z kampanii „Brand Search – Google Ads" wzrósł o 28% vs poprzedni okres, ale koszt pozyskania nowych klientów w Meta Ads spadł o 18%. Sugeruję: zwiększyć budżet kampanii brandowej o 20% i przetestować nowy zestaw kreacji w Meta.',
      insight2:
        'Produkty z kategorii „Akcesoria zimowe" odpowiadają za 35% przychodu, ale nie mają osobnej kampanii remarketingowej. Sugeruję stworzyć kampanię dynamiczną skierowaną do osób, które dodały te produkty do koszyka.',
      btnDetails: 'Pokaż szczegóły',
      btnAsk: 'Zadaj własne pytanie',
      promptPlaceholder: 'Zadaj pytanie, np. „Które kampanie mają najwyższy ROAS?"',
      answerHint: 'W demie odpowiedzi są przygotowane, ale UI działa jak żywy czat.',
    },
    kpi: {
      revenue: 'Przychód (okres wybrany)',
      spend: 'Wydatki marketingowe',
      roas: 'ROAS (łączny)',
      aov: 'Średnia wartość koszyka (AOV)',
      margin: 'Marża szacunkowa',
      trend: 'vs poprzedni okres',
    },
    chart: {
      title: 'Sprzedaż i wydatki w czasie',
      subtitle: 'Porównaj przychód ze wszystkich kanałów z wydatkami marketingowymi.',
      metrics: {
        revenue: 'Przychód',
        orders: 'Zamówienia',
        spend: 'Wydatki marketingowe',
        sessions: 'Sesje (GA4)',
      },
    },
    alerts: {
      connectionLost:
        'Brak aktualnych danych z {name} – odśwież połączenie w sekcji Integracje.',
      reauthBanner:
        'Niektóre integracje wymagają ponownego połączenia. Kliknij tutaj, aby przejść do ustawień.',
      toastError: 'Połączenie z {name} zostało przerwane. Sprawdź Integracje.',
      toastReauth: 'Tokeny wygasły? Odśwież połączenia w ustawieniach.',
    },
  },
  reports: {
    gated: {
      title: 'To serce systemu PapaData, które może być Twoje',
      text: 'W pełnym koncie zobaczysz tutaj wszystkie raporty Live – sprzedaż, kampanie, techniczne, customer journey i wiele więcej. Wersja demo pokazuje tylko przykładowe dane. Pełny dostęp odblokujesz po upływie 14 dni.',
      btnUnlock: 'Rozpocznij 14-dniowy Trial',
      btnDemo: 'Zobacz, jak wygląda raport demo',
    },
    sandbox: {
      info: 'Tryb demonstracyjny. Dane są przykładowe – aby zobaczyć własne raporty Live, załóż konto.',
      highlight: 'Demo mode – prawdziwe raporty pojawią się po założeniu konta.',
      tabs: {
        sales: 'Sprzedaż',
        campaigns: 'Kampanie',
        customers: 'Klienci',
        technical: 'Techniczne',
      },
      btnCreate: 'Załóż konto',
    },
  },
  integrations: {
    title: 'Integracje PapaData – wersja demo',
    text: 'Tutaj zobaczysz wszystkie platformy, które możesz podłączyć do PapaData. Kliknięcie „Połącz" w wersji demo tylko symuluje działanie – prawdziwe klucze API dodasz po założeniu konta.',
    searchPlaceholder: 'Szukaj integracji...',
    buttons: {
      connect: 'Połącz (demo)',
      connected: 'Połączono',
      comingSoon: 'Wkrótce',
      vote: 'Zagłosuj',
    },
    categories: {
      All: 'Wszystkie',
      Marketing: 'Marketing',
      Store: 'Sklep',
      Marketplace: 'Marketplace',
      Analytics: 'Analityka',
      Tool: 'Narzędzia',
      CRM: 'CRM',
      Payment: 'Płatności',
      Logistics: 'Logistyka',
      Accounting: 'Księgowość',
    },
    votesLabel: 'Głosy',
    toasts: {
      connected:
        'Symulacja: integracja połączona. W prawdziwym koncie dodasz klucze API w kilka kliknięć.',
      vote:
        'Dziękujemy za głos! Użyj tego przycisku, aby podpowiedzieć nam, które integracje wdrożyć jako pierwsze.',
    },
    tooltips: {
      comingSoon: 'Ta integracja jest w trakcie wdrożenia.',
    },
    status: {
      needsReauth: 'Wymagane ponowne logowanie',
      reconnect: 'Połącz ponownie',
      reconnectHint: 'Zaktualizuj dane, aby przywrócić dane.',
      bannerError: 'Niektóre źródła danych zgłosiły błąd. Sprawdź szczegóły i przetestuj jeszcze raz.',
      bannerReauth: 'Tokeny wygasły. Odśwież połączenia, aby AI i raporty odzyskały dane.',
    },
  },
  academy: {
    title: 'PapaData Academy – wiedza o analityce i e-commerce',
    text: 'W pełnej wersji PapaData znajdziesz tu nagrania, artykuły i case studies z prawdziwych wdrożeń. W wersji demo udostępniamy część materiałów, aby pokazać, czego możesz się spodziewać.',
    videos: [
      {
        title: 'Jak w 5 minut przejść przez rejestrację w PapaData',
        subtitle: 'Krok po kroku: od formularza do pierwszych raportów.',
        locked: false,
      },
      {
        title: 'Strategia kampanii e-commerce na Q4',
        subtitle: 'Jak ustawić cele i budżety, żeby nie przepalić.',
        locked: true,
      },
      {
        title: 'Remarketing dynamiczny w praktyce',
        subtitle: 'Segmenty odbiorców i feed produktowy.',
        locked: true,
      },
    ],
    articles: [
      {
        title: '3 najczęstsze błędy w raportowaniu sprzedaży e-commerce',
        subtitle: 'Jak uniknąć pułapki raportów z Excela i różnych źródeł danych.',
        locked: false,
      },
      {
        title: 'Checklisty wdrożenia GA4 dla sklepów',
        subtitle: 'Zamówienia, zdarzenia, niestandardowe parametry.',
        locked: true,
      },
      {
        title: 'Customer journey w omnichannel',
        subtitle: 'Mapa punktów styku i pomiar LTV.',
        locked: true,
      },
      {
        title: 'Jak łączyć dane marketingowe z marżą',
        subtitle: 'Praktyczny przewodnik CFO/CMO.',
        locked: true,
      },
    ],
    badgePremium: 'Materiał premium – dostępny dla klientów PapaData',
    lockedModal: {
      title: 'Odblokuj wszystkie materiały',
      text: 'Pełny dostęp do webinarów, case studies i checklist otrzymasz po założeniu konta.',
      btn: 'Załóż konto (14 dni za darmo)',
    },
    articleBody:
      'Krótka wersja artykułu w demie. Pełne wdrożenie pokazuje, jak łączyć dane sprzedażowe, marketingowe i logistyczne w jeden raport, aby podejmować decyzje szybciej.',
    videoBody:
      'To podgląd playera w wersji demo. W prawdziwym koncie obejrzysz pełne nagrania w jakości HD i z napisami.',
  },
  support: {
    title: 'Wsparcie i konsultacje',
    text: 'Możesz zamówić analizę specjalisty lub zadać pytanie zespołowi PapaData. W wersji demo formularz pokazuje, jakie informacje zbieramy przed konsultacją.',
    form: {
      topic: 'Temat konsultacji',
      topics: {
        campaigns: 'Kampanie marketingowe',
        budget: 'Budżet',
        analytics: 'Analityka',
        implementation: 'Implementacja',
        other: 'Inne',
      },
      budget: 'Zakres budżetu miesięcznego',
      budgetRanges: {
        low: 'do 10 000 PLN',
        mid: '10 000–50 000 PLN',
        high: '50 000–200 000 PLN',
        huge: 'powyżej 200 000 PLN',
      },
      desc: 'Opis sytuacji',
      descPlaceholder:
        'Opisz, co dokładnie chcesz przeanalizować. Podaj dane, okres, kanały i główny cel.',
      date: 'Preferowana data konsultacji',
      email: 'E-mail do kontaktu',
      priceInfo:
        'Czas trwania konsultacji: 60 minut. Usługa jest dodatkowo płatna – wycenę otrzymasz przed potwierdzeniem terminu.',
      btn: 'Wyślij prośbę o konsultację',
    },
    dynamicTopics: [
      {
        key: 'campaigns',
        label: 'Kampanie marketingowe',
        extraLabel: 'Kanał / kampania',
        extraOptions: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Microsoft Ads', 'Inne'],
      },
      {
        key: 'budget',
        label: 'Budżet',
        extraLabel: 'Zakres budżetu miesięcznego',
        extraOptions: ['do 10 000 PLN', '10 000–50 000 PLN', '50 000–200 000 PLN', 'powyżej 200 000 PLN'],
      },
      {
        key: 'analytics',
        label: 'Analityka',
        extraLabel: 'Narzędzie',
        extraOptions: ['GA4', 'Looker Studio', 'BigQuery', 'Inne'],
      },
      {
        key: 'implementation',
        label: 'Implementacja',
        extraLabel: 'Zakres prac',
        extraOptions: ['Tagowanie', 'Konwersje', 'Feed produktowy', 'Inne'],
      },
      {
        key: 'attribution',
        label: 'Atrybucja i ROAS',
        extraLabel: 'Model',
        extraOptions: ['Data-driven', 'Last click', 'Position-based'],
      },
      {
        key: 'retention',
        label: 'Retencja / CRM',
        extraLabel: 'Narzędzie CRM',
        extraOptions: ['HubSpot', 'Salesforce', 'Klaviyo', 'Inne'],
      },
      {
        key: 'marketplaces',
        label: 'Marketplace',
        extraLabel: 'Platforma',
        extraOptions: ['Allegro', 'Amazon', 'Kaufland', 'Empik'],
      },
      {
        key: 'logistics',
        label: 'Logistyka',
        extraLabel: 'Przewoźnik',
        extraOptions: ['InPost', 'DHL', 'DPD', 'FedEx'],
      },
      {
        key: 'integrations',
        label: 'Integracje',
        extraLabel: 'System do połączenia',
        extraOptions: ['Shopify', 'WooCommerce', 'BaseLinker', 'IdoSell'],
      },
      {
        key: 'other',
        label: 'Inne',
      },
    ],
    successToast:
      'To tylko wersja demo. W prawdziwym koncie Twoje zgłoszenie trafi bezpośrednio do zespołu PapaData.',
  },
  settings: {
    title: 'Ustawienia konta demo',
    labels: {
      lang: 'Język interfejsu',
      theme: 'Motyw',
      themeOptions: {
        dark: 'Ciemny (zalecany)',
        light: 'Jasny',
      },
      sidebar: 'Panel boczny',
      sidebarOption: 'Zawsze pokazuj rozwinięty panel boczny',
    },
    deleteBtn: 'Usuń konto',
    deleteModal: {
      title: 'To konto demonstracyjne',
      text: 'W wersji demo nie możesz usunąć konta. W pełnej wersji PapaData masz pełną kontrolę nad swoimi danymi.',
      btn: 'Rozumiem',
    },
  },
  logoutModal: {
    title: 'Właśnie zakończyłeś demo.',
    text: 'Zrób kolejny krok i załóż konto – dane będą wtedy Twoje.',
    signup: 'Załóż konto',
    back: 'Wyloguj demo',
  },
};

const DEMO_TRANSLATION_EN: DemoTranslation = {
  sidebar: {
    dashboard: 'Dashboard',
    reports: 'Live Reports',
    academy: 'Academy',
    support: 'Support',
    integrations: 'Integrations',
    settings: 'Settings',
    logout: 'Log out of demo',
    supportTooltip: 'Consultations and contact',
  },
  topbar: {
    titles: {
      dashboard: 'Dashboard – e-commerce demo data',
      reports: 'Live Reports – demo mode',
      academy: 'Academy – knowledge and resources',
      support: 'Support and consultations',
      integrations: 'Integrations – demo mode',
      settings: 'Demo account settings',
    },
    ranges: {
      today: 'Today',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
    },
    refreshLabel: 'Last sync:',
    refreshTooltip: 'Demo data is refreshed automatically to show typical fluctuations.',
    accountTooltip: 'Demo account: JD Store',
  },
  dashboard: {
    ai: {
      title: 'AI Assistant – summary of your data',
      subtitle:
        'In this demo you see sample insights generated from e-commerce data. In your real account, the AI analyzes your campaigns and sales in real time.',
      status: 'Analyzing data from the last 30 days...',
      insight1:
        'Revenue from your "Brand Search – Google Ads" campaign increased by 28% vs the previous period, while the cost of acquiring new customers via Meta Ads dropped by 18%. I suggest increasing your brand campaign budget by 20% and testing a new creative set on Meta.',
      insight2:
        'Products in the "Winter Accessories" category account for 35% of revenue but have no separate remarketing campaign. I suggest creating a dynamic campaign targeting users who added these products to their cart.',
      btnDetails: 'Show details',
      btnAsk: 'Ask your own question',
      promptPlaceholder: 'Ask anything, e.g. "Which campaigns deliver the best ROAS?"',
      answerHint: 'In the demo, answers are mocked but the UX feels like a live chat.',
    },
    kpi: {
      revenue: 'Revenue (selected period)',
      spend: 'Marketing spend',
      roas: 'ROAS (blended)',
      aov: 'Average order value (AOV)',
      margin: 'Estimated margin',
      trend: 'vs previous period',
    },
    chart: {
      title: 'Sales and spend over time',
      subtitle: 'Compare total revenue from all channels with your marketing spend.',
      metrics: {
        revenue: 'Revenue',
        orders: 'Orders',
        spend: 'Marketing spend',
        sessions: 'Sessions (GA4)',
      },
    },
    alerts: {
      connectionLost: 'No fresh data from {name} – refresh the connection in Integrations.',
      reauthBanner: 'Some integrations require re-connecting. Click here to open settings.',
      toastError: 'Connection with {name} dropped. Check Integrations.',
      toastReauth: 'Tokens expired? Refresh connections in settings.',
    },
  },
  reports: {
    gated: {
      title: 'This is the heart of PapaData, ready for you',
      text: 'In the full account you will see all Live Reports here – sales, campaigns, technical, customer journey and more. The demo shows sample data only. Full access unlocks after 14 days.',
      btnUnlock: 'Start 14-day trial',
      btnDemo: 'See how the demo report looks',
    },
    sandbox: {
      info: 'Demo mode. Data is sample only – to see your own Live Reports, create an account.',
      highlight: 'Demo mode – real reports appear right after signup.',
      tabs: {
        sales: 'Sales',
        campaigns: 'Campaigns',
        customers: 'Customers',
        technical: 'Technical',
      },
      btnCreate: 'Create account',
    },
  },
  integrations: {
    title: 'PapaData integrations – demo mode',
    text: 'Here you can see all platforms you can connect to PapaData. Clicking "Connect" in demo mode only simulates the action – you will add real API keys after creating an account.',
    searchPlaceholder: 'Search integrations...',
    buttons: {
      connect: 'Connect (demo)',
      connected: 'Connected',
      comingSoon: 'Coming soon',
      vote: 'Vote',
    },
    categories: {
      All: 'All',
      Marketing: 'Marketing',
      Store: 'Store',
      Marketplace: 'Marketplace',
      Analytics: 'Analytics',
      Tool: 'Tools',
      CRM: 'CRM',
      Payment: 'Payment',
      Logistics: 'Logistics',
      Accounting: 'Accounting',
    },
    votesLabel: 'Votes',
    toasts: {
      connected:
        'Simulation: integration connected. In a real account, you will add API keys in a few clicks.',
      vote: 'Thanks for voting! Use this button to tell us which integrations to prioritize.',
    },
    tooltips: {
      comingSoon: 'This integration is currently being developed.',
    },
    status: {
      needsReauth: 'Re-authentication required',
      reconnect: 'Reconnect',
      reconnectHint: 'Update credentials to resume data flow.',
      bannerError: 'Some data sources reported an error. Check the details and retest.',
      bannerReauth: 'Tokens expired. Refresh connections so AI and reports get fresh data.',
    },
  },
  academy: {
    title: 'PapaData Academy – analytics and e-commerce knowledge',
    text: 'In the full version of PapaData, you will find recordings, articles, and case studies from real implementations here. In the demo version, we share some materials to show you what to expect.',
    videos: [
      {
        title: 'How to complete PapaData signup in 5 minutes',
        subtitle: 'Step by step: from form to first reports.',
        locked: false,
      },
      {
        title: 'E-commerce campaign strategy for Q4',
        subtitle: 'Set goals and budgets without wasting spend.',
        locked: true,
      },
      {
        title: 'Dynamic remarketing in practice',
        subtitle: 'Audience segments and product feeds.',
        locked: true,
      },
    ],
    articles: [
      {
        title: '3 most common mistakes in e-commerce sales reporting',
        subtitle: 'How to avoid the trap of Excel reports and disjointed data sources.',
        locked: false,
      },
      {
        title: 'GA4 implementation checklist for stores',
        subtitle: 'Purchases, events, and custom parameters.',
        locked: true,
      },
      {
        title: 'Customer journey in omnichannel',
        subtitle: 'Mapping touchpoints and measuring LTV.',
        locked: true,
      },
      {
        title: 'How to combine marketing data with margin',
        subtitle: 'A practical guide for CFOs and CMOs.',
        locked: true,
      },
    ],
    badgePremium: 'Premium content – available for PapaData customers',
    lockedModal: {
      title: 'Unlock all materials',
      text: 'Get full access to webinars, case studies, and checklists after creating an account.',
      btn: 'Create account (14 days free)',
    },
    articleBody:
      'A short article preview for the demo. The full version shows how to blend sales, marketing, and logistics data into one report to make faster decisions.',
    videoBody:
      'This is a demo video preview. In your account you will watch the full recording in HD with captions.',
  },
  support: {
    title: 'Support and consultations',
    text: 'You can order a specialist analysis or ask the PapaData team a question. In the demo version, the form shows what information we collect before a consultation.',
    form: {
      topic: 'Topic of consultation',
      topics: {
        campaigns: 'Marketing campaigns',
        budget: 'Budget',
        analytics: 'Analytics',
        implementation: 'Implementation',
        other: 'Other',
      },
      budget: 'Monthly budget range',
      budgetRanges: {
        low: 'up to 10 000 PLN',
        mid: '10 000–50 000 PLN',
        high: '50 000–200 000 PLN',
        huge: 'over 200 000 PLN',
      },
      desc: 'Describe your situation',
      descPlaceholder:
        'Describe exactly what you want to analyze. Provide data, period, channels, and main goal.',
      date: 'Preferred consultation date',
      email: 'Contact email',
      priceInfo:
        'Consultation duration: 60 minutes. The service is paid additionally – you will receive a quote before confirming the date.',
      btn: 'Send consultation request',
    },
    dynamicTopics: [
      {
        key: 'campaigns',
        label: 'Marketing campaigns',
        extraLabel: 'Channel / campaign',
        extraOptions: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Microsoft Ads', 'Other'],
      },
      {
        key: 'budget',
        label: 'Budget',
        extraLabel: 'Monthly budget range',
        extraOptions: ['up to 10 000 PLN', '10 000–50 000 PLN', '50 000–200 000 PLN', 'over 200 000 PLN'],
      },
      {
        key: 'analytics',
        label: 'Analytics',
        extraLabel: 'Tool',
        extraOptions: ['GA4', 'Looker Studio', 'BigQuery', 'Other'],
      },
      {
        key: 'implementation',
        label: 'Implementation',
        extraLabel: 'Scope',
        extraOptions: ['Tracking plan', 'Conversions', 'Product feed', 'Other'],
      },
      {
        key: 'attribution',
        label: 'Attribution & ROAS',
        extraLabel: 'Model',
        extraOptions: ['Data-driven', 'Last click', 'Position-based'],
      },
      {
        key: 'retention',
        label: 'Retention & CRM',
        extraLabel: 'CRM tool',
        extraOptions: ['HubSpot', 'Salesforce', 'Klaviyo', 'Other'],
      },
      {
        key: 'marketplaces',
        label: 'Marketplaces',
        extraLabel: 'Platform',
        extraOptions: ['Allegro', 'Amazon', 'Kaufland', 'Empik'],
      },
      {
        key: 'logistics',
        label: 'Logistics',
        extraLabel: 'Carrier',
        extraOptions: ['InPost', 'DHL', 'DPD', 'FedEx'],
      },
      {
        key: 'integrations',
        label: 'Integrations',
        extraLabel: 'System to connect',
        extraOptions: ['Shopify', 'WooCommerce', 'BaseLinker', 'IdoSell'],
      },
      {
        key: 'other',
        label: 'Other',
      },
    ],
    successToast:
      'This is just a demo version. In a real account, your request will go directly to the PapaData team.',
  },
  settings: {
    title: 'Demo account settings',
    labels: {
      lang: 'Interface language',
      theme: 'Theme',
      themeOptions: {
        dark: 'Dark (recommended)',
        light: 'Light',
      },
      sidebar: 'Sidebar',
      sidebarOption: 'Always keep the sidebar expanded',
    },
    deleteBtn: 'Delete account',
    deleteModal: {
      title: 'This is a demo account',
      text: 'You cannot delete the account in the demo version. In the full version of PapaData, you have full control over your data.',
      btn: 'I understand',
    },
  },
  logoutModal: {
    title: 'You just finished the demo.',
    text: 'Take the next step and create an account – your data will be yours.',
    signup: 'Create account',
    back: 'Back to landing',
  },
};

/**
 * Global translation dictionary.
 * Contains text resources for all supported languages (PL, EN).
 */
export const TRANSLATIONS: Record<Language, Translation> = {
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
      title:
        'AI, które analizuje Twoje dane e-commerce.\nZobacz, skąd naprawdę bierze się Twój przychód.',
      subtitle:
        'Połącz sklep, kampanie reklamowe i analitykę w jednym miejscu. PapaData codziennie budzi się z gotowymi raportami, żebyś Ty nie musiał ich składać z Excela.',
      ctaPrimary: 'Rozpocznij 14-dniowy Trial',
      ctaSecondary: 'Zobacz Demo',
      trustText:
        'Bez karty, bez zobowiązań. Pierwsze raporty zobaczysz tego samego dnia.',
      mock: {
        header: 'Panel klienta – przykładowe dane',
        carousel: {
          slide1: {
            title: 'Przychód (ostatnie 30 dni)',
            value: '124 592,00 PLN',
            trend: '+12.5% vs poprzednie 30 dni',
            assistant:
              'W tym tygodniu sprzedaż z kampanii „Brand Search" wzrosła o 32%. Meta Ads przynosi 60% nowych klientów.',
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
        sales: { title: 'Wzrosty i spadki sprzedaży', desc: 'Analiza przyczyn zmian w przychodach dzień po dniu.' },
        period: { title: 'Raport Miesięczny / Tygodniowy', desc: 'Automatyczne podsumowania KPI na maila.' },
        products: { title: 'Produkty i Marża', desc: 'Trendy, prognozy, zwroty i koszty wysyłki.' },
        conversion: { title: 'Ścieżka Konwersji', desc: 'Atrybucja, budżet i punkty styku klienta.' },
        marketing: { title: 'Performance Kampanii', desc: 'Efektywność reklam w Google, Meta i TikToku.' },
        customers: { title: 'Klienci i LTV', desc: 'Analiza powracalności i segmentacja bazy.' },
        discounts: { title: 'Rabaty i Promocje', desc: 'Statystyki użycia kodów rabatowych.' },
        funnel: { title: 'Lejek Zakupowy', desc: 'Analiza etapów checkoutu (wymaga GA4).' },
        trends: { title: 'Trendy Sprzedaży', desc: 'Kluczowe wnioski i sezonowość.' },
        export: { title: 'Data Export', desc: 'Eksport danych do CSV lub Arkuszy Google.' },
      },
    },
    aiSection: {
      title: 'Gotowe Raporty. Asystent AI analizuje dane e-commerce',
      subtitle: 'Zadaj pytanie asystentowi a otrzymasz odpowiedź',
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
        'PapaData laczy dane z Twojego sklepu, kampanii reklamowych, marketplaceow i narzedzi analitycznych. Jednym kliknieciem podlaczasz zrodla, a my zajmujemy sie reszta (ETL, hurtownia, raporty).',
      viewAllButton: 'Zobacz wszystkie integracje (30+)',
      searchPlaceholder: 'Szukaj integracji...',
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
        'Polacz PapaData z platformami, ktorych uzywasz na co dzien. Sklepy, kampanie reklamowe, marketplacey, CRM, platnosci, logistyka i ksiegowosc - w jednym, spojnym widoku.',
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
        logistics: 'Logistics',
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
      button: 'Rozpocznij 14-dniowy Trial',
      sideLabel: '14 DNI FREE',
    },
    scrollToTop: 'Wróć na górę',
    security: {
      title: 'Bezpieczeństwo Twoich danych',
      mainCard: {
        title: 'Dane biznesowe w zgodzie z RODO',
        desc: 'Dbamy o prywatność i bezpieczeństwo danych Twoich klientów.',
      },
      cards: {
        infra: { title: 'Infrastruktura Google Cloud', desc: 'ISO 27001' },
        encryption: { title: 'Szyfrowanie bankowe', desc: 'AES-256, TLS 1.3' },
        ai: { title: 'Bezpieczne AI', desc: 'Dane nie trenują modeli publicznych' },
        gdpr: { title: 'Zgodność z RODO', desc: 'Pełna ochrona danych osobowych' },
        isolation: { title: 'Izolacja danych', desc: 'Osobne bazy dla każdego klienta' },
        access: { title: 'Kontrola dostępów', desc: '2FA i logi aktywności' },
      },
    },
    pricing: {
      title: 'Cennik elastyczny',
      calculator: {
        title: 'Kalkulator kosztów',
        sourceLabel: 'Liczba źródeł danych',
        supportLabel: 'Wsparcie Eksperta',
        supportDesc: 'Pomoc w konfiguracji (+500 PLN jednorazowo)',
        priceLabel: 'Twój abonament',
        perMonth: '/ mies',
        cta: 'Rozpocznij Trial',
      },
    },
    faq: {
      title: 'Najczęściej zadawane pytania',
      items: {
        q1: { q: 'Jakie są funkcje?', a: 'Oferujemy 10 głównych dashboardów: Sprzedaż, Marketing, Produkty, Klienci i więcej.' },
        q2: { q: 'Czy narzędzie przechowuje dane osobiste?', a: 'Nie, przechowujemy tylko zanonimizowane metryki biznesowe potrzebne do analizy.' },
        q3: { q: 'Czy jest zgodność z RODO?', a: 'Tak, działamy w pełnej zgodności z RODO i standardami UE.' },
        q4: { q: 'Jak długo przechowuje dane?', a: 'Dane w pamięci podręcznej AI są przechowywane do 30 dni.' },
        q5: { q: 'Czy konkurencja widzi dane?', a: 'Absolutnie nie. Bazy danych są ściśle izolowane.' },
        q6: { q: 'Jakie macie zabezpieczenia?', a: 'Stosujemy szyfrowanie AES-256 i infrastrukturę GCP.' },
        q7: { q: 'Co się stanie z danymi po rezygnacji?', a: 'Są trwale usuwane w ciągu 30 dni od zamknięcia konta.' },
      },
    },
    footer: {
      links: {
        privacy: 'Polityka Prywatności',
        terms: 'Regulamin',
        cookies: 'Polityka Cookies',
        blog: 'Blog',
        contact: 'Formularz kontaktowy',
      },
      socials: 'Social Media',
    },
    demo: DEMO_TRANSLATION_PL,
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
      title:
        'AI that analyzes your e-commerce data.\nSee where your revenue really comes from.',
      subtitle:
        "Connect your store, ad platforms and analytics in one place. PapaData wakes up every morning with ready-to-use reports, so you don't have to build them in spreadsheets.",
      ctaPrimary: 'Start 14-day trial',
      ctaSecondary: 'See Demo',
      trustText:
        'No card required, no commitment. Your first reports are ready the same day.',
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
        sales: { title: 'Sales Growth & Drop', desc: 'Root cause analysis of daily revenue changes.' },
        period: { title: 'Monthly / Weekly Reports', desc: 'Automatic KPI summaries sent to your email.' },
        products: { title: 'Products & Margin', desc: 'Trends, forecasts, returns, and shipping costs.' },
        conversion: { title: 'Conversion Path', desc: 'Attribution, budget, and customer touchpoints.' },
        marketing: { title: 'Campaign Performance', desc: 'Ad efficiency across Google, Meta, and TikTok.' },
        customers: { title: 'Customers & LTV', desc: 'Retention analysis and base segmentation.' },
        discounts: { title: 'Discounts & Promo Codes', desc: 'Usage statistics of discount codes.' },
        funnel: { title: 'Purchase Funnel', desc: 'Checkout stage analysis (GA4 required).' },
        trends: { title: 'Sales Trends', desc: 'Key insights and seasonality.' },
        export: { title: 'Data Export', desc: 'Export data to CSV or Google Sheets.' },
      },
    },
    aiSection: {
      title: 'Ready-to-use Reports. AI Assistant analyzes e-commerce data',
      subtitle: 'Ask the assistant a question and get an answer',
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
      searchPlaceholder: 'Search integrations...',
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
        text: "Don't see your platform?",
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
    security: {
      title: 'Security of your data',
      mainCard: {
        title: 'Business data in compliance with GDPR',
        desc: 'We care about the privacy and security of your customer data.',
      },
      cards: {
        infra: { title: 'Google Cloud Infrastructure', desc: 'ISO 27001' },
        encryption: { title: 'Bank-level encryption', desc: 'AES-256, TLS 1.3' },
        ai: { title: 'Secure AI', desc: 'Data does not train public models' },
        gdpr: { title: 'GDPR Compliance', desc: 'Full personal data protection' },
        isolation: { title: 'Data Isolation', desc: 'Separate databases for each client' },
        access: { title: 'Access Control', desc: '2FA and activity logs' },
      },
    },
    pricing: {
      title: 'Flexible Pricing',
      calculator: {
        title: 'Cost Calculator',
        sourceLabel: 'Number of data sources',
        supportLabel: 'Expert Support',
        supportDesc: 'Configuration assistance (+500 PLN one-time)',
        priceLabel: 'Your subscription',
        perMonth: '/ month',
        cta: 'Start Trial',
      },
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: {
        q1: { q: 'What are the features?', a: 'We offer 10 main dashboards: Sales, Marketing, Products, Customers and more.' },
        q2: { q: 'Does the tool store personal data?', a: 'No, we only store anonymized business metrics needed for analysis.' },
        q3: { q: 'Is it GDPR compliant?', a: 'Yes, we operate in full compliance with GDPR and EU standards.' },
        q4: { q: 'How long is data stored?', a: 'Data in AI cache is stored for up to 30 days.' },
        q5: { q: 'Can competitors see my data?', a: 'Absolutely not. Databases are strictly isolated.' },
        q6: { q: 'What security measures do you have?', a: 'We use AES-256 encryption and GCP infrastructure.' },
        q7: { q: 'What happens to data after cancellation?', a: 'It is permanently deleted within 30 days of account closure.' },
      },
    },
    footer: {
      links: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy',
        blog: 'Blog',
        contact: 'Contact Form',
      },
      socials: 'Social Media',
    },
    demo: DEMO_TRANSLATION_EN,
  },
};
