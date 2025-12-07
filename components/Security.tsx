import React from 'react';
import { Lock, Server, ShieldCheck, Database, KeyRound, Eye } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, Translation } from '../types';

interface Props {
  tOverride?: Translation['security'];
  lang?: Language;
}

const resolveLang = (override?: Language): Language => {
  if (override) return override;
  try {
    const stored = localStorage.getItem('papadata-lang') as Language | null;
    if (stored === 'PL' || stored === 'EN') return stored;
  } catch {
    // ignore
  }
  return 'PL';
};

const Security: React.FC<Props> = ({ tOverride, lang }) => {
  const effectiveLang = resolveLang(lang);
  const t = tOverride ?? TRANSLATIONS[effectiveLang].security;

  const cards = [
    { icon: Server, ...t.cards.infra },
    { icon: Lock, ...t.cards.encryption },
    { icon: ShieldCheck, ...t.cards.ai },
    { icon: Database, ...t.cards.gdpr },
    { icon: KeyRound, ...t.cards.isolation },
    { icon: Eye, ...t.cards.access },
  ];

  return (
    <section className="bg-slate-950 py-16 text-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {t.mainCard.desc}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="md:row-span-2 flex flex-col rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4 shadow-lg shadow-emerald-500/20">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-50">
              {t.mainCard.title}
            </h3>
            <p className="mt-2 text-xs text-emerald-100/80">
              {t.mainCard.desc}
            </p>
            <ul className="mt-4 space-y-1.5 text-[11px] text-emerald-100/75">
              <li>• ISO 27001 / SOC2 ready stack</li>
              <li>• EU-only regions i kontrola lokalizacji danych</li>
              <li>• Czytelne logi audytowe i dostępów</li>
            </ul>
          </article>

          {cards.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs shadow-sm shadow-black/40"
            >
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-primary-300 ring-1 ring-primary-500/40">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-[13px] font-semibold text-slate-50">
                {title}
              </h3>
              <p className="mt-2 text-[11px] text-slate-400">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
