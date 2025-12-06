import React, { useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { Translation } from '../../types';

interface Props {
  t: Translation;
}

type FaqItemEntry = Translation['faq']['items'][keyof Translation['faq']['items']];
type SecurityCard = Translation['security']['cards'][keyof Translation['security']['cards']];

const FaqSection: React.FC<Props> = ({ t }) => {
  const faqItems = (Object.entries(t.faq.items) as [string, FaqItemEntry][]).map(
    ([key, item]) => ({
      id: key,
      question: item.q,
      answer: item.a,
    }),
  );
  const securityCards = Object.values(t.security.cards) as SecurityCard[];

  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section
      id="security"
      className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          {/* FAQ Column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {t.faq.title}
            </h2>
            
            <div className="mt-8 space-y-2">
              {faqItems.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenId(isOpen ? null : item.id)
                      }
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm md:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-xl transition-colors"
                    >
                      <span className="font-medium">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 flex-none text-slate-500 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs md:text-sm text-slate-600 dark:text-slate-400">
                        <p className="leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Highlight Column */}
          <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
                {t.security.title}
              </h3>
            </div>

            <div className="mt-4 space-y-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
              <p>{t.security.mainCard.desc}</p>
            </div>
            
            <ul className="mt-4 space-y-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
                {securityCards.map((card, idx) => (
                     <li key={idx} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
                        <span>
                          <strong>{card.title}:</strong> {card.desc}
                        </span>
                     </li>
                ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
