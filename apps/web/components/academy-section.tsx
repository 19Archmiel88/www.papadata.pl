'use client';

import { usePathname } from 'next/navigation';

export default function AcademySection() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  return (
    <section
      id="academy"
      className="border-t border-brand-border bg-brand-dark py-16 md:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {isEn ? 'PapaData Academy & Webinars' : 'Akademia PapaData i webinary'}
        </h2>
        <p className="mt-3 text-base md:text-lg text-pd-muted">
          {isEn
            ? 'This section will soon contain a calendar of live webinars and educational content about e-commerce analytics and AI.'
            : 'Ta sekcja wkrótce będzie zawierać kalendarz webinarów na żywo oraz materiały edukacyjne o analityce e-commerce i AI.'}
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-brand-border bg-brand-dark/70 px-6 py-10 text-sm text-pd-muted">
          {isEn ? (
            <>
              <p className="font-medium">
                Upcoming content (placeholder):
              </p>
              <ul className="mt-3 space-y-2 text-pd-muted">
                <li>• How to connect PapaData to your store and ad platforms</li>
                <li>• Interpreting sales and marketing reports</li>
                <li>• Using AI assistant for everyday decisions</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-medium">
                Nadchodzące treści (placeholder):
              </p>
              <ul className="mt-3 space-y-2 text-pd-muted">
                <li>• Jak podłączyć PapaData do sklepu i kampanii reklamowych</li>
                <li>• Jak czytać raporty sprzedażowe i marketingowe</li>
                <li>• Jak korzystać z Asystenta AI w codziennych decyzjach</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
