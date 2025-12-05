from pathlib import Path
content = r'''
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
  const [chartData, setChartData] = useState<any[]>([]);
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

  const generateGeminiInsight = async (stats: typeof chartStats, currentKpis: typeof kpis, r: string, l: Language) => {
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

      const prompt = f"""
        You are an expert e-commerce analyst.
        Analyze the following dashboard data: {dataSummary}.

        Generate a single, professional, and actionable business insight (max 2 sentences).
        Focus on the relationship between spend, revenue, or specific KPI trends.

        Output language: {'Polish' if l == 'PL' else 'English'}.
        Do not use markdown formatting.
      """;

      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      return response.text
    } catch (e):
      return None

  useEffect(() => {
    setAiLoading(True)
    # truncated intentionally
'''  # noqa: E501
Path('apps/web/app/demo-dashboard').mkdir(parents=True, exist_ok=True)
Path('apps/web/app/demo-dashboard/page.tsx').write_text(content, encoding='utf-8')
