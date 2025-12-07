import React, { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';
import { Translation } from '../types';

interface Props {
  t: Translation['nagging'];
}

const NaggingModal: React.FC<Props> = ({ t }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs rounded-2xl border border-primary-500/40 bg-slate-950/95 p-4 text-xs text-slate-100 shadow-xl shadow-primary-500/30">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute right-2 top-2 rounded-full border border-slate-800 bg-slate-900/80 p-1 text-slate-400 hover:text-slate-100"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-[10px] font-semibold text-primary-200">
        <Clock className="h-3 w-3" />
        <span>{t.sideLabel}</span>
      </div>

      <h3 className="mt-3 text-[13px] font-semibold text-slate-50">
        {t.title}
      </h3>
      <p className="mt-2 text-[11px] text-slate-300">{t.subtitle}</p>

      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-500"
      >
        {t.button}
      </button>
    </div>
  );
};

export default NaggingModal;
