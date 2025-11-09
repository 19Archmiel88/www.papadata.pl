/* ============================================================
   đźŚ PapaData â€” script.js (clean)
   Wersja: 2025-11-02
   Zakres: nawigacja, motyw, i18n, parallax, SW
   ============================================================ */

/* --------------------------------------------
   0) SĹOWNIKI PL / EN
-------------------------------------------- */
const translations = {
  pl: {
    "nav.home": "Strona gĹ‚Ăłwna",
    "nav.services": "UsĹ‚ugi",
    "nav.tech": "Technologie",
    "nav.integration": "Integracje",
    "nav.contact": "Kontakt",

    "home.subtitle": "Bezpieczna chmura",
    "home.text": "PapaData to zespĂłĹ‚ ekspertĂłw chmurowych specjalizujÄ…cych siÄ™ w automatyzacji analityki danych w Google Cloud Platform. Tworzymy i utrzymujemy platformy danych dla firm e-commerce, SaaS i agencji marketingowych.",
    "btn.more": "Dowiedz siÄ™ wiÄ™cej",

    "gallery.title": "Wizualizacje PapaData",
    "gallery.lead": "Poznaj nasze motywy graficzne obrazujÄ…ce integracje danych, automatyzacjÄ™ raportowania oraz migracje do Google Cloud.",
    "gallery.cards.analytics": "Analityka chmurowa i dashboard KPI",
    "gallery.cards.ads": "Automatyzacja kampanii Google Ads",
    "gallery.cards.research": "Badania danych i wizualizacje",
    "gallery.cards.migration": "Migracja hurtowni danych do GCP",
    "gallery.cards.logo": "Podpis i identyfikacja wizualna PapaData",

    "services.title": "Nasze usĹ‚ugi",
    "services.etl.title": "Automatyzacja ETL bez kodu",
    "services.etl.text": "ĹÄ…czymy ĹşrĂłdĹ‚a i przetwarzamy dane do BigQuery bez pisania kodu.",
    "services.analytics.title": "Analityka w Looker Studio",
    "services.analytics.text": "Gotowe dashboardy KPI oparte o modele danych w BigQuery.",
    "services.integration.title": "Integracja z GCP",
    "services.integration.text": "Bezpieczna infrastruktura jako kod, Cloud Functions i Scheduler.",

    "tech.title": "Technologie",
    "tech.etl.title": "Technologia - opis.",
    "tech.etl.text": "RĂłĹĽne technologie - opis.",
    "tech.analytics.title": "Technologia - opis.",
    "tech.analytics.text": "RĂłĹĽne technologie - opis.",
    "tech.integration.title": "Technologia - opis.",
    "tech.integration.text": "RĂłĹĽne technologie - opis.",

    "integration.title": "Integracje",
    "integration.etl.title": "Automatyzacja ETL do BigQuery",
    "integration.etl.text": "Laczymy e-commerce, CRM i marketing z BigQuery z wykorzystaniem zarzadzanych konektorow.",
    "integration.analytics.title": "Integracje BI i raportowe",
    "integration.analytics.text": "Synchronizujemy Looker Studio, Power BI i Data Studio na jednym modelu danych.",
    "integration.integration.title": "Bezpieczne przeplywy operacyjne",
    "integration.integration.text": "Laczymy ERP, systemy magazynowe i aplikacje SaaS z kontrola dostepu.",

    "contact.title": "Skontaktuj siÄ™ z nami",
    "contact.name": "ImiÄ™ i nazwisko",
    "contact.email": "Adres e-mail",
    "contact.message": "Twoja wiadomoĹ›Ä‡",
    "contact.send": "WyĹ›lij",

    "footer.text": "Â© 2025 PapaData | Wszystkie prawa zastrzeĹĽone.",
    "aria.menu": "OtwĂłrz menu",
    "aria.menuClose": "Zamknij menu",
    "aria.top": "WrĂłÄ‡ na gĂłrÄ™",
    "aria.themeLight": "WĹ‚Ä…cz jasny motyw",
    "aria.themeDark": "WĹ‚Ä…cz ciemny motyw"
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.tech": "Technology",
    "nav.integration": "Integrations",
    "nav.contact": "Contact",

    "home.subtitle": "Secure Cloud",
    "home.text": "PapaData is a team of cloud experts specializing in automating data analytics in Google Cloud Platform. We build and maintain data platforms for e-commerce, SaaS companies, and marketing agencies.",
    "btn.more": "Learn more",

    "gallery.title": "PapaData Visuals",
    "gallery.lead": "Explore our artwork illustrating data integrations, automated reporting, and migrations to Google Cloud.",
    "gallery.cards.analytics": "Cloud analytics & KPI dashboards",
    "gallery.cards.ads": "Google Ads automation",
    "gallery.cards.research": "Data research and visualisations",
    "gallery.cards.migration": "Data warehouse migration to GCP",
    "gallery.cards.logo": "PapaData visual identity",

    "services.title": "Our Services",
    "services.etl.title": "No-Code ETL Automation",
    "services.etl.text": "We connect data sources and process data to BigQuery without writing code.",
    "services.analytics.title": "Analytics in Looker Studio",
    "services.analytics.text": "Ready-to-use KPI dashboards built on BigQuery data models.",
    "services.integration.title": "Integration with GCP",
    "services.integration.text": "Secure infrastructure as code, Cloud Functions, and Scheduler.",

    "tech.title": "Technology",
    "tech.etl.title": "Technology - description.",
    "tech.etl.text": "Various technologies - description.",
    "tech.analytics.title": "Technology - description.",
    "tech.analytics.text": "Various technologies - description.",
    "tech.integration.title": "Technology - description.",
    "tech.integration.text": "Various technologies - description.",

    "integration.title": "Integrations",
    "integration.etl.title": "Automated ETL to BigQuery",
    "integration.etl.text": "Connect commerce, CRM, and marketing sources to BigQuery with managed connectors.",
    "integration.analytics.title": "BI & Reporting Integrations",
    "integration.analytics.text": "Keep Looker Studio, Power BI, and Data Studio aligned on a single data model.",
    "integration.integration.title": "Secure Operational Workflows",
    "integration.integration.text": "Integrate ERP, warehouse, and SaaS apps with governed access.",

    "contact.title": "Contact Us",
    "contact.name": "Full name",
    "contact.email": "Email address",
    "contact.message": "Your message",
    "contact.send": "Send",

    "footer.text": "Â© 2025 PapaData | All rights reserved.",
    "aria.menu": "Open menu",
    "aria.menuClose": "Close menu",
    "aria.top": "Back to top",
    "aria.themeLight": "Enable light theme",
    "aria.themeDark": "Enable dark theme"
  }
};

/* --------------------------------------------
   1) JÄZYK
-------------------------------------------- */
function detectLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved === "pl" || saved === "en") return saved;
  try {
    return navigator.language && navigator.language.startsWith("pl") ? "pl" : "en";
  } catch { return "en"; }
}

/* --------------------------------------------
   2) START PO DOMContentLoaded
-------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Elementy
  const menuIcon   = document.querySelector('#menu-icon');
  const navbar     = document.querySelector('.navbar');
  const headerEl   = document.querySelector('.header');
  const controlsEl = document.querySelector('.controls');
  const sections   = document.querySelectorAll('section');
  const navLinks   = document.querySelectorAll('header nav a');
  const themeToggle= document.querySelector('#theme-toggle');

  // zapamiÄ™tanie oryginalnej pozycji .controls
  const controlsHomeParent = controlsEl ? controlsEl.parentElement : null;
  const controlsNextSibling = controlsEl ? controlsEl.nextElementSibling : null;

  // pomocnicze
  const currentLang = () => localStorage.getItem('lang') || detectLanguage();

  function setMenuAria(isOpen) {
    if (!menuIcon) return;
    const lang = currentLang();
    const key  = isOpen ? 'aria.menuClose' : 'aria.menu';
    menuIcon.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const label = translations?.[lang]?.[key] || (isOpen ? 'Close menu' : 'Open menu');
    menuIcon.setAttribute('aria-label', label);
  }

  /* ---------- 2a) MENU MOBILNE + STICKY + ACTIVE LINK ---------- */
  if (menuIcon && navbar) {
    // stan poczÄ…tkowy dla ARIA/ikony
    menuIcon.classList.add('bx', 'bx-menu');
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

  window.addEventListener('scroll', () => {
    const top = window.scrollY;

    sections.forEach(sec => {
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (top >= offset && top < offset + height) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`header nav a[href*="${id}"]`);
        activeLink && activeLink.classList.add('active');
      }
    });

    headerEl && headerEl.classList.toggle('sticky', top > 100);

    // auto-zamykanie menu podczas scrolla
    if (navbar && navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      menuIcon?.classList.remove('bx-x');
      menuIcon?.classList.add('bx-menu');
      document.body.classList.remove('nav-open');
      document.documentElement.classList.remove('nav-open');
      setMenuAria(false);
    }
  });

  /* ---------- 2b) RELOKACJA .controls NA WÄ„SKICH EKRANACH ---------- */
  function ensureNavControls() {
    if (!navbar) return null;
    let slot = navbar.querySelector('.nav-controls');
    if (!slot) {
      slot = document.createElement('div');
      slot.className = 'nav-controls';
      navbar.appendChild(slot);
    }
    return slot;
  }

  function relocateControls() {
    if (!controlsEl) return;
    const narrow = window.innerWidth <= 640;
    if (narrow) {
      const slot = ensureNavControls();
      if (slot && controlsEl.parentElement !== slot) slot.appendChild(controlsEl);
    } else if (controlsHomeParent) {
      if (controlsNextSibling && controlsNextSibling.parentElement === controlsHomeParent) {
        controlsHomeParent.insertBefore(controlsEl, controlsNextSibling);
      } else {
        controlsHomeParent.appendChild(controlsEl);
      }
    }
  }
  relocateControls();
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && navbar?.classList.contains('active')) {
      navbar.classList.remove('active');
      document.body.classList.remove('nav-open');
      document.documentElement.classList.remove('nav-open');
      menuIcon?.classList.remove('bx-x');
      menuIcon?.classList.add('bx-menu');
      setMenuAria(false);
    }
    relocateControls();
  });

  /* ---------- 2c) PARALLAX (wyĹ‚Ä…cz na touch/reduced-motion) ---------- */
  (function initParallax() {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (reduce || coarse) return;
    let raf;
    function onMove(e) {
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
  })();

  /* ---------- 2d) MOTYW (data-theme + color-scheme) ---------- */
  const THEME_KEY = 'theme';      // ujednolicone
  const THEME_LOCK_KEY = 'themeLocked';

  function systemPrefersLight() {
    return window.matchMedia?.('(prefers-color-scheme: light)').matches;
  }
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return systemPrefersLight() ? 'light' : 'dark';
  }
  function applyTheme(mode, { persist = true } = {}) {
    const root = document.documentElement;
    const isLight = mode === 'light';

    root.setAttribute('data-theme', mode);
    root.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('light-mode', isLight);
    root.style.colorScheme = isLight ? 'light' : 'dark';

    if (persist) {
      localStorage.setItem(THEME_KEY, mode);
      localStorage.setItem(THEME_LOCK_KEY, '1');
    }

    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bx-sun', isLight);
        icon.classList.toggle('bx-moon', !isLight);
      }
      // aria-pressed = true traktujemy jako "wĹ‚Ä…czony dark"
      themeToggle.setAttribute('aria-pressed', isLight ? 'false' : 'true');
      const dict = translations[currentLang()];
      const labelKey = isLight ? 'aria.themeDark' : 'aria.themeLight';
      if (dict?.[labelKey]) themeToggle.setAttribute('aria-label', dict[labelKey]);
    }
  }
  // inicjalizacja i nasĹ‚uch
  applyTheme(getInitialTheme(), { persist: false });
  themeToggle?.addEventListener('click', () => {
    const next = (localStorage.getItem(THEME_KEY) || getInitialTheme()) === 'light' ? 'dark' : 'light';
    applyTheme(next, { persist: true });
  });
  const mql = window.matchMedia?.('(prefers-color-scheme: light)');
  mql?.addEventListener?.('change', () => {
    const locked = localStorage.getItem(THEME_LOCK_KEY) === '1';
    if (!locked) applyTheme(getInitialTheme(), { persist: false });
  });

  /* ---------- 2e) I18N ---------- */
  function applyLanguage(lang) {
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

    // fallback dla linkĂłw w nav
    const navMap = {
      "nav.home": ['header .navbar a[href="#home"]'],
      "nav.services": ['header .navbar a[href="#uslugi"]', 'header .navbar a[href="#services"]'],
      "nav.tech": ['header .navbar a[href="#technologia"]', 'header .navbar a[href="#technology"]'],
      "nav.integration": ['header .navbar a[href="#integracje"]', 'header .navbar a[href="#integrations"]'],
      "nav.contact": ['header .navbar a[href="#kontakt"]', 'header .navbar a[href="#contact"]']
    };
    Object.keys(navMap).forEach(key => {
      const text = dict[key];
      if (!text) return;
      for (const sel of navMap[key]) {
        const el = document.querySelector(sel);
        if (el) { el.textContent = text; break; }
      }
    });

    // stan przyciskĂłw jÄ™zyka
    const btnPL = document.getElementById('lang-pl');
    const btnEN = document.getElementById('lang-en');
    if (btnPL && btnEN) {
      const isPL = lang === 'pl';
      btnPL.classList.toggle('active', isPL);
      btnEN.classList.toggle('active', !isPL);
      btnPL.setAttribute('aria-pressed', isPL ? 'true' : 'false');
      btnEN.setAttribute('aria-pressed', !isPL ? 'true' : 'false');
      btnPL.textContent = 'PL';
      btnEN.textContent = 'EN';
    }

    // aria dla menu/top i motywu
    setMenuAria(navbar?.classList.contains('active'));
    const topLink = document.querySelector('.footer-iconTop a');
    if (topLink && dict['aria.top']) topLink.setAttribute('aria-label', dict['aria.top']);
    if (themeToggle) {
      const isLight = (localStorage.getItem('theme') || getInitialTheme()) === 'light';
      const labelKey = isLight ? 'aria.themeDark' : 'aria.themeLight';
      if (dict[labelKey]) themeToggle.setAttribute('aria-label', dict[labelKey]);
    }
  }

  function ensureLangButtons() {
    const controls = document.querySelector('.controls');
    if (!controls) return;

    let plBtn = document.getElementById('lang-pl');
    let enBtn = document.getElementById('lang-en');

    if (!plBtn) {
      plBtn = document.createElement('button');
      plBtn.id = 'lang-pl';
      plBtn.className = 'lang-btn';
      plBtn.type = 'button';
      plBtn.textContent = 'PL';
      plBtn.dataset.lang = 'pl';
      controls.appendChild(plBtn);
    }
    if (!enBtn) {
      enBtn = document.createElement('button');
      enBtn.id = 'lang-en';
      enBtn.className = 'lang-btn';
      enBtn.type = 'button';
      enBtn.textContent = 'EN';
      enBtn.dataset.lang = 'en';
      controls.appendChild(enBtn);
    }

    // odĹ›wieĹĽ nasĹ‚uchy
    [plBtn, enBtn].forEach(btn => {
      const clone = btn.cloneNode(true);
      btn.replaceWith(clone);
      clone.addEventListener('click', () => applyLanguage(clone.dataset.lang));
    });
  }

  ensureLangButtons();
  applyLanguage(detectLanguage());

  /* ---------- 2f) SCROLL REVEAL (opcjonalnie, jeĹ›li biblioteka obecna) ---------- */
  if (typeof ScrollReveal !== "undefined") {
    ScrollReveal({ reset: true, distance: '80px', duration: 2000, delay: 200 });
    ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
    ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
    ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });
  }

  /* ---------- 2g) SERVICE WORKER (jedna rejestracja) ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw-v7.js', { scope: './' })
        .then(reg => {
          reg.addEventListener('updatefound', () => {
            const sw = reg.installing;
            sw?.addEventListener('statechange', () => {
              if (sw.state === 'installed' && navigator.serviceWorker.controller) {
             console.log('SW: nowa wersja zainstalowana.');
              }
            });
          });
           console.log('âś… ServiceWorker registered:', reg.scope);
        })
      .catch(err => console.error('âťŚ SW register error:', err));
    });
  }
});


