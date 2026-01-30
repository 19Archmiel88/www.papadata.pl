import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { InteractiveButton } from './InteractiveButton';
import { Translation } from '../types';

type VertexTab = 'pipeline' | 'exec' | 'ai';

const TAB_ORDER: VertexTab[] = ['pipeline', 'exec', 'ai'];
const SCENE_TIMINGS: Record<VertexTab, number> = {
  pipeline: 8000,
  exec: 8000,
  ai: 12000,
};

type ChatRole = 'system' | 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
  meta?: React.ReactNode;
  confidence?: 'high' | 'review';
}

type PlaybackMode = 'auto' | 'manual';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function timeStampNow() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function usePrefersReducedMotionFlag() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(Boolean(mq.matches));
    apply();
    mq.addEventListener?.('change', apply);
    return () => {
      mq.removeEventListener?.('change', apply);
    };
  }, []);

  return reduced;
}

function usePageVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVis = () => setVisible(!document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return visible;
}

/** Simple seeded RNG (stable in session) */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getSessionSeed(key: string) {
  if (typeof window === 'undefined') return 1337;
  const existing = window.sessionStorage.getItem(key);
  if (existing) return Number(existing) || 1337;
  const seed = Math.floor(Date.now() % 2147483647);
  window.sessionStorage.setItem(key, String(seed));
  return seed;
}

type NarrativeModel = {
  roasDropPct: number; // 8-18
  cvrDropPp: number; // 0.3-0.9
  revenuePLN: number; // 900k - 1.9M
  marginPct: number; // 18-32
  stockoutsCount: number; // 6-22
  underspendPct: number; // 10-35
  heroCategoryPL: string;
  heroCategoryEN: string;
  topChannelPL: string;
  topChannelEN: string;
};

function buildNarrative(seed: number): NarrativeModel {
  const rnd = mulberry32(seed);
  const roasDropPct = Math.round(8 + rnd() * 10); // 8..18
  const cvrDropPp = Math.round((0.3 + rnd() * 0.6) * 10) / 10; // 0.3..0.9
  const revenuePLN = Math.round((900_000 + rnd() * 1_000_000) / 1000) * 1000;
  const marginPct = Math.round((18 + rnd() * 14) * 10) / 10; // 18..32
  const stockoutsCount = Math.round(6 + rnd() * 16); // 6..22
  const underspendPct = Math.round(10 + rnd() * 25); // 10..35

  const heroPairs: Array<[string, string]> = [
    ['designerskie lampy', 'designer lamps'],
    ['buty sportowe', 'sports shoes'],
    ['kosmetyki premium', 'premium cosmetics'],
    ['akcesoria home', 'home accessories'],
  ];
  const channelPairs: Array<[string, string]> = [
    ['Google Ads • Mobile', 'Google Ads • Mobile'],
    ['Meta Ads • Prospecting', 'Meta Ads • Prospecting'],
    ['Performance Max', 'Performance Max'],
    ['SEO • Organic', 'SEO • Organic'],
  ];

  const hero = heroPairs[Math.floor(rnd() * heroPairs.length)];
  const channel = channelPairs[Math.floor(rnd() * channelPairs.length)];

  return {
    roasDropPct,
    cvrDropPp,
    revenuePLN,
    marginPct,
    stockoutsCount,
    underspendPct,
    heroCategoryPL: hero[0],
    heroCategoryEN: hero[1],
    topChannelPL: channel[0],
    topChannelEN: channel[1],
  };
}

function formatPLN(amount: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale || 'pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${Math.round(amount)} PLN`;
  }
}

function useSceneTimeline(params: {
  active: VertexTab;
  enabled: boolean;
  paused: boolean;
  onNext: (t: VertexTab) => void;
}) {
  const { active, enabled, paused, onNext } = params;
  const progress = useMotionValue(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    progress.set(0);

    if (!enabled) return;

    startRef.current = performance.now();
    const duration = SCENE_TIMINGS[active];

    const tick = (now: number) => {
      if (paused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      progress.set(p);

      if (p >= 1) {
        const idx = TAB_ORDER.indexOf(active);
        onNext(TAB_ORDER[(idx + 1) % TAB_ORDER.length]);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [active, enabled, paused, onNext, progress]);

  return progress;
}

const ConfidenceTag = memo(({ value }: { value?: ChatMessage['confidence'] }) => {
  if (!value) return null;
  const isHigh = value === 'high';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-black uppercase tracking-[0.25em] border ${
        isHigh
          ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'
          : 'text-amber-300 border-amber-300/20 bg-amber-300/10'
      }`}
    >
      {isHigh ? 'HIGH' : 'REVIEW'}
    </span>
  );
});

const ChatBubble = memo(
  ({
    msg,
    isLast,
    reducedMotion,
  }: {
    msg: ChatMessage;
    isLast: boolean;
    reducedMotion: boolean;
  }) => {
    const isSystem = msg.role === 'system';
    const isAssistant = msg.role === 'assistant';

    return (
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, x: -10, y: 10 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        className={`flex flex-col gap-1.5 mb-4 ${isSystem ? 'items-center' : 'items-start'}`}
      >
        {!isSystem && (
          <div className="flex items-center gap-2.5 px-1">
            <span className="text-3xs font-mono font-bold text-gray-500 uppercase tracking-widest">
              {msg.role}
            </span>
            <span className="text-3xs font-mono text-gray-400 opacity-50">{msg.timestamp}</span>
            <ConfidenceTag value={msg.confidence} />
          </div>
        )}

        <div
          className={`relative p-3.5 md:p-4 rounded-2xl text-sm-plus md:text-sm font-medium leading-relaxed max-w-[95%] md:max-w-[90%] border shadow-sm ${
            isSystem
              ? 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-500 italic text-center text-2xs md:text-xs font-mono uppercase tracking-widest'
              : isAssistant
                ? 'bg-white dark:bg-[#0F1117] border-black/5 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-tl-none'
                : 'brand-gradient-bg text-white border-transparent rounded-tr-none'
          }`}
        >
          {msg.text}
          {msg.meta && <div className="mt-3">{msg.meta}</div>}
          {isAssistant && isLast && !reducedMotion && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-3 ml-1 bg-brand-start translate-y-0.5"
            />
          )}
        </div>
      </motion.div>
    );
  }
);

function buildSequences(args: {
  active: VertexTab;
  isPL: boolean;
  narrative: NarrativeModel;
  locale: string;
}) {
  const { active, isPL, narrative, locale } = args;
  const now = timeStampNow();

  const hero = isPL ? narrative.heroCategoryPL : narrative.heroCategoryEN;
  const channel = isPL ? narrative.topChannelPL : narrative.topChannelEN;

  const revenueLabel = isPL ? 'Przychód' : 'Revenue';
  const marginLabel = isPL ? 'Marża' : 'Margin';

  const revenueText = formatPLN(narrative.revenuePLN, locale);
  const marginText = `${narrative.marginPct.toFixed(1)}%`;

  const sys = (text: string): ChatMessage => ({
    id: `sys_${Math.random().toString(16).slice(2)}`,
    role: 'system',
    text,
    timestamp: now,
  });

  const asst = (
    text: string,
    confidence?: ChatMessage['confidence'],
    meta?: React.ReactNode
  ): ChatMessage => ({
    id: `a_${Math.random().toString(16).slice(2)}`,
    role: 'assistant',
    text,
    timestamp: now,
    confidence,
    meta,
  });

  const user = (text: string): ChatMessage => ({
    id: `u_${Math.random().toString(16).slice(2)}`,
    role: 'user',
    text,
    timestamp: now,
  });

  if (active === 'pipeline') {
    return isPL
      ? [
          sys('ŁĄCZENIE Z INSTANCJĄ PAPA DATA…'),
          asst(`Wykryto anomalię: ROAS spadł o ${narrative.roasDropPct}% (${channel})`, 'high'),
          asst(`Największa zmiana: spadek CVR w checkout (-${narrative.cvrDropPp} pp)`, 'high'),
          asst(
            `Rekomendacja: sprawdź płatności / dostawy / błędy mobile → raport diagnostyczny gotowy (kategoria: „${hero}”)`,
            'review'
          ),
        ]
      : [
          sys('CONNECTING TO PAPA DATA INSTANCE…'),
          asst(`Anomaly detected: ROAS dropped by ${narrative.roasDropPct}% (${channel})`, 'high'),
          asst(`Primary driver: Checkout CVR drop (-${narrative.cvrDropPp} pp)`, 'high'),
          asst(
            `Recommendation: Check payments / deliveries / mobile errors → diagnostic report ready (category: “${hero}”)`,
            'review'
          ),
        ];
  }

  if (active === 'exec') {
    const meta = (
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="p-2 rounded-lg bg-brand-start/10 border border-brand-start/20">
          <div className="text-4xs text-gray-500 uppercase font-black">{revenueLabel}</div>
          <div className="text-xs font-black text-brand-start">{revenueText}</div>
        </div>
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-4xs text-gray-500 uppercase font-black">{marginLabel}</div>
          <div className="text-xs font-black text-emerald-500">{marginText}</div>
        </div>
      </div>
    );

    return isPL
      ? [
          sys('RAPORT GOTOWY • WIDOK ZARZĄDCZY'),
          asst('Generowanie raportu P&L (wczoraj)…', 'high', meta),
          asst(
            `Marża netto ↓ głównie przez: rabaty + zwroty (korelacja z ROAS -${narrative.roasDropPct}% w “${hero}”)`,
            'review'
          ),
          asst(
            `Rekomendacja: lista SKU z ujemnym zyskiem + alerty progowe ustawione (stock-outs: ${narrative.stockoutsCount})`,
            'review'
          ),
        ]
      : [
          sys('REPORT READY • EXECUTIVE VIEW'),
          asst('Generating P&L matrix (yesterday)…', 'high', meta),
          asst(
            `Net margin ↓ mainly due to: discounts + returns (correlates with ROAS -${narrative.roasDropPct}% in “${hero}”)`,
            'review'
          ),
          asst(
            `Recommendation: SKU list with negative profit + threshold alerts set (stock-outs: ${narrative.stockoutsCount})`,
            'review'
          ),
        ];
  }

  // AI
  return isPL
    ? [
        sys('POBIERANIE DANYCH • ANALIZA SEMANTYCZNA'),
        user('dlaczego nie osiągnąłem celu sprzedażowego w poprzednim miesiącu?'),
        asst(
          `1) Spadek ROAS o ${narrative.roasDropPct}% w kampaniach (najmocniej: “${hero}”, kanał: ${channel}).`,
          'high'
        ),
        asst(
          `2) Problemy z dostępnością (stock-outs) dla ${narrative.stockoutsCount} kluczowych SKU.`,
          'high'
        ),
        asst(
          `3) Niedoszacowanie budżetu na najlepsze kampanie (underspend ~${narrative.underspendPct}%).`,
          'review'
        ),
      ]
    : [
        sys('DATA INGESTION • SEMANTIC ANALYSIS'),
        user('Why did I miss my sales target last month?'),
        asst(
          `1) ROAS dropped by ${narrative.roasDropPct}% (strongest: “${hero}”, channel: ${channel}).`,
          'high'
        ),
        asst(
          `2) Availability issues (stock-outs) for ${narrative.stockoutsCount} key SKUs.`,
          'high'
        ),
        asst(
          `3) Underspending on top-performing campaigns (~${narrative.underspendPct}%).`,
          'review'
        ),
      ];
}

const NetworkStatus = memo(({ reducedMotion }: { reducedMotion: boolean }) => {
  const [idx, setIdx] = useState(0);
  const items = useMemo(
    () => [
      { label: 'ETL: OK', dot: 'bg-emerald-500' },
      { label: 'BQ: OK', dot: 'bg-emerald-500' },
      { label: 'AI: OK', dot: 'bg-emerald-500' },
      { label: 'ALERTS: LIVE', dot: 'bg-brand-start' },
    ],
    []
  );

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setIdx((p) => (p + 1) % items.length), 2000);
    return () => window.clearInterval(id);
  }, [items.length, reducedMotion]);

  const current = items[idx] ?? items[0];
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-1.5 h-1.5 rounded-full ${current.dot} ${reducedMotion ? '' : 'animate-pulse'}`}
      />
      <span className="text-3xs md:text-2xs font-black tracking-[0.25em] uppercase text-gray-500">
        {current.label}
      </span>
    </div>
  );
});

export const VertexPlayer = ({ t }: { t: Translation }) => {
  const navigate = useNavigate();

  const reducedMotion = usePrefersReducedMotionFlag();
  const pageVisible = usePageVisible();

  const [active, setActive] = useState<VertexTab>('pipeline');
  const [playback, setPlayback] = useState<PlaybackMode>('auto');
  const [hoverPaused, setHoverPaused] = useState(false);

  const [historyByTab, setHistoryByTab] = useState<Record<VertexTab, ChatMessage[]>>({
    pipeline: [],
    exec: [],
    ai: [],
  });

  const lastTailRef = useRef<ChatMessage[]>([]);
  const prevActiveRef = useRef<VertexTab>('pipeline');

  const scrollRef = useRef<HTMLDivElement>(null);

  const locale = t?.langCode || 'pl-PL';
  const isPL = !!t?.langCode?.startsWith?.('pl');

  // Narrative model (stable per session)
  const narrative = useMemo(() => {
    const seed = getSessionSeed('pd_vertex_player_seed');
    return buildNarrative(seed);
  }, []);

  const autoplayEnabled = playback === 'auto' && !reducedMotion;
  const paused = hoverPaused || !pageVisible || !autoplayEnabled;

  const progress = useSceneTimeline({
    active,
    enabled: autoplayEnabled,
    paused,
    onNext: (next) => setActive(next),
  });

  const setTab = useCallback((tab: VertexTab) => {
    setActive(tab);
  }, []);

  // Build & stream sequences per tab change (or render instantly in reduced motion)
  useEffect(() => {
    const sequences = buildSequences({ active, isPL, narrative, locale });

    // store tail from previous tab (last 2 messages) + reset current tab
    setHistoryByTab((prev) => {
      const prevTab = prevActiveRef.current;
      const prevHist = prev[prevTab] || [];
      lastTailRef.current = prevHist.slice(-2);
      prevActiveRef.current = active;
      return { ...prev, [active]: [] };
    });

    if (reducedMotion) {
      setHistoryByTab((prev) => ({ ...prev, [active]: sequences }));
      return;
    }

    let current = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const nextMsg = sequences[current];
      if (!nextMsg) return;

      setHistoryByTab((prev) => {
        const existing = prev[active] || [];
        // avoid duplicates if any race
        if (existing.some((m) => m.id === nextMsg.id)) return prev;
        return { ...prev, [active]: [...existing, nextMsg] };
      });

      current += 1;
      if (current >= sequences.length) return;
      window.setTimeout(tick, 900);
    };

    const id = window.setTimeout(tick, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [active, isPL, locale, narrative, reducedMotion]);

  // scroll to bottom on history updates
  const displayedHistory = useMemo(() => {
    const currentHistory = historyByTab[active] || [];
    // show previous tail as context only when not reduced motion
    const tail = reducedMotion ? [] : lastTailRef.current;
    return [...tail, ...currentHistory];
  }, [active, historyByTab, reducedMotion]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [displayedHistory]);

  const safeHistory = displayedHistory.filter(
    (m): m is ChatMessage =>
      !!m &&
      typeof m === 'object' &&
      typeof (m as any).id === 'string' &&
      typeof (m as any).role === 'string' &&
      typeof (m as any).text === 'string' &&
      typeof (m as any).timestamp === 'string'
  );

  // Quick prompts (AI)
  const quickPrompts = useMemo(() => {
    if (isPL) {
      return ['Dlaczego spadł ROAS?', 'Pokaż SKU z ujemnym zyskiem', 'Co mam zrobić dziś?'];
    }
    return ['Why did ROAS drop?', 'Show negative-profit SKUs', 'What should I do today?'];
  }, [isPL]);

  const [aiInput, setAiInput] = useState('');

  const appendToAI = useCallback((msgs: ChatMessage[]) => {
    setHistoryByTab((prev) => {
      const existing = prev.ai || [];
      return { ...prev, ai: [...existing, ...msgs] };
    });
  }, []);

  const runAIInteraction = useCallback(
    (promptText: string) => {
      const now = timeStampNow();
      const userMsg: ChatMessage = {
        id: `ai_u_${Math.random().toString(16).slice(2)}`,
        role: 'user',
        text: promptText,
        timestamp: now,
      };

      // deterministic-ish replies based on narrative
      const hero = isPL ? narrative.heroCategoryPL : narrative.heroCategoryEN;
      const channel = isPL ? narrative.topChannelPL : narrative.topChannelEN;

      const repliesPL: ChatMessage[] = [
        {
          id: `ai_a_${Math.random().toString(16).slice(2)}`,
          role: 'assistant',
          text: `Skrót: największy wpływ miały “${hero}” oraz ${channel}. ROAS -${narrative.roasDropPct}%, CVR -${narrative.cvrDropPp} pp.`,
          timestamp: now,
          confidence: 'high',
        },
        {
          id: `ai_a_${Math.random().toString(16).slice(2)}`,
          role: 'assistant',
          text: `Plan na dziś: 1) sprawdź checkout mobile, 2) uzupełnij stany (stock-outs: ${narrative.stockoutsCount}), 3) podnieś budżet top kampanii (+${narrative.underspendPct}% potencjału).`,
          timestamp: now,
          confidence: 'review',
        },
      ];

      const repliesEN: ChatMessage[] = [
        {
          id: `ai_a_${Math.random().toString(16).slice(2)}`,
          role: 'assistant',
          text: `Summary: biggest impact came from “${hero}” and ${channel}. ROAS -${narrative.roasDropPct}%, CVR -${narrative.cvrDropPp} pp.`,
          timestamp: now,
          confidence: 'high',
        },
        {
          id: `ai_a_${Math.random().toString(16).slice(2)}`,
          role: 'assistant',
          text: `Today’s plan: 1) check mobile checkout, 2) fix stock-outs (${narrative.stockoutsCount}), 3) scale top campaigns (underspend ~${narrative.underspendPct}%).`,
          timestamp: now,
          confidence: 'review',
        },
      ];

      const replies = isPL ? repliesPL : repliesEN;

      // ensure we’re in AI tab
      setActive('ai');

      // append user immediately
      appendToAI([userMsg]);

      if (reducedMotion) {
        appendToAI(replies);
        return;
      }

      // simulate thinking then streaming assistant
      window.setTimeout(() => appendToAI([replies[0]]), 650);
      window.setTimeout(() => appendToAI([replies[1]]), 1400);
    },
    [appendToAI, isPL, narrative, reducedMotion]
  );

  const onSendAI = useCallback(() => {
    const trimmed = aiInput.trim();
    if (!trimmed) return;
    setAiInput('');
    runAIInteraction(trimmed);
  }, [aiInput, runAIInteraction]);

  // Dynamic CTA per scene
  const ctaLabel = useMemo(() => {
    if (isPL) {
      if (active === 'pipeline') return 'ZOBACZ ALERTY';
      if (active === 'exec') return 'OTWÓRZ RAPORT';
      return 'PRZEJDŹ DO DEMO';
    }
    if (active === 'pipeline') return 'VIEW ALERTS';
    if (active === 'exec') return 'OPEN REPORT';
    return 'GO TO DEMO';
  }, [active, isPL]);

  const onCta = useCallback(() => {
    // keep your route; only enrich query
    navigate(`/dashboard?mode=demo&scene=${active}`);
  }, [active, navigate]);

  const onTogglePlayback = useCallback(() => {
    setPlayback((p) => (p === 'auto' ? 'manual' : 'auto'));
  }, []);

  const playbackLabel = useMemo(() => {
    if (reducedMotion) return isPL ? 'STATIC' : 'STATIC';
    if (playback === 'auto') return isPL ? 'AUTO' : 'AUTO';
    return isPL ? 'MANUAL' : 'MANUAL';
  }, [isPL, playback, reducedMotion]);

  return (
    <div
      className="w-full max-w-xl mx-auto rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0A0A0C]/90 backdrop-blur-3xl shadow-2xl relative"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />
          <span className="text-2xs md:text-xs font-black text-gray-500 tracking-[0.2em] uppercase">
            Papa Guardian
          </span>

          <div className="ml-2 hidden sm:block">
            <NetworkStatus reducedMotion={reducedMotion} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlayback}
            disabled={reducedMotion}
            className={`px-3 py-1.5 rounded-xl text-3xs md:text-2xs font-black tracking-[0.25em] uppercase transition-all border ${
              reducedMotion
                ? 'opacity-50 cursor-not-allowed border-black/10 dark:border-white/10 text-gray-400'
                : playback === 'auto'
                  ? 'border-brand-start/30 bg-brand-start/10 text-brand-start hover:bg-brand-start/15'
                  : 'border-amber-300/25 bg-amber-300/10 text-amber-300 hover:bg-amber-300/15'
            }`}
            aria-label={isPL ? 'Tryb odtwarzania' : 'Playback mode'}
            title={
              reducedMotion
                ? isPL
                  ? 'Preferencje systemu: reduced motion'
                  : 'System preference: reduced motion'
                : undefined
            }
          >
            {playbackLabel}
          </button>

          <div
            className={`w-1.5 h-1.5 rounded-full ${paused ? 'bg-amber-400' : 'bg-emerald-500'} ${reducedMotion ? '' : 'animate-pulse'}`}
          />
        </div>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        className="h-[340px] md:h-[420px] overflow-y-auto p-5 md:p-8 no-scrollbar scroll-smooth flex flex-col"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {safeHistory.map((msg, idx) => (
            <ChatBubble
              key={`${active}-${msg.id}-${idx}`}
              msg={msg}
              isLast={idx === safeHistory.length - 1}
              reducedMotion={reducedMotion}
            />
          ))}
        </AnimatePresence>

        {/* AI mini input */}
        {active === 'ai' && (
          <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => runAIInteraction(p)}
                  className="px-3 py-2 rounded-xl text-2xs font-black uppercase tracking-widest border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-brand-start/30 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 md:h-11 rounded-xl md:rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 flex items-center gap-2">
                <span className="text-brand-start font-black text-xs">&gt;</span>
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSendAI();
                  }}
                  placeholder={isPL ? 'Zadaj pytanie w demo…' : 'Ask a question in demo…'}
                  className="w-full bg-transparent outline-none text-xs-plus md:text-sm2 font-medium text-gray-600 dark:text-gray-300 placeholder:text-gray-400"
                />
              </div>
              <button
                type="button"
                onClick={onSendAI}
                className="h-10 md:h-11 px-4 rounded-xl md:rounded-2xl brand-gradient-bg text-white text-2xs md:text-xs font-black uppercase tracking-widest shadow-xl"
              >
                {isPL ? 'WYŚLIJ' : 'SEND'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-5 md:p-6 border-t border-black/5 dark:border-white/5 bg-black/[0.01]">
        <div className="flex gap-1.5 mb-4 md:mb-6 overflow-x-auto no-scrollbar pb-1">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-3xs md:text-2xs font-black tracking-widest uppercase transition-all shrink-0 ${
                active === tab
                  ? 'brand-gradient-bg text-white shadow-lg'
                  : 'bg-black/5 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t?.vertexPlayer?.tabs?.[tab]?.label ?? tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex-1 h-10 md:h-12 rounded-xl md:rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 flex items-center gap-2">
            <span className="text-brand-start font-black text-xs">&gt;</span>
            <span className="text-xs md:text-xs-plus font-medium text-gray-400 italic">
              {reducedMotion
                ? isPL
                  ? 'Podgląd statyczny (reduced motion)'
                  : 'Static preview (reduced motion)'
                : paused
                  ? isPL
                    ? 'Pauza…'
                    : 'Paused…'
                  : isPL
                    ? 'Przetwarzanie danych…'
                    : 'Processing data…'}
            </span>
          </div>

          <InteractiveButton
            variant="primary"
            onClick={onCta}
            className="!h-10 md:!h-12 !px-4 md:!px-6 !text-2xs md:!text-xs font-black uppercase tracking-widest rounded-xl md:rounded-2xl shadow-xl shrink-0"
          >
            {ctaLabel}
          </InteractiveButton>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-black/5 dark:bg-white/5 w-full relative">
        <motion.div
          className="h-full brand-gradient-bg shadow-[0_0_10px_rgba(78,38,226,0.6)]"
          style={{
            scaleX: autoplayEnabled ? progress : 0,
            transformOrigin: '0%',
          }}
        />
      </div>
    </div>
  );
};
