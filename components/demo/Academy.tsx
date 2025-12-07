// components/demo/Academy.tsx
import React, { useState } from "react";
import { Language } from "../../types";
import {
  BookOpen,
  GraduationCap,
  Video,
  FileText,
  Sparkles,
  Lock,
  Clock,
  PlayCircle,
  ArrowRight,
} from "lucide-react";

interface Props {
  lang: Language;
  /** Czy to tryb demo (np. /demo/academy) */
  isDemo?: boolean;
}

const cardBase =
  "bg-slate-900/80 border border-slate-800/70 rounded-2xl shadow-lg shadow-black/40 backdrop-blur-sm";

const Academy: React.FC<Props> = ({ lang, isDemo = true }) => {
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  const isPL = lang === "PL";

  const t = {
    title: isPL ? "Akademia PapaData" : "PapaData Academy",
    subtitle: isDemo
      ? isPL
        ? "Zobacz, jak korzystać z raportów, integracji i Analityka AI. Część materiałów to demo – pełny dostęp po aktywacji konta."
        : "See how to use dashboards, integrations and the AI analyst. Some materials are demo – full access after account activation."
      : isPL
      ? "Zebraliśmy w jednym miejscu wideo, dokumentację i gotowe playbooki do pracy z danymi."
      : "We’ve collected videos, documentation and ready-made playbooks for your data work.",
    quickStartTitle: isPL ? "Szybki start" : "Quick start",
    quickStartSteps: isPL
      ? [
          {
            label: "Krok 1",
            title: "Poznaj pulpit i Raporty Live",
            desc: "5-minutowy przegląd kluczowych widoków: sprzedaż, marża, kampanie i klienci.",
          },
          {
            label: "Krok 2",
            title: "Podłącz sklep i reklamy",
            desc: "Instrukcje krok po kroku dla WooCommerce, Shopify, IdoSell, Allegro, Google Ads, Meta Ads i GA4.",
          },
          {
            label: "Krok 3",
            title: "Pierwsze alerty i wnioski",
            desc: "Jak skonfigurować alerty spadków sprzedaży i monitorować ROAS w jednym miejscu.",
          },
        ]
      : [
          {
            label: "Step 1",
            title: "Learn the dashboard & Live Reports",
            desc: "5-minute walkthrough of key views: sales, margin, campaigns and customers.",
          },
          {
            label: "Step 2",
            title: "Connect store & ads",
            desc: "Step-by-step guides for WooCommerce, Shopify, IdoSell, Allegro, Google Ads, Meta Ads and GA4.",
          },
          {
            label: "Step 3",
            title: "First alerts & insights",
            desc: "How to configure drop alerts and monitor ROAS in one place.",
          },
        ],
    videosTitle: isPL ? "Webinary i wideo" : "Webinars & video",
    docsTitle: isPL ? "Dokumentacja & Playbooki" : "Docs & playbooks",
    lockedTitle: isPL ? "Materiały premium (po 14 dniach)" : "Premium content (after 14 days)",
    lockedDesc: isPL
      ? "Zaawansowane playbooki i szablony są odblokowywane po okresie trial i przedłużeniu współpracy."
      : "Advanced playbooks and templates unlock after the trial period and extending cooperation.",
    lockedCta: isPL ? "Jak odblokować dostęp?" : "How to unlock?",
    lockedModalTitle: isPL ? "Dostęp po 14 dniach współpracy" : "Access after 14 days of cooperation",
    lockedModalDesc: isPL
      ? "Te materiały są przeznaczone dla klientów, którzy zakończyli okres testowy i przedłużyli współpracę. Dzięki temu możemy pokazywać konkretne case’y i wyniki oparte na realnych wdrożeniach."
      : "These materials are for customers who completed the trial period and extended the cooperation. This lets us show real-life cases and results.",
    lockedModalHow: isPL
      ? [
          "1. Załóż konto i zakończ onboarding w kreatorze.",
          "2. Połącz sklep + minimum jedno źródło reklamowe.",
          "3. Aktywuj płatny plan po 14 dniach.",
        ]
      : [
          "1. Create an account and finish the onboarding wizard.",
          "2. Connect your store + at least one marketing source.",
          "3. Activate the paid plan after 14 days.",
        ],
    lockedModalClose: isPL ? "Zamknij" : "Close",
  };

  const videos = isPL
    ? [
        {
          tag: "Start",
          title: "Jak czytać pulpit i Raporty Live",
          duration: "7 min",
          level: "Podstawowy",
        },
        {
          tag: "Integracje",
          title: "Podłączanie sklepu i reklam (Woo + Google Ads + Meta)",
          duration: "12 min",
          level: "Średnio zaawansowany",
        },
        {
          tag: "AI",
          title: "Analityk AI – pytania o marżę, kampanie i klientów",
          duration: "9 min",
          level: "Podstawowy",
        },
      ]
    : [
        {
          tag: "Start",
          title: "How to read the dashboard & Live Reports",
          duration: "7 min",
          level: "Beginner",
        },
        {
          tag: "Integrations",
          title: "Connecting store and ads (Woo + Google Ads + Meta)",
          duration: "12 min",
          level: "Intermediate",
        },
        {
          tag: "AI",
          title: "AI analyst – questions about margin, campaigns and customers",
          duration: "9 min",
          level: "Beginner",
        },
      ];

  const docs = isPL
    ? [
        {
          icon: BookOpen,
          title: "Podręcznik startowy e-commerce",
          desc: "Jak poukładać raportowanie sprzedaży, marży i kampanii w jednym miejscu.",
        },
        {
          icon: FileText,
          title: "Schemat danych PapaData",
          desc: "Opis głównych tabel, metryk i definicji używanych w raportach.",
        },
        {
          icon: Sparkles,
          title: "Playbook: ratowanie ROAS-u",
          desc: "Krok po kroku, co sprawdzić, gdy kampanie zaczynają przepalać budżet.",
        },
      ]
    : [
        {
          icon: BookOpen,
          title: "E-commerce starter guide",
          desc: "How to structure reporting for sales, margin and campaigns in one place.",
        },
        {
          icon: FileText,
          title: "PapaData data model",
          desc: "Overview of core tables, metrics and definitions used in reports.",
        },
        {
          icon: Sparkles,
          title: "Playbook: fixing ROAS",
          desc: "Step-by-step checklist when campaigns start burning budget.",
        },
      ];

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-6 md:px-6 md:py-8 text-slate-50">
      {/* Góra sekcji */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-slate-900/80 px-3 py-1 text-xs font-medium text-primary-300 mb-3">
            <GraduationCap className="h-4 w-4" />
            <span>{isPL ? "Materiały edukacyjne" : "Educational content"}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        <div className={`${cardBase} px-4 py-3 flex items-center gap-3 max-w-xs w-full`}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700">
            <Clock className="h-4 w-4 text-primary-300" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400">
              {isPL ? "Cały moduł" : "Whole module"}
            </p>
            <p className="text-sm font-medium text-slate-100">
              {isPL
                ? "ok. 30–40 minut, żeby ogarnąć całość"
                : "about 30–40 minutes to understand everything"}
            </p>
          </div>
        </div>
      </div>

      {/* Główna siatka */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Kolumna 1 – Szybki start */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {t.quickStartTitle}
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              {t.quickStartSteps.map((step) => (
                <div
                  key={step.title}
                  className="relative pl-8 pb-3 border-l border-slate-800 last:pb-0"
                >
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border border-primary-500 flex items-center justify-center text-[10px] text-primary-200">
                    ●
                  </div>
                  <p className="text-[11px] font-medium text-primary-300 uppercase tracking-wide mb-0.5">
                    {step.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-50 mb-0.5">
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Karta: checklista pierwszych 14 dni */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {isPL
                  ? "Checklista pierwszych 14 dni"
                  : "First 14 days checklist"}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                •{" "}
                {isPL
                  ? "Dzień 1–2: podłącz sklep i reklamy."
                  : "Day 1–2: connect store and ads."}
              </li>
              <li>
                •{" "}
                {isPL
                  ? "Dzień 3–5: przejrzyj Raporty Live i ustaw alerty."
                  : "Day 3–5: review Live Reports and set alerts."}
              </li>
              <li>
                •{" "}
                {isPL
                  ? "Dzień 6–10: przeanalizuj marżę i produkty TOP/LOW."
                  : "Day 6–10: analyse margin and TOP/LOW products."}
              </li>
              <li>
                •{" "}
                {isPL
                  ? "Dzień 11–14: zaplanuj akcje na podstawie wniosków."
                  : "Day 11–14: plan actions based on insights."}
              </li>
            </ul>
          </div>
        </div>

        {/* Kolumna 2 – Webinary / wideo */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`${cardBase} p-5 h-full flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {t.videosTitle}
                </h2>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {videos.map((v) => (
                <button
                  key={v.title}
                  className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-3 hover:border-primary-500/60 hover:bg-slate-900/80 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[11px] text-primary-300 mb-1">
                        <span className="uppercase tracking-wide">{v.tag}</span>
                        <span className="w-1 h-1 rounded-full bg-primary-400" />
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <Clock className="h-3 w-3" />
                          {v.duration}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-50 mb-0.5">
                        {v.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isPL ? "Poziom:" : "Level:"} {v.level}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-slate-900 border border-slate-700 w-8 h-8 group-hover:border-primary-500/70">
                        <PlayCircle className="h-4 w-4 text-primary-300" />
                      </span>
                      <span className="text-[11px] text-slate-500 group-hover:text-primary-300 inline-flex items-center gap-1">
                        {isPL ? "Zobacz" : "Watch"}
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kolumna 3 – Dokumentacja + materiały premium */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary-300" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                {t.docsTitle}
              </h2>
            </div>
            <div className="space-y-3">
              {docs.map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.title}
                    className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-3 hover:border-primary-500/60 hover:bg-slate-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                      <Icon className="h-4 w-4 text-primary-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-50 mb-0.5">
                        {d.title}
                      </p>
                      <p className="text-xs text-slate-400">{d.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materiały premium – zablokowane */}
          <div className={`${cardBase} p-5 border-dashed border-primary-500/60 bg-slate-950/70`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-primary-500/60">
                <Lock className="h-4 w-4 text-primary-300" />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-50">
                  {t.lockedTitle}
                </h3>
                <p className="text-xs text-slate-400">{t.lockedDesc}</p>
                <button
                  type="button"
                  onClick={() => setLockedModalOpen(true)}
                  className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-300 hover:text-primary-200"
                >
                  {t.lockedCta}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal o 14 dniach współpracy */}
      {lockedModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setLockedModalOpen(false)}
        >
          <div
            className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-xl shadow-black/60 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs"
              onClick={() => setLockedModalOpen(false)}
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-primary-300" />
              <h3 className="text-lg font-semibold text-slate-50">
                {t.lockedModalTitle}
              </h3>
            </div>
            <p className="text-sm text-slate-300 mb-3">{t.lockedModalDesc}</p>
            <ul className="text-xs text-slate-400 space-y-1.5 mb-4">
              {t.lockedModalHow.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setLockedModalOpen(false)}
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 hover:border-primary-500/70 hover:text-primary-200"
            >
              {t.lockedModalClose}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academy;
