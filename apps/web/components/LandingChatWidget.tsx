// apps/web/components/LandingChatWidget.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useModal } from '../context/useModal';

type ChatMessage = {
  id: string;
  role: 'user' | 'papa';
  text: string;
};

const createId = (): string => {
  const randomId = typeof globalThis !== 'undefined' ? globalThis.crypto?.randomUUID?.() : undefined;
  return randomId ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const LandingChatWidget: React.FC<{
  lang: string;
  onStartTrial: () => void;
}> = ({ lang, onStartTrial }) => {
  const { activeModal } = useModal();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isDisabled = Boolean(activeModal);

  const copy = useMemo(() => {
    const isPL = String(lang).toLowerCase().startsWith('pl');
    return {
      label: isPL ? 'Papa AI — czat' : 'Papa AI — chat',
      title: 'Papa AI',
      subtitle: isPL ? 'Demo na stronie głównej' : 'Homepage demo',
      hello: isPL
        ? 'Cześć! To demo czatu. Zaloguj się, żeby rozmawiać z Papa AI na własnych danych.'
        : 'Hi! This is a demo chat. Sign in to use Papa AI on your own data.',
      placeholder: isPL ? 'Zadaj pytanie…' : 'Ask a question…',
      send: isPL ? 'Wyślij' : 'Send',
      startTrial: isPL ? 'Testuj 14 dni' : 'Start 14-day trial',
      disclaimer: isPL ? 'Wersja demo — odpowiedzi są symulowane.' : 'Demo — responses are simulated.',
      demoReply: isPL
        ? 'W wersji produkcyjnej Papa AI odpowiada w oparciu o Twoje dane (marts) i kontekst w dashboardzie.'
        : 'In production, Papa AI answers using your data (marts) and dashboard context.',
      close: isPL ? 'Zamknij czat' : 'Close chat',
      open: isPL ? 'Otwórz czat' : 'Open chat',
    };
  }, [lang]);

  // Gdy otwiera się jakikolwiek modal — zamykamy popover czatu i blokujemy interakcje.
  useEffect(() => {
    if (!isDisabled) return;
    setIsOpen(false);
  }, [isDisabled]);

  useEffect(() => {
    if (!isOpen) return;
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{ id: createId(), role: 'papa', text: copy.hello }];
    });
  }, [copy.hello, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isOpen, messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    setMessages((prev) => [...prev, { id: createId(), role: 'user', text: trimmed }]);

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: createId(), role: 'papa', text: copy.demoReply }]);
    }, 450);
  };

  return (
    <div className={`relative ${isDisabled ? 'pointer-events-none opacity-30' : ''}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="absolute bottom-14 right-0 w-[min(380px,calc(100vw-3rem))] rounded-[1.75rem] glass border border-black/10 dark:border-white/10 shadow-[0_35px_110px_rgba(0,0,0,0.38)] overflow-hidden"
            role="dialog"
            aria-label={copy.label}
          >
            <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-black tracking-[0.18em] text-gray-900 dark:text-white truncate">
                  {copy.title}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                  {copy.subtitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label={copy.close}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="max-h-[340px] overflow-y-auto p-4 space-y-3 no-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed border shadow-sm ${
                      m.role === 'user'
                        ? 'brand-gradient-bg text-white border-transparent rounded-tr-none'
                        : 'bg-white/90 dark:bg-[#0b0b0f]/80 text-gray-800 dark:text-gray-200 border-black/5 dark:border-white/10 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={copy.placeholder}
                  className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-start/50 transition-all text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-11 h-11 rounded-2xl brand-gradient-bg text-white flex items-center justify-center shadow-lg hover:scale-[1.02] active:scale-[0.985] transition-all disabled:opacity-40 disabled:pointer-events-none"
                  aria-label={copy.send}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" />
                  </svg>
                </button>
              </form>

              <button
                type="button"
                onClick={onStartTrial}
                className="w-full py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-brand-start/40 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-xs-plus font-black tracking-[0.14em] text-gray-800 dark:text-gray-100"
              >
                {copy.startTrial}
              </button>

              <div className="text-xs text-gray-500 dark:text-gray-400 text-center opacity-80">
                {copy.disclaimer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="h-12 px-4 rounded-2xl glass border border-black/10 dark:border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.22)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.55)] flex items-center gap-3 text-xs-plus font-black tracking-[0.14em] text-gray-800 dark:text-gray-100 hover:border-brand-start/50 hover:scale-[1.02] active:scale-[0.985] transition-all"
        aria-label={isOpen ? copy.close : copy.open}
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-2xl brand-gradient-bg flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M8 10h8m-8 4h6m5 6l-3-3H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <span className="hidden sm:inline">{copy.label}</span>
        <span className="sm:hidden">AI</span>
      </button>
    </div>
  );
};
