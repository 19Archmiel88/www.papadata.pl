import React from 'react';
import { motion } from 'framer-motion';

export interface SectionCardItem {
  id?: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  desc: React.ReactNode;
  colSpan?: string;
}

interface Props {
  title: string;
  description?: React.ReactNode;
  items: SectionCardItem[];
  gridCols?: string;
}

const SectionCardGrid: React.FC<Props> = ({
  title,
  description,
  items,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}) => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-2">
            PapaData • Intelligence
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm md:text-base text-slate-400">
              {description}
            </p>
          )}
        </header>

        <div className={`mt-8 grid gap-6 ${gridCols}`}>
          {items.map((item, idx) => (
            <motion.article
              key={item.id ?? idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className={[
                'group relative overflow-hidden rounded-2xl border',
                'border-slate-800 bg-slate-900/70',
                'backdrop-blur-sm shadow-[0_24px_80px_rgba(15,23,42,0.9)]',
                'hover:border-primary-500/80 hover:shadow-[0_24px_80px_rgba(88,28,135,0.75)]',
                'transition-all duration-300',
                item.colSpan ?? '',
              ].join(' ')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-slate-900/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 flex flex-col h-full">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-primary-300">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionCardGrid;
