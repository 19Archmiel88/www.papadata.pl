import React, { useMemo, useState } from 'react';

const ValueProposition: React.FC = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState(10); // ile godzin tygodniowo na raporty
  const hourlyRate = 80; // PLN
  const yearlyHours = useMemo(() => hoursPerWeek * 52, [hoursPerWeek]);
  const yearlySavings = useMemo(
    () => yearlyHours * hourlyRate,
    [yearlyHours, hourlyRate]
  );

  return (
    <section id="about" className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-400 mb-2">
            Udowodnij wartość
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Z chaosu arkuszy do jednego, spokojnego pulpitu prawdy.
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-400">
            PapaData zastępuje ręczne klejenie raportów z wielu źródeł jednym
            uporządkowanym modelem danych. Zamiast „Policzymy to jutro” masz
            „Widzimy to teraz”.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Bez PapaData
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li>• Ręczne pobieranie danych z wielu platform</li>
                <li>• Raporty z jednodniowym (albo tygodniowym) opóźnieniem</li>
                <li>• Konfliktujące wersje „tego samego” KPI</li>
                <li>• Brak czasu na analizę, tylko na kopiowanie</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-primary-500/40 bg-gradient-to-br from-primary-950/80 via-slate-950 to-slate-900 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
                Z PapaData
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>• Automatyczne zaciąganie danych do hurtowni BigQuery</li>
                <li>• Jeden zestandaryzowany model dla sklepu, reklam i marży</li>
                <li>• AI, które odpowiada na pytania wprost z Twoich danych</li>
                <li>• Gotowe raporty dzienne, tygodniowe i kampanijne</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mini kalkulator ROI – bez przesady, tylko highlight */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Szacunek oszczędności
          </p>
          <h3 className="mt-3 text-lg font-semibold text-slate-50">
            Ile godzin tygodniowo schodzi na raporty?
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Prosty szacunek, żeby pokazać skalę. Zero ukrytej magii.
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Godziny tygodniowo</span>
              <span className="font-mono text-slate-200">{hoursPerWeek} h</span>
            </div>
            <input
              type="range"
              min={2}
              max={40}
              step={2}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value) || 0)}
              className="mt-2 w-full cursor-pointer accent-primary-500"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <p className="text-xs text-slate-400">Odzyskany czas rocznie</p>
              <p className="mt-1 text-xl font-semibold text-slate-50 font-mono">
                {yearlyHours.toLocaleString('pl-PL')} h
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-primary-600/60 p-3">
              <p className="text-xs text-slate-400">Potencjalna oszczędność</p>
              <p className="mt-1 text-xl font-semibold text-primary-300 font-mono">
                {yearlySavings.toLocaleString('pl-PL')} zł
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Rzeczywisty efekt zależy od liczby źródeł danych i sposobu pracy
            Twojego zespołu. Ten blok ma tylko pokazać skalę, nie obiecywać
            cudów.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
