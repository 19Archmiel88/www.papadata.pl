import React from 'react';
import {
  LayoutDashboard,
  BarChart2,
  GraduationCap,
  Headphones,
  Puzzle,
  Settings,
  LogOut,
} from 'lucide-react';
import { DemoSection, DemoTranslation } from '../../types';
import BrandLogo from '../BrandLogo';

interface Props {
  activeSection: DemoSection;
  setActiveSection: (s: DemoSection) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  alwaysExpanded: boolean;
  t: DemoTranslation['sidebar'];
  onLogout: () => void;
}

const Sidebar: React.FC<Props> = ({
  activeSection,
  setActiveSection,
  isExpanded,
  setIsExpanded,
  alwaysExpanded,
  t,
  onLogout,
}) => {
  const menuItems: {
    id: DemoSection;
    icon: React.ReactNode;
    label: string;
    tooltip?: string;
  }[] = [
    { id: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: t.dashboard },
    { id: 'LiveReports', icon: <BarChart2 className="w-4 h-4" />, label: t.reports },
    { id: 'Academy', icon: <GraduationCap className="w-4 h-4" />, label: t.academy },
    {
      id: 'Support',
      icon: <Headphones className="w-4 h-4" />,
      label: t.support,
      tooltip: t.supportTooltip,
    },
    { id: 'Integrations', icon: <Puzzle className="w-4 h-4" />, label: t.integrations },
    { id: 'Settings', icon: <Settings className="w-4 h-4" />, label: t.settings },
  ];

  const handleMouseEnter = () => {
    if (!alwaysExpanded) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!alwaysExpanded) setIsExpanded(false);
  };

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-900/80 bg-slate-950/95 transition-[width] duration-200 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Górny blok – logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-900/80 px-3">
        {isExpanded ? (
          <BrandLogo className="scale-[0.95]" />
        ) : (
          <BrandLogo size="sm" />
        )}
      </div>

      {/* Menu sekcji */}
      <nav className="flex-1 py-4 space-y-1">
        {menuItems.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.tooltip || item.label}
              onClick={() => setActiveSection(item.id)}
              className={`relative w-full flex items-center ${
                isExpanded ? 'px-4' : 'px-2'
              } py-2.5 group`}
            >
              {/* Ikona + label w kapsułce */}
              <div
                className={`flex items-center gap-3 w-full rounded-lg px-2 py-2 transition-colors ${
                  active
                    ? 'bg-slate-900 text-primary-200'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center rounded-md ${
                    active ? 'bg-primary-600/20 text-primary-300' : 'bg-slate-900/40'
                  } w-8 h-8`}
                >
                  {item.icon}
                </span>
                {isExpanded && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </div>

              {/* Pionowy znacznik aktywnej sekcji */}
              {active && (
                <span className="absolute inset-y-1 right-0 w-1 rounded-l-full bg-primary-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Dolny blok – plan / logout */}
      <div className="border-t border-slate-900/80 px-3 py-3 space-y-3">
        {isExpanded && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2">
            <p className="text-[11px] text-slate-400 leading-snug">
              PapaData Intelligence
              <br />
              <span className="text-slate-300 font-medium">Demo / Client workspace</span>
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-200 hover:bg-rose-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {isExpanded && <span>{t.logout}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
