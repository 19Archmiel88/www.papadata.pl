import React from 'react';

interface Props {
  code: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const IntegrationLogo: React.FC<Props> = ({ code, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-xl 
        flex items-center justify-center 
        font-bold 
        bg-slate-100 dark:bg-slate-800 
        text-slate-600 dark:text-slate-300
        border border-slate-200 dark:border-slate-700
        shadow-sm
        ${className}
      `}
    >
      {code}
    </div>
  );
};

export default IntegrationLogo;