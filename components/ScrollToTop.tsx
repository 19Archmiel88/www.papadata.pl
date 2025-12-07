import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface Props {
  tooltip: string;
}

const ScrollToTop: React.FC<Props> = ({ tooltip }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title={tooltip}
      aria-label={tooltip}
      className="fixed bottom-4 left-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-950/90 text-slate-100 shadow-lg shadow-black/40 hover:border-primary-500 hover:text-primary-100"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
};

export default ScrollToTop;
