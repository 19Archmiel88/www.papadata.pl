import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Sparkles, BarChart2, LineChart, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Translation } from '../types';

interface Props {
  /** Translation object containing text for the hero section */
  t: Translation['hero'];
  /**
   * Function to handle smart navigation to different app sections.
   * Redirects users based on authentication status and selected target.
   */
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

/** Represents the content of a single slide in the hero carousel */
type Slide =
  | { key: string; type: 'chat'; user: string; ai: string; highlight?: string }
  | { key: string; type: 'chart'; title: string; assistant: string; trend: string }
  | { key: string; type: 'analysis'; title: string; subtitle: string; assistant: string };

/**
 * The main Hero section of the landing page.
 * Displays a large title, call-to-action buttons, and an interactive carousel simulating the AI dashboard.
 */
const Hero: React.FC<Props> = ({ t, onSmartNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const isPL = t.ctaPrimary.toLowerCase().includes('rozpocznij');
  const titleLines = t.title.split('\n');
  const heroLine1 = isPL ? 'Wszystkie dane e-commerce w jednym oknie' : titleLines[0];
  const heroLine2 = isPL ? 'PapaData łączy dane i odpowiada w <200ms' : titleLines[1] || '';
  const heroSubtitle = isPL
    ? 'PapaData łączy Twój sklep, reklamy i analitykę i odpowiada w czasie rzeczywistym.'
    : t.subtitle;

  const slides: Slide[] = [
    {
      key: 'chat-1',
      type: 'chat',
      user: isPL ? 'Pokaż mi, co teraz dzieje się z kampaniami.' : 'Show me what is happening with campaigns right now.',
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
      user: isPL ? 'Czy możemy zoptymalizować budżet?' : 'Can we optimize the budget?',
      ai: isPL
        ? 'Zwiększyłem wydatki na kampanię brandową o 20% i monitoruję ROAS.'
        : "I increased brand campaign spend by 20% and I'm monitoring ROAS.",
      highlight: t.mock.carousel.slide3.subtitle,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const barColors = [
    'bg-primary-300',
    'bg-primary-400',
    'bg-primary-400',
    'bg-primary-600',
    'bg-emerald-400',
    'bg-rose-400',
    'bg-sky-400',
  ];

  const renderSlide = (slide: Slide) => {
    if (slide.type === 'chat') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary-200/80">
            <MessageSquare className="w-4 h-4" />
            {isPL ? 'Czat z AI' : 'AI Chat'}
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">{slide.highlight}</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="max-w-[90%] ml-auto bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-sm text-slate-100 shadow-lg shadow-primary-900/40">
              <div className="text-[10px] uppercase tracking-wide text-slate-300/70 mb-1">{isPL ? 'Ty' : 'You'}</div>
              {slide.user}
            </div>
            <div className="max-w-[92%] bg-gradient-to-br from-primary-500/20 via-primary-500/15 to-slate-900/50 border border-primary-200/20 rounded-2xl px-4 py-3 text-sm text-slate-100 shadow-[0_15px_60px_-35px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-primary-100 mb-1">
                <Sparkles className="w-3 h-3" />
                PapaData AI
              </div>
              {slide.ai}
            </div>
          </div>
        </div>
      );
    }

    if (slide.type === 'chart') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-100/80">{isPL ? 'Przykładowe wykresy' : 'Sample charts'}</p>
              <h3 className="text-lg font-semibold text-white">{slide.title}</h3>
              <p className="text-xs text-slate-300/80 mt-1">{slide.trend}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <BarChart2 className="w-5 h-5 text-primary-200" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 h-32 items-end">
            {[45, 70, 55, 85, 35, 50, 65].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.08, duration: 0.6, type: 'spring' }}
                className={`w-full rounded-t-md bg-gradient-to-t from-white/5 to-white/40 ${barColors[i % barColors.length]}`}
              />
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-primary-100 mb-1">
              <Sparkles className="w-3 h-3" />
              PapaData AI
            </div>
            {slide.assistant}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary-100/80">
          <LineChart className="w-4 h-4" />
          {isPL ? 'Analiza' : 'Analysis'}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white shadow-lg shadow-primary-900/30">
            <p className="text-xs text-slate-300/80 mb-1">{slide.title}</p>
            <p className="text-lg font-semibold">{slide.subtitle}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-300" />
              {isPL ? 'Budżet dostosowany automatycznie' : 'Budget adjusted automatically'}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary-500/15 via-primary-500/10 to-slate-900/70 border border-primary-300/20 p-4 text-slate-50">
            <p className="text-xs uppercase tracking-wide text-primary-100 mb-1">{isPL ? 'Wnioski AI' : 'AI takeaways'}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-200" />
                {isPL ? 'Najmocniejszy wzrost w kampanii Brand Search (+32%).' : 'Strongest lift in Brand Search campaign (+32%).'}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-200" />
                {isPL ? 'Meta Ads odpowiada za 60% nowych klientów.' : 'Meta Ads drive 60% of new customers.'}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-200" />
                {isPL ? 'Rekomendacja: test remarketing w niedzielę wieczorem.' : 'Recommendation: test remarketing on Sunday evening.'}
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-primary-100 mb-1">
            <Sparkles className="w-3 h-3" />
            PapaData AI
          </div>
          {slide.assistant}
        </div>
      </div>
    );
  };

  const current = slides[currentSlide];

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-6">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-bold tracking-wide text-primary-600 dark:text-primary-400 uppercase">
                {t.tag}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-6">
              {heroLine1}
              <span className="block mt-2 text-2xl md:text-3xl font-medium text-slate-500 dark:text-slate-400 border-b-2 border-primary-500/30 w-fit pb-1">
                {heroLine2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-xl">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href="/wizard"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:scale-105"
              >
                {t.ctaPrimary}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlayerOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  <Play className="mr-2 w-4 h-4" />
                  {t.ctaSecondary}
                </button>
                <button
                  type="button"
                  onClick={() => onSmartNavigate('demo')}
                  className="text-sm text-primary-200 hover:text-primary-100 underline self-start"
                >
                  {isPL ? 'Przejdź do interaktywnego sandboxa' : 'Go to interactive sandbox'}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.trustText}
            </p>
          </div>

          {/* Right: AI interactive preview */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary-600/10 blur-3xl -z-10 transform translate-y-4 rounded-[3rem]" />

            <div className="relative z-10 bg-slate-950/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden h-[470px] flex flex-col">
              {/* Fake Window Header */}
              <div className="h-11 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="ml-4 px-3 py-1 bg-white/5 rounded-md">
                  <span className="text-xs text-slate-200/80 block truncate max-w-[150px]">{t.mock.header}</span>
                </div>
                <div className="ml-auto text-[10px] uppercase tracking-wide text-primary-100/70">
                  {isPL ? 'Czat → Wykresy → Analiza → Czat' : 'Chat → Charts → Analysis → Chat'}
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="p-6 md:p-8 space-y-6 flex-1 relative overflow-hidden bg-gradient-to-br from-[#12192f] via-[#0e1427] to-[#0a0f1f]">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.25),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,0.18),transparent_30%)]" />
                <div className="absolute inset-[18px] rounded-[22px] border border-white/5 pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.45 }}
                    className="relative z-10 h-full"
                  >
                    {renderSlide(current)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel Indicators */}
              <div className="h-14 border-t border-white/10 flex items-center justify-between px-4 bg-white/5">
                <div className="flex items-center gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.key}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2.5 rounded-full transition-all ${currentSlide === i ? 'w-10 bg-primary-400 shadow-[0_0_0_4px_rgba(139,92,246,0.15)]' : 'w-4 bg-white/20 hover:bg-white/30'}`}
                      aria-label={`Switch to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-slate-300/80">
                  {isPL ? 'Auto-rotacja co ~5s' : 'Auto-rotates every ~5s'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo player modal */}
      {isPlayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            onClick={() => setIsPlayerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative max-w-6xl w-full">
            <button
              type="button"
              onClick={() => setIsPlayerOpen(false)}
              className="absolute -top-12 right-0 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2"
              aria-label={isPL ? 'Zamknij player' : 'Close player'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative rounded-[36px] border border-white/10 bg-slate-950/90 shadow-[0_40px_140px_-80px_rgba(0,0,0,0.85)] overflow-hidden">
              <div className="absolute inset-x-10 -top-4 h-6 rounded-full bg-slate-900/70 border border-white/10" />
              <div className="relative m-6 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1b2244] via-[#151b36] to-[#0f152a] h-[520px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.16),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,0.12),transparent_30%)]" />
                <div className="absolute inset-[18px] rounded-[22px] border border-white/5" />
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-200/70" />
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center transition transform hover:scale-105 hover:bg-white/15">
                    <Play className="w-12 h-12 text-white" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-10 right-10">
                  <button
                    type="button"
                    onClick={() => onSmartNavigate('demo')}
                    className="px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/20"
                  >
                    {isPL ? 'Wejdź do sandboxa' : 'Open sandbox'}
                  </button>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
