import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react';
import { Logo } from './Logo';
import { Translation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { createRateLimiter } from '../utils/rate-limit';
import { getWebConfig } from '../config';
import type { AIChatMessage, DateRange, DatePreset, AppMode } from '@papadata/shared';
import { streamChat } from '../data/ai';

/**
 * PapaAI.tsx
 * Ten plik odpowiada za boczny panel czatu „Papa AI” (drawer) w dashboardzie:
 * - zarządza stanem otwarcia (controlled/uncontrolled),
 * - renderuje historię wiadomości + streaming odpowiedzi z API (/api/ai/chat),
 * - obsługuje focus management (focus trap, auto-focus input), ESC do zamknięcia,
 * - wspiera „draftMessage” (np. Explain in AI) oraz ostrzegawcze „chips” zależne od kontekstu.
 */

interface Message {
  id: string;
  role: 'user' | 'papa';
  text: string;
  isStreaming?: boolean;
}

interface PapaAIProps {
  t: Translation;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  aiMode?: boolean;
  draftMessage?: string | null;
  onDraftClear?: () => void;
  contextData?: {
    filters?: Record<string, string>;
    selection?: string[];
  };
}

const createId = (): string => {
  // Bezpieczne, stabilne ID (na wypadek równoległych zdarzeń / szybkich klików).
  // crypto.randomUUID jest dostępne w nowoczesnych przeglądarkach.
  // Fallback zachowuje kompatybilność.
  const randomId = typeof globalThis !== 'undefined' ? globalThis.crypto?.randomUUID?.() : undefined;
  return randomId ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const PapaAI: React.FC<PapaAIProps> = memo(
  ({
    t,
    isOpen: controlledOpen,
    onOpenChange,
    aiMode = true,
    draftMessage,
    onDraftClear,
    contextData,
  }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);
    const streamingMessageIdRef = useRef<string | null>(null);
    const messagesRef = useRef<Message[]>([]);

    const location = useLocation();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

    const lastActiveElementRef = useRef<HTMLElement | null>(null);

    const isControlled = typeof controlledOpen === 'boolean';
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (isControlled) {
          onOpenChange?.(next);
          return;
        }
        setInternalOpen(next);
      },
      [isControlled, onOpenChange],
    );

    const focusTrapRef = useFocusTrap(isOpen);

    const copy = t.papaAI;

    const { max: aiRateMax, windowMs: aiRateWindowMs } = getWebConfig().aiClientRateLimit;
    const rateLimiter = useMemo(
      () => createRateLimiter(aiRateMax, aiRateWindowMs),
      [aiRateMax, aiRateWindowMs],
    );

    const currentView = useMemo(
      () => location.pathname.split('/')[2] || 'Overview',
      [location.pathname],
    );

    const panelTitleId = 'papadata-papaai-title';
    const panelDescId = 'papadata-papaai-desc';

    const tenantId = useMemo(() => {
      if (typeof window === 'undefined') return null;
      return (
        window.localStorage.getItem('pd_active_tenant_id') ||
        window.localStorage.getItem('papadata_user_id') ||
        null
      );
    }, []);

    const dataMode = useMemo(() => {
      const raw = new URLSearchParams(location.search).get('mode') ?? 'demo';
      return raw as AppMode;
    }, [location.search]);

    const warningChips = useMemo(() => {
      const filterValues = Object.values(contextData?.filters ?? {});
      const hasActiveFilters = filterValues.some((value) => value && value !== 'all');
      const hasSelection = (contextData?.selection?.length ?? 0) > 0;
      const timeRange = contextData?.filters?.timeRange;
      const isStaleRange = ['90d', 'ytd', 'qtd', 'custom'].includes(timeRange ?? '');

      return [
        { id: 'stale', label: copy.warning_stale, show: isStaleRange },
        { id: 'missing', label: copy.warning_missing, show: !hasActiveFilters && !hasSelection },
        { id: 'locked', label: copy.warning_locked, show: !aiMode },
      ].filter((item) => item.show);
    }, [
      aiMode,
      contextData?.filters,
      contextData?.selection,
      copy.warning_locked,
      copy.warning_missing,
      copy.warning_stale,
    ]);

    const trimHistory = useCallback((next: Message[]) => {
      if (next.length <= 30) return next;
      return next.slice(-30);
    }, []);

    useEffect(() => {
      messagesRef.current = messages;
    }, [messages]);

    const stopStreaming = useCallback(() => {
      const streamingId = streamingMessageIdRef.current;
      if (!streamingId) return;

      setMessages((prev) => prev.map((m) => (m.id === streamingId ? { ...m, isStreaming: false } : m)));
      streamingMessageIdRef.current = null;
    }, []);

    const handleCancel = useCallback(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setIsTyping(false);
      stopStreaming();
    }, [stopStreaming]);

    const buildDateRange = useCallback((): DateRange => {
      const preset = (contextData?.filters?.timeRange ?? '30d') as DatePreset;
      const now = new Date();
      const end = new Date(now);

      const start = new Date(now);
      if (preset === '1d') start.setDate(now.getDate() - 1);
      else if (preset === '7d') start.setDate(now.getDate() - 7);
      else if (preset === '30d') start.setDate(now.getDate() - 30);
      else if (preset === '90d') start.setDate(now.getDate() - 90);
      else if (preset === 'mtd') start.setDate(1);
      else if (preset === 'qtd') {
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        start.setMonth(quarterStartMonth, 1);
      } else if (preset === 'ytd') start.setMonth(0, 1);

      const toIso = (d: Date) => d.toISOString().slice(0, 10);
      return { start: toIso(start), end: toIso(end), preset };
    }, [contextData?.filters?.timeRange]);

    const sendPrompt = useCallback(
      async (promptTextRaw: string) => {
        const promptText = promptTextRaw.trim();
        if (!promptText || isTyping || !aiMode) return;

        if (!rateLimiter.tryConsume()) {
          const retryAfterMs = rateLimiter.getRetryAfterMs();
          const retrySeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
          const rateLimitMessage =
            copy.rate_limit?.replace('{seconds}', String(retrySeconds)) ??
            `Zbyt wiele zapytań. Spróbuj ponownie za ${retrySeconds}s.`;
          setMessages((prev) => [...prev, { id: createId(), role: 'papa', text: rateLimitMessage }]);
          return;
        }

        const userMessage: Message = { id: createId(), role: 'user', text: promptText };
        const assistantMessageId = createId();

        streamingMessageIdRef.current = assistantMessageId;

        setMessages((prev) =>
          trimHistory([
            ...prev,
            userMessage,
            { id: assistantMessageId, role: 'papa', text: '', isStreaming: true },
          ]),
        );

        setInputValue('');
        setIsTyping(true);

        const baseMessages = messagesRef.current
          .filter((m) => m.id !== 'welcome' && m.text.trim())
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          }))
          .slice(-29);

        const apiMessages: AIChatMessage[] = [
          ...baseMessages,
          { role: 'user', content: promptText }
        ];

        const dateRange = buildDateRange();

        const runStream = async (attempt: number) => {
          // Anuluj poprzednie żądanie jeśli jeszcze trwa (defensywnie).
          if (abortControllerRef.current) abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();

          let fullText = '';

          await streamChat(
            {
              tenantId,
              prompt: promptText,
              messages: apiMessages,
              context: {
                view: currentView,
                dateRange,
                filters: undefined,
                dataMode,
                activeView: currentView,
              },
            },
            {
              signal: abortControllerRef.current.signal,
              onToken: (token) => {
                fullText += token;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMessageId ? { ...m, text: fullText } : m)),
                );
              },
              onDone: () => {
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMessageId ? { ...m, isStreaming: false } : m)),
                );
                streamingMessageIdRef.current = null;
                setIsTyping(false);
                abortControllerRef.current = null;
              },
              onError: (err) => {
                const fallbackError = t.papaAI.error_generic;

                if (err.isNetworkError && attempt === 0) {
                  void runStream(1);
                  return;
                }

                const requestId = err.requestId ? ` (Request ID: ${err.requestId})` : '';
                const resolvedError = `${err.message || fallbackError}${requestId}`;

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, text: resolvedError, isStreaming: false }
                      : m,
                  ),
                );
                streamingMessageIdRef.current = null;
                setIsTyping(false);
                abortControllerRef.current = null;
              },
            },
          );
        };

        try {
          await runStream(0);
        } catch {
          setIsTyping(false);
          abortControllerRef.current = null;
        }
      },
      [
        aiMode,
        buildDateRange,
        currentView,
        dataMode,
        isTyping,
        copy,
        rateLimiter,
        tenantId,
        trimHistory,
        t.papaAI.error_generic
      ],
    );

    const handleSend = useCallback(
      async (e?: React.FormEvent<HTMLFormElement>, manualPrompt?: string) => {
        e?.preventDefault();
        const prompt = (manualPrompt ?? inputValue).trim();
        if (!prompt) return;
        await sendPrompt(prompt);
      },
      [inputValue, sendPrompt],
    );

    // Focus: zapamiętaj element aktywny przed otwarciem + przywróć po zamknięciu.
    useEffect(() => {
      if (typeof document === 'undefined') return;

      if (isOpen) {
        lastActiveElementRef.current = document.activeElement as HTMLElement | null;
        return;
      }

      // przy zamknięciu: preferuj toggle (spójny powrót), fallback: poprzedni aktywny element
      window.setTimeout(() => {
        if (toggleBtnRef.current) {
          toggleBtnRef.current.focus();
          return;
        }
        lastActiveElementRef.current?.focus?.();
      }, 0);
    }, [isOpen]);

    // ESC do zamknięcia
    useEffect(() => {
      if (!isOpen) return;

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          setOpen(false);
        }
      };

      // capture = true, żeby ESC działał nawet jeśli fokus jest w środku inputów/komponentów
      document.addEventListener('keydown', handleEsc, true);
      return () => document.removeEventListener('keydown', handleEsc, true);
    }, [isOpen, setOpen]);

    // Scroll na dół przy nowych wiadomościach
    useEffect(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    // Draft z „Explain in AI”
    useEffect(() => {
      if (!draftMessage) return;

      setOpen(true);
      void sendPrompt(draftMessage);
      onDraftClear?.();
    }, [draftMessage, onDraftClear, sendPrompt, setOpen]);

    // Przy otwarciu: welcome + autofocus input
    useEffect(() => {
      if (!isOpen) return;

      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return trimHistory([{ id: 'welcome', role: 'papa', text: copy.intro }]);
      });

      const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(focusTimer);
    }, [copy.intro, isOpen, trimHistory]);

    // Gdy zamykasz panel w trakcie streamingu: anuluj request, żeby nie zostawiać „żyjącego” fetch’a w tle
    useEffect(() => {
      if (isOpen) return;
      if (isTyping || streamingMessageIdRef.current) {
        handleCancel();
      }
    }, [handleCancel, isOpen, isTyping]);

    // Cleanup na unmount
    useEffect(() => {
      return () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
      };
    }, []);

    const suggestions = useMemo(
      () =>
        t.papaAI.suggestions?.map((s) => ({
          label: s.label,
          prompt: s.prompt.replace('{view}', currentView),
        })) ?? [],
      [currentView, t.papaAI.suggestions],
    );

    const handleToggle = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

    return (
      <>
        {/* Floating Toggle Button
            UWAGA: gdy drawer jest otwarty, ukrywamy FAB, żeby nie nachodził na inne fixed-elementy / modale. */}
        {!isOpen && (
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={handleToggle}
            aria-label={t.papaAI.toggle_label}
            aria-haspopup="dialog"
            aria-expanded={false}
            className="fixed z-[2000] w-16 h-16 brand-gradient-bg rounded-2xl flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden border border-white/20"
            style={{
              bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
              right: 'calc(1.5rem + env(safe-area-inset-right, 0px))',
            }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </button>
        )}

        {/* Backdrop (ZAWSZE, także na desktop) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="papaai-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-[3000] bg-black/30 backdrop-blur-sm sm:bg-black/20 sm:backdrop-blur-[2px]"
            />
          )}
        </AnimatePresence>

        {/* Right Drawer Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={focusTrapRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={panelTitleId}
              aria-describedby={panelDescId}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-white dark:bg-[#070709] border-l border-black/10 dark:border-white/5 z-[3050] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center shadow-lg">
                      <Logo className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4
                        id={panelTitleId}
                        className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white"
                      >
                        Papa AI Agent
                      </h4>
                      <div id={panelDescId} className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          Kontekst: {currentView}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t.papaAI.close_label}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {warningChips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {warningChips.map((warning) => (
                      <span
                        key={warning.id}
                        className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/30 text-amber-500 bg-amber-500/10"
                      >
                        {warning.label}
                      </span>
                    ))}
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-reveal`}>
                    <div
                      className={`max-w-[90%] p-5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-start text-white rounded-tr-none font-semibold shadow-lg'
                          : 'bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none font-medium'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-brand-start animate-pulse align-middle" />}

                      {/* Meta Actions for AI Responses */}
                      {msg.role === 'papa' && !msg.isStreaming && msg.id !== 'welcome' && (
                        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
                          >
                            {t.papaAI.set_alert}
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-brand-start/10 text-brand-start text-xs font-black uppercase border border-brand-start/20 hover:bg-brand-start hover:text-white transition-all"
                          >
                            {t.papaAI.add_to_report}
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-gray-500 text-xs font-black uppercase border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            {t.papaAI.evidence_label}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => void handleSend(undefined, s.prompt)}
                      className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-xs font-bold text-gray-500 hover:text-brand-start border border-transparent hover:border-brand-start/30 transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={copy.placeholder}
                    disabled={!aiMode}
                    className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-medium outline-none focus:border-brand-start/50 transition-all text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isTyping ? (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="h-12 px-4 rounded-xl bg-rose-500 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                      title={t.papaAI.cancel_label}
                      aria-label={t.papaAI.cancel_label}
                    >
                      Stop generating
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      aria-label={t.papaAI.send}
                      className="h-12 w-12 rounded-xl brand-gradient-bg text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" />
                      </svg>
                    </button>
                  )}
                </form>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest opacity-40">
                    {t.papaAI.footer_text}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  },
);

PapaAI.displayName = 'PapaAI';
