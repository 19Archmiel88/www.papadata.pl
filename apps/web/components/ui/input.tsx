import * as React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, hint, ...props }, ref) => {
    return (
      <label className="w-full space-y-2 text-left">
        {label ? (
          <span className="text-2xs font-black uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
            {label}
          </span>
        ) : null}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/50 shadow-inner',
            className,
          )}
          ref={ref}
          {...props}
        />
        {hint ? (
          <span className="block text-2xs font-medium text-gray-400 dark:text-gray-500">
            {hint}
          </span>
        ) : null}
      </label>
    );
  },
);
Input.displayName = 'Input';
