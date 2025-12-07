import React from 'react';

interface Props {
  size?: 'sm' | 'lg';
  className?: string;
}

const BrandLogo: React.FC<Props> = ({ size = 'lg', className = '' }) => {
  
  // Część graficzna (Ikona PD) - wyciągnięta do zmiennej, bo używamy jej w obu wersjach
  const LogoIcon = (
    <div className="relative w-11 h-11">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 animate-pulse-slow transition-opacity duration-1000" />
      
      {/* Main Box */}
      <div className="relative w-full h-full bg-slate-950 text-white flex items-center justify-center rounded-xl shadow-2xl ring-1 ring-white/10 overflow-hidden transition-all duration-500 group-hover:shadow-primary-500/20 group-hover:-rotate-2">
        {/* Glass Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        
        {/* Text PD */}
        <span className="relative z-10 font-bold text-lg font-sans tracking-tight">PD</span>
        
        {/* Shimmer Animation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-20deg] animate-shimmer" />
      </div>
    </div>
  );

  // Wersja MAŁA (np. na mobile, samo logo)
  if (size === 'sm') {
    return (
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`flex items-center justify-center cursor-pointer group select-none ${className}`}
      >
        {LogoIcon}
      </div>
    );
  }

  // Wersja PEŁNA (z napisami PapaData Intelligence) - Twój kod
  return (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`flex items-center gap-4 cursor-pointer group select-none ${className}`}
    >
      {LogoIcon}
      
      <div className="flex flex-col justify-center h-full">
        <span className="font-bold text-lg leading-none text-slate-900 dark:text-white transition-colors duration-300">
          PapaData
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500 mt-1 transition-all duration-300 group-hover:text-primary-500">
          Intelligence
        </span>
      </div>
    </div>
  );
};

export default BrandLogo;