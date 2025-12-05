import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface Props {
  tooltip: string;
}

const ScrollToTop: React.FC<Props> = ({ tooltip }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title={tooltip}
      className="fixed bottom-6 right-6 z-40 p-3 bg-slate-900 dark:bg-slate-700 hover:bg-primary-600 dark:hover:bg-primary-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110 group"
    >
      <ArrowUp className="w-5 h-5" />
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltip}
      </span>
    </button>
  );
};

export default ScrollToTop;