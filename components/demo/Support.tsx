// components/demo/Support.tsx
import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageCircle,
  Mail,
  BookOpen,
  Sparkles,
  Clock,
  ArrowRight,
  HeadphonesIcon,
} from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
  isDemo?: boolean;
}

const cardBase =
  'rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_18px_45px_rgba(15,23,42,0.85)]';

const Support: React.FC<Props> = ({ lang, isDemo = true }) => {
  const [showLockedModal, setShowLockedModal] = useState(false);
  const isPL = lang === 'PL';

  const t = {
    title: isPL ? 'Wsparcie i kontakt' : 'Support & contact',
    subtitle: isDemo
      ? isPL
        ? 'Zobacz, jak wygląda panel wsparcia. Część opcji jest dostępna dopiero po przejściu z triala na pełną współpracę.'
        : 'See how the support panel looks. Some options are available after trial when cooperation is extended.'
      : isPL
        ? 'Tu zgłaszasz zadania, incydenty i pomysły na nowe raporty.'
        : 'Here you submit tasks, incidents and ideas for new reports.',
    quickHelpTitle: isPL ? 'Szybka pomoc' : 'Quick help',
    contactTitle: isPL ? 'Kanały kontaktu' : 'Contact channels',
    premiumTitle: isPL ? 'Priorytetowe wsparcie (po 14 dniach)' : 'Priority support (after 14 days)',
    premiumDesc: isPL
      ? 'Dostęp do dedykowanego opiekuna i priorytetowej kolejki ticketów odblokowujemy po przedłużeniu współpracy po okresie trial.'
      : 'Dedicated account manager and priority ticket queue are available after you extend the cooperation post trial.',
    premiumCta: isPL ? 'Jak działa priorytetowe wsparcie?' : 'How does priority support work?',
    modalTitle: isPL ? 'Priorytetowe wsparcie po 14 dniach' : 'Priority support after 14 days',
    modalDesc: isPL
      ? 'Tryb priorytetowego wsparcia uruchamiamy po okresie testowym, kiedy decydujesz się na stałą współpracę. Dzięki temu możemy reagować szybciej i planować zmiany w raportach w cyklach miesięcznych.'
      : 'Priority support mode is enabled after the trial, once you decide to continue the cooperation. It lets us react faster and plan report changes on a monthly cadence.',
  };

  const quickHelpItems = isPL
    ? [
        {
          icon: BookOpen,
          title: 'Jak zgłosić błąd w danych?',
          text: 'Krótka checklista: co sprawdzić zanim zgłosisz problem z raportem.',
        },
        {
          icon: Sparkles,
          title: 'Propozycja nowego raportu',
          text: 'Jak opisać potrzeby biznesowe, żebyśmy mogli zaprojektować raport.',
        },
      ]
    : [
        {
          icon: BookOpen,
          title: 'How to report data issues?',
          text: 'Short checklist: what to check before reporting data problems.',
        },
        {
          icon: Sparkles,
          title: 'Suggest a new report',
          text: 'How to describe your business needs for a new report.',
        },
      ];

  const channels = isPL
    ? [
        {
          icon: MessageCircle,
          label: 'Panel zgłoszeń',
          desc: 'Tworzenie ticketów dla błędów, zadań i zmian w raportach.',
          badge: 'Standard',
        },
        {
          icon: Mail,
          label: 'E-mail',
          desc: 'Dla tematów strategicznych i ustaleń biznesowych.',
          badge: 'Biznes',
        },
        {
          icon: HeadphonesIcon,
          label: 'Status techniczny',
          desc: 'Informacje o pracach serwisowych i SLA.',
          badge: 'Status',
        },
      ]
    : [
        {
          icon: MessageCircle,
          label: 'Ticket panel',
          desc: 'Create tickets for bugs, tasks and report changes.',
          badge: 'Standard',
        },
        {
          icon: Mail,
          label: 'E-mail',
          desc: 'For strategic topics and business agreements.',
          badge: 'Business',
        },
        {
          icon: HeadphonesIcon,
          label: 'Technical status',
          desc: 'Information about maintenance windows and SLA.',
          badge: 'Status',
        },
      ];

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-6 md:px-6 md:py-8 text-slate-50">
      {/* Góra sekcji */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-slate-900/80 px-3 py-1 text-xs font-medium text-primary-300 mb-3">
            <LifeBuoy className="h-4 w-4" />
            <span>{isPL ? 'Wsparcie' : 'Support'}</span>
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
              {isPL ? 'Standardowe SLA' : 'Standard SLA'}
            </p>
            <p className="text-[11px] font-medium text-slate-100">
              {isPL ? 'Reakcja w 1 dzień roboczy' : 'Response within 1 business day'}
            </p>
          </div>
        </div>
      </div>

      {/* Główna siatka */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Kolumna 1 – szybka pomoc */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {t.quickHelpTitle}
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {quickHelpItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-3 hover:border-primary-500/60 hover:bg-slate-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                      <Icon className="h-4 w-4 text-primary-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-50 mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">{item.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {isPL ? 'Co zgłaszać w pierwszej kolejności?' : 'What to report first?'}
              </h3>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li>
                • {isPL ? 'Różnice w liczbach między systemami.' : 'Differences in numbers across systems.'}
              </li>
              <li>
                • {isPL ? 'Brak danych za konkretne dni.' : 'Missing data for specific days.'}
              </li>
              <li>
                • {isPL ? 'Błędy w marży / kosztach.' : 'Errors in margin / costs.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Kolumna 2 – kanały kontaktu */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`${cardBase} p-5 h-full flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {t.contactTitle}
                </h2>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <div
                    key={ch.label}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-3 flex items-start gap-3 text-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                      <Icon className="h-4 w-4 text-primary-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-50">
                          {ch.label}
                        </p>
                        <span className="px-2 py-0.5 rounded-full border border-slate-700 text-[10px] text-slate-300">
                          {ch.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{ch.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
              <LifeBuoy className="h-3 w-3 text-primary-300" />
              {isPL
                ? 'Dane wrażliwe (np. marże) omawiamy tylko przez bezpieczne kanały.'
                : 'Sensitive topics (e.g. margins) are handled only via secure channels.'}
            </p>
          </div>
        </div>

        {/* Kolumna 3 – priorytet po 14 dniach */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`${cardBase} p-5 border-dashed border-primary-500/60 bg-slate-950/80`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-primary-500/60">
                <HeadphonesIcon className="h-4 w-4 text-primary-300" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-50">
                  {t.premiumTitle}
                </h3>
                <p className="text-xs text-slate-400">{t.premiumDesc}</p>
                <button
                  type="button"
                  onClick={() => setShowLockedModal(true)}
                  className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-300 hover:text-primary-200"
                >
                  {t.premiumCta}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardBase} p-4`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="h-3.5 w-3.5 text-primary-300" />
              <p className="text-xs font-semibold text-slate-100">
                {isPL ? 'Godziny pracy zespołu' : 'Support office hours'}
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              {isPL
                ? 'Standardowo pracujemy w dni robocze 9:00–17:00 (CET). Dla klientów z priorytetem ustalamy indywidualne okna wsparcia.'
                : 'We work on business days 9:00–17:00 (CET). For priority clients we agree dedicated support windows.'}
            </p>
          </div>
        </div>
      </div>

      {/* Modal locked po 14 dniach */}
      {showLockedModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setShowLockedModal(false)}
        >
          <div
            className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-xl shadow-black/60 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs"
              onClick={() => setShowLockedModal(false)}
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3">
              <HeadphonesIcon className="h-4 w-4 text-primary-300" />
              <h3 className="text-lg font-semibold text-slate-50">
                {t.modalTitle}
              </h3>
            </div>
            <p className="text-sm text-slate-300 mb-3">{t.modalDesc}</p>
            <ul className="text-xs text-slate-400 space-y-1.5 mb-4">
              {isPL ? (
                <>
                  <li>1. Najpierw korzystasz z triala i poznajesz raporty.</li>
                  <li>2. Po 14 dniach decydujesz o przedłużeniu współpracy.</li>
                  <li>3. Ustalamy priorytety raportowe i zasady obsługi ticketów.</li>
                </>
              ) : (
                <>
                  <li>1. First you use the trial and explore reports.</li>
                  <li>2. After 14 days you decide to extend the cooperation.</li>
                  <li>3. We agree reporting priorities and ticket handling rules.</li>
                </>
              )}
            </ul>
            <button
              type="button"
              onClick={() => setShowLockedModal(false)}
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 hover:border-primary-500/70 hover:text-primary-200"
            >
              {isPL ? 'Zamknij' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
