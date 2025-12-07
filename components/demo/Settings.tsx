// components/demo/Settings.tsx
import React from 'react';
import {
  Cog,
  Monitor,
  Moon,
  Sun,
  Languages,
  LayoutPanelLeft,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Theme, Language } from '../../types';

const cardBase =
  'rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_18px_45px_rgba(15,23,42,0.85)]';

interface Props {
  // tłumaczenia z i18n – nie musimy ich tu używać, ale zostawiamy dla spójności API
  t: unknown;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  alwaysExpanded: boolean;
  setAlwaysExpanded: (value: boolean) => void;
  isDemo?: boolean;
}

const Settings: React.FC<Props> = ({
  lang,
  setLang,
  theme,
  setTheme,
  alwaysExpanded,
  setAlwaysExpanded,
  isDemo = true,
}) => {
  const isPL = lang === 'PL';

  const headerTitle = isPL ? 'Ustawienia widoku i konta' : 'Workspace & view settings';
  const headerSubtitle = isPL
    ? 'Dostosuj język, motyw i układ panelu. To są ustawienia po stronie przeglądarki – nie zmieniają danych w hurtowni.'
    : 'Adjust language, theme and panel layout. These are client-side settings – they don’t change data in the warehouse.';

  const demoBadge = isDemo
    ? isPL
      ? 'Tryb demo – ustawienia zapisujemy lokalnie w przeglądarce.'
      : 'Demo mode – settings are stored locally in the browser.'
    : isPL
      ? 'Środowisko klienta – ustawienia łączymy z Twoim kontem.'
      : 'Client workspace – settings are linked to your account.';

  const handleLangChange = (value: Language) => {
    setLang(value);
  };

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-6 md:px-6 md:py-8 text-slate-50">
      {/* Góra sekcji */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-slate-900/80 px-3 py-1 text-xs font-medium text-primary-300 mb-3">
            <Cog className="h-4 w-4" />
            <span>{isPL ? 'Ustawienia' : 'Settings'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 tracking-tight mb-2">
            {headerTitle}
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">
            {headerSubtitle}
          </p>
        </div>

        <div className={`${cardBase} px-4 py-3 flex items-center gap-3 max-w-xs w-full`}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700">
            <Monitor className="h-4 w-4 text-primary-300" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400">
              {isPL ? 'Status środowiska' : 'Workspace status'}
            </p>
            <p className="text-[11px] font-medium text-slate-100">{demoBadge}</p>
          </div>
        </div>
      </div>

      {/* Główna siatka */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Kolumna 1 – język i motyw */}
        <div className="lg:col-span-1 space-y-4">
          {/* Język interfejsu */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {isPL ? 'Język interfejsu' : 'Interface language'}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['PL', 'EN'] as Language[]).map((code) => {
                const active = lang === code;
                const label =
                  code === 'PL'
                    ? 'Polski'
                    : code === 'EN'
                      ? 'English'
                      : code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleLangChange(code)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs transition-colors ${
                      active
                        ? 'border-primary-500/70 bg-primary-500/10 text-primary-100'
                        : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span>{label}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              {isPL
                ? 'Język ustawień wpływa też na komunikaty w kreatorze i Raportach Live (tam gdzie to możliwe).'
                : 'Language also affects labels in the wizard and Live Reports (where available).'}
            </p>
          </div>

          {/* Motyw – jasny / ciemny */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary-300" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {isPL ? 'Motyw panelu' : 'Panel theme'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'border-primary-500/70 bg-slate-950 text-primary-100'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5" />
                  {isPL ? 'Ciemny (domyślny)' : 'Dark (default)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isPL
                    ? 'Najlepszy kontrast do pracy z danymi.'
                    : 'Best contrast for heavy data work.'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border transition-colors ${
                  theme === 'light'
                    ? 'border-primary-500/70 bg-slate-100/5 text-primary-100'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5" />
                  {isPL ? 'Jasny (eksperymentalny)' : 'Light (experimental)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isPL
                    ? 'Wersja do prezentacji lub zrzutów ekranu.'
                    : 'Good for presentations and screenshots.'}
                </span>
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-primary-300 mt-0.5" />
              <span>
                {isPL
                  ? 'Zmiana motywu działa natychmiast w całym panelu. Ustawienie jest zapamiętywane w przeglądarce.'
                  : 'Theme change applies immediately across the panel. Setting is stored in the browser.'}
              </span>
            </div>
          </div>
        </div>

        {/* Kolumna 2 – układ i nawigacja */}
        <div className="lg:col-span-1 space-y-4">
          {/* Układ bocznego menu */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <LayoutPanelLeft className="h-5 w-5 text-primary-300" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                {isPL ? 'Układ nawigacji' : 'Navigation layout'}
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <button
                type="button"
                onClick={() => setAlwaysExpanded(!alwaysExpanded)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 hover:border-primary-500/70 hover:bg-slate-900/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-700">
                    <LayoutPanelLeft className="h-4 w-4 text-primary-300" />
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-100">
                      {isPL ? 'Przypnij boczne menu' : 'Pin the sidebar'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isPL
                        ? 'Zawsze rozwinięte menu po lewej – wygodne na dużych ekranach.'
                        : 'Always expanded left sidebar – handy on large screens.'}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex h-5 w-9 items-center rounded-full border px-0.5 transition-colors ${
                    alwaysExpanded
                      ? 'border-primary-500 bg-primary-500/30 justify-end'
                      : 'border-slate-600 bg-slate-900 justify-start'
                  }`}
                >
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-100" />
                </span>
              </button>

              <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-primary-300 mt-0.5" />
                <span>
                  {isPL
                    ? 'Na mobile menu zawsze zachowuje się kompaktowo – niezależnie od tej opcji.'
                    : 'On mobile the menu stays compact regardless of this setting.'}
                </span>
              </div>
            </div>
          </div>

          {/* Sekcja o nawigacji demo vs real */}
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {isPL ? 'Przejście z demo do pełnej wersji' : 'Switching from demo to full version'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {isPL
                ? 'Struktura nawigacji (Pulpit, Raporty Live, Integracje, Akademia, Wsparcie, Ustawienia) jest taka sama w trybie demo i w środowisku klienta.'
                : 'Navigation structure (Dashboard, Live Reports, Integrations, Academy, Support, Settings) is the same in demo and client workspace.'}
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5">
              {isPL ? (
                <>
                  <li>• Po aktywacji konta widzisz swoje dane zamiast sample data.</li>
                  <li>• Integracje i harmonogram ETL działają na Twoich źródłach.</li>
                </>
              ) : (
                <>
                  <li>• After activation you see your own data instead of sample data.</li>
                  <li>• Integrations and ETL schedule work on your sources.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Kolumna 3 – bezpieczeństwo i 14 dni */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`${cardBase} p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-primary-300" />
              <h3 className="text-sm font-semibold text-slate-100">
                {isPL ? 'Bezpieczeństwo ustawień' : 'Settings security'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {isPL
                ? 'W trybie demo ustawienia widoku, języka i motywu trzymamy lokalnie w przeglądarce. W pełnej wersji część ustawień może być powiązana z kontem użytkownika.'
                : 'In demo, view, language and theme settings are stored locally in the browser. In full version some of them may be tied to the user account.'}
            </p>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-300 mt-0.5" />
              <span>
                {isPL
                  ? 'Czyszczenie pamięci przeglądarki (local storage) może zresetować część ustawień widoku.'
                  : 'Clearing browser storage (local storage) may reset some view settings.'}
              </span>
            </div>
          </div>

          <div className={`${cardBase} p-5 border-dashed border-primary-500/60 bg-slate-950/80`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-primary-500/60">
                <Cog className="h-4 w-4 text-primary-300" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-50">
                  {isPL
                    ? 'Dodatkowe preferencje po 14 dniach'
                    : 'Additional preferences after 14 days'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isPL
                    ? 'Po zakończeniu okresu testowego możesz ustalić dodatkowe ustawienia – np. domyślne raporty startowe dla swojego zespołu.'
                    : 'After the trial period you can agree on extra preferences – e.g. default start reports for your team.'}
                </p>
                <button
                  type="button"
                  className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-300 hover:text-primary-200"
                >
                  {isPL ? 'Porozmawiajmy o konfiguracji konta' : 'Let’s talk about account setup'}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
