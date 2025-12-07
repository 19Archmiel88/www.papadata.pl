import React from 'react';
import { Clock } from 'lucide-react';
import { DemoTranslation, DemoSection } from '../../types';

interface Props {
  t: DemoTranslation['topbar'];
  activeSection: DemoSection;
  dateRange: 'today' | 'last7' | 'last30';
  setDateRange: (r: 'today' | 'last7' | 'last30') => void;
}

const TopBar: React.FC<Props> = ({ t, activeSection, dateRange, setDateRange }) => {
  const getTitle = () => {
    switch (activeSection) {
      case 'Dashboard':
        return t.titles.dashboard;
      case 'LiveReports':
        return t.titles.reports;
      case 'Academy':
        return t.titles.academy;
      case 'Support':
        return t.titles.support;
      case 'Integrations':
        return t.titles.integrations;
      case 'Settings':
        return t.titles.settings;
      default:
        return '';
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-900/70 bg-slate-950/70 backdrop-blur">
      {/* Tytuł sekcji */}
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
          PapaData • {t.refreshLabel}
        </span>
        <h1 className="mt-1 text-lg font-semibold text-slate-50">{getTitle()}</h1>
      </div>

      {/* Sterowanie po prawej */}
      <div className="flex items-center gap-4">
        {/* Zakres dat */}
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-1 py-1">
          {(['today', 'last7', 'last30'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all ${
                dateRange === range
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {(t.ranges as any)[range]}
            </button>
          ))}
        </div>

        {/* Info o odświeżeniu */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{t.refreshTooltip}</span>
        </div>

        {/* Avatar / konto */}
        <button
          type="button"
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 text-xs font-semibold text-slate-100 shadow-sm"
          title={t.accountTooltip}
        >
          PD
        </button>
      </div>
    </header>
  );
};

export default TopBar;
