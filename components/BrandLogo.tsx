import React from 'react';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  /** The size of the logo. 'sm' (small), 'md' (medium), or 'lg' (large). Defaults to 'md'. */
  size?: Size;
  /** Optional additional CSS classes. */
  className?: string;
}

const sizeMap: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

/**
 * Displays the PapaData brand logo (PD monogram).
 * 
 * @param size - The size of the logo.
 * @param className - Optional CSS class for styling.
 */
const BrandLogo: React.FC<Props> = ({ size = 'md', className = '' }) => (
  <div
    className={`flex items-center justify-center rounded-full bg-primary-500 text-white font-bold shadow-lg ${sizeMap[size]} ${className}`}
    aria-label="PapaData logo"
  >
    PD
  </div>
);

export default BrandLogo;
