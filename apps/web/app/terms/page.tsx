'use client';

import { usePathname } from 'next/navigation';

export default function TermsPage() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  return (
    <main className="min-h-screen bg-brand-dark text-pd-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {isEn
            ? 'PapaData Terms of Service (draft)'
            : 'Regulamin świadczenia usług PapaData (wersja robocza)'}
        </h1>
        <div className="mt-6 space-y-4 text-sm md:text-base text-pd-muted">
          <p>
            {isEn
              ? 'The full legal text of the Terms of Service will be published before the production launch of PapaData.'
              : 'Pełna treść regulaminu zostanie opublikowana przed uruchomieniem wersji produkcyjnej PapaData.'}
          </p>
          <p>
            {isEn
              ? 'For any questions, email us at '
              : 'W razie pytań skontaktuj się z nami: '}
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
