"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  Headphones,
  Puzzle,
  Settings,
  LogOut,
  Calendar,
  RefreshCw,
  Search,
  Lock,
  PlayCircle,
  FileText,
  ChevronRight,
  Check,
  ThumbsUp,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  ShoppingCart,
  Download,
  Printer,
  X
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from "recharts";
import { GoogleGenAI } from "@google/genai";
import { TEXTS, MOCK_KPIS, MOCK_INTEGRATIONS, MOCK_ACADEMY } from "./constants";
import { View, Language } from "./types";

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
    outline: "border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
  } as const;

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const DashboardView = ({ lang, range }: { lang: Language; range: "today" | "24h" | "7d" | "30d" }) => {
  const [aiLoading, setAiLoading] = useState(true);
  const [insight, setInsight] = useState("");
  const [kpis, setKpis] = useState(MOCK_KPIS);
  type ChartPoint = { name: string; revenue: number; spend: number; sessions: number };
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartStats, setChartStats] = useState({ totalRev: 0, totalSpend: 0, avgRev: 0, avgSpend: 0 });

  const generateData = useCallback(
    (days: number) =>
      Array.from({ length: days }).map((_, i) => {
        let name = `Day ${i + 1}`;
        if (range === "today") {
          name = `${String(i).padStart(2, "0")}:00`;
        } else if (range === "24h") {
          const h = (new Date().getHours() - (23 - i) + 24) % 24;
          name = `${String(h).padStart(2, "0")}:00`;
        }

        const isHourly = range === "today" || range === "24h";
        return {
          name,
          revenue: Math.floor(Math.random() * (isHourly ? 500 : 5000)) + (isHourly ? 100 : 2000),
          spend: Math.floor(Math.random() * (isHourly ? 100 : 1000)) + (isHourly ? 20 : 500),
          sessions: Math.floor(Math.random() * (isHourly ? 300 : 3000)) + (isHourly ? 50 : 1000)
        };
      }),
    [range]
  );

  const getMockInsight = useCallback((r: string, l: Language) => {
    const insights: Record<string, Record<Language, string[]>> = {
      today: {
        PL: [
          "Dzisiejszy ruch z urzadzen mobilnych wzrosl o 22% w godzinach porannych. Konwersja jest jednak nizsza o 0.5pp. Sugeruje sprawdzic szybkosci ladowania strony na mobile.",
          "Wykryto nagly wzrost porzuconych koszykow miedzy 13:00 a 14:00. Moze to wskazywac na chwilowe problemy z bramka platnosci lub blad w procesie checkoutu.",
          "Produkt 'Zimowa Kurtka Premium' jest dzis najczesciej ogladany, ale slabo konwertuje. Rozwaz dodanie licznika 'Niska dostepnosc' aby zwiekszyc pilnosc zakupu.",
          "Kampania 'Flash Sale' osiagnela CTR na poziomie 4.5% w pierwszej godzinie. To wynik o 1.2pp wyzszy od sredniej. Warto zwiekszyc budzet dzienny o 15%.",
          "Wzrost bezposrednich wejsci na strone (Direct) o 18%. Prawdopodobnie efekt offline'owej reklamy lub wiralowego postu w social media.",
          "Srednia wartosc koszyka dzisiaj wynosi 420 PLN, co jest wynikiem o 12% wyzszym od sredniej z tego dnia tygodnia. Klienci czesciej dobieraja akcesoria."
        ],
        EN: [
          "Today's mobile traffic increased by 22% in the morning. However, conversion is 0.5pp lower. I suggest checking mobile page load speed.",
          "Detected a spike in abandoned carts between 1 PM and 2 PM. This might indicate temporary issues with the payment gateway or checkout errors.",
          "Product 'Winter Jacket Premium' has high views today but low conversion. Consider adding a 'Low Stock' counter to increase urgency.",
          "'Flash Sale' campaign achieved 4.5% CTR in the first hour. This is 1.2pp higher than average. Consider increasing daily budget by 15%.",
          "Direct traffic increased by 18%. Likely the effect of offline advertising or a viral social media post.",
          "Average Order Value today is 420 PLN, which is 12% higher than the average for this day of the week. Customers are adding more accessories."
        ]
      },
      "24h": {
        PL: [
          "W ciagu ostatnich 24h ruch z social media wzrosl o 15% w porownaniu do sredniej tygodniowej. Warto zwiekszyc budzet na najlepiej konwertujace reklamy.",
          "Nocna sprzedaz (00:00 - 06:00) byla o 30% wyzsza niz zazwyczaj. Sprawdz, czy to efekt kampanii mailingowej lub influencer marketingu.",
          "Wspolczynnik konwersji w ostatnich 24h ustabilizowal sie na poziomie 2.8%, co jest dobrym wynikiem. Rekomendacja: utrzymaj obecne stawki CPC.",
          "Produkty z kategorii 'Home & Decor' odnotowaly 40% wzrost sprzedazy w ciagu ostatniej doby. Zaktualizuj strone glowna, aby promowac bestsellery z tej grupy.",
          "Wykryto 5% wzrost zwrotow towarow zamowionych w ciagu ostatnich 24h. Warto sprawdzic jakosc pakowania lub zgodnosc opisow produktow."
        ],
        EN: [
          "In the last 24h, social media traffic grew by 15% compared to weekly average. Consider increasing budget for top converting ads.",
          "Night sales (12 AM - 6 AM) were 30% higher than usual. Check if this is due to an email campaign or influencer marketing.",
          "Conversion rate stabilized at 2.8% in the last 24h, which is a solid result. Recommendation: maintain current CPC bids.",
          "Products in 'Home & Decor' saw a 40% sales increase in the last 24 hours. Update the homepage to promote bestsellers from this category.",
          "Detected a 5% increase in returns for items ordered in the last 24h. Worth checking packaging quality or product description accuracy."
        ]
      },
      "7d": {
        PL: [
          "Przychod z kampanii Brand Search wzrosl o 28%, a koszt pozyskania w Meta Ads spadl o 18%. Rekomendacja: zwieksz budzet brandowy o 20% i przetestuj nowe kreacje w Meta.",
          "Klienci kupujacy 'Zestaw Startowy' czesto wracaja po 5 dniach. Sugeruje automatyczny e-mail z kodem rabatowym w 4. dniu po zakupie, aby zwiekszyc retencje.",
          "Sroda byla dniem z najwyzszym ROAS (850%). Warto przeanalizowac kreacje emitowane tego dnia i zwiekszyc ich udzial w emisji w przyszlym tygodniu.",
          "Analiza kohortowa pokazuje, ze uzytkownicy pozyskani z Instagrama maja o 20% wyzsze LTV w pierwszym tygodniu niz uzytkownicy z TikToka.",
          "Kategoria 'Elektronika' ma wysoki wskaznik porzucen na etapie dostawy (65%). Sugeruje dodanie opcji darmowej dostawy powyzej 300 PLN."
        ],
        EN: [
          "Revenue from 'Brand Search' increased by 28%, while CAC in Meta Ads dropped by 18%. Recommendation: increase brand budget by 20% and test new creatives in Meta.",
          "Customers buying 'Starter Kit' often return after 5 days. Suggest automated email with discount code on day 4 post-purchase to boost retention.",
          "Wednesday had the highest ROAS (850%). Worth analyzing creatives shown that day and increasing their impression share next week.",
          "Cohort analysis shows users acquired from Instagram have 20% higher LTV in the first week compared to TikTok users.",
          "'Electronics' category has a high abandonment rate at shipping (65%). Suggest adding free shipping option above 300 PLN."
        ]
      },
      "30d": {
        PL: [
          "Wskaznik powracajacych klientow spadl o 5%. Analiza koszyka wskazuje, ze rzadziej dobieraja akcesoria. Uruchom kampanie cross-sell dla ostatnich kupujacych.",
          "Kategoria 'Elektronika' odpowiada za 40% przychodu, ale marza spadla o 2%. Sprawdz koszty dostawy dla tych produktow lub renegocjuj stawki kurierskie.",
          "LTV klientow pozyskanych z TikTok Ads jest o 15% wyzsze niz z Facebooka. Rozwaz przesuniecie 10% budzetu na TikToka w nadchodzacym kwartale.",
          "Organiczny ruch z Google (SEO) wzrosl o 12% m/m, glownie na frazy zwiazane z 'zimowa wyprzedaza'. Warto stworzyc dedykowany landing page dla tych slow kluczowych.",
          "Klienci korzystajacy z platnosci odroczonych (BNPL) maja o 30% wyzsza wartosc koszyka. Warto promowac te metode platnosci w procesie checkoutu."
        ],
        EN: [
          "Returning customer rate dropped by 5%. Basket analysis shows fewer accessories attached. Launch a cross-sell campaign for recent buyers.",
          "'Electronics' category accounts for 40% of revenue, but margin dropped by 2%. Check shipping costs for these items or renegotiate courier rates.",
          "LTV of customers from TikTok Ads is 15% higher than from Facebook. Consider shifting 10% of budget to TikTok in the upcoming quarter.",
          "Organic traffic from Google (SEO) grew by 12% m/m, mainly for 'winter sale' related terms. Worth creating a dedicated landing page for these keywords.",
          "Customers using Buy Now Pay Later (BNPL) have a 30% higher basket value. Worth promoting this payment method at checkout."
        ]
      }
    };

    const key = ["today", "24h", "7d", "30d"].includes(r) ? r : "7d";
    const pool = insights[key][l];
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);
  const generateGeminiInsight = useCallback(
    async (stats: typeof chartStats, currentKpis: typeof kpis, r: string, l: Language) => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY });

        const dataSummary = {
          range: r,
          stats: {
            totalRevenue: stats.totalRev,
            totalSpend: stats.totalSpend
          },
          kpis: currentKpis.map((k) => ({
            name: k.label.EN,
            value: k.value,
            trend: k.trend
          }))
        };

        const prompt = `
        You are an expert e-commerce analyst.
        Analyze the following dashboard data: ${JSON.stringify(dataSummary)}.

        Generate a single, professional, and actionable business insight (max 2 sentences).
        Focus on the relationship between spend, revenue, or specific KPI trends.

        Output language: ${l === "PL" ? "Polish" : "English"}.
        Do not use markdown formatting.
      `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });

        return response.text;
      } catch {
        return null;
      }
    },
    []
  );

  useEffect(() => {
    setAiLoading(true);
    const points = range === "today" || range === "24h" ? 24 : range === "7d" ? 7 : 30;
    const newData = generateData(points);
    setChartData(newData);

    const totalRev = newData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalSpend = newData.reduce((acc, curr) => acc + curr.spend, 0);

    const newStats = {
      totalRev,
      totalSpend,
      avgRev: Math.round(totalRev / points),
      avgSpend: Math.round(totalSpend / points)
    };
    setChartStats(newStats);

    const multiplier = range === "today" || range === "24h" ? 0.15 : range === "7d" ? 1 : 4;
    const newKpis = MOCK_KPIS.map((kpi) => {
      if (kpi.id === "roas" || kpi.id === "aov") {
        const val = parseInt(kpi.value.replace(/[^0-9]/g, ""), 10);
        const variance = Math.floor(Math.random() * 20) - 10;
        const suffix = kpi.id === "roas" ? "%" : " PLN";
        return { ...kpi, value: `${val + variance}${suffix}` };
      }
      const val = parseInt(kpi.value.replace(/[^0-9]/g, ""), 10);
      const scaled = Math.floor(val * multiplier);
      return { ...kpi, value: `${scaled.toLocaleString()} PLN` };
    });
    setKpis(newKpis);

    const fetchInsight = async () => {
      await new Promise((r) => setTimeout(r, 600));
      const aiInsight = await generateGeminiInsight(newStats, newKpis, range, lang);
      setInsight(aiInsight || getMockInsight(range, lang));
      setAiLoading(false);
    };

    fetchInsight();
  }, [range, lang, generateData, getMockInsight, generateGeminiInsight]);

  const getLoadingText = () => {
    if (lang === "PL") {
      if (range === "today") return "Analizuje dzisiejsze dane...";
      if (range === "24h") return "Analizuje ostatnie 24h...";
      if (range === "7d") return "Analizuje dane z ostatnich 7 dni...";
      return "Analizuje dane z ostatnich 30 dni...";
    }
    if (range === "today") return "Analyzing today's data...";
    if (range === "24h") return "Analyzing last 24h...";
    if (range === "7d") return "Analyzing data from the last 7 days...";
    return "Analyzing data from the last 30 days...";
  };

  type LegendItem = { dataKey?: string | number; color?: string; value?: string | number };
  const renderLegend = ({ payload }: { payload?: LegendItem[] }) => {
    const legendPayload = payload ?? [];
    if (!legendPayload.length) return null;

    return (
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {legendPayload.map((entry, index) => {
          const isRevenue = entry.dataKey === "revenue";
          const avg = isRevenue ? chartStats.avgRev : chartStats.avgSpend;
          const total = isRevenue ? chartStats.totalRev : chartStats.totalSpend;

          return (
            <div key={`legend-${index}`} className="flex items-center gap-2 group relative cursor-help">
              <div className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}></div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{entry.value}</span>
              <span className="text-xs text-slate-500 font-mono">(O {avg.toLocaleString()})</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
                <div className="text-xs text-slate-400 mb-2 border-b border-slate-700 pb-1">{entry.value}</div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Total:</span>
                  <span className="text-white font-mono">{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Avg:</span>
                  <span className="text-white font-mono">{avg.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500"></div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
            <h2 className="text-lg font-semibold tracking-wide">{TEXTS.aiTitle[lang]}</h2>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-3 text-slate-400 h-24">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
              <span className="text-sm font-mono">{getLoadingText()}</span>
            </div>
          ) : (
            <div key={insight} className="space-y-4 animate-slide-up">
              <p className="text-slate-300 leading-relaxed max-w-4xl text-lg md:text-xl font-light">{insight}</p>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="text-sm py-1.5">{TEXTS.aiShowDetails[lang]}</Button>
                <Button variant="ghost" className="text-sm py-1.5">{TEXTS.aiAsk[lang]}</Button>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2 border-t border-white/5 pt-3">{TEXTS.aiDesc[lang]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="glass-panel p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default">
            <h3 className="text-slate-400 text-sm font-medium mb-2">{kpi.label[lang]}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{kpi.value}</span>
            </div>
            <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${kpi.trendUp ? "text-emerald-400" : "text-red-400"}`}>
              {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">{TEXTS.chartTitle[lang]}</h3>
            <p className="text-sm text-slate-400">{TEXTS.chartSubtitle[lang]}</p>
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
              <option>{lang === "PL" ? "Przychod" : "Revenue"}</option>
              <option>{lang === "PL" ? "Zamowienia" : "Orders"}</option>
            </select>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
              <option>{lang === "PL" ? "Wydatki" : "Spend"}</option>
              <option>{lang === "PL" ? "Sesje" : "Sessions"}</option>
            </select>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} itemStyle={{ color: "#e2e8f0" }} />
              <Legend content={(props) => renderLegend(props as { payload?: LegendItem[] })} />
              <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name={lang === "PL" ? "Przychod" : "Revenue"} />
              <Area type="monotone" dataKey="spend" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name={lang === "PL" ? "Wydatki" : "Spend"} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
const ReportsView = ({ lang, range }: { lang: Language; range: "today" | "24h" | "7d" | "30d" }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"Sales" | "Campaigns" | "Customers" | "Technical">("Sales");
  type ReportPoint = {
    name: string;
    revenue: number;
    profit: number;
    orders: number;
    aov: number;
    spend: number;
    clicks: number;
    impressions: number;
    newUsers: number;
    returningUsers: number;
    latency: number;
    errors: number;
  };
  const [data, setData] = useState<ReportPoint[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(true);
  const [focusFilter, setFocusFilter] = useState<"perf" | "cost" | "errors" | "audience">("perf");

  useEffect(() => {
    const points = range === "today" || range === "24h" ? 24 : range === "7d" ? 7 : 30;

    const generatedData = Array.from({ length: points }).map((_, i) => {
      let name = `D${i + 1}`;
      if (range === "today") name = `${String(i).padStart(2, "0")}:00`;
      else if (range === "24h") name = `${String((new Date().getHours() - (23 - i) + 24) % 24).padStart(2, "0")}:00`;

      return {
        name,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        profit: Math.floor(Math.random() * 2000) + 500,
        orders: Math.floor(Math.random() * 100) + 10,
        aov: Math.floor(Math.random() * 50) + 200,
        spend: Math.floor(Math.random() * 1000) + 200,
        clicks: Math.floor(Math.random() * 5000) + 1000,
        impressions: Math.floor(Math.random() * 50000) + 10000,
        newUsers: Math.floor(Math.random() * 200) + 50,
        returningUsers: Math.floor(Math.random() * 100) + 20,
        latency: Math.floor(Math.random() * 200) + 50,
        errors: Math.floor(Math.random() * 10)
      };
    });

    setData(generatedData);
  }, [range, activeTab]);

  const handleExportCSV = () => {
    const columns: Record<string, string[]> = {
      Sales: ["name", "revenue", "profit", "orders", "aov"],
      Campaigns: ["name", "spend", "clicks", "impressions"],
      Customers: ["name", "newUsers", "returningUsers"],
      Technical: ["name", "latency", "errors"]
    };

    const relevantCols = columns[activeTab] || Object.keys(data[0]);
    const headers = relevantCols.join(",");
    const rows = data.map((row) => {
      const record = row as Record<string, string | number | undefined>;
      return relevantCols.map((col) => record[col] ?? "").join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PapaData_Report_${activeTab}_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => window.print();

  const tabs = [
    { id: "Sales", label: lang === "PL" ? "Sprzedaz" : "Sales", icon: ShoppingCart },
    { id: "Campaigns", label: lang === "PL" ? "Kampanie" : "Campaigns", icon: TrendingUp },
    { id: "Customers", label: lang === "PL" ? "Klienci" : "Customers", icon: Users },
    { id: "Technical", label: lang === "PL" ? "Techniczne" : "Technical", icon: Activity }
  ] as const;

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 animate-fade-in">
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="glass-panel max-w-xl w-full rounded-2xl border border-cyan-500/40 shadow-2xl relative">
            <button aria-label="Close" onClick={() => setShowUpgradeModal(false)} className="absolute right-3 top-3 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold">Live Reports</p>
              <h3 className="text-2xl font-bold text-white">
                {lang === "PL" ? "Twoje wlasne dashboardy po 14 dniach" : "Your live dashboards after 14 days"}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {lang === "PL"
                  ? "Wersja demo pokazuje fikcyjne dane. Po 14 dniach i przedluzeniu konta otrzymasz pelne Raporty Live z Twoich kampanii, techniki i customer journey."
                  : "Demo shows sample data. After 14 days and plan extension you will unlock full Live Reports with your campaigns, technical health and customer journey."}
              </p>
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Check className="w-4 h-4" />
                  {lang === "PL" ? "Monitor kampanie i techniczne alerty w czasie rzeczywistym" : "Monitor campaigns and technical alerts in real time"}
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <Check className="w-4 h-4" />
                  {lang === "PL" ? "Filtry: kanal, ROAS, bledy, uptime, audience" : "Filters: channel, ROAS, errors, uptime, audience"}
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <Check className="w-4 h-4" />
                  {lang === "PL" ? "Eksport CSV / PDF i alerty e-mail" : "CSV / PDF export and email alerts"}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" className="w-full justify-center" onClick={() => setShowUpgradeModal(false)}>
                  {lang === "PL" ? "Przedluz i odblokuj" : "Extend and unlock"}
                </Button>
                <Button variant="ghost" className="w-full justify-center text-cyan-300" onClick={() => setShowUpgradeModal(false)}>
                  {lang === "PL" ? "Zobacz demo dalej" : "Continue demo"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 transition-all duration-500 h-full flex flex-col ${unlocked ? "" : "blur-md opacity-30 pointer-events-none"}`}>
        {unlocked && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 px-4 py-3 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-3 animate-slide-up no-print">
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              {TEXTS.reportsDemoBanner[lang]}
            </span>
            <Button variant="primary" className="text-xs px-4 py-1.5 h-8 whitespace-nowrap">{TEXTS.btnCreateAccount[lang]}</Button>
          </div>
        )}

        <div className="flex gap-1 border-b border-slate-700 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative ${isActive ? "text-cyan-400" : "text-slate-400 hover:text-white hover:bg-white/5 rounded-t-lg"}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 no-print">
          {(["perf", "cost", "errors", "audience"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFocusFilter(f)}
              className={`px-3 py-1 text-xs rounded-full border ${focusFilter === f ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-slate-700 text-slate-400 hover:text-white"}`}
            >
              {f === "perf" && (lang === "PL" ? "ROAS / CTR" : "ROAS / CTR")}
              {f === "cost" && (lang === "PL" ? "Koszty" : "Costs")}
              {f === "errors" && (lang === "PL" ? "Bledy / uptime" : "Errors / uptime")}
              {f === "audience" && (lang === "PL" ? "Odbiorcy" : "Audience")}
            </button>
          ))}
        </div>
        <div className="flex-1 space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {activeTab === "Sales" && (lang === "PL" ? "Przychod vs Zysk" : "Revenue vs Profit")}
                  {activeTab === "Campaigns" && (lang === "PL" ? "Wydatki vs Klikniecia" : "Spend vs Clicks")}
                  {activeTab === "Customers" && (lang === "PL" ? "Aktywni uzytkownicy" : "Active Users")}
                  {activeTab === "Technical" && (lang === "PL" ? "Czas odpowiedzi serwera (ms)" : "Server Response Time (ms)")}
                </h3>
                <p className="text-xs text-slate-500">{lang === "PL" ? "Dane dla wybranego okresu:" : "Data for selected range:"} {range.toUpperCase()}</p>
              </div>
              <div className="flex gap-2 no-print">
                <Button variant="outline" onClick={handleExportCSV} className="text-xs px-3 py-1.5 h-8 text-cyan-400 border-cyan-500/30">
                  <Download className="w-3 h-3" /> CSV
                </Button>
                <Button variant="outline" onClick={handlePrint} className="text-xs px-3 py-1.5 h-8 text-slate-300 border-slate-600">
                  <Printer className="w-3 h-3" /> PDF
                </Button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeTab === "Technical" ? "#ef4444" : "#06b6d4"} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={activeTab === "Technical" ? "#ef4444" : "#06b6d4"} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} itemStyle={{ color: "#fff" }} />
                  <Legend />
                  {activeTab === "Sales" && (
                    <>
                      <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="url(#grad1)" strokeWidth={2} name={lang === "PL" ? "Przychod" : "Revenue"} />
                      <Area type="monotone" dataKey="profit" stroke="#8b5cf6" fill="url(#grad2)" strokeWidth={2} name={lang === "PL" ? "Zysk" : "Profit"} />
                    </>
                  )}
                  {activeTab === "Campaigns" && (
                    <>
                      <Area type="monotone" dataKey="clicks" stroke="#06b6d4" fill="url(#grad1)" strokeWidth={2} name="Clicks" />
                      <Area type="monotone" dataKey="spend" stroke="#8b5cf6" fill="url(#grad2)" strokeWidth={2} name={lang === "PL" ? "Wydatki" : "Spend"} />
                    </>
                  )}
                  {activeTab === "Customers" && (
                    <>
                      <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#06b6d4" fill="#06b6d4" name={lang === "PL" ? "Nowi" : "New Users"} />
                      <Area type="monotone" dataKey="returningUsers" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name={lang === "PL" ? "Powracajacy" : "Returning"} />
                    </>
                  )}
                  {activeTab === "Technical" && <Area type="monotone" dataKey="latency" stroke="#ef4444" fill="url(#grad1)" strokeWidth={2} name="Latency (ms)" />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-sm font-bold text-slate-300 mb-4">
                {activeTab === "Sales" && (lang === "PL" ? "Liczba zamowien" : "Order Count")}
                {activeTab === "Campaigns" && (lang === "PL" ? "Impresje (Zasieg)" : "Impressions")}
                {activeTab === "Customers" && (lang === "PL" ? "Srednia sesja" : "Avg Session Duration")}
                {activeTab === "Technical" && (lang === "PL" ? "Bledy API" : "API Errors")}
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} hide />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar
                      dataKey={activeTab === "Sales" ? "orders" : activeTab === "Campaigns" ? "impressions" : activeTab === "Customers" ? "newUsers" : "errors"}
                      fill={activeTab === "Technical" ? "#ef4444" : "#3b82f6"}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-sm font-bold text-slate-300 mb-4">
                {activeTab === "Sales" && (lang === "PL" ? "Srednia wartosc koszyka (AOV)" : "Avg Order Value (AOV)")}
                {activeTab === "Campaigns" && "CTR (%)"}
                {activeTab === "Customers" && (lang === "PL" ? "Lojalnosc" : "Retention Rate")}
                {activeTab === "Technical" && (lang === "PL" ? "Uptime" : "Uptime %")}
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} hide />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Line type="monotone" dataKey={activeTab === "Sales" ? "aov" : activeTab === "Technical" ? "latency" : "revenue"} stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!unlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="glass-panel p-8 max-w-lg w-full text-center rounded-2xl border-t border-white/20 shadow-2xl shadow-black/80 transform scale-100 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{TEXTS.reportsGatedTitle[lang]}</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">{TEXTS.reportsGatedText[lang]}</p>
            <div className="flex flex-col gap-3">
              <Button variant="primary" className="w-full py-3 text-lg justify-center">{TEXTS.btnUnlock[lang]}</Button>
              <Button variant="ghost" className="w-full justify-center text-cyan-400 hover:text-cyan-300" onClick={() => setUnlocked(true)}>
                {TEXTS.btnShowDemo[lang]}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const IntegrationsView = ({ lang }: { lang: Language }) => {
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATIONS);
  const [filter, setFilter] = useState("All");

  const handleVote = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id && item.status === "voting") {
          return { ...item, votes: (item.votes || 0) + 1 };
        }
        return item;
      })
    );
  };

  const categories = ["All", "Store", "Marketing", "Analytics", "Tools", "Marketplace", "Payment"];
  const filteredList = filter === "All" ? integrations : integrations.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border-l-4 border-cyan-500">
        <h2 className="text-xl font-bold text-white mb-2">{TEXTS.intHeaderTitle[lang]}</h2>
        <p className="text-slate-400 max-w-3xl">{TEXTS.intHeaderDesc[lang]}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto w-full pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${filter === cat ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-cyan-500 outline-none text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredList.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-xl flex flex-col justify-between h-48 hover:border-cyan-500/30 transition-colors group">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs">{item.name.substring(0, 2).toUpperCase()}</div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-1 rounded">{item.category}</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{item.name}</h3>
            </div>

            <div className="mt-4">
              {item.status === "available" && (
                <Button
                  variant="secondary"
                  className="w-full text-sm justify-center"
                  onClick={() => {
                    alert(lang === "PL" ? "Symulacja: integracja polaczona." : "Simulation: integration connected.");
                  }}
                >
                  {TEXTS.intConnect[lang]}
                </Button>
              )}
              {item.status === "coming_soon" && (
                <Button variant="ghost" disabled className="w-full text-sm justify-center cursor-not-allowed opacity-50">
                  {TEXTS.intComingSoon[lang]}
                </Button>
              )}
              {item.status === "voting" && (
                <Button variant="outline" className="w-full text-sm justify-between group-active:scale-95" onClick={() => handleVote(item.id)}>
                  <span>{TEXTS.intVote[lang]}</span>
                  <span className="text-xs bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> {item.votes}
                  </span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AcademyView = ({ lang }: { lang: Language }) => (
  <div className="space-y-6">
    <div className="glass-panel p-6 rounded-xl bg-gradient-to-r from-purple-900/20 to-slate-900">
      <h2 className="text-xl font-bold text-white mb-2">{TEXTS.acadHeaderTitle[lang]}</h2>
      <p className="text-slate-400 max-w-3xl">{TEXTS.acadHeaderDesc[lang]}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_ACADEMY.map((item) => (
        <div key={item.id} className={`glass-panel rounded-xl overflow-hidden flex flex-col ${item.isLocked ? "opacity-80" : ""}`}>
          <div className="h-40 bg-slate-800 relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.type === "video" ? "from-purple-600/20 to-blue-600/20" : "from-emerald-600/20 to-cyan-600/20"}`}></div>
            {item.isLocked ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Lock className="w-8 h-8 text-white/70" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 cursor-pointer">
                {item.type === "video" ? <PlayCircle className="w-12 h-12 text-white" /> : <FileText className="w-12 h-12 text-white" />}
              </div>
            )}
            <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium uppercase">{item.type}</div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">{item.title[lang]}</h3>
            <p className="text-sm text-slate-400 mb-4 flex-1">{item.subtitle[lang]}</p>
            {item.isLocked ? (
              <div className="flex items-center gap-2 text-xs text-amber-400 mt-auto">
                <Lock className="w-3 h-3" />
                <span>{TEXTS.acadPremium[lang]}</span>
              </div>
            ) : (
              <div className="mt-auto">
                <span className="text-cyan-400 text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline">
                  {lang === "PL" ? "Zobacz teraz" : "Watch now"} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
const SupportView = ({ lang }: { lang: Language }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="glass-panel p-8 max-w-md w-full text-center rounded-xl">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{lang === "PL" ? "Wyslano" : "Sent"}</h3>
          <p className="text-slate-400 mb-6">{TEXTS.suppMockAlert[lang]}</p>
          <Button variant="outline" onClick={() => setSubmitted(false)} className="mx-auto">
            {lang === "PL" ? "Wroc" : "Back"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{TEXTS.suppHeader[lang]}</h2>
        <p className="text-slate-400">{TEXTS.suppDesc[lang]}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Topic</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500">
              <option>Marketing Campaigns</option>
              <option>Budget</option>
              <option>Analytics Implementation</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="date" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pl-10 text-white outline-none focus:border-cyan-500" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Email</label>
          <input type="email" required placeholder="your@email.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Description</label>
          <textarea required rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" placeholder="..."></textarea>
        </div>

        <div className="pt-4">
          <Button className="w-full justify-center py-3">{TEXTS.suppBtn[lang]}</Button>
          <p className="text-center text-xs text-slate-500 mt-4">{TEXTS.suppMockAlert[lang]}</p>
        </div>
      </form>
    </div>
  );
};

const SettingsView = ({
  lang,
  setLang,
  sidebarFixed,
  setSidebarFixed
}: {
  lang: Language;
  setLang: (l: Language) => void;
  sidebarFixed: boolean;
  setSidebarFixed: (b: boolean) => void;
}) => (
  <div className="max-w-2xl mx-auto glass-panel rounded-xl overflow-hidden">
    <div className="p-6 border-b border-slate-800">
      <h2 className="text-xl font-bold text-white">{TEXTS.settHeader[lang]}</h2>
    </div>
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-medium mb-1">{TEXTS.settLang[lang]}</h3>
          <p className="text-xs text-slate-500">Polski / English</p>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button onClick={() => setLang("PL")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === "PL" ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}>
            PL
          </button>
          <button onClick={() => setLang("EN")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === "EN" ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}>
            EN
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-medium mb-1">{TEXTS.settTheme[lang]}</h3>
        </div>
        <select className="bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm outline-none focus:border-cyan-500">
          <option>{TEXTS.settThemeDark[lang]}</option>
          <option disabled>{TEXTS.settThemeLight[lang]}</option>
        </select>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-medium mb-1">{TEXTS.settSidebar[lang]}</h3>
          <p className="text-xs text-slate-500">{TEXTS.settSidebarFixed[lang]}</p>
        </div>
        <div onClick={() => setSidebarFixed(!sidebarFixed)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${sidebarFixed ? "bg-cyan-600" : "bg-slate-700"}`}>
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${sidebarFixed ? "translate-x-6" : ""}`}></div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <Button variant="danger" onClick={() => alert("Demo: Account deletion not allowed.")}>{TEXTS.settDelete[lang]}</Button>
      </div>
    </div>
  </div>
);
const Sidebar = ({
  view,
  setView,
  lang,
  fixed,
  expanded,
  setExpanded
}: {
  view: View;
  setView: (v: View) => void;
  lang: Language;
  fixed: boolean;
  expanded: boolean;
  setExpanded: (b: boolean) => void;
}) => {
  const handleMouseEnter = () => {
    if (!fixed) setExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!fixed) setExpanded(false);
  };

  const navItems = [
    { id: View.DASHBOARD, label: TEXTS.navDashboard[lang], icon: LayoutDashboard },
    { id: View.REPORTS, label: TEXTS.navReports[lang], icon: BarChart3 },
    { id: View.ACADEMY, label: TEXTS.navAcademy[lang], icon: GraduationCap },
    { id: View.SUPPORT, label: TEXTS.navSupport[lang], icon: Headphones },
    { id: View.INTEGRATIONS, label: TEXTS.navIntegrations[lang], icon: Puzzle },
    { id: View.SETTINGS, label: TEXTS.navSettings[lang], icon: Settings }
  ];

  const isActuallyExpanded = fixed || expanded;

  return (
    <div
      className={`fixed left-0 top-0 h-full z-50 bg-[#020617] border-r border-white/10 transition-all duration-300 flex flex-col no-print ${isActuallyExpanded ? "w-64 shadow-2xl shadow-cyan-900/20" : "w-[70px]"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-[70px] flex items-center pl-5 border-b border-white/5 overflow-hidden whitespace-nowrap">
        <div className="min-w-[32px] h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shrink-0">PD</div>
        <div className={`ml-3 font-bold text-xl tracking-tight text-white transition-opacity duration-200 ${isActuallyExpanded ? "opacity-100" : "opacity-0"}`}>
          PapaData
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = view === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`relative flex items-center h-12 rounded-lg transition-all duration-200 group overflow-hidden whitespace-nowrap ${isActive ? "bg-white/10 text-cyan-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              <div className="min-w-[46px] flex justify-center">
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-white"}`} />
              </div>
              <span className={`text-sm font-medium transition-opacity duration-300 ${isActuallyExpanded ? "opacity-100" : "opacity-0"}`}>
                {item.label}
              </span>
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-l-full"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 mb-2 border-t border-white/5">
        <button onClick={() => window.location.reload()} className="flex items-center w-full h-12 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors overflow-hidden whitespace-nowrap">
          <div className="min-w-[46px] flex justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span className={`text-sm font-medium transition-opacity duration-300 ${isActuallyExpanded ? "opacity-100" : "opacity-0"}`}>
            {TEXTS.navLogout[lang]}
          </span>
        </button>
      </div>
    </div>
  );
};

const TopBar = ({
  lang,
  view,
  range,
  setRange
}: {
  lang: Language;
  view: View;
  range: "today" | "24h" | "7d" | "30d";
  setRange: (r: "today" | "24h" | "7d" | "30d") => void;
}) => {
  let title = "";
  switch (view) {
    case View.DASHBOARD:
      title = TEXTS.titleDashboard[lang];
      break;
    case View.REPORTS:
      title = TEXTS.titleReports[lang];
      break;
    case View.ACADEMY:
      title = TEXTS.titleAcademy[lang];
      break;
    case View.SUPPORT:
      title = TEXTS.titleSupport[lang];
      break;
    case View.INTEGRATIONS:
      title = TEXTS.titleIntegrations[lang];
      break;
    case View.SETTINGS:
      title = TEXTS.titleSettings[lang];
      break;
    default:
      title = "";
  }

  return (
    <div className="h-[70px] border-b border-white/5 bg-[#020617]/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 transition-all no-print">
      <div className="flex items-center gap-4">
        <h1 className="text-white font-semibold text-lg hidden md:block animate-fade-in">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {(view === View.DASHBOARD || view === View.REPORTS) && (
          <div className="hidden md:flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            {(["today", "24h", "7d", "30d"] as const).map((r) => {
              let label = "";
              if (r === "today") label = TEXTS.rangeToday[lang];
              if (r === "24h") label = TEXTS.range24h[lang];
              if (r === "7d") label = TEXTS.range7Days[lang];
              if (r === "30d") label = TEXTS.range30Days[lang];
              const isActive = range === r;
              return (
                <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${isActive ? "bg-cyan-900/30 text-cyan-400" : "text-slate-400 hover:text-white"}`}>
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 group cursor-help relative">
          <RefreshCw className="w-3 h-3" />
          <span>
            {TEXTS.lastSync[lang]}: 12:57
          </span>
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 text-slate-300 p-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            {TEXTS.lastSyncTooltip[lang]}
          </div>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 ring-white/20 transition-all group relative">
            JD
            <div className="absolute top-full right-0 mt-3 w-40 bg-slate-800 text-slate-300 p-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {TEXTS.demoAccount[lang]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DemoDashboardPage() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [lang, setLang] = useState<Language>("PL");
  const [sidebarFixed, setSidebarFixed] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<"today" | "24h" | "7d" | "30d">("7d");

  const contentMargin = sidebarFixed || sidebarExpanded ? "ml-64" : "ml-[70px]";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
      <Sidebar view={currentView} setView={setCurrentView} lang={lang} fixed={sidebarFixed} expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <div className={`transition-all duration-300 flex flex-col min-h-screen ${contentMargin} print-reset-margin`}>
        <TopBar lang={lang} view={currentView} range={dateRange} setRange={setDateRange} />
        <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          {currentView === View.DASHBOARD && <DashboardView lang={lang} range={dateRange} />}
          {currentView === View.REPORTS && <ReportsView lang={lang} range={dateRange} />}
          {currentView === View.INTEGRATIONS && <IntegrationsView lang={lang} />}
          {currentView === View.ACADEMY && <AcademyView lang={lang} />}
          {currentView === View.SUPPORT && <SupportView lang={lang} />}
          {currentView === View.SETTINGS && <SettingsView lang={lang} setLang={setLang} sidebarFixed={sidebarFixed} setSidebarFixed={setSidebarFixed} />}
        </main>
      </div>
    </div>
  );
}


