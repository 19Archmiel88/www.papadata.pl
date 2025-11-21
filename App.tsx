import React, { useState, useEffect, useRef } from 'react';
import { AnimatedLogo, StaticLogo, BrandMark } from './components/Logo';
import { ChatBot } from './components/ChatBot';
import { getDashboardInsights, AnalyzerResult } from './services/geminiService';
import { apiService } from './services/apiService';
import { 
  User, ViewState, OnboardingData, IntegrationType, UserRole, 
  IntegrationCategory, IntegrationMeta, ConnectionStatus, ProvisioningStep, KPIData,
  HealthData, LanguageCode 
} from './types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, AreaChart, Area, ComposedChart, Legend 
} from 'recharts';

// --- GLOBAL TYPES ---

enum DashboardTab {
  HOME = 'HOME',
  INTEGRATIONS = 'INTEGRATIONS',
  HEALTH = 'HEALTH',
  REPORTS = 'REPORTS',
  DOCS = 'DOCS'
}

// --- EPIC I: Internationalization Dictionary (Complete) ---
const translations: Record<LanguageCode, Record<string, string>> = {
  pl: {
    "nav.dashboard": "Pulpit",
    "nav.integrations": "Integracje",
    "nav.health": "Zdrowie Danych",
    "nav.reports": "Raporty PapaData",
    "nav.docs": "Dokumentacja",
    "nav.logout": "Wyloguj się",
    
    "hero.title": "Inteligentna Chmura Danych",
    "hero.subtitle": "Zintegrowany rdzeń danych łączący e-commerce, marketing i logistykę.",
    "hero.cta": "Zobacz Poradniki",
    "header.register": "Zarejestruj się",
    "header.login": "Zaloguj się",
    "header.sections.analyzer": "Poradniki Wideo",
    "header.sections.architecture": "Architektura",
    
    "auth.join": "Dołącz do PapaData",
    "auth.subtitle": "Rozpocznij inteligentną pracę z danymi.",
    "auth.tenant_hint": "Konto tworzy dzierżawę klienta (tenant). Używaj służbowego e-maila.",
    "auth.welcome": "Witaj ponownie",
    "auth.company": "Nazwa Firmy",
    "auth.email": "E-mail służbowy",
    "auth.email_hint": "np. jan@firma.com",
    "auth.email_error_free": "Użyj adresu w domenie firmowej (nie Gmail, Outlook itp.)",
    "auth.password": "Hasło",
    "auth.password_req": "Min. 12 znaków, duża litera, cyfra, znak specjalny.",
    "auth.create_btn": "Utwórz Konto",
    "auth.signin_btn": "Zaloguj się",
    "auth.have_account": "Masz już konto? Zaloguj się",
    "auth.no_account": "Stwórz konto",
    "auth.invite_link": "Masz zaproszenie? Aktywuj",
    "auth.back": "Powrót",
    "auth.2fa_title": "Weryfikacja 2FA",
    "auth.2fa_desc": "Wpisz 6-cyfrowy kod wysłany na e-mail.",
    "auth.verify_btn": "Weryfikuj i Zaloguj",
    "auth.sso_google": "Zaloguj przez Google Workspace",
    "auth.sso_microsoft": "Zaloguj przez Microsoft Entra ID",
    "auth.terms": "Akceptuję Regulamin i Politykę Prywatności",
    "auth.marketing": "Wyrażam zgodę na kontakt operacyjny/aktualizacje produktu",
    "auth.captcha": "Jestem człowiekiem",
    
    "wiz.title": "Kreator Konfiguracji",
    "wiz.step1": "Organizacja",
    "wiz.step1_sub": "Dane i Zgodność",
    "wiz.step1_contact": "Kontakt Techniczny",
    "wiz.step2": "Integracje",
    "wiz.step3": "Dostępy",
    "wiz.step4": "Harmonogram",
    "wiz.step5": "Potwierdzenie",
    "wiz.next": "Dalej",
    "wiz.back": "Wstecz",
    "wiz.cancel": "Anuluj konfigurację",
    "wiz.save_draft": "Zapisz szkic",
    "wiz.activate": "Aktywuj Platformę",
    "wiz.provisioning": "Przygotowanie Środowiska",
    "wiz.prov_desc": "Budowanie środowiska PapaData...",
    
    "dash.ai_btn": "Analiza AI",
    "dash.neural_core": "Rdzeń Neuralny",
    "dash.kpi.revenue": "Przychód",
    "dash.kpi.sessions": "Sesje",
    "dash.kpi.orders": "Zamówienia",
    "dash.loading": "Ładowanie pulpitu...",
    "dash.live": "Na żywo",
    
    "health.overall": "Ogólny Stan",
    "health.freshness": "Świeżość Danych",
    "health.sla": "Status SLA",
    "health.timeline": "Oś Czasu Zadań",
    "health.recommendations": "Rekomendacje AI",
    
    "gen.title": "Centrum Wiedzy",
    "gen.subtitle": "Dowiedz się, jak rozbudować swoją platformę i zwiększyć sprzedaż.",
    
    "vid.watch": "Konfiguracja Sklepu",
    "vid.desc": "Dowiedz się, jak dodawać kolejne sklepy, uruchamiać nowe kampanie i wdrażać firmę.",
    
    "footer.rights": "Wszelkie prawa zastrzeżone.",
    "promo.title": "2 Tygodnie Gratis",
    "promo.desc": "Odblokuj pełną moc chmury PapaData.",
    "promo.btn": "Odbierz Ofertę",
    "promo.later": "Może później"
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.integrations": "Integrations",
    "nav.health": "Data Health",
    "nav.reports": "PapaData Reports",
    "nav.docs": "Documentation",
    "nav.logout": "Log Out",

    "hero.title": "Intelligent Data Cloud",
    "hero.subtitle": "Unified data core connecting e-commerce, marketing, and logistics.",
    "hero.cta": "Watch Guides",
    "header.register": "Register",
    "header.login": "Login",
    "header.sections.analyzer": "Video Guides",
    "header.sections.architecture": "Architecture",

    "auth.join": "Join PapaData",
    "auth.subtitle": "Start your intelligent data journey today.",
    "auth.tenant_hint": "Account creates a client tenant. Please use work email.",
    "auth.welcome": "Welcome Back",
    "auth.company": "Company Name",
    "auth.email": "Work Email",
    "auth.email_hint": "e.g. john@company.com",
    "auth.email_error_free": "Use a corporate domain (no Gmail, Outlook, etc.)",
    "auth.password": "Password",
    "auth.password_req": "Min 12 chars, uppercase, number, special char.",
    "auth.create_btn": "Create Account",
    "auth.signin_btn": "Sign In",
    "auth.have_account": "Already have an account? Sign In",
    "auth.no_account": "Create an account",
    "auth.invite_link": "Have an invite? Activate",
    "auth.back": "Back",
    "auth.2fa_title": "Two-Factor Auth",
    "auth.2fa_desc": "Enter 6-digit code sent to your email.",
    "auth.verify_btn": "Verify & Login",
    "auth.sso_google": "Login with Google Workspace",
    "auth.sso_microsoft": "Login with Microsoft Entra ID",
    "auth.terms": "I accept Terms & Privacy Policy",
    "auth.marketing": "I agree to operational/product updates",
    "auth.captcha": "I am human",

    "wiz.title": "Setup Wizard",
    "wiz.step1": "Profile",
    "wiz.step1_sub": "Compliance",
    "wiz.step1_contact": "Tech Contact",
    "wiz.step2": "Integrations",
    "wiz.step3": "Secrets",
    "wiz.step4": "Schedule",
    "wiz.step5": "Confirm",
    "wiz.next": "Next Step",
    "wiz.back": "Back",
    "wiz.cancel": "Cancel Configuration",
    "wiz.save_draft": "Save Draft",
    "wiz.activate": "Activate Platform",
    "wiz.provisioning": "Provisioning",
    "wiz.prov_desc": "Building your PapaData environment...",

    "dash.ai_btn": "AI Insights",
    "dash.neural_core": "Neural Data Core",
    "dash.kpi.revenue": "Revenue",
    "dash.kpi.sessions": "Sessions",
    "dash.kpi.orders": "Orders",
    "dash.loading": "Loading dashboard...",
    "dash.live": "Live",

    "health.overall": "Overall Health",
    "health.freshness": "Data Freshness",
    "health.sla": "SLA Status",
    "health.timeline": "Job Timeline",
    "health.recommendations": "AI Recommendations",

    "gen.title": "Knowledge Hub",
    "gen.subtitle": "Learn how to expand your platform and boost sales.",

    "vid.watch": "Store Setup",
    "vid.desc": "Learn how to add additional stores, run new campaigns, and implement your company.",

    "footer.rights": "All rights reserved.",
    "promo.title": "2 Weeks Free Trial",
    "promo.desc": "Unlock the full power of PapaData Cloud.",
    "promo.btn": "Get Offer",
    "promo.later": "Maybe Later"
  },
  de: {
    "nav.dashboard": "Dashboard",
    "nav.integrations": "Integrationen",
    "nav.health": "Datenintegrität",
    "nav.reports": "PapaData Berichte",
    "nav.docs": "Dokumentation",
    "nav.logout": "Abmelden",

    "hero.title": "Intelligente Datenwolke",
    "hero.subtitle": "Einheitlicher Datenkern für E-Commerce, Marketing und Logistik.",
    "hero.cta": "Anleitungen ansehen",
    "header.register": "Registrieren",
    "header.login": "Anmelden",
    "header.sections.analyzer": "Video-Anleitungen",
    "header.sections.architecture": "Architektur",

    "auth.join": "PapaData Beitreten",
    "auth.subtitle": "Beginnen Sie Ihre intelligente Datenreise.",
    "auth.tenant_hint": "Konto erstellt einen Mandanten. Bitte Firmen-E-Mail nutzen.",
    "auth.welcome": "Willkommen zurück",
    "auth.company": "Firmenname",
    "auth.email": "Geschäfts-E-Mail",
    "auth.email_hint": "z.B. name@firma.de",
    "auth.email_error_free": "Bitte Firmen-Domain nutzen (kein Gmail etc.)",
    "auth.password": "Passwort",
    "auth.password_req": "Min 12 Zeichen, Großbuchstabe, Zahl, Sonderzeichen.",
    "auth.create_btn": "Konto erstellen",
    "auth.signin_btn": "Anmelden",
    "auth.have_account": "Bereits ein Konto? Anmelden",
    "auth.no_account": "Konto erstellen",
    "auth.invite_link": "Einladung aktivieren",
    "auth.back": "Zurück",
    "auth.2fa_title": "Zwei-Faktor-Auth",
    "auth.2fa_desc": "Geben Sie den 6-stelligen Code ein.",
    "auth.verify_btn": "Verifizieren & Anmelden",
    "auth.sso_google": "Mit Google Workspace anmelden",
    "auth.sso_microsoft": "Mit Microsoft Entra ID anmelden",
    "auth.terms": "Ich akzeptiere AGB & Datenschutz",
    "auth.marketing": "Ich stimme Updates zu",
    "auth.captcha": "Ich bin ein Mensch",

    "wiz.title": "Einrichtungsassistent",
    "wiz.step1": "Profil",
    "wiz.step1_sub": "Compliance",
    "wiz.step1_contact": "Technischer Kontakt",
    "wiz.step2": "Integrationen",
    "wiz.step3": "Geheimnisse",
    "wiz.step4": "Zeitplan",
    "wiz.step5": "Bestätigen",
    "wiz.next": "Weiter",
    "wiz.back": "Zurück",
    "wiz.cancel": "Konfiguration abbrechen",
    "wiz.save_draft": "Entwurf speichern",
    "wiz.activate": "Plattform Aktivieren",
    "wiz.provisioning": "Bereitstellung",
    "wiz.prov_desc": "Ihre PapaData-Umgebung wird erstellt...",

    "dash.ai_btn": "KI-Einblicke",
    "dash.neural_core": "Neuraler Datenkern",
    "dash.kpi.revenue": "Einnahmen",
    "dash.kpi.sessions": "Sitzungen",
    "dash.kpi.orders": "Bestellungen",
    "dash.loading": "Dashboard lädt...",
    "dash.live": "Live",

    "health.overall": "Gesamtzustand",
    "health.freshness": "Datenaktualität",
    "health.sla": "SLA Status",
    "health.timeline": "Job-Zeitachse",
    "health.recommendations": "KI-Empfehlungen",

    "gen.title": "Wissenszentrum",
    "gen.subtitle": "Lernen Sie, wie Sie Ihre Plattform erweitern.",

    "vid.watch": "Shop-Einrichtung",
    "vid.desc": "Erfahren Sie, wie Sie weitere Shops hinzufügen und Kampagnen starten.",

    "footer.rights": "Alle Rechte vorbehalten.",
    "promo.title": "2 Wochen kostenlos testen",
    "promo.desc": "Nutzen Sie die volle Kraft der PapaData Cloud.",
    "promo.btn": "Angebot erhalten",
    "promo.later": "Vielleicht später"
  },
  fr: {
    "nav.dashboard": "Tableau de bord",
    "nav.integrations": "Intégrations",
    "nav.health": "Santé des Données",
    "nav.reports": "Rapports PapaData",
    "nav.docs": "Documentation",
    "nav.logout": "Se déconnecter",

    "hero.title": "Nuage de Données Intelligent",
    "hero.subtitle": "Cœur de données unifié connectant e-commerce, marketing et logistique.",
    "hero.cta": "Voir les Guides",
    "header.register": "S'inscrire",
    "header.login": "Connexion",
    "header.sections.analyzer": "Guides Vidéo",
    "header.sections.architecture": "Architecture",

    "auth.join": "Rejoindre PapaData",
    "auth.subtitle": "Commencez votre voyage de données intelligent.",
    "auth.tenant_hint": "Le compte crée un locataire client. Utilisez l'e-mail pro.",
    "auth.welcome": "Bon retour",
    "auth.company": "Nom de l'entreprise",
    "auth.email": "E-mail professionnel",
    "auth.email_hint": "ex: jean@entreprise.com",
    "auth.email_error_free": "Utilisez un domaine pro (pas de Gmail, etc.)",
    "auth.password": "Mot de passe",
    "auth.password_req": "Min 12 cars, majuscule, chiffre, car. spécial.",
    "auth.create_btn": "Créer un compte",
    "auth.signin_btn": "Se connecter",
    "auth.have_account": "Déjà un compte ? Se connecter",
    "auth.no_account": "Créer un compte",
    "auth.invite_link": "Invitation reçue ? Activer",
    "auth.back": "Retour",
    "auth.2fa_title": "Auth à deux facteurs",
    "auth.2fa_desc": "Entrez le code à 6 chiffres.",
    "auth.verify_btn": "Vérifier & Connexion",
    "auth.sso_google": "Connexion Google Workspace",
    "auth.sso_microsoft": "Connexion Microsoft Entra ID",
    "auth.terms": "J'accepte les conditions & la confidentialité",
    "auth.marketing": "J'accepte les mises à jour produit",
    "auth.captcha": "Je suis humain",

    "wiz.title": "Assistant de configuration",
    "wiz.step1": "Profil",
    "wiz.step1_sub": "Conformité",
    "wiz.step1_contact": "Contact Tech",
    "wiz.step2": "Intégrations",
    "wiz.step3": "Secrets",
    "wiz.step4": "Calendrier",
    "wiz.step5": "Confirmer",
    "wiz.next": "Suivant",
    "wiz.back": "Retour",
    "wiz.cancel": "Annuler la configuration",
    "wiz.save_draft": "Sauvegarder",
    "wiz.activate": "Activer la plateforme",
    "wiz.provisioning": "Approvisionnement",
    "wiz.prov_desc": "Construction de votre environnement PapaData...",

    "dash.ai_btn": "Aperçus IA",
    "dash.neural_core": "Cœur Neural",
    "dash.kpi.revenue": "Revenu",
    "dash.kpi.sessions": "Sessions",
    "dash.kpi.orders": "Commandes",
    "dash.loading": "Chargement...",
    "dash.live": "En direct",

    "health.overall": "Santé Globale",
    "health.freshness": "Fraîcheur des données",
    "health.sla": "Statut SLA",
    "health.timeline": "Chronologie des tâches",
    "health.recommendations": "Recommandations IA",

    "gen.title": "Centre de connaissances",
    "gen.subtitle": "Apprenez à étendre votre plateforme et augmenter les ventes.",

    "vid.watch": "Configuration",
    "vid.desc": "Apprenez à ajouter des boutiques et à lancer des campagnes.",

    "footer.rights": "Tous droits réservés.",
    "promo.title": "Essai gratuit de 2 semaines",
    "promo.desc": "Débloquez toute la puissance du cloud PapaData.",
    "promo.btn": "Obtenir l'offre",
    "promo.later": "Peut-être plus tard"
  }
};

// --- i18n Helper Hook ---
const useLanguage = () => {
  // Default to Polish as requested
  const [lang, setLang] = useState<LanguageCode>(() => {
    return (localStorage.getItem('pd_lang') as LanguageCode) || 'pl';
  });

  const t = (key: string): string => {
    // Fallback to English if key is missing in translation, then key itself
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (newLang: LanguageCode) => {
    setLang(newLang);
    localStorage.setItem('pd_lang', newLang);
  };

  return { lang, changeLanguage, t };
};


// --- Components for Landing Page ---

const PromoPopup: React.FC<{ onClose: () => void, t: any }> = ({ onClose, t }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-4">
    <div className="bg-slate-900 border border-cyan-500/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-sm w-full pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-500 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h3 className="text-xl font-bold text-white mb-2">{t('promo.title')} 🚀</h3>
      <p className="text-slate-400 text-sm mb-4">
        {t('promo.desc')}
      </p>
      <div className="flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold py-2 rounded-lg transition-colors">
          {t('promo.btn')}
        </button>
        <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
          {t('promo.later')}
        </button>
      </div>
    </div>
  </div>
);

const LandingHeader: React.FC<{ 
  onLogin: () => void; 
  onRegister: () => void; 
  scrollToSection: (id: string) => void; 
  langHook: any;
}> = ({ onLogin, onRegister, scrollToSection, langHook }) => {
  const { lang, changeLanguage, t } = langHook;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <StaticLogo size="sm" />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            {id: 'dashboard', label: t('nav.dashboard')},
            {id: 'generator', label: t('header.sections.analyzer')},
            {id: 'architecture', label: t('header.sections.architecture')},
            {id: 'docs', label: t('nav.docs')}
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* EPIC I: Language Dropdown (Ordered: PL, EN, DE, FR) */}
          <div className="relative group">
             <button className="flex items-center gap-2 text-xs font-bold font-mono text-slate-400 hover:text-white border border-slate-800 px-3 py-1.5 rounded uppercase transition-colors">
               🌐 {lang}
             </button>
             <div className="absolute right-0 top-full mt-1 w-24 bg-slate-900 border border-slate-800 rounded shadow-xl hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                {['pl', 'en', 'de', 'fr'].map((l) => (
                  <button 
                    key={l}
                    onClick={() => changeLanguage(l as LanguageCode)}
                    className={`block w-full text-left px-3 py-2 text-xs uppercase hover:bg-slate-800 ${lang === l ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
                  >
                    {l}
                  </button>
                ))}
             </div>
          </div>

          <button onClick={onRegister} className="hidden sm:block px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            {t('header.register')}
          </button>
          <button onClick={onLogin} className="text-sm font-medium text-slate-300 hover:text-white">
            {t('header.login')}
          </button>
        </div>
      </div>
    </header>
  );
};

const HeroSection: React.FC<{ onStart: () => void; t: any }> = ({ onStart, t }) => (
  <section id="dashboard" className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden min-h-[80vh]">
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div className="z-10 mb-12 scale-75 md:scale-100">
      <AnimatedLogo />
    </div>

    <h1 className="z-10 text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-5xl leading-tight">
      {t('hero.title')} <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        PapaData
      </span>
    </h1>

    <p className="z-10 text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
      {t('hero.subtitle')}
    </p>

    <button 
      onClick={onStart}
      className="z-10 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-105 flex items-center gap-2"
    >
      {t('hero.cta')}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  </section>
);

// --- New Video Section (Replaced AI Visualizer) ---
const VideoSection: React.FC<{ t: any }> = ({ t }) => {
  const [activeVideoId, setActiveVideoId] = useState(0);
  
  // Hardcoded list for "Our Videos" as requested
  const videos = [
    { 
      id: 0, 
      title: t('vid.watch'), 
      desc: t('vid.desc'), 
      duration: "04:20",
      // Store Setup Visual
      visual: (isActive: boolean) => (
        <svg viewBox="0 0 100 60" className={`w-full h-full ${isActive ? 'text-cyan-500' : 'text-slate-500'}`}>
           <rect x="20" y="15" width="60" height="40" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
           <path d="M20 15 L50 5 L80 15" fill="none" stroke="currentColor" strokeWidth="2"/>
           <circle cx="50" cy="35" r="8" fill="currentColor" fillOpacity="0.4"/>
           <rect x="30" y="45" width="40" height="10" rx="1" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      )
    },
    { 
      id: 1, 
      title: "Advanced Campaigns", 
      desc: "Running multi-channel marketing campaigns.", 
      duration: "08:15",
      // Marketing Campaign Visual
      visual: (isActive: boolean) => (
        <svg viewBox="0 0 100 60" className={`w-full h-full ${isActive ? 'text-cyan-500' : 'text-slate-500'}`}>
           <path d="M10 50 L30 35 L50 45 L90 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
           <circle cx="90" cy="15" r="3" fill="currentColor"/>
           <rect x="15" y="50" width="10" height="0" className="animate-[pulse_2s_infinite]">
              <animate attributeName="height" from="0" to="20" dur="1s" fill="freeze" />
           </rect>
           <rect x="35" y="50" width="10" height="30" fill="currentColor" fillOpacity="0.2"/>
           <rect x="55" y="50" width="10" height="40" fill="currentColor" fillOpacity="0.3"/>
           <rect x="75" y="50" width="10" height="25" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      )
    },
    { 
      id: 2, 
      title: "Team Onboarding", 
      desc: "Inviting users and managing roles.", 
      duration: "03:45",
      // Team/Users Visual
      visual: (isActive: boolean) => (
        <svg viewBox="0 0 100 60" className={`w-full h-full ${isActive ? 'text-cyan-500' : 'text-slate-500'}`}>
           <circle cx="50" cy="25" r="10" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
           <path d="M30 55 Q50 35 70 55" fill="none" stroke="currentColor" strokeWidth="2"/>
           <circle cx="75" cy="30" r="7" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
           <circle cx="25" cy="30" r="7" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
           <path d="M50 15 L50 10 M50 5 L50 0" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
        </svg>
      )
    }
  ];

  const activeVideo = videos[activeVideoId];

  return (
    <section id="generator" className="py-24 px-4 bg-slate-950 relative border-t border-slate-900">
       <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('gen.title')}</h2>
          <p className="text-slate-400">{t('gen.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Main Player */}
             <div className="lg:col-span-2">
                <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-video flex items-center justify-center relative group">
                   {/* Placeholder for video playback */}
                   <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white ml-1">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                         </svg>
                      </div>
                      <p className="mt-4 text-slate-500 text-sm font-mono">Playing: {activeVideo.title}</p>
                   </div>
                </div>
                <div className="mt-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                   <h3 className="text-2xl font-bold text-white mb-2">{activeVideo.title}</h3>
                   <p className="text-slate-400 leading-relaxed">{activeVideo.desc}</p>
                </div>
             </div>

             {/* Playlist Sidebar */}
             <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 h-full max-h-[500px] overflow-y-auto shadow-inner">
                <h4 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider px-2 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                   </svg>
                   Playlist
                </h4>
                <div className="space-y-2">
                   {videos.map((v, i) => {
                      const isActive = activeVideoId === i;
                      return (
                      <button 
                        key={i}
                        onClick={() => setActiveVideoId(i)}
                        className={`w-full p-3 rounded-xl flex gap-4 text-left transition-all ${isActive ? 'bg-slate-800 border border-cyan-500/30 shadow-lg' : 'hover:bg-slate-800/50 border border-transparent'}`}
                      >
                         {/* Video Thumbnail Visual */}
                         <div className="w-24 h-16 bg-slate-950 rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-800 relative overflow-hidden">
                            <div className="absolute inset-0 p-2 opacity-80">
                                {v.visual(isActive)}
                            </div>
                            {/* Play Icon Overlay */}
                            <div className={`absolute inset-0 flex items-center justify-center ${isActive ? 'bg-black/10' : 'bg-black/30 group-hover:bg-black/10'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm ${isActive ? 'bg-cyan-500 text-white' : 'bg-white/20 text-white'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                         </div>
                         <div>
                            <h5 className={`font-bold text-sm mb-1 line-clamp-1 ${isActive ? 'text-cyan-400' : 'text-white'}`}>{v.title}</h5>
                            <span className="text-xs text-slate-500 block">{v.duration}</span>
                         </div>
                      </button>
                   )})}
                </div>
                <div className="mt-4 p-4 bg-cyan-900/20 rounded-xl border border-cyan-900/50 text-xs text-cyan-400 text-center">
                   More premium guides available in dashboard.
                </div>
             </div>
        </div>
       </div>
    </section>
  );
};

const ArchitectureSection: React.FC<{t: any}> = ({t}) => (
  <section id="architecture" className="py-24 px-4 bg-slate-950 border-t border-slate-900">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('header.sections.architecture')}</h2>
        <p className="text-slate-400">Enterprise-grade stack built for scale, security, and speed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Frontend Portal", desc: "React-based SPA with comprehensive onboarding wizard and visualization dashboard.", icon: "🖥️" },
          { title: "Backend BFF", desc: "Secure API layer handling client configuration, secret management, and proxying.", icon: "🛡️" },
          { title: "ETL Processing", desc: "Automated pipelines with hourly/daily schedules and historical backfill capability.", icon: "⚙️" },
          { title: "Infrastructure (IaC)", desc: "Multi-tenant environment provisioned via Terraform. Scalable and isolated.", icon: "🏗️" },
          { title: "Storage & Analytics", desc: "BigQuery implementation with Raw, Analytics, and Curated data layers.", icon: "🗄️" },
          { title: "Data Contracts", desc: "Strict schema validation, lineage tracking, and automated quality alerts.", icon: "📜" }
        ].map((card, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-all group">
            <div className="text-3xl mb-4 bg-slate-950 w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Authenticated Dashboard Components ---

const Sidebar: React.FC<{ activeTab: DashboardTab; onChangeTab: (t: DashboardTab) => void; onLogout: () => void; version: string; t: any }> = ({ activeTab, onChangeTab, onLogout, version, t }) => (
  <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 h-full border-r border-slate-800">
    {/* Static Logo for Sidebar (Consistent Branding) */}
    <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
      <StaticLogo size="sm" />
    </div>
    
    <nav className="flex-1 p-4 space-y-2">
      {[
        { id: DashboardTab.HOME, label: t('nav.dashboard'), icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
        { id: DashboardTab.INTEGRATIONS, label: t('nav.integrations'), icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' },
        { id: DashboardTab.HEALTH, label: t('nav.health'), icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' }, // Warning icon for Health/SLA
        { id: DashboardTab.REPORTS, label: t('nav.reports'), icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
        { id: DashboardTab.DOCS, label: t('nav.docs'), icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
      ].map(item => (
        <button 
          key={item.id}
          onClick={() => onChangeTab(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
          </svg>
          {item.label}
        </button>
      ))}
    </nav>
    
    <div className="p-4 border-t border-slate-800">
      <button onClick={onLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        {t('nav.logout')}
      </button>
      <div className="text-xs text-slate-600 font-mono">v{version}</div>
    </div>
  </aside>
);

// --- EPIC H: Data Health View ---
const DataHealthView: React.FC<{ user: User | null, t: any }> = ({ user, t }) => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiService.getDataHealth(user.id).then(data => {
        setHealth(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading || !health) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
         <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
       <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">{t('nav.health')} & SLA</h1>
             <p className="text-slate-600 mt-1">Monitor pipeline stability and data contracts.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-2 ${
              health.overallScore > 90 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}>
               <div className={`w-2 h-2 rounded-full ${health.overallScore > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
               {health.pipelineStatus} ({health.overallScore}%)
            </span>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Cards */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">{t('health.freshness')}</h3>
             <div className="text-3xl font-bold text-slate-900">{health.freshness}</div>
             <p className="text-xs text-green-600 mt-1">✓ Within SLA limit</p>
          </div>
          
          {/* Metrics Grid */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">{t('health.sla')}</h3>
             <div className="grid grid-cols-3 gap-4">
                {health.metrics.map((m, i) => (
                   <div key={i} className={`p-3 rounded-lg border ${m.status === 'OK' ? 'bg-slate-50 border-slate-100' : 'bg-yellow-50 border-yellow-100'}`}>
                      <div className="text-xs text-slate-500 mb-1">{m.name}</div>
                      <div className="font-bold text-slate-900">{m.value}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Target: {m.slaThreshold}</div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* Timeline */}
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">{t('health.timeline')}</h3>
          <div className="relative">
             <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-100"></div>
             <div className="space-y-6">
                {health.recentJobs.map((job) => (
                  <div key={job.id} className="relative flex items-center pl-8">
                     <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                       job.status === 'SUCCESS' ? 'bg-green-500' : job.status === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'
                     }`}></div>
                     <div className="flex-1 flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div>
                           <div className="font-medium text-slate-900 text-sm">{job.name}</div>
                           <div className="text-xs text-slate-500">{job.timestamp}</div>
                        </div>
                        <div className="text-right">
                           <div className={`text-xs font-bold ${job.status === 'SUCCESS' ? 'text-green-600' : job.status === 'WARNING' ? 'text-yellow-600' : 'text-red-600'}`}>
                             {job.status}
                           </div>
                           <div className="text-xs text-slate-400 font-mono">{job.duration}</div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* AI Recommendations */}
       <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100">
          <div className="flex items-center gap-2 mb-4">
             <BrandMark size={20} className="opacity-70" />
             <h3 className="font-bold text-cyan-900">{t('health.recommendations')}</h3>
          </div>
          <ul className="space-y-2">
             {health.aiRecommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-cyan-800">
                   <span className="text-cyan-500">●</span>
                   {rec}
                </li>
             ))}
          </ul>
       </div>
    </div>
  );
};

const ReportsView: React.FC<{t: any}> = ({t}) => (
  <div className="p-8 animate-in fade-in duration-300 h-full flex flex-col">
    <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t('nav.reports')}</h2>
        <p className="text-slate-600">Interactive white-label reporting studio.</p>
      </div>
      <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 shadow-sm flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export PDF
      </button>
    </div>
    
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex gap-4 flex-wrap items-center">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded border border-slate-200 text-sm text-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span>Last 30 Days</span>
      </div>
      <div className="h-6 w-px bg-slate-200"></div>
      <select className="bg-transparent border-none text-slate-700 text-sm font-medium focus:ring-0 cursor-pointer">
        <option>All Channels</option>
        <option>Shopify</option>
        <option>Amazon</option>
      </select>
    </div>

    <div className="flex-1 bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-4 right-4 opacity-20"><BrandMark size={24}/></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50">
          <div className="w-full max-w-2xl aspect-video bg-white rounded-xl border border-slate-200 shadow-lg p-8 flex flex-col">
             <div className="flex justify-between mb-8">
               <div className="h-6 w-32 bg-slate-100 rounded"></div>
               <div className="h-6 w-6 bg-slate-100 rounded-full"></div>
             </div>
             <div className="flex gap-4 mb-8">
               <div className="h-24 flex-1 bg-blue-50 rounded-lg border border-blue-100"></div>
               <div className="h-24 flex-1 bg-green-50 rounded-lg border border-green-100"></div>
               <div className="h-24 flex-1 bg-purple-50 rounded-lg border border-purple-100"></div>
             </div>
             <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 flex items-end justify-around p-4 gap-2">
                {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                  <div key={i} className="w-full bg-slate-200 rounded-t" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </div>
          <p className="mt-6 text-slate-500 font-medium">Generating Interactive Report Canvas...</p>
          <p className="text-slate-400 text-sm">Securely connecting to your private dataset.</p>
        </div>
    </div>
  </div>
);

const DashboardContent: React.FC<{ user: User | null, t: any }> = ({ user, t }) => {
  const [aiResult, setAiResult] = useState<AnalyzerResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const data = await apiService.getDashboardMetrics(user.id);
        setKpiData(data);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [user]);
  
  const handleRunAi = async () => {
    if (!kpiData) return;
    setLoadingAi(true);
    
    const metrics = {
      revenue: kpiData.revenue.value,
      sessions: kpiData.sessions.value,
      orders: kpiData.orders.value,
      etlAvgTime: kpiData.etlPerformance.avgDuration
    };
    
    const result = await getDashboardInsights(metrics);
    setAiResult(result);
    setLoadingAi(false);
  };

  if (loadingData || !kpiData) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-slate-500">{t('dash.loading')}</p>
        </div>
      </div>
    );
  }

  const historyLength = kpiData.revenue.history.length;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, historyLength);
  
  const revChartData = kpiData.revenue.history.map((val, i) => ({
    name: days[i], val
  }));

  const mixedChartData = kpiData.sessions.history.map((val, i) => ({
    name: days[i], 
    sessions: val, 
    orders: kpiData.orders.history[i]
  }));

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('nav.dashboard')}</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {t('dash.live')}
          </span>
          <button 
            onClick={handleRunAi}
            disabled={loadingAi}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-70"
          >
            {loadingAi ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                 <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 11.03a.75.75 0 111.06 1.06l-1.06-1.06zm0 0a.75.75 0 101.06 1.06l-1.06-1.06z" clipRule="evenodd" />
              </svg>
            )}
            {t('dash.ai_btn')}
          </button>
        </div>
      </div>

      {/* Row 1: System Core + AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 text-white flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10"></div>
           <div className="scale-75 mb-4 relative z-10">
             <BrandMark size={64} />
           </div>
           <h3 className="text-xl font-bold z-10">{t('dash.neural_core')}</h3>
           <p className="text-slate-400 text-sm mt-2 z-10">Active & Monitoring</p>
           <div className="mt-4 flex gap-2 z-10">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75"></div>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
           </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col relative">
           {!aiResult ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-50">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                <p>Click 'AI Insights' to analyze current metrics</p>
             </div>
           ) : (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-lg font-bold text-slate-900">Gemini Analysis</h3>
                     <p className="text-sm text-slate-600">{aiResult.summary}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      aiResult.sentiment === 'Positive' ? 'bg-green-100 text-green-700 border-green-200' : 
                      aiResult.sentiment === 'Negative' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {aiResult.sentiment}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Key Insights</h4>
                      <ul className="space-y-1">
                         {aiResult.insights.map((item, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-cyan-500">•</span> {item}
                            </li>
                         ))}
                      </ul>
                   </div>
                   <div className="space-y-3">
                      <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                         <h4 className="text-xs font-bold text-cyan-700 uppercase mb-1">Recommendation</h4>
                         <p className="text-sm text-cyan-900">{aiResult.recommendation || 'Maintain current strategy.'}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="text-slate-400">Confidence</span>
                         <div className="w-24 bg-slate-100 rounded-full h-1.5">
                            <div className="bg-slate-800 h-1.5 rounded-full" style={{width: `${aiResult.confidence}%`}}></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Row 2: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('dash.kpi.revenue'), val: `$${kpiData.revenue.value.toLocaleString()}`, trend: `+${kpiData.revenue.trend}%`, icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: t('dash.kpi.sessions'), val: kpiData.sessions.value.toLocaleString(), trend: `+${kpiData.sessions.trend}%`, icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" },
          { label: t('dash.kpi.orders'), val: kpiData.orders.value.toLocaleString(), trend: `+${kpiData.orders.trend}%`, icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                   </svg>
                </div>
                <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">{stat.trend}</span>
             </div>
             <div className="text-slate-500 text-sm mb-1">{stat.label}</div>
             <div className="text-2xl font-bold text-slate-900">{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Row 3: Business Charts - BRAND COLORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Revenue Trend (7 Days)</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revChartData}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                     <YAxis stroke="#94a3b8" fontSize={12} />
                     <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     <Area type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Traffic vs Orders</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mixedChartData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                     <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                     <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                     <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     <Legend />
                     <Bar yAxisId="left" dataKey="sessions" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                     <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Row 4: Technical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-900">ETL Job Performance</h3>
               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Avg: {kpiData.etlPerformance.avgDuration}s</span>
            </div>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpiData.etlPerformance.history}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                     <YAxis stroke="#94a3b8" fontSize={12} />
                     <Tooltip contentStyle={{backgroundColor: '#fff'}} />
                     <Line type="stepAfter" dataKey="dur" stroke="#64748b" strokeWidth={2} dot={false} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-900">Data Quality (Rows)</h3>
               <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{kpiData.dataQuality.healthyPct}% Healthy</span>
            </div>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpiData.dataQuality.history} stackOffset="sign">
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                     <YAxis stroke="#94a3b8" fontSize={12} />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{backgroundColor: '#fff'}} />
                     <Bar dataKey="success" stackId="a" fill="#22c55e" />
                     <Bar dataKey="failed" stackId="a" fill="#ef4444" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<{ user?: User | null; onLogout: () => void; langHook: any }> = ({ user, onLogout, langHook }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.HOME);
  const version = "1.5.0";

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden relative">
      <Sidebar 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        onLogout={onLogout} 
        version={version}
        t={langHook.t}
      />
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
         {activeTab === DashboardTab.HOME && <DashboardContent user={user || null} t={langHook.t} />}
         {activeTab === DashboardTab.HEALTH && <DataHealthView user={user || null} t={langHook.t} />}
         {activeTab === DashboardTab.REPORTS && <ReportsView t={langHook.t} />}
         {activeTab === DashboardTab.INTEGRATIONS && (
            <div className="p-8 flex flex-col items-center justify-center h-full text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                <p>Integrations Manager is coming soon.</p>
            </div>
         )}
         {activeTab === DashboardTab.DOCS && (
            <div className="p-8 flex flex-col items-center justify-center h-full text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <p>Documentation is under maintenance.</p>
            </div>
         )}
      </main>
      
      {/* Global Chatbot for Dashboard */}
      <div className="fixed bottom-8 right-8 z-50">
          <ChatBot />
      </div>
    </div>
  );
};

const AuthView: React.FC<{ 
  view: ViewState; 
  onChangeView: (v: ViewState) => void; 
  onSuccess: (email: string) => void;
  t: any;
}> = ({ view, onChangeView, onSuccess, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  
  // Registration specific state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaState, setCaptchaState] = useState(false); // Mock

  const commonFreeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'wp.pl', 'onet.pl', 'interia.pl', 'o2.pl', 'vp.pl', 'tlen.pl'];

  const isWorkEmail = (e: string) => {
    if (!e || !e.includes('@')) return true; // Basic check, full regex later
    const domain = e.split('@')[1];
    return domain && !commonFreeDomains.includes(domain.toLowerCase());
  };

  const isStrongPassword = (p: string) => {
    // Min 12 chars, Uppercase, Digit, Special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/;
    return regex.test(p);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (view === ViewState.AUTH_REGISTER) {
      if (!companyName || !email || !password) {
        setError('All fields are required.');
        return;
      }
      if (!isWorkEmail(email)) {
        setError(t('auth.email_error_free'));
        return;
      }
      if (!isStrongPassword(password)) {
        setError(t('auth.password_req'));
        return;
      }
      if (!termsAccepted) {
        setError('Please accept Terms & Privacy Policy.');
        return;
      }
      if (!captchaState) {
         setError('Please verify CAPTCHA.');
         return;
      }
      onChangeView(ViewState.AUTH_LOGIN);
    } else if (view === ViewState.AUTH_LOGIN) {
      if (!email || !password) {
        setError('Please enter email and password.');
        return;
      }
      onChangeView(ViewState.AUTH_2FA);
    } else if (view === ViewState.AUTH_2FA) {
      if (code === '123456' || code.length === 6) {
        onSuccess(email || 'demo@papadata.com');
      } else {
        setError('Invalid 2FA code. Try 123456.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-4">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-40"></div>
        </div>

        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 z-10 animate-in zoom-in-95 duration-300 relative">
           <button 
             onClick={() => onChangeView(ViewState.LANDING)}
             className="absolute top-5 right-6 text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800/50"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>

           <div className="flex justify-center mb-6">
             <StaticLogo size="lg" />
           </div>

           <h2 className="text-2xl font-bold text-white text-center mb-2">
             {view === ViewState.AUTH_REGISTER && t('auth.join')}
             {view === ViewState.AUTH_LOGIN && t('auth.welcome')}
             {view === ViewState.AUTH_2FA && t('auth.2fa_title')}
           </h2>
           <p className="text-center text-slate-400 mb-6 text-sm">
             {view === ViewState.AUTH_REGISTER && t('auth.subtitle')}
             {view === ViewState.AUTH_2FA && t('auth.2fa_desc')}
           </p>

           {/* SSO Buttons (Only Register/Login) */}
           {view !== ViewState.AUTH_2FA && (
               <div className="space-y-3 mb-6">
                   <button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium py-2.5 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm">
                       <svg className="w-5 h-5" viewBox="0 0 24 24">
                           <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                           <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                           <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                           <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                       </svg>
                       {t('auth.sso_google')}
                   </button>
                   <button className="w-full bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] font-medium py-2.5 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm border border-slate-700">
                       <svg className="w-5 h-5" viewBox="0 0 21 21" fill="currentColor">
                           <path fill="#F25022" d="M1 1h9v9H1z" /><path fill="#00A4EF" d="M1 11h9v9H1z" /><path fill="#7FBA00" d="M11 1h9v9h-9z" /><path fill="#FFB900" d="M11 11h9v9h-9z" />
                       </svg>
                       {t('auth.sso_microsoft')}
                   </button>
                   <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900/80 px-2 text-slate-500">Or manually</span></div>
                   </div>
               </div>
           )}
           
           {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-xs text-center font-medium">{error}</div>}

           <form onSubmit={handleSubmit} className="space-y-4">
             {view === ViewState.AUTH_REGISTER && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('auth.company')}</label>
                    <input 
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-500 mt-1 ml-1">{t('auth.tenant_hint')}</p>
                  </div>
                </>
             )}

             {view !== ViewState.AUTH_2FA && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('auth.email')}</label>
                    <input 
                        type="email" 
                        required
                        placeholder={t('auth.email_hint')}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all ${
                           email && !isWorkEmail(email) ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500'
                        }`}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('auth.password')}</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-white">
                           {showPassword ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                           ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                           )}
                        </button>
                    </div>
                    {view === ViewState.AUTH_REGISTER && (
                        <div className="mt-2">
                           <div className="flex gap-1 h-1 mb-1">
                              <div className={`flex-1 rounded-full ${password.length > 0 ? (password.length < 8 ? 'bg-red-500' : 'bg-yellow-500') : 'bg-slate-800'}`}></div>
                              <div className={`flex-1 rounded-full ${password.length >= 8 ? 'bg-yellow-500' : 'bg-slate-800'}`}></div>
                              <div className={`flex-1 rounded-full ${isStrongPassword(password) ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                           </div>
                           <p className="text-[10px] text-slate-500">{t('auth.password_req')}</p>
                        </div>
                    )}
                  </div>
                </>
             )}

             {view === ViewState.AUTH_REGISTER && (
                 <div className="space-y-3 pt-2">
                     <label className="flex items-start gap-3 cursor-pointer group">
                         <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors ${termsAccepted ? 'bg-cyan-600 border-cyan-600' : 'bg-slate-950 border-slate-700 group-hover:border-slate-500'}`}>
                             <input type="checkbox" className="hidden" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                             {termsAccepted && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>}
                         </div>
                         <span className="text-xs text-slate-400 leading-relaxed select-none">{t('auth.terms')}</span>
                     </label>
                     
                     <label className="flex items-start gap-3 cursor-pointer group">
                         <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors ${marketingAccepted ? 'bg-cyan-600 border-cyan-600' : 'bg-slate-950 border-slate-700 group-hover:border-slate-500'}`}>
                             <input type="checkbox" className="hidden" checked={marketingAccepted} onChange={e => setMarketingAccepted(e.target.checked)} />
                             {marketingAccepted && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>}
                         </div>
                         <span className="text-xs text-slate-400 leading-relaxed select-none">{t('auth.marketing')}</span>
                     </label>

                     {/* Fake Captcha */}
                     <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-slate-600 transition-colors" onClick={() => setCaptchaState(true)}>
                         <div className={`w-6 h-6 rounded border flex items-center justify-center ${captchaState ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}>
                            {captchaState && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>}
                         </div>
                         <span className="text-xs text-slate-300 font-medium">{t('auth.captcha')}</span>
                         <div className="ml-auto">
                            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                            </div>
                         </div>
                     </div>
                 </div>
             )}

             {view === ViewState.AUTH_2FA && (
                 <div>
                    <input 
                      type="text" 
                      placeholder="123456"
                      autoFocus
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                    />
                 </div>
             )}

             <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-900/20 hover:scale-[1.02] mt-2">
               {view === ViewState.AUTH_REGISTER && t('auth.create_btn')}
               {view === ViewState.AUTH_LOGIN && t('auth.signin_btn')}
               {view === ViewState.AUTH_2FA && t('auth.verify_btn')}
             </button>
           </form>

           <div className="mt-6 text-center pt-4 border-t border-slate-800">
             {view === ViewState.AUTH_LOGIN && (
                <div className="flex flex-col gap-2">
                    <button onClick={() => onChangeView(ViewState.AUTH_REGISTER)} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {t('auth.no_account')}
                    </button>
                    <button className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">
                    {t('auth.invite_link')}
                    </button>
                </div>
             )}
             {view === ViewState.AUTH_REGISTER && (
                <button onClick={() => onChangeView(ViewState.AUTH_LOGIN)} className="text-sm text-slate-400 hover:text-white transition-colors">
                  {t('auth.have_account')}
                </button>
             )}
             {view === ViewState.AUTH_2FA && (
                <button onClick={() => onChangeView(ViewState.AUTH_LOGIN)} className="text-sm text-slate-400 hover:text-white transition-colors">
                  {t('auth.back')}
                </button>
             )}
             <div className="mt-4">
                <button onClick={() => onChangeView(ViewState.LANDING)} className="text-[10px] uppercase tracking-wider text-slate-600 hover:text-cyan-500 transition-colors font-bold">
                   PapaData Home
                </button>
             </div>
           </div>
        </div>
    </div>
  );
}

// --- Onboarding Wizard (Updated with Validation & Drafts) ---

const OnboardingWizard: React.FC<{ onComplete: (data: OnboardingData) => void; userEmail: string }> = ({ onComplete, userEmail }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);
  const [provisioningSteps, setProvisioningSteps] = useState<ProvisioningStep[]>([]);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [validationLogs, setValidationLogs] = useState<Record<string, string[]>>({});
  
  // Inline Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const { t } = useLanguage();
  
  const [data, setData] = useState<OnboardingData>(() => {
    const savedDraft = localStorage.getItem(`draft_${userEmail}`);
    if (savedDraft) return JSON.parse(savedDraft);

    return {
      companyName: '',
      clientId: `CL-${Math.floor(Math.random()*10000)}`,
      timezone: 'UTC',
      currency: 'USD',
      retentionDays: 365,
      consents: false,
      technicalEmail: '',
      integrations: [],
      secrets: {},
      connectionStatuses: {},
      etlSchedule: { frequency: 'daily', window: 'rolling_30', backfill: false }
    };
  });

  const handleSaveDraft = () => {
    localStorage.setItem(`draft_${userEmail}`, JSON.stringify(data));
    alert(t('wiz.save_draft') + ' OK!');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel the configuration? All unsaved progress will be lost.')) {
        localStorage.removeItem(`draft_${userEmail}`);
        window.location.reload(); // Reset to initial state (or redirect)
    }
  };

  const validateField = (field: string, value: any) => {
    let errMsg = '';
    if (field === 'companyName') {
      if (!value || value.trim().length < 3) errMsg = 'Company Name must be at least 3 characters.';
    }
    if (field === 'technicalEmail') {
      if (!value) errMsg = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errMsg = 'Please enter a valid email address.';
    }
    
    setFieldErrors(prev => ({ ...prev, [field]: errMsg }));
  };
  
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'companyName') validateField('companyName', data.companyName);
    if (field === 'technicalEmail') validateField('technicalEmail', data.technicalEmail);
  };

  const validateStep = (currentStep: number): boolean => {
    setError('');
    switch(currentStep) {
      case 1:
        if (data.companyName.length < 3) {
          setError('Company Name must be at least 3 characters.');
          return false;
        }
        if (!data.technicalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.technicalEmail)) {
             setError('Invalid Technical Contact Email.');
             return false;
        }
        if (!data.consents) {
          setError('You must agree to data processing terms.');
          return false;
        }
        return true;
      case 2:
        if (data.integrations.length === 0) {
          setError('Please select at least one integration.');
          return false;
        }
        return true;
      case 3:
        // Ensure all selected integrations have CONNECTION status as CONNECTED
        const notConnected = data.integrations.some(i => data.connectionStatuses[i] !== ConnectionStatus.CONNECTED);
        if (notConnected) {
          setError('Please successfully connect all selected integrations before proceeding.');
          return false;
        }
        return true; 
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(5, s + 1));
    }
  };
  
  const isStep1Valid = 
      data.companyName.length >= 3 && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.technicalEmail) && 
      data.consents;

  const handleIntegrationToggle = (type: IntegrationType) => {
    setData(prev => {
      const exists = prev.integrations.includes(type);
      return {
        ...prev,
        integrations: exists ? prev.integrations.filter(i => i !== type) : [...prev.integrations, type]
      };
    });
  };

  const addLog = (type: string, msg: string) => {
    setValidationLogs(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), msg]
    }));
  };

  const handleTestConnection = async (type: IntegrationType) => {
    const secrets = data.secrets[type];
    if (!secrets || !secrets['apiKey']) {
       alert("Please enter an API Key first.");
       return;
    }

    // Reset logs
    setValidationLogs(prev => ({ ...prev, [type]: [] }));

    setData(prev => ({
      ...prev,
      connectionStatuses: { ...prev.connectionStatuses, [type]: ConnectionStatus.PENDING }
    }));

    addLog(type, "> Initializing handshake...");
    await new Promise(r => setTimeout(r, 500));

    addLog(type, "> Verifying credential format...");
    if (secrets['apiKey'].length < 8) {
        addLog(type, "> Error: Invalid key format (too short).");
        addLog(type, "> Connection failed.");
        setData(prev => ({
          ...prev,
          connectionStatuses: { ...prev.connectionStatuses, [type]: ConnectionStatus.ERROR } 
        }));
        return;
    }
    await new Promise(r => setTimeout(r, 500));

    addLog(type, "> Encrypting secret...");
    await new Promise(r => setTimeout(r, 400));

    addLog(type, "> Pinging API endpoint...");
    const success = await apiService.validateIntegration(type, secrets);

    if (success) {
        addLog(type, "> 200 OK. Response received.");
        addLog(type, "> Connection successful.");
        setData(prev => ({
          ...prev,
          connectionStatuses: { ...prev.connectionStatuses, [type]: ConnectionStatus.CONNECTED }
        }));
    } else {
        addLog(type, "> 401 Unauthorized. Check permissions.");
        addLog(type, "> Connection failed.");
        setData(prev => ({
          ...prev,
          connectionStatuses: { ...prev.connectionStatuses, [type]: ConnectionStatus.ERROR }
        }));
    }
  };

  const handleUpdateSecret = (type: IntegrationType, key: string, val: string) => {
    setData(prev => ({
      ...prev,
      secrets: { 
        ...prev.secrets, 
        [type]: { ...(prev.secrets[type] || {}), [key]: val } 
      }
    }));
  };

  const handleActivate = async () => {
    setActivating(true);
    localStorage.removeItem(`draft_${userEmail}`);
    
    const generator = apiService.provisionClient(data.companyName);
    for await (const steps of generator) {
      setProvisioningSteps(steps);
    }

    setTimeout(() => {
      onComplete(data);
    }, 1000);
  };

  const totalSteps = 5;
  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  if (activating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-8">
         <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{t('wiz.provisioning')}</h2>
                <p className="text-slate-400 text-sm">{t('wiz.prov_desc')}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {provisioningSteps.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    s.status === 'completed' ? 'bg-green-500 border-green-500' :
                    s.status === 'running' ? 'border-cyan-500 text-cyan-500' : 'border-slate-700 text-slate-700'
                  }`}>
                    {s.status === 'completed' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {s.status === 'running' && <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>}
                  </div>
                  <span className={`text-sm ${
                     s.status === 'completed' ? 'text-white' :
                     s.status === 'running' ? 'text-cyan-400 font-medium' : 'text-slate-500'
                  }`}>{s.label}</span>
                </div>
              ))}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
             {/* Use StaticLogo for consistent branding in Wizard header */}
             <StaticLogo size="sm" />
             <div className="h-6 w-px bg-slate-700"></div>
             <h1 className="text-white font-bold text-xl">{t('wiz.title')}</h1>
          </div>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white text-sm underline">{t('wiz.cancel')}</button>
        </div>

        {/* Visual Progress Indicator */}
        <div className="flex justify-between mb-12 relative max-w-3xl mx-auto">
            {/* Background Track */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
            
            {/* Active Progress Track */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 -z-10 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>

            {[1, 2, 3, 4, 5].map(i => {
               const isCompleted = step > i;
               const isActive = step === i;
               
               return (
                <div key={i} className={`relative flex flex-col items-center group`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-[3px] transition-all duration-300 z-10 ${
                        isActive 
                            ? 'bg-slate-900 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110' 
                            : isCompleted 
                                ? 'bg-cyan-900/20 border-cyan-600 text-cyan-500' 
                                : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}>
                        {isCompleted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        ) : (
                            <span>{i}</span>
                        )}
                    </div>
                    <span className={`absolute -bottom-8 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                        isActive ? 'text-cyan-400' : isCompleted ? 'text-cyan-600/70' : 'text-slate-600'
                    }`}>
                      {[t('wiz.step1'), t('wiz.step2'), t('wiz.step3'), t('wiz.step4'), t('wiz.step5')][i-1]}
                    </span>
                </div>
               );
            })}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl min-h-[450px] relative">
            {error && (
               <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm shadow-lg animate-bounce z-10">
                 ⚠️ {error}
               </div>
            )}

            {/* Step Counter Indicator */}
            <div className="absolute top-8 right-8">
                <div className="text-sm font-medium text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Step <span className="text-cyan-400">{step}</span> of {totalSteps}
                </div>
            </div>

            {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-2xl font-bold text-white">{t('wiz.step1')}</h2>
                    <p className="text-slate-400 text-sm mt-1">Configure primary organization settings and compliance rules.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Organization */}
                    <div className="space-y-4">
                         <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2">Organization Details</h3>
                         <div>
                            <label className="block text-slate-400 text-xs mb-1.5">Company Name <span className="text-red-400">*</span></label>
                            <input 
                                value={data.companyName} 
                                onChange={e => {
                                    setData({...data, companyName: e.target.value});
                                    validateField('companyName', e.target.value);
                                }} 
                                onBlur={() => handleBlur('companyName')}
                                className={`w-full bg-slate-950 border p-2.5 rounded-lg text-white outline-none text-sm ${
                                    touched.companyName && fieldErrors.companyName ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500'
                                }`}
                                placeholder="Acme Corp" 
                            />
                            {touched.companyName && fieldErrors.companyName && (
                                <p className="text-xs text-red-400 mt-1">{fieldErrors.companyName}</p>
                            )}
                         </div>
                         <div>
                            <label className="block text-slate-400 text-xs mb-1.5">Client Slug (Auto)</label>
                            <div className="relative">
                                <input 
                                    value={data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')} 
                                    disabled 
                                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-500 font-mono text-xs" 
                                />
                                <span className="absolute right-3 top-2.5 text-slate-600 text-[10px]">READONLY</span>
                            </div>
                         </div>
                         <div>
                            <label className="block text-slate-400 text-xs mb-1.5">Client ID</label>
                            <div className="flex gap-2">
                                <input value={data.clientId} disabled className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-500 font-mono text-xs" />
                                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg border border-slate-700" title="Regenerate">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                                </button>
                            </div>
                         </div>
                    </div>

                    {/* Middle Col: Compliance & Data */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2">Data & Compliance</h3>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-slate-400 text-xs mb-1.5">Country</label>
                                <select className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-sm outline-none">
                                    <option>United States</option>
                                    <option>Poland</option>
                                    <option>Germany</option>
                                    <option>France</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-slate-400 text-xs mb-1.5">Currency</label>
                                <select value={data.currency} onChange={e => setData({...data, currency: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-sm outline-none">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                             </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1.5">Data Residency</label>
                            <select className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-sm outline-none">
                                <option>Europe (Frankfurt)</option>
                                <option>US East (N. Virginia)</option>
                            </select>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                             <label className="flex items-center justify-between cursor-pointer group">
                                 <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Enable Pseudonymization</span>
                                 <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                     <input type="checkbox" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-slate-600 border-4 appearance-none cursor-pointer"/>
                                     <label className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-900 cursor-pointer border border-slate-700"></label>
                                 </div>
                             </label>
                             <p className="text-[10px] text-slate-500 mt-1">Masks PII (Names, Emails) in analytics views.</p>
                        </div>
                    </div>

                    {/* Right Col: Legal */}
                    <div className="space-y-4">
                         <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2">Legal</h3>
                         <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={data.consents} onChange={e => setData({...data, consents: e.target.checked})} className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0" />
                                <span className="text-xs text-slate-400 leading-tight">
                                    I accept the <span className="text-cyan-400 underline">Data Processing Agreement (DPA)</span> and Terms of Service.
                                </span>
                             </label>
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0" />
                                <span className="text-xs text-slate-400 leading-tight">
                                    I allow PapaData support team to access logs for troubleshooting.
                                </span>
                             </label>
                         </div>
                         
                         <div className="pt-2">
                             <label className="block text-slate-400 text-xs mb-1.5">Technical Contact Email <span className="text-red-400">*</span></label>
                             <input 
                                 value={data.technicalEmail} 
                                 onChange={e => {
                                     setData({...data, technicalEmail: e.target.value});
                                     validateField('technicalEmail', e.target.value);
                                 }}
                                 onBlur={() => handleBlur('technicalEmail')}
                                 className={`w-full bg-slate-950 border p-2.5 rounded-lg text-white outline-none text-sm ${
                                     touched.technicalEmail && fieldErrors.technicalEmail ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500'
                                 }`}
                                 placeholder="admin@company.com" 
                             />
                             {touched.technicalEmail && fieldErrors.technicalEmail && (
                                <p className="text-xs text-red-400 mt-1">{fieldErrors.technicalEmail}</p>
                             )}
                         </div>
                    </div>
                </div>
            </div>
            )}

            {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-white">{t('wiz.step2')}</h2>
                <p className="text-slate-400 text-sm">Choose your data sources. You will configure access in the next step.</p>
                
                {[IntegrationCategory.STORE, IntegrationCategory.MARKETING, IntegrationCategory.MARKETPLACE].map(cat => (
                   <div key={cat} className="mb-6">
                      <h3 className="text-slate-500 text-xs font-bold uppercase mb-3">{cat}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.values(IntegrationType).filter(t => IntegrationMeta[t].category === cat).map(type => (
                            <div 
                            key={type}
                            onClick={() => handleIntegrationToggle(type)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${data.integrations.includes(type) ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                            >
                                <span className="text-2xl">{IntegrationMeta[type].icon}</span>
                                <span className="font-medium text-white text-sm">{type}</span>
                                {data.integrations.includes(type) && <div className="w-2 h-2 bg-cyan-400 rounded-full ml-auto"></div>}
                            </div>
                        ))}
                      </div>
                   </div>
                ))}
            </div>
            )}

            {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-white">{t('wiz.step3')}</h2>
                <p className="text-slate-400 text-sm">Enter credentials. We only store encrypted references.</p>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {data.integrations.map((integration, idx) => {
                    const status = data.connectionStatuses[integration];
                    const logs = validationLogs[integration] || [];

                    return (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span>{IntegrationMeta[integration].icon}</span>
                                <h4 className="font-bold text-white">{integration}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                {status === ConnectionStatus.CONNECTED && <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-800">Connected</span>}
                                {status === ConnectionStatus.ERROR && <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded border border-red-800">Failed</span>}
                                {(!status || status === ConnectionStatus.PENDING) && <span className="text-xs bg-slate-800 text-slate-500 px-2 py-1 rounded">Not Connected</span>}
                            </div>
                        </div>
                        
                        {status === ConnectionStatus.CONNECTED ? (
                             <div className="text-sm text-green-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                Credentials verified & saved securely.
                             </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">API Key / Client ID</label>
                                    <div className="relative">
                                        <input 
                                            type={visibleSecrets[integration] ? "text" : "password"} 
                                            value={data.secrets[integration]?.['apiKey'] || ''}
                                            onChange={e => handleUpdateSecret(integration, 'apiKey', e.target.value)}
                                            placeholder="Enter key..." 
                                            className="w-full bg-slate-900 border border-slate-800 p-2 pr-10 rounded text-white text-sm focus:border-cyan-500 outline-none font-mono" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setVisibleSecrets(prev => ({...prev, [integration]: !prev[integration]}))}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors p-1"
                                        >
                                            {visibleSecrets[integration] ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                                                    <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => handleTestConnection(integration)}
                                        disabled={status === ConnectionStatus.PENDING}
                                        className={`w-full py-3 text-sm rounded transition-all font-bold flex justify-center items-center gap-2 ${
                                            status === ConnectionStatus.PENDING 
                                                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                                                : 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        }`}
                                    >
                                        {status === ConnectionStatus.PENDING ? (
                                            <>
                                            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            Testing...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                                </svg>
                                                Test Connection
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Mini Console Log */}
                                {logs.length > 0 && (
                                    <div className="bg-black p-3 rounded border border-slate-800 font-mono text-xs text-slate-400 space-y-1 shadow-inner">
                                        {logs.map((log, i) => (
                                            <div key={i} className="animate-in fade-in slide-in-from-top-1 duration-200">
                                                {log}
                                            </div>
                                        ))}
                                        {status === ConnectionStatus.PENDING && (
                                            <div className="animate-pulse">_</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    );
                })}
                </div>
            </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl font-bold text-white">{t('wiz.step4')}</h2>
                    <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
                        <div>
                            <label className="block text-slate-400 mb-2">Update Frequency</label>
                            <div className="flex gap-2">
                                {['hourly', 'daily', 'weekly'].map(freq => (
                                    <button 
                                        key={freq}
                                        onClick={() => setData({...data, etlSchedule: {...data.etlSchedule, frequency: freq as any}})}
                                        className={`px-4 py-2 rounded-lg text-sm capitalize ${data.etlSchedule.frequency === freq ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2">Data Window</label>
                             <div className="flex gap-2">
                                <button 
                                    onClick={() => setData({...data, etlSchedule: {...data.etlSchedule, window: 'rolling_30'}})}
                                    className={`px-4 py-2 rounded-lg text-sm ${data.etlSchedule.window === 'rolling_30' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                                >
                                    Rolling 30 Days
                                </button>
                                <button 
                                    onClick={() => setData({...data, etlSchedule: {...data.etlSchedule, window: 'all_time'}})}
                                    className={`px-4 py-2 rounded-lg text-sm ${data.etlSchedule.window === 'all_time' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                                >
                                    All Time (Historical)
                                </button>
                             </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2">Historical Backfill</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                                <input type="checkbox" checked={data.etlSchedule.backfill} onChange={e => setData({...data, etlSchedule: {...data.etlSchedule, backfill: e.target.checked}})} className="w-5 h-5 text-cyan-500" />
                                <span className="text-white text-sm">Perform deep historical backfill (Required for year-over-year analysis)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{t('wiz.step5')}</h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                        We will provision a dedicated data environment for <strong>{data.companyName}</strong>, connect {data.integrations.length} sources, and initialize the PapaBot AI model.
                    </p>
                    
                    <div className="max-w-sm mx-auto bg-slate-950 rounded-lg p-4 text-left text-sm border border-slate-800">
                      <div className="flex justify-between text-slate-500 mb-1"><span>Sources:</span> <span className="text-white">{data.integrations.length}</span></div>
                      <div className="flex justify-between text-slate-500 mb-1"><span>Schedule:</span> <span className="text-white capitalize">{data.etlSchedule.frequency}</span></div>
                      <div className="flex justify-between text-slate-500"><span>Backfill:</span> <span className="text-white">{data.etlSchedule.backfill ? 'Yes' : 'No'}</span></div>
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-between mt-8">
            <button 
                onClick={() => setStep(s => Math.max(1, s - 1))} 
                className={`px-6 py-3 rounded-lg font-medium text-slate-400 hover:text-white transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
                {t('wiz.back')}
            </button>
            
            {step < 5 ? (
                <button 
                    onClick={handleNext}
                    disabled={step === 1 && !isStep1Valid}
                    className={`px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20 ${
                        step === 1 && !isStep1Valid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {t('wiz.next')}
                </button>
            ) : (
                <button 
                    onClick={handleActivate}
                    className="px-10 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/25 transform hover:scale-105"
                >
                    {t('wiz.activate')}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  
  // Initialize Language Hook (Epic I)
  const langHook = useLanguage();

  useEffect(() => {
    const session = localStorage.getItem('pd_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      if (userData.hasCompletedOnboarding) {
        setView(ViewState.DASHBOARD);
      } else {
        setView(ViewState.ONBOARDING);
      }
    }
  }, []);

  useEffect(() => {
    if (view === ViewState.LANDING) {
      const timer = setTimeout(() => {
        setShowPromo(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowPromo(false);
    }
  }, [view]);

  const handleLoginSuccess = (email: string) => {
    const newUser = { id: '1', email, role: UserRole.CLIENT, hasCompletedOnboarding: false };
    
    const isOnboarded = localStorage.getItem(`onboarded_${email}`);
    if (isOnboarded) newUser.hasCompletedOnboarding = true;

    setUser(newUser);
    localStorage.setItem('pd_session', JSON.stringify(newUser)); 
    
    if (newUser.hasCompletedOnboarding) {
        setView(ViewState.DASHBOARD);
    } else {
        setView(ViewState.ONBOARDING);
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      localStorage.setItem('pd_session', JSON.stringify(updatedUser));
      localStorage.setItem(`onboarded_${user.email}`, 'true');
    }
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('pd_session');
    setUser(null);
    setView(ViewState.LANDING);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (view === ViewState.LANDING) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 relative">
        <LandingHeader 
          onLogin={() => setView(ViewState.AUTH_LOGIN)} 
          onRegister={() => setView(ViewState.AUTH_REGISTER)}
          scrollToSection={scrollToSection}
          langHook={langHook}
        />
        <main>
          <HeroSection onStart={() => scrollToSection('generator')} t={langHook.t} />
          <VideoSection t={langHook.t} />
          <ArchitectureSection t={langHook.t} />
        </main>
        {showPromo && <PromoPopup onClose={() => setShowPromo(false)} t={langHook.t} />}
        <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900 flex flex-col items-center gap-4">
           <StaticLogo size="sm" />
          <span>&copy; 2025 PapaData Inc. {langHook.t('footer.rights')}</span>
        </footer>
        {/* Global Chatbot */}
        <div className="fixed bottom-8 right-8 z-50">
            <ChatBot />
        </div>
      </div>
    );
  }

  if (view === ViewState.AUTH_LOGIN || view === ViewState.AUTH_REGISTER || view === ViewState.AUTH_2FA) {
    return (
      <AuthView 
        view={view} 
        onChangeView={setView} 
        onSuccess={handleLoginSuccess}
        t={langHook.t} 
      />
    );
  }

  if (view === ViewState.ONBOARDING) {
    return (
       <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          userEmail={user?.email || 'demo'} 
       />
    );
  }

  return (
    <DashboardLayout 
        user={user} 
        onLogout={handleLogout}
        langHook={langHook}
    />
  );
};

export default App;