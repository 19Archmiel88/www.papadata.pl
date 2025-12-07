// components/demo/Support.tsx
import React, { useState } from 'react';
import {
  LifeBuoy,
  Mail,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Headphones,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
  /** czy to tryb demo (zamiast prawdziwego wysyłania zgłoszeń) */
  isDemo?: boolean;
}

const cardBase =
  'rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_18px_45px_rgba(15,23,42,0.85)]';

type Channel = 'ticket' | 'email' | 'chat';
type Category = 'bug' | 'question' | 'idea';
type Impact = 'low' | 'normal' | 'high';

const Support: React.FC<Props> = ({ lang, isDemo = true }) => {
  const isPL = lang === 'PL';

  const [channel, setChannel] = useState<Channel>('ticket');
  const [category, setCategory] = useState<Category>('bug');
  const [impact, setImpact] = useState<Impact>('normal');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = {
    badge: isPL ? 'Wsparcie i sukces klienta' : 'Support & customer success',
    title: isPL ? 'Wsparcie PapaData' : 'PapaData Support',
    subtitle: isPL
      ? 'Pomagamy ogarnąć dane, raporty i integracje. W trybie demo zobaczysz, jak wygląda obsługa zgłoszeń.'
      : 'We help you with data, reports and integrations. In demo mode you can see how support works.',

    channelsTitle: isPL ? 'Kanały kontaktu' : 'Contact channels',
    ticketLabel: isPL ? 'Zgłoszenie z panelu' : 'Ticket from dashboard',
    emailLabel: 'support@papadata.pl',
    chatLabel: isPL ? 'Czat (Slack / komunikator)' : 'Chat (Slack / messenger)',

    channelDescriptions: {
      ticket: isPL
        ? 'Rekomendowany – pełny kontekst konta, integracji i środowiska.'
        : 'Recommended – full context of your account, integrations and workspace.',
      email: isPL
        ? 'Dla spraw ogólnych. Dołącz zrzuty ekranu i ID klienta/sklepu.'
        : 'For general topics. Attach screenshots and client/store ID.',
      chat: isPL
        ? 'Dla klientów po okresie trial – szybkie pytania 1:1.'
        : 'For post-trial customers – quick questions 1:1.',
    } as Record<Channel, string>,

    slaTitle: isPL ? 'SLA i priorytety' : 'SLA & priorities',
    slaBullets: isPL
      ? [
          'Zgłoszenia krytyczne (brak danych, błędne liczby) – reakcja do 4h w dni robocze.',
          'Pozostałe zgłoszenia – odpowiedź zazwyczaj w ciągu 1 dnia roboczego.',
          'Klienci po przedłużeniu współpracy mają dostęp do dedykowanego opiekuna.',
        ]
      : [
          'Critical issues (no data, wrong numbers) – response within 4h on business days.',
          'Other tickets – usually within 1 business day.',
          'Post-trial customers with extended plan get a dedicated account manager.',
        ],

    formTitle: isPL ? 'Otwórz zgłoszenie' : 'Open a ticket',
    formDemoHint: isDemo
      ? isPL
        ? 'W wersji demo zgłoszenie nie jest wysyłane – pokazujemy tylko przebieg procesu.'
        : 'In demo mode the ticket is not actually sent – this is a preview of the flow.'
      : undefined,
    subjectLabel: isPL ? 'Temat zgłoszenia' : 'Ticket subject',
    descLabel: isPL ? 'Opis problemu lub pytania' : 'Problem / question description',
    descPlaceholder: isPL
      ? 'Opisz krótko co widzisz w panelu, czego się spodziewałeś i czy problem jest powtarzalny.'
      : 'Describe what you see in the panel, what you expected and if the problem is reproducible.',
    categoryLabel: isPL ? 'Typ zgłoszenia' : 'Ticket type',
    impactLabel: isPL ? 'Wpływ na biznes' : 'Business impact',

    categoryOptions: {
      bug: isPL ? 'Błąd / dane' : 'Bug / data issue',
      question: isPL ? 'Pytanie o raporty' : 'Question about reports',
      idea: isPL ? 'Propozycja funkcji' : 'Feature request',
    } as Record<Category, string>,

    impactOptions: {
      low: isPL ? 'Niski (kosmetyka)' : 'Low (cosmetic)',
      normal: isPL ? 'Średni (utrudnia pracę)' : 'Medium (slows work)',
      high: isPL ? 'Wysoki (blokuje decyzje)' : 'High (blocks decisions)',
    } as Record<Impact, string>,

    submitLabel: isPL ? 'Wyślij zgłoszenie' : 'Send ticket',
    submittedTitle: isPL ? 'Zgłoszenie zapisane (demo)' : 'Ticket captured (demo)',
    submittedText: isPL
      ? 'W prawdziwym środowisku ticket trafiłby do systemu wsparcia razem z kontekstem Twojego konta.'
      : 'In a real environment this ticket would be sent to the support system with your account context.',

    recentTitle: isPL ? 'Ostatnie zgłoszenia (przykład)' : 'Recent tickets (example)',
    knowledgeTitle: isPL ? 'Baza wiedzy i playbooki' : 'Knowledge base & playbooks',
    knowledgeText: isPL
      ? 'Skróty do najczęściej używanych materiałów: integracje, model danych, przykładowe analizy.'
      : 'Shortcuts to the most used materials: integrations, data model, example analyses.',
    knowledgeCta: isPL ? 'Przejdź do Akademii' : 'Go to Academy',

    premiumNoteTitle: isPL
      ? 'Konsultacje premium po 14 dniach'
      : 'Premium consulting after 14 days',
    premiumNoteText: isPL
      ? 'Indywidualne sesje 1:1 i przeglądy raportów są dostępne po zakończeniu okresu trial i przedłużeniu współpracy.'
      : '1:1 sessions and report reviews are available after trial when you extend the cooperation.',
  };

  const recentTickets = isPL
    ? [
        {
          id: '#PD-1042',
          title: 'Rozjazd przychodu między PapaData a GA4',
          status: 'Zamknięte',
          eta: 'rozwiązane w 1 dzień',
        },
        {
          id: '#PD-1037',
          title: 'Nowy widok – raport marży po dostawcach',
          status: 'W toku',
          eta: 'propozycja w opracowaniu',
        },
        {
          id: '#PD-1029',
          title: 'Problem z autoryzacją Google Ads',
          status: 'Zamknięte',
          eta: 'naprawione w 4h',
        },
      ]
    : [
        {
          id: '#PD-1042',
          title: 'Revenue mismatch between PapaData and GA4',
          status: 'Closed',
          eta: 'resolved within 1 day',
        },
        {
          id: '#PD-1037',
          title: 'New view – margin report by vendor',
          status: 'In progress',
          eta: 'proposal in progress',
        },
        {
          id: '#PD-1029',
          title: 'Google Ads authorization issue',
          status: 'Closed',
          eta: 'fixed within 4h',
        },
      ];

  const canSubmit = subject.trim().length > 4 && description.trim().length > 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    // w prawdziwym środowisku tutaj szedłby request do backendu / systemu ticketowego
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-6 md:px-6 md:py-8 text-slate-50">
      {/* Nagłówek sekcji */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-slate-900/80 px-3 py-1 text-xs font-medium text-primary-300 mb-3">
            <LifeBuoy className="h-4 w-4" />
            <span>{t.badge}</span>
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
            <Headphones className="h-4 w-4 text-primary-300" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400">
              {isPL ? 'Godziny wsparcia' : 'Support hours'}
            </p>
            <p className="text-sm font-medium text-slate-100">
              {isPL ? 'Pon–Pt, 9:00–17:00 (CET)' : 'Mon–Fri, 9:00–17:00 (CET)'}
            </p>
          </div>
        </div>
      </div>

      {/* Główna siatka */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Kolumna 1 – kanały i SLA */}
        <div className="space-y-4 lg:col-span-1">
          {/* Kanały kontaktu */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {t.channelsTitle}
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {/* Ticket */}
              <button
                type="button"
                onClick={() => setChannel('ticket')}
                className={`w-full text-left rounded-xl border px-3.5 py-3 text-sm transition-colors flex items-start gap-3 ${
                  channel === 'ticket'
                    ? 'border-primary-500/70 bg-slate-900/80'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                  <LifeBuoy className="h-4 w-4 text-primary-300" />
                </div>
                <div>
                  <p className="font-semibold text-slate-50 mb-0.5">
                    {t.ticketLabel}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.channelDescriptions.ticket}
                  </p>
                </div>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`w-full text-left rounded-xl border px-3.5 py-3 text-sm transition-colors flex items-start gap-3 ${
                  channel === 'email'
                    ? 'border-primary-500/70 bg-slate-900/80'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                  <Mail className="h-4 w-4 text-primary-300" />
                </div>
                <div>
                  <p className="font-semibold text-slate-50 mb-0.5">
                    {t.emailLabel}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.channelDescriptions.email}
                  </p>
                </div>
              </button>

              {/* Chat */}
              <button
                type="button"
                onClick={() => setChannel('chat')}
                className={`w-full text-left rounded-xl border px-3.5 py-3 text-sm transition-colors flex items-start gap-3 ${
                  channel === 'chat'
                    ? 'border-primary-500/70 bg-slate-900/80'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                  <MessageCircle className="h-4 w-4 text-primary-300" />
                </div>
                <div>
                  <p className="font-semibold text-slate-50 mb-0.5">
                    {t.chatLabel}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.channelDescriptions.chat}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* SLA */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {t.slaTitle}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              {t.slaBullets.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-primary-300" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kolumna 2 – formularz */}
        <div className="lg:col-span-1">
          <div className={`${cardBase} p-5 h-full flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {t.formTitle}
                </h2>
              </div>
            </div>

            {t.formDemoHint && (
              <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-200 flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5" />
                <span>{t.formDemoHint}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              {/* Temat */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  {t.subjectLabel}
                </label>
                <input
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setSubmitted(false);
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/70"
                />
              </div>

              {/* Opis */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  {t.descLabel}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setSubmitted(false);
                  }}
                  placeholder={t.descPlaceholder}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/70 resize-none"
                />
              </div>

              {/* Typ + wpływ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-300">
                    {t.categoryLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(t.categoryOptions) as Category[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                          category === key
                            ? 'border-primary-500 bg-primary-500/10 text-primary-100'
                            : 'border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {t.categoryOptions[key]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-300">
                    {t.impactLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(t.impactOptions) as Impact[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setImpact(key)}
                        className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                          impact === key
                            ? 'border-primary-500 bg-primary-500/10 text-primary-100'
                            : 'border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {t.impactOptions[key]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* przycisk + info po wysłaniu */}
              <div className="mt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg shadow-primary-500/30 transition-all ${
                    canSubmit
                      ? 'bg-primary-600 hover:bg-primary-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  {t.submitLabel}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>

                {submitted && (
                  <div className="flex items-start gap-2 text-[11px] text-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                    <div>
                      <div className="font-medium">{t.submittedTitle}</div>
                      <div>{t.submittedText}</div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Kolumna 3 – ostatnie tickety + premium note */}
        <div className="space-y-4 lg:col-span-1">
          {/* Ostatnie zgłoszenia */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {t.recentTitle}
              </h3>
            </div>
            <div className="space-y-2">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-slate-400">{ticket.id}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-slate-100 mb-0.5">{ticket.title}</p>
                  <p className="text-slate-500">{ticket.eta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Baza wiedzy */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {t.knowledgeTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">{t.knowledgeText}</p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-300 hover:text-primary-200"
            >
              {t.knowledgeCta}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Notka premium po 14 dniach */}
          <div className={`${cardBase} p-5 border-dashed border-primary-500/60 bg-slate-950/80`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-primary-500/60">
                <Headphones className="h-4 w-4 text-primary-300" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-50">
                  {t.premiumNoteTitle}
                </h3>
                <p className="text-xs text-slate-400">{t.premiumNoteText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
