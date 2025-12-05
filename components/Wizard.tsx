
import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, KeyRound, Lock, Shield, Zap, X } from "lucide-react";
import { IntegrationItem, Language, IntegrationHealthInfo } from "../types";

type Step = 0 | 1 | 2 | 3;

type IntegrationCard = IntegrationItem & {
  description: { PL: string; EN: string };
  longName: string;
  type: "oauth" | "apikey";
};

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  navigate: (p: string) => void;
}

const Wizard: React.FC<Props> = ({ lang, setLang, navigate }) => {
  const [step, setStep] = useState<Step>(0);
  const [showLegal, setShowLegal] = useState(false);
  const [legalText, setLegalText] = useState("");
  const [company, setCompany] = useState({
    nip: "",
    name: "",
    address: "",
    industry: "",
    currency: "PLN",
    timezone: "Europe/Warsaw",
    email: "",
  });
  const [nipStatus, setNipStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [notifications, setNotifications] = useState({ ops: false, marketing: false, legal: false });
  const [selected, setSelected] = useState<string[]>([]);
  const [prefillNote, setPrefillNote] = useState<string | null>(null);
  const [oauthStatus, setOauthStatus] = useState<Record<string, "idle" | "testing" | "healthy" | "error">>({});
  const [apiTests, setApiTests] = useState<Record<string, "idle" | "testing" | "healthy" | "error">>({});
  const [connectionHealth, setConnectionHealth] = useState<Record<string, IntegrationHealthInfo>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [progress, setProgress] = useState(0);
  const t = useMemo(
    () => ({
      steps: lang === "PL" ? ["Dane firmy", "Integracje", "Klucze i dostep", "Podsumowanie i start"] : ["Company details", "Integrations", "Keys & access", "Summary & launch"],
      labels: {
        close: lang === "PL" ? "Zamknij" : "Close",
        back: lang === "PL" ? "Wstecz" : "Back",
        next: lang === "PL" ? "Dalej" : "Next",
        activate: lang === "PL" ? "Aktywuj platforme" : "Activate platform",
      },
      contact: {
        label: lang === "PL" ? "E-mail do kontaktu i powiadomien" : "Contact & notifications email",
        desc: lang === "PL"
          ? "Na ten adres wyslemy podsumowanie konfiguracji, alerty integracji i przypomnienia o koncu triala."
          : "We will send setup summary, integration alerts and trial reminders here.",
        notify: lang === "PL"
          ? "Chce otrzymywac powiadomienia o stanie integracji i okresie probnym."
          : "I want to receive notifications about integration status and trial period.",
        marketing: lang === "PL"
          ? "Chce otrzymywac materialy edukacyjne i oferty."
          : "I want to receive educational tips and offers.",
      },
      nip: {
        title: lang === "PL" ? "Dane Twojej firmy" : "Your company details",
        desc: lang === "PL"
          ? "Na podstawie NIP uzupelnimy dane firmy i stworzymy izolowane srodowisko w Google Cloud."
          : "With your tax ID we prefill company data and create an isolated Google Cloud workspace.",
        fields: {
          nip: lang === "PL" ? "NIP firmy" : "Company tax ID (NIP)",
          nipHint: lang === "PL" ? "Wpisz NIP bez spacji i kresek." : "Enter tax ID without spaces.",
          name: lang === "PL" ? "Nazwa firmy" : "Company name",
          address: lang === "PL" ? "Adres firmy" : "Company address",
          industry: lang === "PL" ? "Branza" : "Industry",
          currency: lang === "PL" ? "Waluta raportowania" : "Reporting currency",
          timezone: lang === "PL" ? "Strefa czasowa" : "Time zone",
        },
        checking: lang === "PL" ? "Sprawdzam dane w rejestrze GUS..." : "Checking registry...",
        ok: lang === "PL" ? "Dane pobrane automatycznie. Mozesz je edytowac." : "Data fetched automatically. You can edit.",
        error: lang === "PL" ? "Nie udalo sie pobrac danych. Sprawdz NIP." : "Could not fetch company data. Check tax ID.",
      },
      security: {
        title: lang === "PL" ? "Bezpieczenstwo Twoich danych" : "Your data security",
        bullets: lang === "PL"
          ? ["Dane i konfiguracja w Google Cloud (region europe-central2).", "Klucze API szyfrujemy i trzymamy w Secret Managerze.", "Nie udostepniamy ich innym klientom."]
          : ["Data & config stored in Google Cloud (europe-central2).", "API keys encrypted in Secret Manager.", "Never shared with other customers."],
        legal: lang === "PL" ? "Akceptuje Regulamin i Polityke Prywatnosci." : "I accept Terms of Service and Privacy Policy.",
      },
      integrations: {
        title: lang === "PL" ? "Wybierz systemy, ktore chcesz podlaczyc" : "Select the systems you want to connect",
        desc: lang === "PL" ? "Okresl zrodla danych. Mozesz zmienic je pozniej." : "Choose data sources. You can adjust later.",
        prefill: lang === "PL" ? "Na podstawie Cennika zaznaczylismy: " : "From pricing we preselected: ",
        info: lang === "PL" ? "Minimum jeden sklep + dowolne zrodla reklamowe." : "At least one store plus any ad sources.",
      },
      keys: {
        title: lang === "PL" ? "Polacz swoje konta i dodaj klucze" : "Connect your accounts and add keys",
        desc: lang === "PL" ? "Loginy sluza tylko do pobierania danych do Twojej hurtowni." : "Login data is only used to pull data into your warehouse.",
        oauth: lang === "PL" ? "Logowanie przez dostawce (OAuth)" : "Sign in with provider (OAuth)",
        api: lang === "PL" ? "Klucze API i adresy" : "API keys and endpoints",
        connect: lang === "PL" ? "Zaloguj" : "Sign in",
        test: lang === "PL" ? "Testuj polaczenie" : "Test connection",
        testing: lang === "PL" ? "Sprawdzam polaczenie..." : "Testing connection...",
        ok: lang === "PL" ? "Polaczenie poprawne" : "Connection OK",
        error: lang === "PL" ? "Nie udalo sie polaczyc" : "Connection failed",
        errorDetail:
          lang === "PL"
            ? "Nie udało się połączyć. Sprawdź dane lub spróbuj ponownie za chwilę."
            : "Connection could not be established. Check the credentials or try again in a moment.",
        vaultTitle: lang === "PL" ? "Jak przetwarzamy Twoje klucze" : "How we process your keys",
        vaultBullets: lang === "PL"
          ? ["Szyfrujemy (AES-256)", "Przechowujemy w Google Secret Manager", "Uzywamy tylko do pobierania danych"]
          : ["Encrypted (AES-256)", "Stored in Google Secret Manager", "Used only to ingest your data"],
      },
      summary: {
        title: lang === "PL" ? "Podsumowanie konfiguracji" : "Configuration summary",
        desc: lang === "PL" ? "Sprawdz dane przed startem. Przygotujemy srodowisko po kliknieciu." : "Review before launch. We will provision after you proceed.",
        company: lang === "PL" ? "Dane firmy" : "Company data",
        integrations: lang === "PL" ? "Wybrane integracje" : "Selected integrations",
        pricing: lang === "PL" ? "Plan cenowy" : "Pricing",
        c1: lang === "PL" ? "Potwierdzam prawo do zarzadzania tymi kontami." : "I confirm I can manage these accounts.",
        c2: lang === "PL" ? "Rozumiem, ze PapaData utworzy projekt w Google Cloud w moim imieniu." : "I understand PapaData will create a Google Cloud project on my behalf.",
      },
      terminal: {
        title: lang === "PL" ? "Tworzymy Twoja instancje PapaData" : "We're creating your PapaData workspace",
        done: lang === "PL" ? "Gotowe! Przechodzimy do pulpitu." : "All set! Redirecting to your dashboard.",
      },
    }),
    [lang]
  );
  const integrations: IntegrationCard[] = useMemo(() => {
    const base: IntegrationCard[] = [
      {
        id: "woocommerce",
        code: "Woo",
        name: "WooCommerce",
        category: "Store",
        status: "Available",
        votes: 0,
        longName: "WooCommerce",
        type: "apikey",
        description: { PL: "Sklep WordPress. Zamowienia, produkty, klienci.", EN: "WordPress store. Orders, products, customers." },
      },
      { id: "shopify", code: "Sh", name: "Shopify", category: "Store", status: "Available", votes: 0, longName: "Shopify", type: "apikey", description: { PL: "Import zamowien, produktow i klientow.", EN: "Import orders, products and customers." } },
      { id: "idosell", code: "Ido", name: "IdoSell", category: "Store", status: "Available", votes: 0, longName: "IdoSell", type: "apikey", description: { PL: "Synchronizacja katalogu i zamowien.", EN: "Sync catalog and orders." } },
      { id: "google_ads", code: "GAds", name: "Google Ads", category: "Marketing", status: "Available", votes: 0, longName: "Google Ads", type: "oauth", description: { PL: "Kampanie, koszty, konwersje.", EN: "Campaigns, spend, conversions." } },
      { id: "ga4", code: "GA4", name: "Google Analytics 4", category: "Analytics", status: "Available", votes: 0, longName: "Google Analytics 4", type: "oauth", description: { PL: "Sesje i zdarzenia.", EN: "Sessions and events." } },
      { id: "meta_ads", code: "Meta", name: "Meta Ads", category: "Marketing", status: "Available", votes: 0, longName: "Meta Ads", type: "oauth", description: { PL: "Kampanie Meta i wyniki.", EN: "Meta campaigns and results." } },
      { id: "tiktok_ads", code: "TT", name: "TikTok Ads", category: "Marketing", status: "Available", votes: 0, longName: "TikTok Ads", type: "oauth", description: { PL: "Kampanie TikTok.", EN: "TikTok campaigns." } },
      { id: "allegro", code: "All", name: "Allegro", category: "Marketplace", status: "Available", votes: 0, longName: "Allegro", type: "apikey", description: { PL: "Zamowienia i oferty Allegro.", EN: "Allegro orders and listings." } },
      { id: "baselinker", code: "BL", name: "BaseLinker", category: "Tool", status: "Available", votes: 0, longName: "BaseLinker", type: "apikey", description: { PL: "Sprzedaz wielokanalowa.", EN: "Multichannel sales." } },
    ];
    return base;
  }, []);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sources = params.get("sources");
      if (sources) {
        const ids = sources.split(",").map((s) => s.trim());
        setSelected(ids);
        const pre = ids
          .map((id) => integrations.find((i) => i.id === id)?.longName)
          .filter(Boolean)
          .join(", ");
        if (pre) setPrefillNote(pre);
      }
    } catch {}
  }, [integrations]);

  const toggleIntegration = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleNipBlur = () => {
    if (!company.nip || company.nip.replace(/\D/g, "").length < 10) {
      setNipStatus("error");
      return;
    }
    setNipStatus("checking");
    setTimeout(() => {
      setCompany((prev) => ({
        ...prev,
        name: prev.name || (lang === "PL" ? "Moja Firma Sp. z o.o." : "My Company LLC"),
        address: prev.address || (lang === "PL" ? "ul. Przykladowa 1, 00-000 Warszawa" : "Example Street 1, Warsaw"),
      }));
      setNipStatus("ok");
    }, 800);
  };

  const nextStep = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const prevStep = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));
  const handleNextStep = () => {
    if (step === 2) {
      if (!healthyStoreSelected || !healthyMarketingSelected) {
        setValidationError(
          lang === "PL"
            ? "Wybierz przynajmniej jeden sklep i jedno źródło reklamowe oraz upewnij się, że ich testy połączeń są poprawne."
            : "Select at least one store and one marketing source, and make sure their connection tests succeed.",
        );
        return;
      }
    }
    setValidationError(null);
    nextStep();
  };

  const persistIntegrationStates = () => {
    const snapshot = selectedIntegrations.map((integration) => {
      const health = connectionHealth[integration.id];
      return {
        id: integration.id,
        longName: integration.longName,
        state: health?.state ?? "healthy",
        message: health?.message,
        errorCode: health?.errorCode,
        updatedAt: health?.updatedAt ?? new Date().toISOString(),
      };
    });
    const marketingIndex = snapshot.findIndex((entry) => {
      const integration = integrations.find((i) => i.id === entry.id);
      return integration?.category === "Marketing" && entry.state === "healthy";
    });
    if (marketingIndex >= 0) {
      const reauthHint =
        lang === "PL"
          ? "Tokeny wygasły. Odśwież połączenia w sekcji Integracje."
          : "Tokens expired. Refresh connections in Integrations.";
      snapshot[marketingIndex] = {
        ...snapshot[marketingIndex],
        state: "needs_reauth",
        message: reauthHint,
        updatedAt: new Date().toISOString(),
      };
    }
    window.localStorage.setItem("papadata_integration_health", JSON.stringify(snapshot));
  };

  const startProvisioning = () => {
    setShowTerminal(true);
    let val = 0;
    const timer = setInterval(() => {
      val = Math.min(100, val + Math.random() * 20 + 10);
      setProgress(val);
      if (val >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          persistIntegrationStates();
          navigate("/dashboard");
        }, 1200);
      }
    }, 700);
  };

  const selectedIntegrations = integrations.filter((i) => selected.includes(i.id));
  const oauthIntegrations = selectedIntegrations.filter((i) => i.type === "oauth");
  const apiIntegrations = selectedIntegrations.filter((i) => i.type === "apikey");
  const healthyStoreSelected = useMemo(
    () =>
      selectedIntegrations.some(
        (integration) =>
          (integration.category === "Store" || integration.category === "Marketplace") &&
          connectionHealth[integration.id]?.state === "healthy",
      ),
    [selectedIntegrations, connectionHealth],
  );
  const healthyMarketingSelected = useMemo(
    () =>
      selectedIntegrations.some(
        (integration) =>
          integration.category === "Marketing" && connectionHealth[integration.id]?.state === "healthy",
      ),
    [selectedIntegrations, connectionHealth],
  );
  const markIntegrationHealth = (
    id: string,
    state: IntegrationHealthInfo["state"],
    message?: string,
    errorCode?: string,
  ) => {
    setConnectionHealth((prev) => ({
      ...prev,
      [id]: {
        state,
        message,
        errorCode,
        updatedAt: new Date().toISOString(),
      },
    }));
  };
  const runApiTest = (integrationId: string) => {
    setApiTests((prev) => ({ ...prev, [integrationId]: "testing" }));
    setTimeout(() => {
      const success = Math.random() > 0.25;
      if (success) {
        setApiTests((prev) => ({ ...prev, [integrationId]: "healthy" }));
        markIntegrationHealth(integrationId, "healthy");
      } else {
        const errorCode = Math.random() > 0.5 ? "INVALID_CREDENTIALS" : "INVALID_TOKEN";
        setApiTests((prev) => ({ ...prev, [integrationId]: "error" }));
        markIntegrationHealth(
          integrationId,
          "error",
          `${t.keys.errorDetail} (${errorCode})`,
          errorCode,
        );
      }
    }, 1100);
  };
  const runOauthTest = (integrationId: string) => {
    setOauthStatus((prev) => ({ ...prev, [integrationId]: "testing" }));
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setOauthStatus((prev) => ({ ...prev, [integrationId]: "healthy" }));
        markIntegrationHealth(integrationId, "healthy");
      } else {
        const errorCode = Math.random() > 0.5 ? "INVALID_GRANT" : "EXPIRED_TOKEN";
        setOauthStatus((prev) => ({ ...prev, [integrationId]: "error" }));
        markIntegrationHealth(
          integrationId,
          "error",
          `${t.keys.errorDetail} (${errorCode})`,
          errorCode,
        );
      }
    }, 900);
  };

  const card = "bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-lg";
  const renderStepper = () => (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {t.steps.map((label, idx) => {
        const current = idx === step;
        const done = idx < step;
        return (
          <div key={label} className="flex items-center gap-2 text-sm">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                done ? "bg-primary-600 text-white border-primary-600" : current ? "border-primary-500 text-primary-500" : "border-slate-300 text-slate-400"
              }`}
            >
              {done ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`whitespace-nowrap ${current ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500"}`}>
              {label}
            </span>
            {idx < t.steps.length - 1 && <div className="w-8 h-px bg-slate-200 dark:bg-slate-700" />}
          </div>
        );
      })}
    </div>
  );

  const renderActions = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
      <div className="flex gap-2">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium"
        >
          {t.labels.close}
        </button>
        {step > 0 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> {t.labels.back}
          </button>
        )}
      </div>
      {step < 3 ? (
        <button
          onClick={handleNextStep}
          className="px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center gap-2 shadow-primary-500/30 shadow-lg"
        >
          {t.labels.next} <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={startProvisioning}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-emerald-500/30 shadow-lg"
        >
          <Zap className="w-4 h-4" /> {t.labels.activate}
        </button>
      )}
      {validationError && (
        <p className="mt-2 text-xs text-rose-500">{validationError}</p>
      )}
    </div>
  );
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className={`${card} p-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.nip.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{t.nip.desc}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex items-center gap-1 text-xs">
            <button
              onClick={() => setLang("PL")}
              className={`px-3 py-1 rounded-full ${lang === "PL" ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500"}`}
            >
              PL
            </button>
            <button
              onClick={() => setLang("EN")}
              className={`px-3 py-1 rounded-full ${lang === "EN" ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500"}`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.nip.fields.nip}</label>
            <input
              value={company.nip}
              onChange={(e) => setCompany({ ...company, nip: e.target.value })}
              onBlur={handleNipBlur}
              placeholder={t.nip.fields.nipHint}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {nipStatus !== "idle" && (
              <p
                className={`text-xs ${
                  nipStatus === "checking"
                    ? "text-amber-500"
                    : nipStatus === "ok"
                      ? "text-emerald-500"
                      : "text-rose-500"
                }`}
              >
                {nipStatus === "checking" ? t.nip.checking : nipStatus === "ok" ? t.nip.ok : t.nip.error}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.nip.fields.name}</label>
            <input
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.nip.fields.address}</label>
            <textarea
              rows={2}
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.nip.fields.industry}</label>
            <select
              value={company.industry}
              onChange={(e) => setCompany({ ...company, industry: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">{lang === "PL" ? "Wybierz..." : "Select..."}</option>
              <option value="ecom">E-commerce</option>
              <option value="omni">Omnichannel</option>
              <option value="b2b">B2B</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.nip.fields.currency}</label>
            <select
              value={company.currency}
              onChange={(e) => setCompany({ ...company, currency: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.nip.fields.timezone}</label>
            <select
              value={company.timezone}
              onChange={(e) => setCompany({ ...company, timezone: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="Europe/Warsaw">Europe/Warsaw</option>
              <option value="Europe/Berlin">Europe/Berlin</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.contact.label}</label>
            <input
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              placeholder={lang === "PL" ? "np. dane@twojafirma.pl" : "e.g. data@yourcompany.com"}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <p className="text-xs text-slate-500">{t.contact.desc}</p>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={notifications.ops}
                  onChange={(e) => setNotifications({ ...notifications, ops: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                {t.contact.notify}
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                {t.contact.marketing}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.security.title}</h3>
        </div>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 mb-3">
          {t.security.bullets.map((b) => (
            <li key={b}>- {b}</li>
          ))}
          <li className="flex flex-wrap gap-3 text-primary-500">
            {[lang === "PL" ? "Polityka Prywatnosci" : "Privacy", lang === "PL" ? "Regulamin" : "Terms", lang === "PL" ? "Przetwarzanie danych" : "Data processing"].map((lbl) => (
              <button
                key={lbl}
                type="button"
                onClick={() => {
                  setLegalText(lbl);
                  setShowLegal(true);
                }}
                className="hover:underline"
              >
                {lbl}
              </button>
            ))}
          </li>
        </ul>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={notifications.legal}
            onChange={(e) => setNotifications({ ...notifications, legal: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          {t.security.legal}
        </label>
      </div>
    </div>
  );
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className={`${card} p-6`}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.integrations.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.integrations.desc}</p>
        {prefillNote && (
          <div className="mt-3 text-xs text-primary-600 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg px-3 py-2">
            {t.integrations.prefill}
            {prefillNote}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => {
          const active = selected.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleIntegration(item.id)}
              className={`${card} text-left p-5 hover:-translate-y-1 hover:shadow-xl transition-all ${
                active ? "border-primary-400 ring-2 ring-primary-400/40" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                    {item.code}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.longName}</h3>
                    <p className="text-xs text-slate-500 uppercase">{item.category}</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    active ? "bg-primary-600 border-primary-600 text-white" : "border-slate-300 text-transparent"
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{item.description[lang]}</p>
              <div className="mt-3 text-xs text-slate-500">{lang === "PL" ? "Status: Dostepne" : "Status: Available"}</div>
            </button>
          );
        })}
      </div>

      <div className={`${card} p-4 text-sm text-slate-600 dark:text-slate-300`}>{t.integrations.info}</div>
    </div>
  );
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className={`${card} p-6`}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.keys.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.keys.desc}</p>
      </div>

      <div className={`${card} p-5 space-y-3`}>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">{t.keys.oauth}</h3>
        </div>
        {oauthIntegrations.length === 0 && (
          <p className="text-sm text-slate-500">{lang === "PL" ? "Wybierz integracje w kroku 2." : "Select integrations in step 2."}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {oauthIntegrations.map((integration) => {
            const status = oauthStatus[integration.id] || "idle";
            const health = connectionHealth[integration.id];
            const isError = health?.state === "error";
            const cardClass = `rounded-xl border ${isError ? "border-rose-500 bg-rose-50/40" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-900/80 p-4`;
            const detailText = health?.message || (status === "error" ? t.keys.errorDetail : undefined);
            return (
              <div key={integration.id} className={cardClass}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{integration.longName}</h4>
                    <p className="text-xs text-slate-500">{integration.description[lang]}</p>
                  </div>
                  {status === "healthy" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => runOauthTest(integration.id)}
                    disabled={status === "testing"}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-60"
                  >
                    {t.keys.connect}
                  </button>
                  <button
                    onClick={() => runOauthTest(integration.id)}
                    disabled={status === "testing"}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
                  >
                    {status === "testing" ? t.keys.testing : status === "healthy" ? t.keys.ok : t.keys.test}
                  </button>
                </div>
                {status === "healthy" && (
                  <p className="text-xs text-emerald-500 mt-2">
                    {lang === "PL" ? "Połączono. Token zapisany w magazynie." : "Connected. Token stored in vault."}
                  </p>
                )}
                {status === "error" && detailText && (
                  <p className="text-xs text-rose-500 mt-2">
                    {detailText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${card} p-5 space-y-3`}>
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">{t.keys.api}</h3>
        </div>
        {apiIntegrations.length === 0 && (
          <p className="text-sm text-slate-500">{lang === "PL" ? "Wybierz integracje sklepowe." : "Select store/marketplace integrations."}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apiIntegrations.map((integration) => {
            const status = apiTests[integration.id] || "idle";
            const testing = status === "testing";
            const health = connectionHealth[integration.id];
            const isError = health?.state === "error";
            const detailText = health?.message || (status === "error" ? t.keys.errorDetail : undefined);
            const cardClass = `rounded-xl border ${isError ? "border-rose-500 bg-rose-50/40" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-900/80 p-4 space-y-2`;
            return (
              <div key={integration.id} className={cardClass}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{integration.longName}</h4>
                    <p className="text-xs text-slate-500">{integration.description[lang]}</p>
                  </div>
                  {status === "healthy" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                </div>
                <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white" placeholder={lang === "PL" ? "Adres sklepu (URL)" : "Store URL"} />
                <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white" placeholder={lang === "PL" ? "Klucz / Token" : "API Key / Token"} />
                <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white" placeholder="Secret" />
                <p className="text-xs text-slate-500">{lang === "PL" ? "Klucze szyfrowane w Google Cloud." : "Keys encrypted in Google Cloud."}</p>
                <button
                  onClick={() => runApiTest(integration.id)}
                  disabled={testing}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
                >
                  {testing ? t.keys.testing : status === "healthy" ? t.keys.ok : status === "error" ? t.keys.error : t.keys.test}
                </button>
                {status === "error" && detailText && (
                  <p className="text-xs text-rose-500">{detailText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${card} p-5`}>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{t.keys.vaultTitle}</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
          {t.keys.vaultBullets.map((b) => (
            <li key={b}>- {b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className={`${card} p-6`}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.summary.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.summary.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${card} p-5`}>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{t.summary.company}</h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>{company.name || "-"}</li>
            <li>{company.nip || (lang === "PL" ? "NIP nieuzupelniony" : "Tax ID missing")}</li>
            <li>{company.address || (lang === "PL" ? "Adres nieuzupelniony" : "Address missing")}</li>
            <li>{(lang === "PL" ? "Waluta: " : "Currency: ") + company.currency}</li>
            <li>{(lang === "PL" ? "Strefa czasowa: " : "Time zone: ") + company.timezone}</li>
          </ul>
        </div>

        <div className={`${card} p-5`}>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{t.summary.integrations}</h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            {selectedIntegrations.length === 0 && <li>{lang === "PL" ? "Brak" : "None"}</li>}
            {selectedIntegrations.map((i) => (
              <li key={i.id} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> {i.longName}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${card} p-5`}>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{t.summary.pricing}</h4>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>{lang === "PL" ? "Plan: Standard" : "Plan: Standard"}</li>
            <li>{lang === "PL" ? "Zrodla danych: 3" : "Data sources: 3"}</li>
            <li>{lang === "PL" ? "Szacowana cena: 240 PLN / mies." : "Estimated: 240 PLN / mo."}</li>
          </ul>
        </div>
      </div>

      <div className={`${card} p-5 space-y-2`}>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
          {t.summary.c1}
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
          {t.summary.c2}
        </label>
      </div>
    </div>
  );
  const renderTerminal = () => (
    <div className="fixed inset-0 z-50 bg-slate-950 text-emerald-400 font-mono p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t.terminal.title}</h2>
          <div className="w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
        <div className="bg-black/60 border border-emerald-500/20 rounded-xl p-4 space-y-2 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div>{"> Inicjalizuje srodowisko klienta:"} {company.name || "mojafirma"}</div>
          <div>{`> Tworze projekt GCP i dataset: ${company.name || "firma"}_raw, curated, analytics (region: europe-central2)... [OK]`}</div>
          {selectedIntegrations.map((i) => {
            const health = connectionHealth[i.id];
            const suffix =
              health?.state === "error"
                ? "ERROR"
                : health?.state === "needs_reauth"
                  ? "REAUTH"
                  : "OK";
            const colorClass =
              health?.state === "error"
                ? "text-rose-300"
                : health?.state === "needs_reauth"
                  ? "text-amber-300"
                  : "text-emerald-300";
            return (
              <div key={i.id} className={`text-sm ${colorClass}`}>
                {`> Konfiguruje integracje: ${i.longName}... [${suffix}]`}
                {health?.state === "error" && (
                  <span className="block text-xs text-rose-200 mt-1">
                    Integracja {i.longName} – {health.message || "Błąd połączenia."} Środowisko utworzone, ale dane nie będą pobierane.
                  </span>
                )}
                {health?.state === "needs_reauth" && (
                  <span className="block text-xs text-amber-200 mt-1">
                    Tokeny wygasły. Odśwież połączenie w sekcji Integracje.
                  </span>
                )}
              </div>
            );
          })}
          <div>{"> Szyfruje klucze w Google Secret Manager... [OK]"}</div>
          <div>{"> Uruchamiam potoki ETL (365 dni danych)... [W TOKU]"}</div>
          <div>{"> Konfiguruje Raporty Live... [OK]"}</div>
          <div>{"> Twoja platforma jest gotowa."}</div>
          {progress >= 100 && <div className="text-emerald-300">{t.terminal.done}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className={`${card} p-8`}>
          {renderStepper()}
          {step === 0 && renderStep1()}
          {step === 1 && renderStep2()}
          {step === 2 && renderStep3()}
          {step === 3 && renderStep4()}
          {renderActions()}
        </div>
      </div>

      {showLegal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLegal(false)}>
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full p-6 rounded-2xl shadow-xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowLegal(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{legalText}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{lang === "PL" ? "Tu wkleimy pelna tresc dokumentu." : "Here we will paste the full document."}</p>
          </div>
        </div>
      )}

      {showTerminal && renderTerminal()}
    </div>
  );
};

export default Wizard;


