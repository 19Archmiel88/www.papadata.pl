import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Lock,
  Shield,
  Zap,
  X,
} from "lucide-react";
import { IntegrationItem, Language, IntegrationHealthInfo } from "../types";
import BrandLogo from "./BrandLogo";

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

const isValidPolishNip = (raw: string): boolean => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 10) return false;
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const d = parseInt(digits[i], 10);
    if (Number.isNaN(d)) return false;
    sum += d * weights[i];
  }
  const control = sum % 11;
  const last = parseInt(digits[9], 10);
  if (control === 10) return false;
  return control === last;
};

type FieldErrors = {
  nip?: string;
  name?: string;
  address?: string;
  email?: string;
  legal?: string;
};

const Wizard: React.FC<Props> = ({ lang, setLang, navigate }) => {
  const [step, setStep] = useState<Step>(0);

  // step 1
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
  const [nipStatus, setNipStatus] =
    useState<"idle" | "checking" | "ok" | "error">("idle");
  const [notifications, setNotifications] = useState({
    ops: false,
    marketing: false,
    legal: false,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // step 2
  const [selected, setSelected] = useState<string[]>([]);
  const [prefillNote, setPrefillNote] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  // step 3
  const [oauthStatus, setOauthStatus] = useState<
    Record<string, "idle" | "testing" | "healthy" | "error">
  >({});
  const [apiTests, setApiTests] = useState<
    Record<string, "idle" | "testing" | "healthy" | "error">
  >({});
  const [connectionHealth, setConnectionHealth] = useState<
    Record<string, IntegrationHealthInfo>
  >({});
  const [integrationValidationError, setIntegrationValidationError] =
    useState<string | null>(null);

  // step 4
  const [summaryChecks, setSummaryChecks] = useState({
    rights: false,
    gcp: false,
  });
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // terminal
  const [showTerminal, setShowTerminal] = useState(false);
  const [progress, setProgress] = useState(0);

  const t = useMemo(
    () => ({
      steps:
        lang === "PL"
          ? ["Dane firmy", "Integracje", "Klucze i dostęp", "Podsumowanie"]
          : ["Company details", "Integrations", "Keys & access", "Summary"],
      labels: {
        close: lang === "PL" ? "Zamknij" : "Close",
        back: lang === "PL" ? "Wstecz" : "Back",
        next: lang === "PL" ? "Dalej" : "Next",
        activate: lang === "PL" ? "Aktywuj platformę" : "Activate platform",
      },
      contact: {
        label:
          lang === "PL"
            ? "E-mail do kontaktu i powiadomień"
            : "Contact & notifications email",
        desc:
          lang === "PL"
            ? "Na ten adres wyślemy podsumowanie konfiguracji, alerty integracji i przypomnienia o końcu okresu próbnego."
            : "We will send setup summary, integration alerts and trial reminders here.",
        notify:
          lang === "PL"
            ? "Chcę otrzymywać powiadomienia o stanie integracji i okresie próbnym."
            : "I want to receive notifications about integration status and trial period.",
        marketing:
          lang === "PL"
            ? "Chcę otrzymywać materiały edukacyjne i oferty."
            : "I want to receive educational tips and offers.",
      },
      nip: {
        title: lang === "PL" ? "Dane Twojej firmy" : "Your company details",
        desc:
          lang === "PL"
            ? "Na podstawie NIP uzupełnimy dane firmy i stworzymy izolowane środowisko w Google Cloud."
            : "With your tax ID we prefill company data and create an isolated Google Cloud workspace.",
        fields: {
          nip: lang === "PL" ? "NIP firmy" : "Company tax ID (NIP)",
          nipHint:
            lang === "PL"
              ? "Wpisz NIP bez spacji i kresek."
              : "Enter tax ID without spaces.",
          name: lang === "PL" ? "Nazwa firmy" : "Company name",
          address: lang === "PL" ? "Adres firmy" : "Company address",
          industry: lang === "PL" ? "Branża" : "Industry",
          currency:
            lang === "PL" ? "Waluta raportowania" : "Reporting currency",
          timezone: lang === "PL" ? "Strefa czasowa" : "Time zone",
        },
        checking:
          lang === "PL"
            ? "Sprawdzam dane w rejestrze GUS..."
            : "Checking registry...",
        ok:
          lang === "PL"
            ? "Dane pobrane automatycznie. Możesz je edytować."
            : "Data fetched automatically. You can edit.",
        error:
          lang === "PL"
            ? "Nie udało się pobrać danych. Sprawdź NIP."
            : "Could not fetch company data. Check tax ID.",
      },
      security: {
        title:
          lang === "PL" ? "Bezpieczeństwo Twoich danych" : "Your data security",
        bullets:
          lang === "PL"
            ? [
                "Dane i konfiguracja w Google Cloud (region europe-central2).",
                "Klucze API szyfrujemy i trzymamy w Secret Managerze.",
                "Nie udostępniamy ich innym klientom.",
              ]
            : [
                "Data & config stored in Google Cloud (europe-central2).",
                "API keys encrypted in Secret Manager.",
                "Never shared with other customers.",
              ],
        legal:
          lang === "PL"
            ? "Akceptuję Regulamin i Politykę Prywatności."
            : "I accept Terms of Service and Privacy Policy.",
      },
      integrations: {
        title:
          lang === "PL"
            ? "Wybierz systemy, które chcesz podłączyć"
            : "Select the systems you want to connect",
        desc:
          lang === "PL"
            ? "Określ źródła danych. Możesz zmienić je później."
            : "Choose data sources. You can adjust later.",
        prefill:
          lang === "PL"
            ? "Na podstawie Cennika zaznaczyliśmy: "
            : "From pricing we preselected: ",
        info:
          lang === "PL"
            ? "Minimum jeden sklep / marketplace + jedno źródło reklamowe."
            : "At least one store/marketplace plus one ad source.",
      },
      keys: {
        title:
          lang === "PL"
            ? "Połącz swoje konta i dodaj klucze"
            : "Connect your accounts and add keys",
        desc:
          lang === "PL"
            ? "Dostępy służą tylko do pobierania danych do Twojej prywatnej hurtowni."
            : "Credentials are used only to pull data into your private warehouse.",
        oauth:
          lang === "PL"
            ? "Reklamy i analityka (logowanie przez dostawcę)"
            : "Ads & analytics (OAuth)",
        api:
          lang === "PL"
            ? "Sklepy i marketplace (klucze API)"
            : "Stores & marketplaces (API keys)",
        connect: lang === "PL" ? "Zaloguj" : "Sign in",
        test: lang === "PL" ? "Testuj połączenie" : "Test connection",
        testing:
          lang === "PL"
            ? "Sprawdzam połączenie..."
            : "Testing connection...",
        ok: lang === "PL" ? "Połączenie poprawne" : "Connection OK",
        error: lang === "PL" ? "Nie udało się połączyć" : "Connection failed",
        errorDetail:
          lang === "PL"
            ? "Nie udało się połączyć. Sprawdź dane lub spróbuj ponownie za chwilę."
            : "Connection could not be established. Check the credentials or try again in a moment.",
        vaultTitle:
          lang === "PL"
            ? "Jak przetwarzamy Twoje klucze"
            : "How we process your keys",
        vaultBullets:
          lang === "PL"
            ? [
                "Szyfrujemy (AES-256)",
                "Przechowujemy w Google Secret Manager",
                "Używamy tylko do pobierania danych",
              ]
            : [
                "Encrypted (AES-256)",
                "Stored in Google Secret Manager",
                "Used only to ingest your data",
              ],
      },
      summary: {
        title:
          lang === "PL"
            ? "Podsumowanie konfiguracji"
            : "Configuration summary",
        desc:
          lang === "PL"
            ? "Sprawdź dane przed startem. Po potwierdzeniu przygotujemy środowisko."
            : "Review before launch. After confirmation we will provision your workspace.",
        company: lang === "PL" ? "Dane firmy" : "Company data",
        integrations: lang === "PL" ? "Wybrane integracje" : "Selected integrations",
        pricing: lang === "PL" ? "Plan cenowy" : "Pricing",
        c1:
          lang === "PL"
            ? "Potwierdzam prawo do zarządzania tymi kontami."
            : "I confirm I can manage these accounts.",
        c2:
          lang === "PL"
            ? "Rozumiem, że PapaData utworzy projekt w Google Cloud w moim imieniu."
            : "I understand PapaData will create a Google Cloud project on my behalf.",
      },
      terminal: {
        title:
          lang === "PL"
            ? "Tworzymy Twoją instancję PapaData"
            : "We're creating your PapaData workspace",
        done:
          lang === "PL"
            ? "Gotowe! Przechodzimy do pulpitu."
            : "All set! Redirecting to your dashboard.",
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
        description: {
          PL: "Sklep WordPress. Zamówienia, produkty, klienci.",
          EN: "WordPress store. Orders, products, customers.",
        },
      },
      {
        id: "shopify",
        code: "Sh",
        name: "Shopify",
        category: "Store",
        status: "Available",
        votes: 0,
        longName: "Shopify",
        type: "apikey",
        description: {
          PL: "Import zamówień, produktów i klientów.",
          EN: "Import orders, products and customers.",
        },
      },
      {
        id: "idosell",
        code: "Ido",
        name: "IdoSell",
        category: "Store",
        status: "Available",
        votes: 0,
        longName: "IdoSell",
        type: "apikey",
        description: {
          PL: "Synchronizacja katalogu i zamówień.",
          EN: "Sync catalog and orders.",
        },
      },
      {
        id: "google_ads",
        code: "GAds",
        name: "Google Ads",
        category: "Marketing",
        status: "Available",
        votes: 0,
        longName: "Google Ads",
        type: "oauth",
        description: {
          PL: "Kampanie, koszty, konwersje.",
          EN: "Campaigns, spend, conversions.",
        },
      },
      {
        id: "ga4",
        code: "GA4",
        name: "Google Analytics 4",
        category: "Analytics",
        status: "Available",
        votes: 0,
        longName: "Google Analytics 4",
        type: "oauth",
        description: { PL: "Sesje i zdarzenia.", EN: "Sessions and events." },
      },
      {
        id: "meta_ads",
        code: "Meta",
        name: "Meta Ads",
        category: "Marketing",
        status: "Available",
        votes: 0,
        longName: "Meta Ads",
        type: "oauth",
        description: {
          PL: "Kampanie Meta i wyniki.",
          EN: "Meta campaigns and results.",
        },
      },
      {
        id: "tiktok_ads",
        code: "TT",
        name: "TikTok Ads",
        category: "Marketing",
        status: "Available",
        votes: 0,
        longName: "TikTok Ads",
        type: "oauth",
        description: { PL: "Kampanie TikTok.", EN: "TikTok campaigns." },
      },
      {
        id: "allegro",
        code: "All",
        name: "Allegro",
        category: "Marketplace",
        status: "Available",
        votes: 0,
        longName: "Allegro",
        type: "apikey",
        description: {
          PL: "Zamówienia i oferty Allegro.",
          EN: "Allegro orders and listings.",
        },
      },
      {
        id: "baselinker",
        code: "BL",
        name: "BaseLinker",
        category: "Tool",
        status: "Available",
        votes: 0,
        longName: "BaseLinker",
        type: "apikey",
        description: {
          PL: "Sprzedaż wielokanałowa.",
          EN: "Multichannel sales.",
        },
      },
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
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setStep2Error(null);
    setIntegrationValidationError(null);
  };

  const handleNipBlur = () => {
    if (!company.nip) return;
    if (!isValidPolishNip(company.nip)) {
      setNipStatus("error");
      setFieldErrors((prev) => ({
        ...prev,
        nip:
          lang === "PL"
            ? "Podaj poprawny NIP (10 cyfr, z poprawną sumą kontrolną)."
            : "Enter a valid Polish tax ID (10 digits, valid checksum).",
      }));
      return;
    }
    setNipStatus("checking");
    setTimeout(() => {
      setCompany((prev) => ({
        ...prev,
        name:
          prev.name ||
          (lang === "PL" ? "Moja Firma Sp. z o.o." : "My Company LLC"),
        address:
          prev.address ||
          (lang === "PL"
            ? "ul. Przykładowa 1, 00-000 Warszawa"
            : "Example Street 1, Warsaw"),
      }));
      setNipStatus("ok");
      setFieldErrors((prev) => ({ ...prev, nip: undefined }));
    }, 500);
  };

  const selectedIntegrations = integrations.filter((i) =>
    selected.includes(i.id)
  );
  const oauthIntegrations = selectedIntegrations.filter(
    (i) => i.type === "oauth"
  );
  const apiIntegrations = selectedIntegrations.filter(
    (i) => i.type === "apikey"
  );

  const healthyStoreSelected = useMemo(
    () =>
      selectedIntegrations.some(
        (integration) =>
          (integration.category === "Store" ||
            integration.category === "Marketplace") &&
          connectionHealth[integration.id]?.state === "healthy"
      ),
    [selectedIntegrations, connectionHealth]
  );

  const healthyMarketingSelected = useMemo(
    () =>
      selectedIntegrations.some(
        (integration) =>
          integration.category === "Marketing" &&
          connectionHealth[integration.id]?.state === "healthy"
      ),
    [selectedIntegrations, connectionHealth]
  );

  const markIntegrationHealth = (
    id: string,
    state: IntegrationHealthInfo["state"],
    message?: string,
    errorCode?: string
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
    setIntegrationValidationError(null);
  };

  const runApiTest = (integrationId: string) => {
    setApiTests((prev) => ({ ...prev, [integrationId]: "testing" }));
    setTimeout(() => {
      const success = Math.random() > 0.25;
      if (success) {
        setApiTests((prev) => ({ ...prev, [integrationId]: "healthy" }));
        markIntegrationHealth(integrationId, "healthy");
      } else {
        const errorCode =
          Math.random() > 0.5 ? "INVALID_CREDENTIALS" : "INVALID_TOKEN";
        setApiTests((prev) => ({ ...prev, [integrationId]: "error" }));
        markIntegrationHealth(
          integrationId,
          "error",
          `${t.keys.errorDetail} (${errorCode})`,
          errorCode
        );
      }
    }, 900);
  };

  const runOauthTest = (integrationId: string) => {
    setOauthStatus((prev) => ({ ...prev, [integrationId]: "testing" }));
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setOauthStatus((prev) => ({ ...prev, [integrationId]: "healthy" }));
        markIntegrationHealth(integrationId, "healthy");
      } else {
        const errorCode =
          Math.random() > 0.5 ? "INVALID_GRANT" : "EXPIRED_TOKEN";
        setOauthStatus((prev) => ({ ...prev, [integrationId]: "error" }));
        markIntegrationHealth(
          integrationId,
          "error",
          `${t.keys.errorDetail} (${errorCode})`,
          errorCode
        );
      }
    }, 800);
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

    window.localStorage.setItem(
      "papadata_integration_health",
      JSON.stringify(snapshot)
    );
  };

  const nextStep = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const prevStep = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const handleNextStep = () => {
    // STEP 0 – dane firmy
    if (step === 0) {
      const nipOk = isValidPolishNip(company.nip);
      const emailOk =
        company.email.includes("@") && company.email.includes(".");

      const newErrors: FieldErrors = {};
      if (!nipOk) {
        newErrors.nip =
          lang === "PL"
            ? "Podaj poprawny NIP (10 cyfr, z poprawną sumą kontrolną)."
            : "Enter a valid Polish tax ID (10 digits, valid checksum).";
      }
      if (!company.name.trim()) {
        newErrors.name =
          lang === "PL"
            ? "Uzupełnij nazwę firmy."
            : "Fill in the company name.";
      }
      if (!company.address.trim()) {
        newErrors.address =
          lang === "PL"
            ? "Uzupełnij adres firmy."
            : "Fill in the company address.";
      }
      if (!emailOk) {
        newErrors.email =
          lang === "PL"
            ? "Podaj poprawny adres e-mail."
            : "Enter a valid email address.";
      }
      if (!notifications.legal) {
        newErrors.legal =
          lang === "PL"
            ? "Aby kontynuować, zaakceptuj Regulamin i Politykę Prywatności."
            : "To continue, accept the Terms and Privacy Policy.";
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        return;
      }
      setFieldErrors({});
    }

    // STEP 1 – integracje: min 1 sklep + 1 reklamy
    if (step === 1) {
      const hasStore = selectedIntegrations.some(
        (i) => i.category === "Store" || i.category === "Marketplace"
      );
      const hasAds = selectedIntegrations.some(
        (i) => i.category === "Marketing"
      );

      if (!hasStore || !hasAds) {
        setStep2Error(
          lang === "PL"
            ? "Aby przejść dalej, wybierz co najmniej jeden sklep / marketplace oraz jedno źródło reklamowe."
            : "Select at least one store/marketplace and one ad source to continue."
        );
        return;
      }
      setStep2Error(null);
    }

    // STEP 2 – testy połączeń
    if (step === 2) {
      if (!healthyStoreSelected || !healthyMarketingSelected) {
        setIntegrationValidationError(
          lang === "PL"
            ? "Przed przejściem dalej przetestuj połączenia: co najmniej jeden sklep/marketplace i jedno źródło reklamowe muszą mieć status „Połączenie poprawne”."
            : "Before you continue, test connections: at least one store/marketplace and one ad source must have a successful connection."
        );
        return;
      }
      setIntegrationValidationError(null);
    }

    nextStep();
  };

  const startProvisioning = () => {
    if (!summaryChecks.rights || !summaryChecks.gcp) {
      setSummaryError(
        lang === "PL"
          ? "Aby aktywować platformę, zaznacz oba pola potwierdzeń."
          : "To activate the platform, tick both confirmation checkboxes."
      );
      return;
    }
    setSummaryError(null);

    setShowTerminal(true);
    let val = 0;
    const timer = setInterval(() => {
      val = Math.min(100, val + Math.random() * 20 + 10);
      setProgress(val);

      if (val >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          persistIntegrationStates();
          try {
            window.localStorage.setItem(
              "papadata_token",
              "onboarding-complete"
            );
          } catch {}
          navigate("/dashboard");
        }, 1000);
      }
    }, 600);
  };

  const outerCard =
    "bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-950/98 border border-slate-800/80 rounded-3xl shadow-[0_30px_120px_rgba(15,23,42,1)]";

  const sectionCard =
    "bg-slate-950/70 border border-slate-800 rounded-2xl shadow-[0_18px_60px_rgba(15,23,42,0.9)]";

  const renderStepper = () => (
    <div className="relative mb-8">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      <div className="relative flex flex-wrap gap-4 justify-between">
        {t.steps.map((label, idx) => {
          const current = idx === step;
          const done = idx < step;
          return (
            <div
              key={label}
              className="flex items-center gap-3 min-w-[120px] flex-1"
            >
              <div className="relative">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border text-sm font-semibold shadow-lg ${
                    done
                      ? "bg-primary-600/90 border-primary-400 text-white"
                      : current
                      ? "bg-slate-900 border-primary-500/60 text-primary-200"
                      : "bg-slate-900/60 border-slate-700 text-slate-500"
                  }`}
                >
                  {done ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                {current && (
                  <div className="absolute -inset-1 rounded-2xl bg-primary-500/20 blur-xl" />
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${
                    current
                      ? "text-primary-200"
                      : done
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  {lang === "PL" ? "Krok" : "Step"} {idx + 1}
                </span>
                <span
                  className={`text-sm ${
                    current
                      ? "text-slate-50"
                      : done
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-5 border-t border-slate-800/80">
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-950/80 text-slate-200 text-sm font-medium hover:border-slate-500 hover:bg-slate-900 transition-colors"
        >
          {t.labels.close}
        </button>
        {step > 0 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-950/80 text-slate-200 text-sm font-medium flex items-center gap-2 hover:border-slate-500 hover:bg-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.labels.back}
          </button>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        {step < 3 ? (
          <button
            onClick={handleNextStep}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-indigo-500 text-white text-sm font-semibold shadow-[0_0_0_1px_rgba(191,219,254,0.25),0_22px_45px_rgba(79,70,229,0.55)] hover:shadow-[0_0_0_1px_rgba(191,219,254,0.4),0_26px_60px_rgba(79,70,229,0.75)] transition-shadow"
          >
            {t.labels.next}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={startProvisioning}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 via-primary-500 to-indigo-500 text-white text-sm font-semibold shadow-[0_0_0_1px_rgba(191,219,254,0.25),0_22px_45px_rgba(79,70,229,0.55)] hover:shadow-[0_0_0_1px_rgba(191,219,254,0.4),0_26px_60px_rgba(79,70,229,0.75)] transition-shadow"
          >
            <Zap className="w-4 h-4" />
            {t.labels.activate}
          </button>
        )}
        {integrationValidationError && step === 2 && (
          <p className="text-xs text-rose-400 max-w-md text-right">
            {integrationValidationError}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className={`${sectionCard} p-6 md:p-7`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-50">
              {t.nip.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">{t.nip.desc}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-900/80 border border-slate-700 px-1.5 py-1 flex items-center text-xs">
              <button
                onClick={() => setLang("PL")}
                className={`px-3 py-1 rounded-full ${
                  lang === "PL"
                    ? "bg-slate-950 text-slate-50 shadow-md"
                    : "text-slate-400"
                }`}
              >
                PL
              </button>
              <button
                onClick={() => setLang("EN")}
                className={`px-3 py-1 rounded-full ${
                  lang === "EN"
                    ? "bg-slate-950 text-slate-50 shadow-md"
                    : "text-slate-400"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              {t.nip.fields.nip}
            </label>
            <input
              value={company.nip}
              onChange={(e) => {
                setCompany({ ...company, nip: e.target.value });
                setFieldErrors((prev) => ({ ...prev, nip: undefined }));
              }}
              onBlur={handleNipBlur}
              placeholder={t.nip.fields.nipHint}
              className={`w-full rounded-xl bg-slate-950/80 border px-3 py-2.5 text-sm text-slate-50 outline-none focus:ring-2 focus:ring-primary-500/70 transition ${
                fieldErrors.nip
                  ? "border-rose-500/80 focus:ring-rose-500/70"
                  : "border-slate-700 focus:border-primary-500"
              }`}
            />
            {fieldErrors.nip && (
              <p className="text-xs text-rose-400">{fieldErrors.nip}</p>
            )}
            {nipStatus !== "idle" && !fieldErrors.nip && (
              <p
                className={`text-xs ${
                  nipStatus === "checking"
                    ? "text-amber-400"
                    : nipStatus === "ok"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {nipStatus === "checking"
                  ? t.nip.checking
                  : nipStatus === "ok"
                  ? t.nip.ok
                  : t.nip.error}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              {t.nip.fields.name}
            </label>
            <input
              value={company.name}
              onChange={(e) => {
                setCompany({ ...company, name: e.target.value });
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full rounded-xl bg-slate-950/80 border px-3 py-2.5 text-sm text-slate-50 outline-none focus:ring-2 focus:ring-primary-500/70 transition ${
                fieldErrors.name
                  ? "border-rose-500/80 focus:ring-rose-500/70"
                  : "border-slate-700 focus:border-primary-500"
              }`}
            />
            {fieldErrors.name && (
              <p className="text-xs text-rose-400">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-slate-300">
              {t.nip.fields.address}
            </label>
            <textarea
              rows={2}
              value={company.address}
              onChange={(e) => {
                setCompany({ ...company, address: e.target.value });
                setFieldErrors((prev) => ({ ...prev, address: undefined }));
              }}
              className={`w-full rounded-xl bg-slate-950/80 border px-3 py-2.5 text-sm text-slate-50 outline-none focus:ring-2 focus:ring-primary-500/70 transition ${
                fieldErrors.address
                  ? "border-rose-500/80 focus:ring-rose-500/70"
                  : "border-slate-700 focus:border-primary-500"
              }`}
            />
            {fieldErrors.address && (
              <p className="text-xs text-rose-400">{fieldErrors.address}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              {t.nip.fields.industry}
            </label>
            <select
              value={company.industry}
              onChange={(e) =>
                setCompany({ ...company, industry: e.target.value })
              }
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2.5 text-sm text-slate-50 outline-none focus:ring-2 focus:ring-primary-500/70"
            >
              <option value="" className="bg-slate-950">
                {lang === "PL" ? "Wybierz..." : "Select..."}
              </option>
              <option value="ecom" className="bg-slate-950">
                E-commerce
              </option>
              <option value="omni" className="bg-slate-950">
                Omnichannel
              </option>
              <option value="b2b" className="bg-slate-950">
                B2B
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              {t.nip.fields.currency}
            </label>
            <input
              value={company.currency}
              disabled
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              {t.nip.fields.timezone}
            </label>
            <input
              value={company.timezone}
              disabled
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-slate-300">
              {t.contact.label}
            </label>
            <input
              value={company.email}
              onChange={(e) => {
                setCompany({ ...company, email: e.target.value });
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder={
                lang === "PL"
                  ? "np. dane@twojafirma.pl"
                  : "e.g. data@yourcompany.com"
              }
              className={`w-full rounded-xl bg-slate-950/80 border px-3 py-2.5 text-sm text-slate-50 outline-none focus:ring-2 focus:ring-primary-500/70 transition ${
                fieldErrors.email
                  ? "border-rose-500/80 focus:ring-rose-500/70"
                  : "border-slate-700 focus:border-primary-500"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-rose-400">{fieldErrors.email}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">{t.contact.desc}</p>

            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={notifications.ops}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      ops: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-slate-500 text-primary-500 focus:ring-primary-500/70"
                />
                {t.contact.notify}
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      marketing: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-slate-500 text-primary-500 focus:ring-primary-500/70"
                />
                {t.contact.marketing}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={`${sectionCard} p-6 md:p-7 flex flex-col gap-3`}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-400" />
          <h3 className="text-sm font-semibold text-slate-50">
            {t.security.title}
          </h3>
        </div>
        <ul className="text-xs text-slate-400 space-y-1">
          {t.security.bullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 mt-2">
          {[
            lang === "PL" ? "Polityka Prywatności" : "Privacy Policy",
            lang === "PL" ? "Regulamin" : "Terms of Service",
            lang === "PL" ? "Przetwarzanie danych" : "Data processing",
          ].map((lbl) => (
            <button
              key={lbl}
              type="button"
              onClick={() => {
                setLegalText(lbl);
                setShowLegal(true);
              }}
              className="text-[11px] text-primary-200 hover:text-primary-100 underline-offset-4 hover:underline"
            >
              {lbl}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <label className="flex items-center gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={notifications.legal}
              onChange={(e) => {
                setNotifications({
                  ...notifications,
                  legal: e.target.checked,
                });
                setFieldErrors((prev) => ({ ...prev, legal: undefined }));
              }}
              className="w-4 h-4 rounded border-slate-500 text-primary-500 focus:ring-primary-500/70"
            />
            {t.security.legal}
          </label>
          {fieldErrors.legal && (
            <p className="text-xs text-rose-400 mt-1">{fieldErrors.legal}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className={`${sectionCard} p-6 md:p-7`}>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
          {t.integrations.title}
        </h2>
        <p className="text-sm text-slate-400">{t.integrations.desc}</p>
        <p className="mt-2 text-xs text-slate-500">{t.integrations.info}</p>
        {prefillNote && (
          <div className="mt-3 text-xs text-primary-200 bg-primary-950/40 border border-primary-700/60 rounded-xl px-3 py-2">
            {t.integrations.prefill}
            {prefillNote}
          </div>
        )}
        {step2Error && (
          <p className="mt-3 text-xs text-rose-400">{step2Error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {integrations.map((item) => {
          const active = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleIntegration(item.id)}
              className={`${sectionCard} text-left p-5 md:p-6 transition-transform duration-200 ${
                active ? "ring-1 ring-primary-500/60" : ""
              } hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-slate-50 shadow-lg">
                      {item.code}
                    </div>
                    {active && (
                      <div className="absolute -inset-1 rounded-2xl bg-primary-500/25 blur-lg" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-50">
                      {item.longName}
                    </h3>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                      {item.category}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    active
                      ? "bg-primary-500 border-primary-400 text-white"
                      : "border-slate-600 text-transparent"
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                </div>
              </div>
              <p className="text-xs text-slate-300">
                {item.description[lang]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className={`${sectionCard} p-6 md:p-7`}>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
          {t.keys.title}
        </h2>
        <p className="text-sm text-slate-400">{t.keys.desc}</p>
      </div>

      <div className={`${sectionCard} p-6 space-y-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary-300" />
            <h3 className="text-sm font-semibold text-slate-50">
              {t.keys.oauth}
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
            OAuth
          </span>
        </div>
        {oauthIntegrations.length === 0 && (
          <p className="text-xs text-slate-500">
            {lang === "PL"
              ? "Najpierw wybierz integracje reklamowe/analityczne w kroku 2."
              : "First select ads/analytics integrations in step 2."}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oauthIntegrations.map((integration) => {
            const status = oauthStatus[integration.id] || "idle";
            const health = connectionHealth[integration.id];
            const detailText =
              health?.message ||
              (status === "error" ? t.keys.errorDetail : undefined);

            const statusLabel =
              status === "testing"
                ? t.keys.testing
                : status === "healthy"
                ? t.keys.ok
                : status === "error"
                ? t.keys.error
                : lang === "PL"
                ? "Niepołączone"
                : "Not connected";

            const statusClass =
              status === "healthy"
                ? "bg-emerald-900/40 text-emerald-300 border-emerald-500/40"
                : status === "error"
                ? "bg-rose-900/40 text-rose-300 border-rose-500/40"
                : "bg-slate-900/60 text-slate-300 border-slate-700";

            return (
              <div
                key={integration.id}
                className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-50">
                      {integration.longName}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {integration.description[lang]}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${statusClass}`}
                  >
                    {status === "healthy" && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {statusLabel}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => runOauthTest(integration.id)}
                    disabled={status === "testing"}
                    className="px-3 py-2 rounded-xl bg-slate-50 text-slate-950 text-xs font-semibold hover:bg-slate-200 disabled:opacity-60"
                  >
                    {t.keys.connect}
                  </button>
                  <button
                    onClick={() => runOauthTest(integration.id)}
                    disabled={status === "testing"}
                    className="px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 hover:bg-slate-900 disabled:opacity-60"
                  >
                    {status === "testing"
                      ? t.keys.testing
                      : status === "healthy"
                      ? t.keys.ok
                      : t.keys.test}
                  </button>
                </div>
                {detailText && (
                  <p className="text-[11px] text-rose-300 mt-1">
                    {detailText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${sectionCard} p-6 space-y-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary-300" />
            <h3 className="text-sm font-semibold text-slate-50">
              {t.keys.api}
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
            API
          </span>
        </div>

        {apiIntegrations.length === 0 && (
          <p className="text-xs text-slate-500">
            {lang === "PL"
              ? "Najpierw wybierz integracje sklepowe/marketplace w kroku 2."
              : "First select store/marketplace integrations in step 2."}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apiIntegrations.map((integration) => {
            const status = apiTests[integration.id] || "idle";
            const testing = status === "testing";
            const health = connectionHealth[integration.id];
            const detailText =
              health?.message ||
              (status === "error" ? t.keys.errorDetail : undefined);

            const statusLabel =
              status === "testing"
                ? t.keys.testing
                : status === "healthy"
                ? t.keys.ok
                : status === "error"
                ? t.keys.error
                : lang === "PL"
                ? "Nieprzetestowane"
                : "Not tested";

            const statusClass =
              status === "healthy"
                ? "bg-emerald-900/40 text-emerald-300 border-emerald-500/40"
                : status === "error"
                ? "bg-rose-900/40 text-rose-300 border-rose-500/40"
                : "bg-slate-900/60 text-slate-300 border-slate-700";

            return (
              <div
                key={integration.id}
                className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-50">
                      {integration.longName}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {integration.description[lang]}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${statusClass}`}
                  >
                    {status === "healthy" && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {statusLabel}
                  </span>
                </div>
                <input
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs text-slate-50"
                  placeholder={
                    lang === "PL" ? "Adres sklepu (URL)" : "Store URL"
                  }
                />
                <input
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs text-slate-50"
                  placeholder={
                    lang === "PL" ? "Klucz / Token" : "API Key / Token"
                  }
                />
                <input
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs text-slate-50"
                  placeholder="Secret"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-400">
                    {lang === "PL"
                      ? "Klucze szyfrowane w Google Cloud."
                      : "Keys encrypted in Google Cloud."}
                  </p>
                  <button
                    onClick={() => runApiTest(integration.id)}
                    disabled={testing}
                    className="px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-50 hover:bg-slate-900 disabled:opacity-60"
                  >
                    {testing
                      ? t.keys.testing
                      : status === "healthy"
                      ? t.keys.ok
                      : status === "error"
                      ? t.keys.error
                      : t.keys.test}
                  </button>
                </div>
                {status === "error" && detailText && (
                  <p className="text-[11px] text-rose-300">{detailText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${sectionCard} p-6`}>
        <h4 className="text-sm font-semibold text-slate-50 mb-2">
          {t.keys.vaultTitle}
        </h4>
        <ul className="text-xs text-slate-400 space-y-1">
          {t.keys.vaultBullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const pricingInfo = useMemo(() => {
    const count = selectedIntegrations.length;
    let plan = lang === "PL" ? "Standard" : "Standard";
    let price = 240;
    if (count > 3 && count <= 6) {
      plan = lang === "PL" ? "Growth" : "Growth";
      price = 390;
    } else if (count > 6) {
      plan = lang === "PL" ? "Scale" : "Scale";
      price = 540;
    }
    return { count, plan, price };
  }, [selectedIntegrations.length, lang]);

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className={`${sectionCard} p-6 md:p-7`}>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
          {t.summary.title}
        </h2>
        <p className="text-sm text-slate-400">{t.summary.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className={`${sectionCard} p-5`}>
          <h4 className="text-sm font-semibold text-slate-50 mb-2">
            {t.summary.company}
          </h4>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>{company.name || "-"}</li>
            <li>
              {company.nip ||
                (lang === "PL" ? "NIP nieuzupełniony" : "Tax ID missing")}
            </li>
            <li>
              {company.address ||
                (lang === "PL" ? "Adres nieuzupełniony" : "Address missing")}
            </li>
            <li>
              {(lang === "PL" ? "Waluta: " : "Currency: ") + company.currency}
            </li>
            <li>
              {(lang === "PL" ? "Strefa czasowa: " : "Time zone: ") +
                company.timezone}
            </li>
          </ul>
        </div>

        <div className={`${sectionCard} p-5`}>
          <h4 className="text-sm font-semibold text-slate-50 mb-2">
            {t.summary.integrations}
          </h4>
          <ul className="text-xs text-slate-300 space-y-1">
            {selectedIntegrations.length === 0 && (
              <li>{lang === "PL" ? "Brak" : "None"}</li>
            )}
            {selectedIntegrations.map((i) => (
              <li key={i.id} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-300" />
                {i.longName}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${sectionCard} p-5`}>
          <h4 className="text-sm font-semibold text-slate-50 mb-2">
            {t.summary.pricing}
          </h4>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              {lang === "PL" ? "Plan: " : "Plan: "}
              <span className="font-semibold text-primary-200">
                {pricingInfo.plan}
              </span>
            </p>
            <p>
              {lang === "PL"
                ? `Źródła danych: ${pricingInfo.count}`
                : `Data sources: ${pricingInfo.count}`}
            </p>
            <p>
              {lang === "PL"
                ? `Szacowana cena: ${pricingInfo.price} PLN / mies.`
                : `Estimated: ${pricingInfo.price} PLN / mo.`}
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              {lang === "PL"
                ? "To orientacyjny koszt na potrzeby on-boardingu. Szczegóły w zakładce Cennik."
                : "Indicative price for onboarding. See Pricing section for details."}
            </p>
          </div>
        </div>
      </div>

      <div className={`${sectionCard} p-5 space-y-2`}>
        <label className="flex items-center gap-2 text-xs text-slate-200">
          <input
            type="checkbox"
            checked={summaryChecks.rights}
            onChange={(e) =>
              setSummaryChecks((prev) => ({ ...prev, rights: e.target.checked }))
            }
            className="w-4 h-4 rounded border-slate-500 text-primary-500 focus:ring-primary-500/70"
          />
          {t.summary.c1}
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-200">
          <input
            type="checkbox"
            checked={summaryChecks.gcp}
            onChange={(e) =>
              setSummaryChecks((prev) => ({ ...prev, gcp: e.target.checked }))
            }
            className="w-4 h-4 rounded border-slate-500 text-primary-500 focus:ring-primary-500/70"
          />
          {t.summary.c2}
        </label>
        {summaryError && (
          <p className="text-xs text-rose-400 mt-2">{summaryError}</p>
        )}
      </div>
    </div>
  );

  const legalBody = useMemo(() => {
    if (legalText.includes("Polityka") || legalText.includes("Privacy")) {
      return lang === "PL"
        ? "Tu będzie Polityka Prywatności PapaData – informacje o przetwarzaniu danych, podstawach prawnych i czasie przechowywania."
        : "Here will be PapaData Privacy Policy – information about data processing, legal basis and retention time.";
    }
    if (legalText.includes("Regulamin") || legalText.includes("Terms")) {
      return lang === "PL"
        ? "Tu będzie Regulamin korzystania z platformy PapaData – zasady świadczenia usług, odpowiedzialność i płatności."
        : "Here will be PapaData Terms of Service – rules of service, responsibilities and payments.";
    }
    if (legalText.includes("Przetwarzanie") || legalText.includes("Data")) {
      return lang === "PL"
        ? "Tu będzie opis przetwarzania danych (DPA) – role administratora, procesora oraz zakres przetwarzania."
        : "Here will be the Data Processing Agreement (DPA) – roles of controller, processor and processing scope.";
    }
    return lang === "PL"
      ? "Tu wkleimy pełną treść dokumentu."
      : "Here we will paste the full document.";
  }, [legalText, lang]);

  const renderTerminal = () => (
    <div className="fixed inset-0 z-50 bg-slate-950/95 text-slate-100 font-mono p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                {t.terminal.title}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === "PL"
                  ? "To tylko symulacja. W produkcji zastąpi to prawdziwy provisioning GCP."
                  : "Simulation only. In production this will trigger real GCP provisioning."}
              </p>
            </div>
          </div>
          <div className="w-48 h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-[0_26px_80px_rgba(15,23,42,1)]">
          <div>
            {"> Inicjalizuję środowisko klienta:"}{" "}
            {company.name || "mojafirma"}
          </div>
          <div>
            {`> Tworzę projekt GCP i dataset: ${
              company.name || "firma"
            }_raw, curated, analytics (region: europe-central2)... [OK]`}
          </div>
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
                : "text-primary-300";
            return (
              <div key={i.id} className={`text-xs ${colorClass}`}>
                {`> Konfiguruję integrację: ${i.longName}... [${suffix}]`}
                {health?.state === "error" && (
                  <span className="block text-[11px] text-rose-200 mt-1">
                    Integracja {i.longName} –{" "}
                    {health.message || "Błąd połączenia."} Środowisko
                    utworzone, ale dane nie będą pobierane.
                  </span>
                )}
                {health?.state === "needs_reauth" && (
                  <span className="block text-[11px] text-amber-200 mt-1">
                    Tokeny wygasły. Odśwież połączenie w sekcji Integracje.
                  </span>
                )}
              </div>
            );
          })}
          <div>{"> Szyfruję klucze w Google Secret Manager... [OK]"}</div>
          <div>{"> Uruchamiam potoki ETL (365 dni danych)... [W TOKU]"}</div>
          <div>{"> Konfiguruję Raporty Live... [OK]"}</div>
          <div>{"> Twoja platforma jest gotowa."}</div>
          {progress >= 100 && (
            <div className="text-primary-300 mt-1">{t.terminal.done}</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className={`${outerCard} p-5 md:p-8 relative`}>
          {/* lekkie tło glow za kartą */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-[26px] bg-gradient-to-br from-primary-500/10 via-indigo-500/5 to-transparent blur-xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4 mb-8">
              <BrandLogo size="lg" />
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Onboarding
                </span>
                <span className="text-xs text-slate-300">
                  {lang === "PL"
                    ? "4 kroki do startu z PapaData"
                    : "4 steps to start with PapaData"}
                </span>
              </div>
            </div>

            {renderStepper()}

            {step === 0 && renderStep1()}
            {step === 1 && renderStep2()}
            {step === 2 && renderStep3()}
            {step === 3 && renderStep4()}

            {renderActions()}
          </div>
        </div>
      </div>

      {showLegal && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLegal(false)}
        >
          <div
            className="bg-slate-950 border border-slate-800 max-w-lg w-full p-6 rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,1)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLegal(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-slate-50">
              {legalText}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {legalBody}
            </p>
          </div>
        </div>
      )}

      {showTerminal && renderTerminal()}
    </div>
  );
};

export default Wizard;
