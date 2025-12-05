import React from 'react';
import { Clock } from 'lucide-react';
import { DemoTranslation, DemoSection } from '../../types';
import BrandLogo from '../BrandLogo';

interface Props {
  t: DemoTranslation['topbar'];
  activeSection: DemoSection;
  dateRange: 'today' | 'last7' | 'last30';
  setDateRange: (r: 'today' | 'last7' | 'last30') => void;
}

const TopBar: React.FC<Props> = ({ t, activeSection, dateRange, setDateRange }) => {
  const getTitle = () => {
    switch(activeSection) {
      case 'Dashboard': return t.titles.dashboard;
      case 'LiveReports': return t.titles.reports;
      case 'Academy': return t.titles.academy;
      case 'Support': return t.titles.support;
      case 'Integrations': return t.titles.integrations;
      case 'Settings': return t.titles.settings;
      default: return '';
    }
  };

  return (
    <header className="h-16 bg-white/5 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* Title */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          {getTitle()}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        
        {/* Date Range Picker */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['today', 'last7', 'last30'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`
                px-3 py-1 text-xs font-medium rounded-md transition-all
                ${dateRange === range 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
              `}
            >
              {(t.ranges as any)[range]}
            </button>
          ))}
        </div>

        {/* Sync Info */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 group cursor-help relative">
          <Clock className="w-3.5 h-3.5" />
          <span>{t.refreshLabel} 12:57</span>
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 p-2 bg-slate-800 text-white rounded text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            {t.refreshTooltip}
          </div>
        </div>

        {/* Avatar */}
        <div className="relative group">
          <BrandLogo size="sm" className="cursor-pointer shadow-lg" />
          <div className="absolute top-full right-0 mt-2 p-2 bg-slate-800 text-white rounded text-xs w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
             {t.accountTooltip}
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopBar;
