import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Translation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  /** Translation object for the nagging modal content */
  t: Translation['nagging'];
}

/**
 * A modal that appears after a delay to encourage users to sign up or claim an offer.
 * Can be dismissed to a minimized side tab and reopened.
 */
const NaggingModal: React.FC<Props> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    // Show after 30 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAppeared(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  const handleReopen = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-primary-200 dark:border-primary-900 p-6 relative overflow-hidden">
              {/* Decorative background blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <button 
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl shrink-0">
                  <Gift className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-2">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {t.subtitle}
                  </p>
                  <a 
                    href="/wizard" 
                    className="block w-full text-center py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    {t.button}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMinimized && !isOpen && (
          <motion.button
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            onClick={handleReopen}
            className="fixed top-1/2 left-0 z-50 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white py-6 px-1.5 rounded-r-lg shadow-lg font-bold text-xs tracking-widest uppercase writing-vertical-rl transition-transform hover:pl-2"
            style={{ writingMode: 'vertical-rl' }}
          >
            {t.sideLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default NaggingModal;
