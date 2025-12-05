import React from 'react';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  size?: Size;
  className?: string;
}

const sizeMap: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const BrandLogo: React.FC<Props> = ({ size = 'md', className = '' }) => (
  <div
    className={`flex items-center justify-center rounded-full bg-primary-500 text-white font-bold shadow-lg ${sizeMap[size]} ${className}`}
    aria-label="PapaData logo"
  >
    PD
  </div>
);

export default BrandLogo;
