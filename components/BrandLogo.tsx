import React from 'react';

interface Props {
  size?: 'sm' | 'lg';
  className?: string;
}

const BrandLogo: React.FC<Props> = ({ size = 'lg', className = '' }) => {
  // Ikona PD – używana w obu wersjach
  const LogoIcon = (
    <div className="relative w-11 h-11">
      {/* Glow */}
      <div className="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

      {/* Główne pudełko */}
      <div className="relative w-full h-full bg-slate-950 text-white flex items-center justify-center rounded-xl shadow-2xl ring-1 ring-white/10 overflow-hidden transition-all duration-500 group-hover:-rotate-2 group-hover:shadow-primary-500/30">
        {/* Glass */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/60" />

        {/* Tekst PD */}
        <span className="relative z-10 font-bold text-lg tracking-tight">
          PD
        </span>

        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-[150%] skew-x-[-20deg] animate-shimmer" />
      </div>
    </div>
  );

  // Wersja mała – samo logo
  if (size === 'sm') {
    return (
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`flex items-center justify-center cursor-pointer group select-none ${className}`}
      >
        {LogoIcon}
      </button>
    );
  }

  // Wersja pełna – PapaData Intelligence
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`flex items-center gap-4 cursor-pointer group select-none ${className}`}
    >
      {LogoIcon}

      <div className="flex flex-col justify-center h-full text-left">
        <span className="font-bold text-lg leading-none text-slate-900 dark:text-white">
          PapaData
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500 mt-1 group-hover:text-primary-400">
          Intelligence
        </span>
      </div>
    </button>
  );
};

export default BrandLogo;
