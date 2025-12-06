import React, { useState } from 'react';
import { Shield, Lock, Cloud, Laptop, Tablet, Smartphone, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface Props {
  /** Current active language */
  lang: Language;
}

type FaqItem = { q: string; a: string };

const getCopy = (lang: Language) => {
  if (lang === 'EN') {
    return {
      title: 'Scalability & Architecture',
      subtitle: 'Built for speed, security and multi-tenant isolation on Google Cloud.',
      security: [
        { icon: <Lock className="w-4 h-4" />, text: 'AES-256 encryption' },
        { icon: <Shield className="w-4 h-4" />, text: 'Tenant isolation' },
        { icon: <Cloud className="w-4 h-4" />, text: 'Google Cloud security' },
      ],
      faq: [
        {
          q: 'Where are my data stored?',
          a: 'Data is stored in EU Google Cloud regions with encrypted storage at rest (AES-256) and in transit (TLS 1.2+).',
        },
        {
          q: 'Is PapaData GDPR compliant?',
          a: 'Yes. We process data as a processor, sign DPAs, and ensure data minimization and access logging.',
        },
        {
          q: 'Can other clients see my data?',
          a: 'No. We enforce strict tenant isolation at the database, network, and application layers.',
        },
        {
          q: 'How long do you keep my data?',
          a: 'Retention follows your contract; you can request purge at any time and exports are available on demand.',
        },
      ],
    };
  }

  return {
    title: 'Skalowalność i Architektura',
    subtitle: 'Nowoczesna, bezpieczna platforma na Google Cloud z izolacją tenantów.',
    security: [
      { icon: <Lock className="w-4 h-4" />, text: 'Szyfrowanie AES-256' },
      { icon: <Shield className="w-4 h-4" />, text: 'Separacja danych (Tenant Isolation)' },
      { icon: <Cloud className="w-4 h-4" />, text: 'Google Cloud Security' },
    ],
    faq: [
      {
        q: 'Gdzie przechowujecie dane?',
        a: 'Dane są w regionach UE na Google Cloud, szyfrowane w spoczynku (AES-256) i w tranzycie (TLS 1.2+).',
      },
      {
        q: 'Czy PapaData jest zgodna z RODO?',
        a: 'Tak. Działamy jako procesor, podpisujemy DPA i stosujemy minimalizację danych oraz logowanie dostępu.',
      },
      {
        q: 'Czy konkurencja może zobaczyć moje dane?',
        a: 'Nie. Utrzymujemy izolację tenantów na warstwie bazy, sieci i aplikacji.',
      },
      {
        q: 'Jak długo trzymacie dane?',
        a: 'Retencja wynika z umowy; możesz poprosić o usunięcie w każdym momencie, eksport jest dostępny na życzenie.',
      },
    ],
  };
};

/**
 * Section detailing the platform's architecture, scalability, and security measures.
 * Includes a FAQ list and highlights key security features like encryption and tenant isolation.
 */
const ScalabilitySection: React.FC<Props> = ({ lang }) => {
  const copy = getCopy(lang);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const devices = [
    {
      label: 'Laptop',
      icon: <Laptop className="w-6 h-6 text-primary-200" />,
      detail: lang === 'EN' ? 'Dashboard in real time' : 'Dashboard w czasie rzeczywistym',
    },
    {
      label: 'Tablet',
      icon: <Tablet className="w-6 h-6 text-primary-200" />,
      detail: lang === 'EN' ? 'Sales & margin report' : 'Raport sprzedaży i marży',
    },
    {
      label: lang === 'EN' ? 'Phone' : 'Smartfon',
      icon: <Smartphone className="w-6 h-6 text-primary-200" />,
      detail: lang === 'EN' ? 'AI alert: margin drop' : 'Alert AI: spadek marży',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950" id="architecture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500 mb-3">
              {lang === 'EN' ? 'Architecture' : 'Architektura'}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              {copy.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">{copy.subtitle}</p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap gap-3 shadow-sm">
              {copy.security.map((item, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200"
                >
                  {item.icon}
                  <span className="text-sm font-semibold">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-3">
              {copy.faq.map((item: FaqItem, idx: number) => {
                const open = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open && (
                      <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/10 blur-3xl -z-10 rounded-[3rem]" />
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {devices.map((device, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary-500/20 border border-primary-500/40">{device.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-white">{device.label}</p>
                        <p className="text-xs text-primary-100/90">{device.detail}</p>
                      </div>
                    </div>
                    <div className="relative flex-1 rounded-xl bg-gradient-to-br from-primary-500/15 via-primary-500/5 to-slate-900 border border-white/5 p-3">
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.2),transparent_35%)]" />
                      <div className="h-full w-full rounded-lg border border-white/10 bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-primary-500/15 border border-primary-400/30 px-5 py-4 text-primary-50 text-sm">
                {lang === 'EN'
                  ? 'One data model, three screens: dashboard for leadership, reports for analytics, instant AI alerts on mobile.'
                  : 'Jeden model danych, trzy ekrany: dashboard dla zarządu, raporty dla analityki, natychmiastowe alerty AI na mobile.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScalabilitySection;
