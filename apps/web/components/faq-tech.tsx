'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'Jakie są funkcje?',
    answer:
      'System oferuje 10 zaawansowanych dashboardów, w tym: Raporty Sprzedaży, Analiza P&L, Analiza Cohort (LTV/Retention), Marketing Mix Modeling, Performance Kampanii, Lejek Zakupowy GA4 oraz Data Export. Wszystko zasilane automatycznym ETL.',
  },
  {
    question: 'Czy dane są bezpieczne?',
    answer:
      'Tak. Wykorzystujemy infrastrukturę Google Cloud Platform z szyfrowaniem AES-256 (At-Rest) oraz TLS 1.3 (In-Transit). Każdy klient posiada odseparowane środowisko (Tenant Isolation), co gwarantuje pełną poufność i zgodność z RODO.',
  },
  {
    question: 'Jak wygląda proces integracji?',
    answer:
      'Integracja jest w 100% no-code. Wybierasz platformę (np. WooCommerce, Allegro), logujesz się przez OAuth lub podajesz klucz API, a nasz system automatycznie pobiera i procesuje dane. Pierwsze raporty widoczne są zazwyczaj w ciągu 15 minut.',
  },
  {
    question: 'Czy mogę eksportować dane?',
    answer:
      'Oczywiście. Wszystkie dashboardy posiadają funkcję eksportu do CSV/Excel. Dodatkowo w wyższych planach oferujemy bezpośredni dostęp do hurtowni danych (BigQuery) dla Twoich analityków.',
  },
  {
    question: 'Ile kosztuje wdrożenie?',
    answer:
      "Plan Standard nie posiada opłaty wdrożeniowej – konfigurujesz go samodzielnie w kreatorze. Opcjonalne 'Wdrożenie Eksperckie' (999 PLN) to usługa, w której nasz analityk konfiguruje system za Ciebie i przeprowadza szkolenie z wnioskowania.",
  },
]

export const FaqTech: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative overflow-hidden bg-brand-dark py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/8 blur-[140px]" />

      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-14 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex items-center justify-center rounded-2xl border border-brand-border bg-brand-dark/80 p-3 shadow-neon-cyan">
              <HelpCircle className="h-8 w-8 text-brand-accent" />
            </div>
          </div>
          <h2 className="mb-3 text-3xl font-bold text-pd-foreground md:text-4xl">Techniczne FAQ</h2>
          <p className="text-pd-muted">Odpowiedzi na pytania o RODO, infrastrukturę i konkurencję.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-brand-accent/50 bg-brand-dark/80 shadow-neon-cyan'
                    : 'border-brand-border/60 bg-brand-dark/60 hover:border-brand-border'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span
                    className={`text-lg font-semibold ${
                      isOpen ? 'text-pd-foreground' : 'text-pd-muted'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`rounded-full p-2 transition-colors ${
                      isOpen
                        ? 'bg-brand-accent/15 text-brand-accent'
                        : 'bg-brand-card/10 text-pd-muted'
                    }`}
                  >
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-[max-height,opacity,padding] duration-300 ${
                    isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
                  }`}
                >
                  <div className="border-t border-brand-border/70 px-6 pt-4">
                    <p className="text-sm leading-relaxed text-pd-muted md:text-base">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

