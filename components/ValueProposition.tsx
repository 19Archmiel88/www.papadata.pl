import React, { useState, useMemo } from 'react';

const ValueProposition: React.FC = () => {
  const [hours, setHours] = useState(10);
  const hourlyRate = 80; // average hourly rate in PLN for an analyst

  const savedHoursYearly = useMemo(() => hours * 52, [hours]);
  const savedMoneyYearly = useMemo(() => savedHoursYearly * hourlyRate, [savedHoursYearly, hourlyRate]);

  return (
    <section className="bg-slate-800 py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Odzyskaj czas i pieniądze</h2>
          <p className="mt-4 text-lg text-slate-300">
            Porównaj stary, chaotyczny świat Excela z nową erą analityki w czasie rzeczywistym z PapaData.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-slate-900/50 p-8 ring-1 ring-red-500/50">
            <h3 className="text-xl font-semibold text-red-400">Stary świat (Excel, chaos)</h3>
            <ul className="mt-6 space-y-4 text-slate-300">
              {[
                'Ręczne pobieranie danych z wielu źródeł',
                'Opóźnienia w raportowaniu (dane z wczoraj)',
                'Ryzyko błędów ludzkich i pomyłek w formułach',
              ].map((item) => (
                <li key={item} className="flex gap-x-3">
                  <svg className="mt-1 h-5 w-5 flex-none text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-900/50 p-8 ring-1 ring-primary-500/50">
            <h3 className="text-xl font-semibold text-primary-400">PapaData (Realtime, AI)</h3>
            <ul className="mt-6 space-y-4 text-slate-300">
              {[
                'Automatyczne integracje API z kluczowymi platformami',
                'Dashboardy i analizy w czasie rzeczywistym (<200ms)',
                'Wsparcie AI do natychmiastowego znajdowania odpowiedzi',
              ].map((item) => (
                <li key={item} className="flex gap-x-3">
                  <svg className="mt-1 h-5 w-5 flex-none text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 rounded-2xl bg-slate-900 p-8">
          <h3 className="text-2xl font-bold text-center">Kalkulator oszczędności</h3>
          <div className="mx-auto max-w-xl mt-6">
            <label htmlFor="hours-slider" className="block text-center text-slate-300">
              Ile godzin tygodniowo tracisz na Excela? <span className="font-bold text-primary-400">{hours} godz.</span>
            </label>
            <input
              id="hours-slider"
              type="range"
              min="1"
              max="40"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value, 10))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-primary-500"
            />

            <div className="mt-8 text-center bg-slate-800 p-6 rounded-lg">
              <p className="text-lg text-slate-300">Z PapaData możesz odzyskać rocznie:</p>
              <div className="mt-4 flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-400">{savedHoursYearly}</p>
                  <p className="text-slate-400">godzin</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-400">
                    ~{new Intl.NumberFormat('pl-PL').format(savedMoneyYearly)}
                  </p>
                  <p className="text-slate-400">PLN oszczędności</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
