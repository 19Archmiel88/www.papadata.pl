import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Sparkles, BarChart2, LineChart, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Translation, Language } from '../types';

interface Props {
  t: Translation['hero'];
  lang: Language;
  onSmartNavigate: (
    target:
      | 'demo'
      | 'demo-ai'
      | 'reports-sales'
      | 'reports-technical'
      | 'academy'
      | 'academy-docs'
      | 'contact'
      | 'pricing'
      | 'privacy'
      | 'terms'
      | 'about'
  ) => void;
}

type Slide =
  | {
      key: string;
      type: 'chat';
      user: string;
      ai: string;
      highlight?: string;
    }
  | {
      key: string;
      type: 'chart';
      title: string;
      assistant: string;
      trend: string;
    }
  | {
      key: string;
      type: 'analysis';
      title: string;
      subtitle: string;
      assistant: string;
    };

const Hero: React.FC<Props> = ({ t, lang, onSmartNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const isPL = lang === 'PL';
  const titleLines = t.title.split('\n');
  const heroLine1 = titleLines[0] || t.title;
  const heroLine2 =
    titleLines[1] ||
    (isPL
      ? 'PapaData łączy dane ze sklepu, reklam i analityki w jednym panelu.'
      : 'PapaData connects data from your store, ads and analytics in one panel.');

  const heroSubtitle =
    t.subtitle ||
    (isPL
      ? 'Hurtownia danych w Google Cloud, gotowe raporty i analityk AI w jednym narzędziu.'
      : 'Your e-commerce data warehouse, ready-made reports and AI analyst in one tool.');

  const slides: Slide[] = [
    {
      key: 'chat-1',
      type: 'chat',
      user: isPL
        ? 'Pokaż mi, jak wyglądają kampanie w ostatnich 7 dniach.'
        : 'Show me how campaigns performed in the last 7 days.',
      ai: t.mock.carousel.slide1.assistant,
      highlight: t.mock.carousel.slide1.title,
    },
    {
      key: 'chart',
      type: 'chart',
      title: t.mock.carousel.slide2.title,
      assistant: t.mock.carousel.slide2.assistant,
      trend: t.mock.carousel.slide1.trend,
    },
    {
      key: 'analysis',
      type: 'analysis',
      title: t.mock.carousel.slide3.title,
      subtitle: t.mock.carousel.slide3.subtitle,
      assistant: t.mock.carousel.slide3.assistant,
    },
    {
      key: 'chat-2',
      type: 'chat',
      user: isPL
        ? 'Co powinienem zrobić z budżetem na Meta Ads?'
        : 'What should I do with my Meta Ads budget?',
      ai: isPL
        ? 'Zwiększyłem budżet w kampanii brandowej o 20% i monitoruję ROAS.'
        : 'I increased brand campaign spend by 20% and I am monitoring ROAS.',
      highlight: t.mock.carousel.slide3.subtitle,
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () =>
        setCurrentSlide((prev) => {
          const next = prev + 1;
          return next >= slides.length ? 0 : next;
        }),
      5500,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const renderSlide = (slide: Slide) => {
    if (slide.type === 'chat') {
      return (
        <div className="flex h-full flex-col gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
            <MessageSquare className="h-3.5 w-3.5 text-primary-500 dark:text-primary-300" />
            <span>{isPL ? 'Czat z AI' : 'AI Conversation'}</span>
          </div>

          {slide.highlight && (
            <p className="text-xs font-medium text-primary-600 dark:text-primary-200">
              {slide.highlight}
            </p>
          )}

          <div className="space-y-2">
            <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
              <span className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {isPL ? 'Ty' : 'You'}
              </span>
              {slide.user}
            </div>
            <div className="rounded-xl bg-primary-50 p-3 text-xs text-primary-900 ring-1 ring-primary-200 dark:bg-primary-950/60 dark:text-primary-50 dark:ring-primary-700/40">
              <span className="mb-1 block text-[11px] font-semibold text-primary-700 dark:text-primary-200">
                PapaData AI
              </span>
              {slide.ai}
            </div>
          </div>
        </div>
      );
    }

    if (slide.type === 'chart') {
      const bars = [45, 70, 55, 85, 35, 50, 65];
      return (
        <div className="flex h-full flex-col gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
            <BarChart2 className="h-3.5 w-3.5 text-primary-500 dark:text-primary-300" />
            <span>{isPL ? 'Przykładowe wykresy' : 'Sample charts'}</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {slide.title}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{slide.trend}</p>
          </div>

          <div className="mt-1 flex flex-1 items-end gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-full bg-slate-100 dark:bg-slate-900/80" style={{ height: `${h}%` }}>
                <div className="h-full w-full rounded-full bg-gradient-to-t from-primary-300 via-primary-500 to-primary-600 dark:from-primary-700 dark:via-primary-500 dark:to-primary-300" />
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
            <div className="mb-1 flex items-center gap-1.5 text-primary-700 dark:text-primary-200">
              <LineChart className="h-3.5 w-3.5" />
              <span className="font-semibold">PapaData AI</span>
            </div>
            {slide.assistant}
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
          <Sparkles className="h-3.5 w-3.5 text-primary-500 dark:text-primary-300" />
          <span>{isPL ? 'Analiza rentowności' : 'Profitability analysis'}</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{slide.title}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{slide.subtitle}</p>
        </div>

        <ul className="mt-1 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
          <li>
            •{' '}
            {isPL
              ? 'Najmocniejszy wzrost w kampanii Brand Search (+32%).'
              : 'Strongest lift in Brand Search campaign (+32%).'}
          </li>
          <li>
            •{' '}
            {isPL
              ? 'Meta Ads odpowiada za większość nowych klientów.'
              : 'Meta Ads is driving most new customers.'}
          </li>
          <li>
            •{' '}
            {isPL
              ? 'Rekomendacja: przetestuj remarketing w niedzielę wieczorem.'
              : 'Recommendation: test remarketing on Sunday evening.'}
          </li>
        </ul>

        <div className="mt-3 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
          <div className="mb-1 flex items-center gap-1.5 text-primary-700 dark:text-primary-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-semibold">PapaData AI</span>
          </div>
          {slide.assistant}
        </div>
      </div>
    );
  };

  const current = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-slate-50 pb-16 pt-20 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="mx-auto h-full max-w-6xl bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:items-start">
        {/* Lewa kolumna */}
        <div className="relative z-10 max-w-xl md:pt-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-3 py-1 text-[11px] font-medium text-primary-700 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-100">
            <Sparkles className="h-3 w-3" />
            <span>{t.tag}</span>
          </p>

          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl lg:text-5xl">
            <span className="block">{heroLine1}</span>
            {heroLine2 && (
              <span className="mt-1 block bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-500 bg-clip-text text-transparent dark:from-primary-300 dark:via-primary-400 dark:to-indigo-300">
                {heroLine2}
              </span>
            )}
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
            {heroSubtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSmartNavigate('demo')}
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500"
            >
              {t.ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlayerOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900"
            >
              <Play className="mr-2 h-4 w-4" />
              {t.ctaSecondary}
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">{t.trustText}</p>
        </div>

        {/* Prawa kolumna – panel AI */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-black/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/60">
            {/* Fake window header */}
            <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-900/90">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                {t.mock.header}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-500">
                {isPL ? 'Live sandbox' : 'Live sandbox'}
              </span>
            </div>

            {/* Zawartość */}
            <div className="mt-3 grid gap-3 rounded-xl bg-slate-50 p-4 dark:bg-gradient-to-b dark:from-slate-950/80 dark:to-slate-950/40">
              {renderSlide(current)}

              {/* Indykatory karuzeli */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {slides.map((s, i) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentSlide === i
                          ? 'w-9 bg-primary-500 shadow-[0_0_0_3px_rgba(139,92,246,0.25)] dark:bg-primary-400 dark:shadow-[0_0_0_3px_rgba(139,92,246,0.35)]'
                          : 'w-4 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-500">
                  {isPL ? 'Auto-rotacja co ~5s' : 'Auto-rotation every ~5s'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal z playerem demo */}
      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
            >
              <button
                type="button"
                onClick={() => setIsPlayerOpen(false)}
                className="absolute right-4 top-4 rounded-full border border-slate-800 bg-slate-900/80 p-1.5 text-slate-300 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              <h2 className="mb-2 text-lg font-semibold text-slate-50">
                {isPL
                  ? 'Zobacz, jak wygląda praca w PapaData'
                  : 'See how working in PapaData looks'}
              </h2>
              <p className="mb-4 text-sm text-slate-300">
                {isPL
                  ? 'W finalnej wersji tutaj będzie nagrany walkthrough z pulpitu oraz raportów. Na razie możesz przejść do interaktywnego demo.'
                  : 'In the final version this will be a recorded walkthrough of the dashboard and reports. For now you can open the interactive demo.'}
              </p>

              <div className="aspect-video w-full rounded-xl border border-slate-800 bg-slate-900/70" />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlayerOpen(false);
                    onSmartNavigate('demo');
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500"
                >
                  {isPL ? 'Przejdź do sandboxa' : 'Open sandbox'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <p className="text-[11px] text-slate-500">
                  {isPL
                    ? 'Demo nie wymaga logowania ani karty.'
                    : 'Demo does not require login or card.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
