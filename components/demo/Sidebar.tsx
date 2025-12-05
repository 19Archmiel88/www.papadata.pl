import React from 'react';
import { LayoutDashboard, BarChart2, GraduationCap, Headphones, Puzzle, Settings, LogOut } from 'lucide-react';
import { DemoSection, DemoTranslation } from '../../types';
import { motion } from 'framer-motion';
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
  
  const handleMouseEnter = () => {
    if (!alwaysExpanded) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!alwaysExpanded) setIsExpanded(false);
  };

  const menuItems: { id: DemoSection; icon: React.ReactNode; label: string; tooltip?: string }[] = [
    { id: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: t.dashboard },
    { id: 'LiveReports', icon: <BarChart2 className="w-5 h-5" />, label: t.reports },
    { id: 'Academy', icon: <GraduationCap className="w-5 h-5" />, label: t.academy },
    { id: 'Support', icon: <Headphones className="w-5 h-5" />, label: t.support, tooltip: t.supportTooltip },
    { id: 'Integrations', icon: <Puzzle className="w-5 h-5" />, label: t.integrations },
    { id: 'Settings', icon: <Settings className="w-5 h-5" />, label: t.settings },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded || alwaysExpanded ? 240 : 64 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 transition-all duration-300"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 overflow-hidden border-b border-slate-800 gap-3">
        <BrandLogo size="sm" className="shadow-lg" />
        <motion.span
          animate={{ opacity: isExpanded || alwaysExpanded ? 1 : 0, x: isExpanded || alwaysExpanded ? 0 : -10 }}
          className="font-bold text-xl text-white whitespace-nowrap"
        >
          PapaData
        </motion.span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 flex flex-col gap-2 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            title={item.tooltip || item.label}
            className={`
              relative flex items-center px-4 py-3 mx-2 rounded-lg transition-colors group
              ${activeSection === item.id 
                ? 'bg-primary-600/20 text-primary-400' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <div className="shrink-0">{item.icon}</div>
            <motion.span 
              animate={{ opacity: isExpanded || alwaysExpanded ? 1 : 0, x: isExpanded || alwaysExpanded ? 0 : -10 }}
              className="ml-3 font-medium text-sm whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
            
            {/* Active Indicator */}
            {activeSection === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center w-full px-2 py-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <motion.span 
             animate={{ opacity: isExpanded || alwaysExpanded ? 1 : 0 }}
             className="ml-3 font-medium text-sm whitespace-nowrap overflow-hidden"
          >
            {t.logout}
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
