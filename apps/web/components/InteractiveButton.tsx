import React, { forwardRef, memo, useMemo } from 'react';

type InteractiveButtonVariant = 'primary' | 'secondary';

export type InteractiveButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: InteractiveButtonVariant;
  isLoading?: boolean;
};

export const InteractiveButton = memo(
  forwardRef<HTMLButtonElement, InteractiveButtonProps>(function InteractiveButton(
    { children, className = '', variant = 'secondary', disabled, isLoading, type, ...rest },
    ref,
  ) {
    const baseStyle = useMemo(
      () =>
        [
          'relative inline-flex items-center justify-center',
          'px-6 py-3',
          'rounded-2xl', // PRO radius
          'font-black text-sm',
          'transition-all duration-300 ease-out',
          'transform-gpu',
          'overflow-hidden',
          'group',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/70',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'dark:focus-visible:ring-offset-[#0b0b0f]',
          'select-none',
        ].join(' '),
      [],
    );

    const enabled = useMemo<Record<InteractiveButtonVariant, string>>(
      () => ({
        primary: [
          'brand-gradient-bg text-white',
          'shadow-[0_18px_55px_rgba(0,0,0,0.28)]',
          'hover:shadow-[0_28px_80px_rgba(78,38,226,0.35)]',
          'hover:brightness-110',
          'hover:scale-[1.02] active:scale-[0.985]',
        ].join(' '),
        secondary: [
          'border border-black/10 dark:border-white/10',
          'bg-white/70 dark:bg-white/5',
          'backdrop-blur-2xl',
          'text-gray-900 dark:text-white',
          'shadow-[0_14px_40px_rgba(0,0,0,0.12)]',
          'hover:bg-white/85 dark:hover:bg-white/7',
          'hover:border-brand-start/35',
          'hover:scale-[1.02] active:scale-[0.985]',
        ].join(' '),
      }),
      [],
    );

    const disabledStyle = useMemo(
      () =>
        [
          'opacity-40 cursor-not-allowed',
          'pointer-events-none',
          'hover:scale-100 active:scale-100',
          'hover:brightness-100',
        ].join(' '),
      [],
    );

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        disabled={isDisabled}
        aria-disabled={isDisabled ? 'true' : undefined}
        aria-busy={isLoading}
        className={`${baseStyle} ${enabled[variant]} ${isDisabled ? disabledStyle : ''} ${className}`}
        {...rest}
      >
        <span className={`relative z-10 flex items-center gap-2 ${isLoading ? 'invisible' : ''}`}>
          {children}
        </span>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {/* subtle sheen for primary */}
        {variant === 'primary' && !isDisabled && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute -inset-[40%] rotate-12 bg-white/10 blur-2xl translate-x-[-30%] group-hover:translate-x-[30%] transition-transform duration-700" />
          </div>
        )}
      </button>
    );
  }),
);

InteractiveButton.displayName = 'InteractiveButton';
