'use client';

import { usePathname } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  return (
    <main className="min-h-screen bg-brand-dark text-pd-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {isEn ? 'Privacy Policy (draft)' : 'Polityka Prywatności (wersja robocza)'}
        </h1>
        <div className="mt-6 space-y-4 text-sm md:text-base text-pd-muted">
          <p>
            {isEn
              ? 'This is a placeholder version of the PapaData Privacy Policy. The full document describing how we process personal data will be published before the production launch.'
              : 'To jest wersja robocza Polityki Prywatności PapaData. Pełny dokument opisujący sposób przetwarzania danych osobowych zostanie opublikowany przed uruchomieniem wersji produkcyjnej.'}
          </p>
          <p>
            {isEn
              ? 'We design PapaData to minimise processing of personal data and focus mainly on business and aggregated metrics.'
              : 'Projektujemy PapaData tak, aby minimalizować przetwarzanie danych osobowych i skupiać się głównie na danych biznesowych oraz zagregowanych metrykach.'}
          </p>
          <p>
            {isEn
              ? 'For detailed questions regarding data protection, please contact us at '
              : 'W przypadku szczegółowych pytań dotyczących ochrony danych prosimy o kontakt: '}
            <a
              href="mailto:kontakt@papadata.pl"
              className="text-brand-accent hover:text-brand-accent"
            >
              kontakt@papadata.pl
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
