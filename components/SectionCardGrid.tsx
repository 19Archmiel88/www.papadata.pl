import React from 'react';
import { motion } from 'framer-motion';

/** Represents an individual card item within the grid */
export interface SectionCardItem {
  /** Optional ID for the card element */
  id?: string;
  /** Icon displayed at the top of the card */
  icon: React.ReactNode;
  /** Title of the card */
  title: React.ReactNode;
  /** Description text for the card */
  desc: React.ReactNode;
  /** Optional column span class (e.g. 'md:col-span-2') */
  colSpan?: string;
}

interface Props {
  /** Main section title */
  title: string;
  /** Optional section description below the title */
  description?: React.ReactNode;
  /** List of card items to display */
  items: SectionCardItem[];
  /** Grid columns configuration class. Defaults to 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' */
  gridCols?: string;
}

/**
 * A reusable component to display a grid of feature cards.
 * Includes a decorative background and hover effects.
 */
const SectionCardGrid: React.FC<Props> = ({ title, description, items, gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', }) => {
  return (
    <section className="py-20 md:py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 mx-auto max-w-4xl">
        <div className="absolute top-1/2 left-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-[140px]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{title}</h2>
          {description && <p className="mt-3 text-slate-600 dark:text-slate-400">{description}</p>}
        </div>

        <div className={`grid gap-6 auto-rows-fr ${gridCols}`}>
          {items.map((item, idx) => (
            <motion.div
              key={item.title.toString() + idx}
              id={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`
                ${item.colSpan || ''}
                group relative p-6 rounded-2xl
                bg-white/50 dark:bg-slate-900/40 backdrop-blur-md
                border border-slate-200 dark:border-slate-800
                hover:border-primary-500/50 dark:hover:border-primary-500/50
                hover:shadow-2xl hover:shadow-primary-500/10
                transition-all duration-300
                flex flex-col justify-between overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="mb-4 p-3 w-fit rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionCardGrid;
