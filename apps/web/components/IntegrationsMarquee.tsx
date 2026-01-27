import React, { useMemo } from 'react';
import { Translation } from '../types';

interface IntegrationsMarqueeProps {
  t: Translation;
}

export const IntegrationsMarquee: React.FC<IntegrationsMarqueeProps> = ({ t }) => {
  const items = useMemo(() => t.integrations.marquee_items, [t.integrations.marquee_items]);
  const loop = useMemo(() => [...items, ...items], [items]);

  return (
    <div
      className="w-full overflow-hidden marquee-mask flex justify-center items-center min-h-[64px] py-2"
      aria-label={t.integrations.marquee_label}
      role="region"
    >
      <div className="flex w-max motion-safe:animate-scroll-right motion-reduce:animate-none will-change-transform mx-auto">
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6">
          {loop.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={[
                'text-sm-plus md:text-sm',
                'font-medium tracking-[0.04em] normal-case',
                'text-slate-600/60 dark:text-white/45 hover:text-slate-900 dark:hover:text-white',
                'cursor-default select-none',
                'transition-colors duration-200 whitespace-nowrap',
              ].join(' ')}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
