'use client';

import { usePathname } from 'next/navigation';

export default function CookiePolicyPage() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  return (
    <main className="min-h-screen bg-brand-dark text-pd-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {isEn ? 'Cookie Policy (draft)' : 'Polityka Cookies (wersja robocza)'}
        </h1>
        <div className="mt-6 space-y-4 text-sm md:text-base text-pd-muted">
          <p>
            {isEn
              ? 'PapaData uses cookies and similar technologies to improve the user experience and analyse traffic on the website.'
              : 'PapaData korzysta z plików cookies i podobnych technologii w celu poprawy doświadczenia użytkownika oraz analizy ruchu na stronie.'}
          </p>
          <p>
            {isEn
              ? 'A full description of cookie types, their purposes and retention periods will be published here together with the cookie banner configuration.'
              : 'Pełen opis rodzajów plików cookies, celów ich wykorzystania oraz okresów przechowywania zostanie opublikowany w tym miejscu wraz z konfiguracją banera cookies.'}
          </p>
          <p>
            {isEn
              ? 'You will be able to manage your cookie preferences directly from the banner and this page.'
              : 'Swoimi preferencjami dotyczącymi cookies będziesz mógł zarządzać bezpośrednio z poziomu banera oraz tej strony.'}
          </p>
        </div>
      </div>
    </main>
  );
}
