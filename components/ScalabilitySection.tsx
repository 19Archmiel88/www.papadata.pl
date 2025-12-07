import React, { useState } from 'react';
import { Cloud, Shield, Lock, Laptop, Tablet, Smartphone, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

type FaqItem = { q: string; a: string };

const getCopy = (lang: Language) => {
  if (lang === 'EN') {
    return {
      title: 'Scalability & Architecture',
      subtitle:
        'Multi-tenant platform on Google Cloud with isolated warehouses for each client.',
      security: [
        { icon: <Lock className="w-4 h-4" />, text: 'AES-256 encryption' },
        { icon: <Shield className="w-4 h-4" />, text: 'Tenant isolation' },
        { icon: <Cloud className="w-4 h-4" />, text: 'EU regions only' },
      ],
      faq: [
        {
          q: 'Where is my data stored?',
          a: 'All data is stored in EU Google Cloud regions, with encryption at rest (AES-256) and in transit (TLS 1.2+).',
        },
        {
          q: 'Is PapaData GDPR compliant?',
          a: 'We act as a data processor, can sign a DPA, and log access to your data for auditability.',
        },
        {
          q: 'Can other clients see my data?',
          a: 'No. Each tenant has a dedicated project, datasets and service accounts.',
        },
      ] as FaqItem[],
      devicesLabel:
        'One data model, three screens: leadership dashboard, analyst reports, AI alerts on mobile.',
    };
  }

  return {
    title: 'Skalowalność i architektura',
    subtitle:
      'Nowoczesna platforma oparta na Google Cloud, z pełną izolacją danych między klientami.',
    security: [
      { icon: <Lock className="w-4 h-4" />, text: 'Szyfrowanie AES-256' },
      { icon: <Shield className="w-4 h-4" />, text: 'Izolacja tenantów' },
      { icon: <Cloud className="w-4 h-4" />, text: 'Regiony UE (europe-central2)' },
    ],
    faq: [
      {
        q: 'Gdzie przechowujecie dane?',
        a: 'W regionach UE Google Cloud (europe-central2), szyfrowane w spoczynku i w tranzycie.',
      },
      {
        q: 'Czy PapaData jest zgodna z RODO?',
        a: 'Tak. Pełnimy rolę procesora, możemy podpisać DPA i prowadzimy logi dostępu.',
      },
      {
        q: 'Czy inne firmy mogą zobaczyć moje dane?',
        a: 'Nie. Każdy klient ma osobny projekt, hurtownię i role IAM.',
      },
    ] as FaqItem[],
    devicesLabel:
      'Jeden model danych, trzy ekrany: dashboard dla zarządu, raporty dla analityki, alerty AI na telefonie.',
  };
};

const ScalabilitySection: React.FC<Props> = ({ lang }) => {
  const copy = getCopy(lang);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const devices = [
    {
      label: lang === 'EN' ? 'Laptop' : 'Laptop',
      icon: <Laptop className="w-5 h-5" />,
      detail:
        lang === 'EN'
          ? 'Full dashboard with all KPIs'
          : 'Pełny pulpit z KPI i marżą',
    },
    {
      label: lang === 'EN' ? 'Tablet' : 'Tablet',
      icon: <Tablet className="w-5 h-5" />,
      detail:
        lang === 'EN'
          ? 'Campaign and margin reports'
          : 'Raporty kampanii i marży',
    },
    {
      label: lang === 'EN' ? 'Phone' : 'Smartfon',
      icon: <Smartphone className="w-5 h-5" />,
      detail:
        lang === 'EN'
          ? 'AI alerts and quick answers'
          : 'Alerty AI i szybkie odpowiedzi',
    },
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-400 mb-2">
            Architektura
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-400">
            {copy.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-300">
            {copy.security.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5"
              >
                <span className="text-primary-400">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {copy.faq.map((item, idx) => {
              const open = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70"
                >
                  <button
                    type="button"
                    className="w-full px-4 py-3 flex items-center justify-between text-left text-sm text-slate-200"
                    onClick={() => setOpenIndex(open ? null : idx)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 text-xs text-slate-400">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 mb-2">
              Experience
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {devices.map((device) => (
                <div
                  key={device.label}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-primary-400">{device.icon}</span>
                    <span className="font-medium">{device.label}</span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    {device.detail}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              {copy.devicesLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScalabilitySection;
