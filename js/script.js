/* =========================================================
   PapaData – Frontend Upgrade (i18n, theme, UX, splash, gallery, playground)
   Version: ppd-2025-11-14-upgraded
   ---------------------------------------------------------
   This script extends the original PapaData client-side logic to
   support interactive cards across services, technology and
   integration sections, an interactive data playground, a click‑to‑enter
   splash screen without an auto‑dismiss timer, and a richer
   translation dictionary.  It preserves the existing parallax,
   theme and language toggles, navigation handling and gallery
   detail panel.  The detail panel has been generalised so that
   any `.visual-card` can open it, regardless of which section it
   belongs to.  New translation keys support the added cards
   and labels, including a hint on the splash screen.
   ========================================================= */

/* ---------------------- I18N dictionary ---------------------- */
const translations = {
  pl: {
    // Navigation
    "nav.home": "Strona główna",
    "nav.services": "Usługi",
    "nav.tech": "Technologie",
    "nav.integration": "Integracje",
    "nav.contact": "Kontakt",

    // Home
    "home.subtitle": "Automatyzacja danych w Google Cloud",
    "home.text": "Projektujemy i utrzymujemy platformy danych dla e‑commerce, SaaS i agencji marketingowych. Dostarczamy infrastrukturę, modele KPI oraz automaty, które na bieżąco zasilają raporty i kampanie.",
    "btn.more": "Poznaj ofertę",

    // Gallery
    "gallery.title": "Jak działa PapaData",
    "gallery.lead": "Pięć najczęstszych scenariuszy, które automatyzujemy w Google Cloud.",
    "gallery.cards.analytics": "Analityka chmurowa i dashboard KPI",
    "gallery.cards.ads": "Automatyzacja kampanii Google Ads",
    "gallery.cards.research": "Badania danych i wizualizacje",
    "gallery.cards.migration": "Migracja hurtowni danych do GCP",
    "gallery.cards.logo": "Podpis i identyfikacja wizualna PapaData",
    "gallery.detail.analytics.eyebrow": "Case study · Moda24",
    "gallery.detail.analytics.title": "Dashboard KPI w Looker Studio w 2 tygodnie",
    "gallery.detail.analytics.body": "Zautomatyzowaliśmy raportowanie sprzedaży, marketingu i logistyki, łącząc silosy danych w BigQuery z gotowymi modelami Looker Studio.",
    "gallery.detail.analytics.point1": "12 źródeł danych odświeżanych co 15 minut",
    "gallery.detail.analytics.point2": "Model semantyczny KPI z wersjonowaniem w Git",
    "gallery.detail.analytics.point3": "Alerty SLA na Slacku i w e‑mailu",
    "gallery.detail.ads.eyebrow": "Playbook · Performance",
    "gallery.detail.ads.title": "Feed produktowy w pełni sterowany danymi",
    "gallery.detail.ads.body": "Łączymy katalog, marże i dane o zapasach, by sterować stawkami oraz wykluczeniami w automatycznych kampaniach.",
    "gallery.detail.ads.point1": "Segmentacja kampanii wg marży i rotacji SKU",
    "gallery.detail.ads.point2": "Włączanie / wyłączanie grup reklam z BigQuery",
    "gallery.detail.ads.point3": "Monitoring kosztów dziennych i ROAS",
    "gallery.detail.research.eyebrow": "Warsztat · Data discovery",
    "gallery.detail.research.title": "Od pytania biznesowego do prototypu ML",
    "gallery.detail.research.body": "Budujemy sandboxy w Vertex AI, które pozwalają testować hipotezy i dzielić się wynikami z zespołem marketingu.",
    "gallery.detail.research.point1": "Notebooki współdzielone w BigQuery Studio",
    "gallery.detail.research.point2": "Śledzenie eksperymentów i wersji modeli",
    "gallery.detail.research.point3": "Eksport rekomendacji do aplikacji wewnętrznych",
    "gallery.detail.migration.eyebrow": "Program · Lift & Shift",
    "gallery.detail.migration.title": "Przeniesienie 5 TB danych bez przestoju",
    "gallery.detail.migration.body": "Automatycznie przepinamy procesy ETL oraz raporty BI do BigQuery, zachowując zgodność z RODO i SOC2.",
    "gallery.detail.migration.point1": "Dwutorowa synchronizacja przez 4 tygodnie",
    "gallery.detail.migration.point2": "IaC w Terraform + Cloud Build",
    "gallery.detail.migration.point3": "Pełny audyt dostępu i alerty kosztowe",
    "gallery.detail.identity.eyebrow": "Oferta · Retainer",
    "gallery.detail.identity.title": "Zespół data cloud na żądanie",
    "gallery.detail.identity.body": "Łączymy architektów GCP, inżynierów danych i analityków, aby dowozić roadmapy automatyzacji bez rozdmuchanej rekrutacji.",
    "gallery.detail.identity.point1": "SLA 24h na zgłoszenie i backlog w Jira",
    "gallery.detail.identity.point2": "Pakiety godzin + rozliczenie outcome based",
    "gallery.detail.identity.point3": "Transfer wiedzy i dokumentacja Confluence",
    "gallery.detail.close": "Zamknij panel",
    "gallery.detail.listLabel": "Najważniejsze korzyści",

    // Services (interactive cards)
    "services.title": "Nasze usługi",
    "services.cards.etl": "Automatyzacja ETL bez kodu",
    "services.detail.etl.eyebrow": "Oferta · ETL",
    "services.detail.etl.title": "Bez kodu do BigQuery",
    "services.detail.etl.body": "Łączymy źródła danych i przetwarzamy je do BigQuery w trybie bezkodowym.",
    "services.detail.etl.point1": "Integracja CRM i e‑commerce",
    "services.detail.etl.point2": "Przetwarzanie i normalizacja danych",
    "services.detail.etl.point3": "Synchronizacja w czasie rzeczywistym",
    "services.cards.analytics": "Analityka Looker Studio",
    "services.detail.analytics.eyebrow": "Oferta · Analiza",
    "services.detail.analytics.title": "Analityka KPI w Looker Studio",
    "services.detail.analytics.body": "Budujemy modele danych i KPI, aby dostarczać interaktywne dashboardy w Looker Studio.",
    "services.detail.analytics.point1": "KPI i modele semantyczne BigQuery",
    "services.detail.analytics.point2": "Automatyczne odświeżanie i alerty",
    "services.detail.analytics.point3": "Wizualizacje spersonalizowane",
    "services.cards.integration": "Integracja z GCP",
    "services.detail.integration.eyebrow": "Oferta · Integracja",
    "services.detail.integration.title": "Bezpieczeństwo i integracja z GCP",
    "services.detail.integration.body": "Tworzymy infrastrukturę jako kod i integrujemy usługi GCP z Twoimi systemami.",
    "services.detail.integration.point1": "Terraform i Cloud Functions",
    "services.detail.integration.point2": "Skalowanie i orkiestracja",
    "services.detail.integration.point3": "Zarządzanie uprawnieniami i audyt",

    // Technology (interactive cards)
    "tech.title": "Technologia",
    "tech.cards.etl": "Infrastruktura jako kod",
    "tech.detail.etl.eyebrow": "Technologia · IaC",
    "tech.detail.etl.title": "Terraform & Cloud Build",
    "tech.detail.etl.body": "Automatyzujemy wdrożenia dzięki Terraform i Cloud Build, zapewniając spójne środowiska.",
    "tech.detail.etl.point1": "Moduły i szablony GCP",
    "tech.detail.etl.point2": "Pipeline CI/CD",
    "tech.detail.etl.point3": "Śledzenie wersji i rollback",
    "tech.cards.analytics": "Modele danych i Looker",
    "tech.detail.analytics.eyebrow": "Technologia · Analiza",
    "tech.detail.analytics.title": "Modele danych i LookML",
    "tech.detail.analytics.body": "Projektujemy schematy BigQuery i semantyczną warstwę LookML dla precyzyjnych raportów.",
    "tech.detail.analytics.point1": "Modelowanie miar i wymiarów",
    "tech.detail.analytics.point2": "Repozytorium Git i testy",
    "tech.detail.analytics.point3": "Personalizacja dashboardów",
    "tech.cards.integration": "Automatyzacja i orkiestracja",
    "tech.detail.integration.eyebrow": "Technologia · Orkiestracja",
    "tech.detail.integration.title": "Functions, Workflows & Scheduler",
    "tech.detail.integration.body": "Cloud Functions i Workflows sterują pipelines ETL, synchronizacją i alertami.",
    "tech.detail.integration.point1": "Zarządzanie zależnościami",
    "tech.detail.integration.point2": "Automatyczne skalowanie",
    "tech.detail.integration.point3": "Raportowanie błędów i logowanie",

    // Integrations (interactive cards)
    "integration.title": "Integracje",
    "integration.cards.etl": "ETL do BigQuery",
    "integration.detail.etl.eyebrow": "Integracje · ETL",
    "integration.detail.etl.title": "Automatyzacja ETL do BigQuery",
    "integration.detail.etl.body": "Łączymy e‑commerce, CRM i marketing z BigQuery dzięki zarządzanym konektorom i własnym integracjom.",
    "integration.detail.etl.point1": "Łatwe włączenie źródeł",
    "integration.detail.etl.point2": "Mapowanie i harmonizacja danych",
    "integration.detail.etl.point3": "Ustawienie harmonogramu i SLA",
    "integration.cards.analytics": "Integracje BI",
    "integration.detail.analytics.eyebrow": "Integracje · BI",
    "integration.detail.analytics.title": "Raportowanie i BI",
    "integration.detail.analytics.body": "Integrujemy Looker Studio, Power BI i inne narzędzia na jednej platformie danych.",
    "integration.detail.analytics.point1": "Wspólne modele danych",
    "integration.detail.analytics.point2": "Połączenia w czasie rzeczywistym",
    "integration.detail.analytics.point3": "Zarządzanie dostępem i autoryzacja",
    "integration.cards.integration": "Bezpieczne przepływy",
    "integration.detail.integration.eyebrow": "Integracje · Operacyjne",
    "integration.detail.integration.title": "Bezpieczne przepływy operacyjne",
    "integration.detail.integration.body": "Automatyzujemy ERP, WMS i aplikacje SaaS z kontrolą dostępu i audytem.",
    "integration.detail.integration.point1": "Integracja API i webhooków",
    "integration.detail.integration.point2": "Monitorowanie i audyt zgodności",
    "integration.detail.integration.point3": "Elastyczne reguły i workflow",

    // Contact
    "contact.title": "Skontaktuj się z nami",
    "contact.name": "Imię i nazwisko",
    "contact.email": "Adres e‑mail",
    "contact.message": "Twoja wiadomość",
    "contact.send": "Wyślij",
    "contact.name.label": "Imię i nazwisko",
    "contact.email.label": "Adres e‑mail",
    "contact.message.label": "Twoja wiadomość",

    // Playground
    "playground.description": "Symulacja przepływu danych: CRM → BigQuery → Looker Studio → Kampanie Google Ads",

    // Footer
    "footer.text": "© 2025 PapaData | Wszystkie prawa zastrzeżone.",

    // Aria labels
    "aria.menu": "Otwórz menu",
    "aria.menuClose": "Zamknij menu",
    "aria.top": "Wróć na górę",
    "aria.themeLight": "Włącz jasny motyw",
    "aria.themeDark": "Włącz ciemny motyw",
    "splash.close": "Zamknij ekran powitalny",

    // Splash hint
    "splash.hint": "Kliknij, aby wejść"
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.tech": "Technology",
    "nav.integration": "Integrations",
    "nav.contact": "Contact",

    // Home
    "home.subtitle": "Data automation on Google Cloud",
    "home.text": "We design and run data platforms for e‑commerce, SaaS companies and marketing agencies. Infrastructure, KPI models and automation that keeps reports and campaigns current.",
    "btn.more": "Explore our services",

    // Gallery
    "gallery.title": "How PapaData works",
    "gallery.lead": "Five typical automation scenarios we deliver on Google Cloud.",
    "gallery.cards.analytics": "Cloud analytics & KPI dashboards",
    "gallery.cards.ads": "Google Ads automation",
    "gallery.cards.research": "Data research and visualisations",
    "gallery.cards.migration": "Data warehouse migrations to GCP",
    "gallery.cards.logo": "PapaData visual identity",
    "gallery.detail.analytics.eyebrow": "Case study · Moda24",
    "gallery.detail.analytics.title": "KPI dashboard in Looker Studio in 2 weeks",
    "gallery.detail.analytics.body": "We automated sales, marketing and logistics reporting by unifying data silos in BigQuery and publishing curated Looker Studio models.",
    "gallery.detail.analytics.point1": "12 data sources refreshed every 15 minutes",
    "gallery.detail.analytics.point2": "Semantic KPI model versioned in Git",
    "gallery.detail.analytics.point3": "SLA alerts delivered to Slack and email",
    "gallery.detail.ads.eyebrow": "Playbook · Performance",
    "gallery.detail.ads.title": "Fully data‑driven product feed",
    "gallery.detail.ads.body": "We join catalogues, margins and stock levels to drive bidding and exclusions inside automated campaigns.",
    "gallery.detail.ads.point1": "Campaign segmentation by margin and SKU velocity",
    "gallery.detail.ads.point2": "Enable / pause ad groups directly from BigQuery",
    "gallery.detail.ads.point3": "Daily cost and ROAS monitoring",
    "gallery.detail.research.eyebrow": "Workshop · Data discovery",
    "gallery.detail.research.title": "From a business question to an ML prototype",
    "gallery.detail.research.body": "We build Vertex AI sandboxes so teams can test hypotheses and share notebooks with marketing.",
    "gallery.detail.research.point1": "Shared notebooks in BigQuery Studio",
    "gallery.detail.research.point2": "Experiment tracking and model versioning",
    "gallery.detail.research.point3": "Recommendation export to internal apps",
    "gallery.detail.migration.eyebrow": "Program · Lift & Shift",
    "gallery.detail.migration.title": "Moving 5 TB of data with zero downtime",
    "gallery.detail.migration.body": "We migrate ETL jobs and BI reports to BigQuery while staying compliant with GDPR and SOC2.",
    "gallery.detail.migration.point1": "Dual‑run synchronisation for 4 weeks",
    "gallery.detail.migration.point2": "IaC with Terraform + Cloud Build",
    "gallery.detail.migration.point3": "Full access audit and cost guards",
    "gallery.detail.identity.eyebrow": "Offering · Retainer",
    "gallery.detail.identity.title": "On‑demand data cloud crew",
    "gallery.detail.identity.body": "Architects, data engineers and analysts delivering automation roadmaps without hiring overhead.",
    "gallery.detail.identity.point1": "24h SLA per request and Jira backlog",
    "gallery.detail.identity.point2": "Hour bundles + outcome‑based billing",
    "gallery.detail.identity.point3": "Knowledge transfer and Confluence docs",
    "gallery.detail.close": "Close panel",
    "gallery.detail.listLabel": "Key benefits",

    // Services (interactive cards)
    "services.title": "Our Services",
    "services.cards.etl": "No‑Code ETL Automation",
    "services.detail.etl.eyebrow": "Offering · ETL",
    "services.detail.etl.title": "No‑code to BigQuery",
    "services.detail.etl.body": "We connect data sources and load them into BigQuery without writing any code.",
    "services.detail.etl.point1": "CRM and e‑commerce integration",
    "services.detail.etl.point2": "Data processing and normalisation",
    "services.detail.etl.point3": "Real‑time synchronisation",
    "services.cards.analytics": "Looker Studio analytics",
    "services.detail.analytics.eyebrow": "Offering · Analysis",
    "services.detail.analytics.title": "KPI analytics in Looker Studio",
    "services.detail.analytics.body": "We build data models and KPIs to deliver interactive dashboards in Looker Studio.",
    "services.detail.analytics.point1": "KPI and semantic models in BigQuery",
    "services.detail.analytics.point2": "Automatic refresh and alerts",
    "services.detail.analytics.point3": "Personalised visualisations",
    "services.cards.integration": "Integration with GCP",
    "services.detail.integration.eyebrow": "Offering · Integration",
    "services.detail.integration.title": "Secure GCP integration",
    "services.detail.integration.body": "We build infrastructure as code and integrate GCP services with your systems.",
    "services.detail.integration.point1": "Terraform and Cloud Functions",
    "services.detail.integration.point2": "Scaling and orchestration",
    "services.detail.integration.point3": "Access control and audit",

    // Technology (interactive cards)
    "tech.title": "Technology",
    "tech.cards.etl": "Infrastructure as code",
    "tech.detail.etl.eyebrow": "Technology · IaC",
    "tech.detail.etl.title": "Terraform & Cloud Build",
    "tech.detail.etl.body": "We automate deployments using Terraform and Cloud Build to ensure consistent environments.",
    "tech.detail.etl.point1": "Reusable GCP modules and templates",
    "tech.detail.etl.point2": "CI/CD pipelines",
    "tech.detail.etl.point3": "Version tracking and rollback",
    "tech.cards.analytics": "Data models & Looker",
    "tech.detail.analytics.eyebrow": "Technology · Analysis",
    "tech.detail.analytics.title": "Data models & LookML",
    "tech.detail.analytics.body": "We design BigQuery schemas and a LookML semantic layer for precise reporting.",
    "tech.detail.analytics.point1": "Measure and dimension modelling",
    "tech.detail.analytics.point2": "Git repository and tests",
    "tech.detail.analytics.point3": "Dashboard personalisation",
    "tech.cards.integration": "Automation & orchestration",
    "tech.detail.integration.eyebrow": "Technology · Orchestration",
    "tech.detail.integration.title": "Functions, Workflows & Scheduler",
    "tech.detail.integration.body": "Cloud Functions and Workflows steer ETL pipelines, synchronisation and alerts.",
    "tech.detail.integration.point1": "Dependency management",
    "tech.detail.integration.point2": "Automatic scaling",
    "tech.detail.integration.point3": "Error reporting and logging",

    // Integrations (interactive cards)
    "integration.title": "Integrations",
    "integration.cards.etl": "Automated ETL to BigQuery",
    "integration.detail.etl.eyebrow": "Integrations · ETL",
    "integration.detail.etl.title": "Automated ETL to BigQuery",
    "integration.detail.etl.body": "We connect e‑commerce, CRM and marketing to BigQuery using managed connectors and custom integrations.",
    "integration.detail.etl.point1": "Easy source onboarding",
    "integration.detail.etl.point2": "Data mapping and harmonisation",
    "integration.detail.etl.point3": "Scheduling and SLA configuration",
    "integration.cards.analytics": "BI integrations",
    "integration.detail.analytics.eyebrow": "Integrations · BI",
    "integration.detail.analytics.title": "Reporting & BI",
    "integration.detail.analytics.body": "We integrate Looker Studio, Power BI and other tools on a single data platform.",
    "integration.detail.analytics.point1": "Shared data models",
    "integration.detail.analytics.point2": "Real‑time connections",
    "integration.detail.analytics.point3": "Access management and authorisation",
    "integration.cards.integration": "Secure workflows",
    "integration.detail.integration.eyebrow": "Integrations · Operational",
    "integration.detail.integration.title": "Secure operational workflows",
    "integration.detail.integration.body": "We automate ERP, WMS and SaaS processes with governed access and auditing.",
    "integration.detail.integration.point1": "API and webhook integrations",
    "integration.detail.integration.point2": "Compliance monitoring and audit",
    "integration.detail.integration.point3": "Flexible rules and workflows",

    // Contact
    "contact.title": "Contact Us",
    "contact.name": "Full name",
    "contact.email": "Email address",
    "contact.message": "Your message",
    "contact.send": "Send",
    "contact.name.label": "Full name",
    "contact.email.label": "Email address",
    "contact.message.label": "Your message",

    // Playground
    "playground.description": "Simulate the data flow: CRM → BigQuery → Looker Studio → Google Ads campaigns",

    // Footer
    "footer.text": "© 2025 PapaData | All rights reserved.",

    // Aria labels
    "aria.menu": "Open menu",
    "aria.menuClose": "Close menu",
    "aria.top": "Back to top",
    "aria.themeLight": "Enable light theme",
    "aria.themeDark": "Enable dark theme",
    "splash.close": "Close intro screen",

    // Splash hint
    "splash.hint": "Click to enter"
  }
};

/* ---------------------- Helpers ---------------------- */
const THEME_KEY = 'theme';
const THEME_LOCK_KEY = 'themeLocked';

function matchesMedia(query){ try{ return !!window.matchMedia?.(query).matches }catch{ return false; } }
function systemPrefersLight(){ return matchesMedia('(prefers-color-scheme: light)'); }
function detectLanguage(){
  const saved = localStorage.getItem('lang');
  if (saved === 'pl' || saved === 'en') return saved;
  try { return navigator.language?.startsWith('pl') ? 'pl' : 'en'; } catch { return 'en'; }
}
function getInitialTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return systemPrefersLight() ? 'light' : 'dark';
}
function setMenuAria(isOpen){
  const menuIcon = document.getElementById('menu-icon');
  if (!menuIcon) return;
  const lang = localStorage.getItem('lang') || detectLanguage();
  const key = isOpen ? 'aria.menuClose' : 'aria.menu';
  const label = translations?.[lang]?.[key] || (isOpen ? 'Close menu' : 'Open menu');
  menuIcon.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  menuIcon.setAttribute('aria-label', label);
}

/* ---------------------- Theme ---------------------- */
function applyTheme(mode, { persist = true } = {}){
  const root = document.documentElement;
  const isLight = mode === 'light';
  root.setAttribute('data-theme', mode);
  root.style.colorScheme = isLight ? 'light' : 'dark';
  if (persist){ localStorage.setItem(THEME_KEY, mode); localStorage.setItem(THEME_LOCK_KEY, '1'); }
  const themeToggle = document.querySelector('#theme-toggle');
  if (themeToggle){
    const icon = themeToggle.querySelector('i');
    icon?.classList.toggle('bx-sun', isLight);
    icon?.classList.toggle('bx-moon', !isLight);
    themeToggle.setAttribute('aria-pressed', isLight ? 'false' : 'true');
    const dict = translations[localStorage.getItem('lang') || detectLanguage()];
    const labelKey = isLight ? 'aria.themeDark' : 'aria.themeLight';
    if (dict?.[labelKey]) themeToggle.setAttribute('aria-label', dict[labelKey]);
  }
}

/* ---------------------- Language ---------------------- */
function applyLanguage(lang){
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  const dict = translations[lang] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] != null) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
  });
  // nav labels fallback for anchors with id mismatches
  const navMap = {
    'nav.home': ['header .navbar a[href="#home"]'],
    'nav.services': ['header .navbar a[href="#uslugi"]','header .navbar a[href="#services"]'],
    'nav.tech': ['header .navbar a[href="#technologia"]','header .navbar a[href="#technology"]'],
    'nav.integration': ['header .navbar a[href="#integracje"]','header .navbar a[href="#integrations"]'],
    'nav.contact': ['header .navbar a[href="#contact"]','header .navbar a[href="#kontakt"]'],
  };
  Object.keys(navMap).forEach(key => {
    const text = dict[key]; if (!text) return;
    for (const sel of navMap[key]){ const el = document.querySelector(sel); if (el){ el.textContent = text; break; } }
  });
  // toggle language buttons state
  const btnPL = document.getElementById('lang-pl');
  const btnEN = document.getElementById('lang-en');
  if (btnPL && btnEN){
    const isPL = lang === 'pl';
    btnPL.classList.toggle('active', isPL); btnEN.classList.toggle('active', !isPL);
    btnPL.setAttribute('aria-pressed', isPL ? 'true' : 'false');
    btnEN.setAttribute('aria-pressed', !isPL ? 'true' : 'false');
    btnPL.textContent = 'PL'; btnEN.textContent = 'EN';
  }
  setMenuAria(document.querySelector('.navbar')?.classList.contains('active'));
  const topLink = document.querySelector('.footer-iconTop a');
  if (topLink && dict['aria.top']) topLink.setAttribute('aria-label', dict['aria.top']);
  // theme toggle label
  const isLight = (localStorage.getItem('theme') || getInitialTheme()) === 'light';
  const labelKey = isLight ? 'aria.themeDark' : 'aria.themeLight';
  if (dict[labelKey]) document.getElementById('theme-toggle')?.setAttribute('aria-label', dict[labelKey]);
}

/* ---------------------- Parallax (mouse only) ---------------------- */
function initParallax(){
  if (matchesMedia('(prefers-reduced-motion: reduce)') || matchesMedia('(pointer: coarse)')) return;
  let raf;
  function onMove(e){
    const x = (e.clientX / innerWidth) - 0.5;
    const y = (e.clientY / innerHeight) - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--tiltX', (y * -10).toFixed(2) + 'deg');
      document.documentElement.style.setProperty('--tiltY', (x * 10).toFixed(2) + 'deg');
      document.documentElement.style.setProperty('--parallaxX', (x * 10).toFixed(1) + 'px');
      document.documentElement.style.setProperty('--parallaxY', (y * 10).toFixed(1) + 'px');
    });
  }
  addEventListener('mousemove', onMove, { passive: true });
  addEventListener('mouseleave', () => {
    document.documentElement.style.setProperty('--tiltX', '0deg');
    document.documentElement.style.setProperty('--tiltY', '0deg');
    document.documentElement.style.setProperty('--parallaxX', '0px');
    document.documentElement.style.setProperty('--parallaxY', '0px');
  });
}

/* ---------------------- Splash (click‑to‑enter) ---------------------- */
function initSplash(){
  const splash = document.getElementById('splash');
  if (!splash) return;
  const prefersReduced = matchesMedia('(prefers-reduced-motion: reduce)');
  const seen = sessionStorage.getItem('splash-seen') === '1';
  if (prefersReduced || seen){
    splash.remove();
    return;
  }
  const closeBtn = splash.querySelector('.splash__close');
  const content = splash.querySelector('.splash__content');
  let hasClosed = false;
  // no auto‑close timer: splash remains until user clicks or presses a key
  let autoTimer = null;
  document.documentElement.classList.add('splash-open');
  document.body.classList.add('splash-open');
  // show splash
  requestAnimationFrame(() => splash.classList.add('is-visible'));
  function closeSplash(){
    if (hasClosed) return;
    hasClosed = true;
    clearTimeout(autoTimer);
    splash.classList.remove('is-visible');
    document.documentElement.classList.remove('splash-open');
    document.body.classList.remove('splash-open');
    setTimeout(() => splash.remove(), 350);
    sessionStorage.setItem('splash-seen','1');
  }
  function handleKey(e){
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape'){ e.preventDefault(); closeSplash(); }
  }
  splash.addEventListener('click', closeSplash);
  content?.addEventListener('click', (e) => e.stopPropagation());
  closeBtn?.addEventListener('click', (e) => { e.preventDefault(); closeSplash(); });
  splash.addEventListener('keydown', handleKey);
}

/* ---------------------- Nav / Active link / Mobile panel ---------------------- */
function initNav(){
  const menuIcon = document.getElementById('menu-icon');
  const navbar   = document.querySelector('.navbar');
  const headerEl = document.querySelector('.header');
  const controlsEl = document.querySelector('.controls');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('header nav a');
  // mobile toggle
  if (menuIcon && navbar){
    setMenuAria(false);
    menuIcon.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('active');
      menuIcon.classList.toggle('bx-x', isOpen);
      menuIcon.classList.toggle('bx-menu', !isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      document.documentElement.classList.toggle('nav-open', isOpen);
      setMenuAria(isOpen);
    });
  }
  // relocate controls on narrow screens
  function ensureNavControls(){
    if (!navbar) return null;
    let slot = navbar.querySelector('.nav-controls');
    if (!slot){ slot = document.createElement('div'); slot.className = 'nav-controls'; navbar.appendChild(slot); }
    return slot;
  }
  const homeParent = controlsEl?.parentElement;
  const nextSibling = controlsEl?.nextElementSibling;
  function relocateControls(){
    if (!controlsEl) return;
    const narrow = window.innerWidth <= 640;
    if (narrow){
      const slot = ensureNavControls();
      if (slot && controlsEl.parentElement !== slot) slot.appendChild(controlsEl);
    } else if (homeParent){
      if (nextSibling && nextSibling.parentElement === homeParent) homeParent.insertBefore(controlsEl, nextSibling);
      else homeParent.appendChild(controlsEl);
    }
  }
  relocateControls();
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && navbar?.classList.contains('active')){
      navbar.classList.remove('active'); document.body.classList.remove('nav-open'); document.documentElement.classList.remove('nav-open');
      menuIcon?.classList.remove('bx-x'); menuIcon?.classList.add('bx-menu'); setMenuAria(false);
    }
    relocateControls();
  });
  // update active link on scroll
  window.addEventListener('scroll', () => {
    const top = window.scrollY;
    sections.forEach(sec => {
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (top >= offset && top < offset + height){
        navLinks.forEach(l => l.removeAttribute('aria-current'));
        const active = document.querySelector(`header nav a[href*="${id}"]`);
        active?.setAttribute('aria-current','page');
      }
    });
    headerEl?.classList.toggle('sticky', top > 100);
    if (navbar?.classList.contains('active')){
      navbar.classList.remove('active'); document.body.classList.remove('nav-open'); document.documentElement.classList.remove('nav-open');
      menuIcon?.classList.remove('bx-x'); menuIcon?.classList.add('bx-menu'); setMenuAria(false);
    }
  });
}

/* ---------------------- Language buttons ---------------------- */
function ensureLangButtons(){
  const controls = document.querySelector('.controls'); if (!controls) return;
  const set = (id, lang) => {
    let btn = document.getElementById(id);
    if (!btn){ btn = document.createElement('button'); btn.id = id; btn.className = 'lang-btn'; btn.type = 'button'; btn.dataset.lang = lang; btn.textContent = lang.toUpperCase(); controls.appendChild(btn); }
    const clone = btn.cloneNode(true); btn.replaceWith(clone);
    clone.addEventListener('click', () => applyLanguage(clone.dataset.lang));
  };
  set('lang-pl','pl'); set('lang-en','en');
}

/* ---------------------- Visual card details ---------------------- */
function initGalleryDetails(){
  // Use a single detail panel for all cards across sections
  const detail = document.querySelector('.visual-detail');
  if (!detail) return;
  const detailImg = detail.querySelector('.visual-detail__img');
  const detailEyebrow = detail.querySelector('#visual-detail-eyebrow');
  const detailTitle = detail.querySelector('#visual-detail-title');
  const detailBody = detail.querySelector('#visual-detail-body');
  const detailList = detail.querySelector('.visual-detail__tags');
  const closeBtn = detail.querySelector('.visual-detail__close');
  const overlay = detail.querySelector('.visual-detail__overlay');
  const panel = detail.querySelector('.visual-detail__panel');
  if (!panel || !detailList) return;
  // Select all triggers globally
  const triggers = document.querySelectorAll('.visual-card__button');
  let activeButton = null;
  let escapeHandler = null;
  let trapHandler = null;
  const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function syncText(target, source){
    if (!target || !source) return;
    target.textContent = source.textContent;
    const key = source.getAttribute('data-i18n');
    if (key) target.setAttribute('data-i18n', key); else target.removeAttribute('data-i18n');
  }
  function spawnBurst(card, evt){
    if (matchesMedia('(prefers-reduced-motion: reduce)')) return;
    const rect = card.getBoundingClientRect();
    const x = (evt?.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (evt?.clientY ?? rect.top + rect.height / 2) - rect.top;
    const burst = document.createElement('span');
    burst.className = 'pd-cloud-burst';
    burst.style.setProperty('--x', `${x}px`);
    burst.style.setProperty('--y', `${y}px`);
    card.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove(), { once: true });
  }
  function trapFocus(event){
    if (event.key !== 'Tab') return;
    const focusable = Array.from(panel.querySelectorAll(focusableSelector))
      .filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first){ event.preventDefault(); last.focus(); return; }
    if (!event.shiftKey && document.activeElement === last){ event.preventDefault(); first.focus(); }
  }
  function closeDetail(){
    if (!detail.classList.contains('is-visible')) return;
    detail.classList.remove('is-visible');
    detail.dataset.state = 'hidden';
    detail.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('detail-open');
    document.body.classList.remove('detail-open');
    if (escapeHandler){ document.removeEventListener('keydown', escapeHandler); escapeHandler = null; }
    if (trapHandler){ panel.removeEventListener('keydown', trapHandler); trapHandler = null; }
    setTimeout(() => { if (detail.dataset.state === 'hidden') detail.setAttribute('hidden',''); }, 250);
    if (activeButton){ activeButton.setAttribute('aria-expanded','false'); activeButton.focus(); activeButton = null; }
  }
  function openDetail(card, trigger, evt){
    const detailBlock = card?.querySelector('.visual-card__detail');
    if (!detailBlock || !detailImg) return;
    const eyebrow = detailBlock.querySelector('.visual-card__detail-eyebrow');
    const title = detailBlock.querySelector('.visual-card__detail-title');
    const body = detailBlock.querySelector('.visual-card__detail-body');
    const listItems = detailBlock.querySelectorAll('.visual-card__detail-list li');
    syncText(detailEyebrow, eyebrow);
    syncText(detailTitle, title);
    syncText(detailBody, body);
    detailList.innerHTML = '';
    listItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.textContent;
      const key = item.getAttribute('data-i18n');
      if (key) li.setAttribute('data-i18n', key);
      detailList.appendChild(li);
    });
    const img = card.querySelector('img');
    if (img){ detailImg.src = card.dataset.image || img.currentSrc || img.src; detailImg.alt = img.alt || ''; }
    detail.removeAttribute('hidden');
    requestAnimationFrame(() => detail.classList.add('is-visible'));
    detail.dataset.state = 'visible';
    detail.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('detail-open');
    document.body.classList.add('detail-open');
    activeButton?.setAttribute('aria-expanded','false');
    activeButton = trigger;
    trigger?.setAttribute('aria-expanded','true');
    panel.focus();
    escapeHandler = (event) => { if (event.key === 'Escape'){ event.preventDefault(); closeDetail(); } };
    document.addEventListener('keydown', escapeHandler);
    trapHandler = (event) => trapFocus(event);
    panel.addEventListener('keydown', trapHandler);
    spawnBurst(card, evt);
  }
  triggers.forEach(btn => {
    btn.addEventListener('click', (evt) => {
      const card = btn.closest('.visual-card');
      openDetail(card, btn, evt);
    });
  });
  closeBtn?.addEventListener('click', () => closeDetail());
  overlay?.addEventListener('click', () => closeDetail());
  detail.addEventListener('click', (evt) => { if (evt.target === detail) closeDetail(); });
}

/* ---------------------- Gradient motion ---------------------- */
function initGradientMotion(){
  const bg = document.querySelector('.hero-bg-motion');
  if (!bg) return;
  let pos = 0;
  setInterval(() => {
    pos += 0.5;
    bg.style.backgroundPosition = `${pos}% 50%`;
  }, 120);
}

/* ---------------------- Hero parallax ---------------------- */
function initHeroParallax(){
  const hero = document.querySelector('.home');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    hero.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });
}

/* ---------------------- DOM Ready ---------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // theme
  applyTheme(getInitialTheme(), { persist:false });
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = (localStorage.getItem(THEME_KEY) || getInitialTheme()) === 'light' ? 'dark' : 'light';
    applyTheme(next, { persist:true });
  });
  const mql = window.matchMedia?.('(prefers-color-scheme: light)');
  mql?.addEventListener?.('change', () => {
    const locked = localStorage.getItem(THEME_LOCK_KEY) === '1';
    if (!locked) applyTheme(getInitialTheme(), { persist:false });
  });
  // language buttons and initial language
  ensureLangButtons();
  applyLanguage(detectLanguage());
  // navigation and interactions
  initNav();
  initParallax();
  initGalleryDetails();
  initSplash();
  // extra motions
  initGradientMotion();
  initHeroParallax();
  // optional ScrollReveal if available on page
  if (typeof ScrollReveal !== 'undefined'){
    ScrollReveal({ reset:false, distance:'40px', duration:900, delay:120 });
    ScrollReveal().reveal('.home-content, .heading', { origin:'top' });
    ScrollReveal().reveal('.visual-card, .services-box, .tech-box, .integration-box, .contact form', { origin:'bottom' });
  }
  // register Service Worker
  if ('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw-v7.js', { scope:'./' })
        .then(reg => {
          if (reg.waiting) reg.waiting.postMessage({ type:'SKIP_WAITING' });
          reg.addEventListener('updatefound', () => {
            const sw = reg.installing;
            sw?.addEventListener('statechange', () => {
              if (sw.state === 'installed' && navigator.serviceWorker.controller){
                console.log('SW: new version installed.');
              }
            });
          });
          console.log('ServiceWorker registered:', reg.scope);
        })
        .catch(err => console.error('SW register error:', err));
    });
  }
  // offline fallback message
  if (!navigator.onLine) {
    document.body.innerHTML = '<h2>Tryb offline — demo danych PapaData</h2>';
  }
});