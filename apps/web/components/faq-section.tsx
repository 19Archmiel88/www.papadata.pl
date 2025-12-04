'use client';

import { useState } from 'react';
import { useI18n } from '@papadata/i18n';
import { ChevronDown, ShieldCheck } from 'lucide-react';

type FaqItem<TKey> = {
  id: string;
  questionKey: TKey;
  answerKey: TKey;
};

export function FaqSection() {
  const t = useI18n();
  type TKey = Parameters<typeof t>[0];

  const items: FaqItem<TKey>[] = [
    {
      id: 'features',
      questionKey: 'landing.faq.items.features.question' as TKey,
      answerKey: 'landing.faq.items.features.answer' as TKey,
    },
    {
      id: 'personalData',
      questionKey: 'landing.faq.items.personalData.question' as TKey,
      answerKey: 'landing.faq.items.personalData.answer' as TKey,
    },
    {
      id: 'retention',
      questionKey: 'landing.faq.items.retention.question' as TKey,
      answerKey: 'landing.faq.items.retention.answer' as TKey,
    },
    {
      id: 'competition',
      questionKey: 'landing.faq.items.competition.question' as TKey,
      answerKey: 'landing.faq.items.competition.answer' as TKey,
    },
    {
      id: 'security',
      questionKey: 'landing.faq.items.security.question' as TKey,
      answerKey: 'landing.faq.items.security.answer' as TKey,
    },
    {
      id: 'gdpr',
      questionKey: 'landing.faq.items.gdpr.question' as TKey,
      answerKey: 'landing.faq.items.gdpr.answer' as TKey,
    },
    {
      id: 'afterCancel',
      questionKey: 'landing.faq.items.afterCancel.question' as TKey,
      answerKey: 'landing.faq.items.afterCancel.answer' as TKey,
    },
    {
      id: 'connections',
      questionKey: 'landing.faq.items.connections.question' as TKey,
      answerKey: 'landing.faq.items.connections.answer' as TKey,
    },
  ];

  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section
      id="security"
      className="border-t border-slate-800 bg-slate-950/80 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          {/* Kolumna FAQ */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              {t('landing.faq.sectionTitle')}
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-300">
              {t('landing.faq.sectionSubtitle')}
            </p>

            <div className="mt-8 space-y-2">
              {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/40"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenId(isOpen ? null : item.id)
                      }
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm md:text-base"
                    >
                      <span className="font-medium text-slate-100">
                        {t(item.questionKey)}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 flex-none text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs md:text-sm text-slate-300">
                        <p className="leading-relaxed">
                          {t(item.answerKey)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolumna – highlight bezpieczeństwa */}
          <aside className="rounded-2xl border border-emerald-700/60 bg-gradient-to-b from-slate-900 to-slate-950 p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-slate-50">
                {t('landing.faq.securityHighlight.title')}
              </h3>
            </div>

            <ul className="mt-4 space-y-2 text-xs md:text-sm text-slate-200">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {t(
                    'landing.faq.securityHighlight.item.encryption'
                  )}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {t(
                    'landing.faq.securityHighlight.item.isolation'
                  )}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {t('landing.faq.securityHighlight.item.gcp')}
                </span>
              </li>
            </ul>

            <p className="mt-4 text-xs md:text-sm text-slate-400">
              {t('landing.faq.securityHighlight.note')}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
