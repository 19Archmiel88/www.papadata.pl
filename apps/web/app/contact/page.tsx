'use client';

import { usePathname } from 'next/navigation';

export default function ContactPage() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  return (
    <main className="min-h-screen bg-brand-dark text-pd-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {isEn ? 'Contact' : 'Kontakt'}
        </h1>
        <p className="mt-3 text-sm md:text-base text-pd-muted">
          {isEn
            ? 'This page will soon contain the full PapaData contact form.'
            : 'Tu w przyszłości będzie pełny formularz kontaktowy PapaData.'}
        </p>

        <form
          className="mt-8 space-y-4 rounded-2xl border border-brand-border bg-brand-card/10 p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-sm font-medium text-pd-foreground"
            >
              {isEn ? 'Name' : 'Imię'}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-xl border border-brand-border bg-brand-dark px-3 py-2 text-sm text-pd-foreground placeholder:text-pd-foreground0 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder={isEn ? 'Your name' : 'Twoje imię'}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-pd-foreground"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-xl border border-brand-border bg-brand-dark px-3 py-2 text-sm text-pd-foreground placeholder:text-pd-foreground0 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder={isEn ? 'you@example.com' : 'ty@przyklad.pl'}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="message"
              className="text-sm font-medium text-pd-foreground"
            >
              {isEn ? 'Message' : 'Wiadomość'}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-xl border border-brand-border bg-brand-dark px-3 py-2 text-sm text-pd-foreground placeholder:text-pd-foreground0 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder={
                isEn
                  ? 'Briefly describe what you would like to discuss.'
                  : 'Napisz krótko, w jakiej sprawie chcesz się z nami skontaktować.'
              }
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-medium text-pd-bg shadow-sm transition-colors hover:bg-brand-accent hover:shadow-md"
          >
            {isEn ? 'Send (demo only)' : 'Wyślij (tylko demo)'}
          </button>

          <p className="mt-3 text-xs text-pd-muted">
            {isEn
              ? 'This is a demo-only form. In the production version the message will be sent directly to the PapaData team.'
              : 'To jest formularz pokazowy. W wersji produkcyjnej wiadomość trafi bezpośrednio do zespołu PapaData.'}
          </p>
        </form>

        <div className="mt-6 text-xs text-pd-muted">
          {isEn ? (
            <p>
              You can also email us directly at{' '}
              <a
                href="mailto:kontakt@papadata.pl"
                className="text-brand-accent hover:text-brand-accent"
              >
                kontakt@papadata.pl
              </a>
              .
            </p>
          ) : (
            <p>
              Możesz też napisać bezpośrednio na{' '}
              <a
                href="mailto:kontakt@papadata.pl"
                className="text-brand-accent hover:text-brand-accent"
              >
                kontakt@papadata.pl
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
