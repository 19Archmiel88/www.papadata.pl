import * as React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b0b0f]/80 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl p-6 space-y-4',
          className
        )}
        {...props}
      >
        {(title || action) && (
          <div className="flex items-start justify-between gap-4">
            {title ? (
              <h3 className="text-base font-black uppercase tracking-[0.18em] text-gray-900 dark:text-white">
                {title}
              </h3>
            ) : (
              <span />
            )}
            {action}
          </div>
        )}
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm text-gray-700 dark:text-gray-200 space-y-3', className)}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';
