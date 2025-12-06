import React, { useState, useEffect } from 'react';
import { X, Search, ThumbsUp } from 'lucide-react';
import { IntegrationItem, IntegrationCategory, Language, Translation } from '../types';
import { INITIAL_INTEGRATIONS } from '../constants';
import IntegrationLogo from './IntegrationLogo';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  /** Controls if the modal is visible */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Current active language */
  lang: Language;
  /** Translation object for the modal content */
  t: Translation['integrationsModal'];
  /** Optional initial filter to apply when opening the modal */
  initialFilter?: IntegrationCategory | 'All';
}

/**
 * A modal dialog displaying the full catalog of integrations.
 * Allows searching, filtering by category, and voting on upcoming integrations.
 */
const IntegrationsModal: React.FC<Props> = ({ isOpen, onClose, lang, t, initialFilter = 'All' }) => {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory | 'All'>('All');

  // Reset filter when opened
  useEffect(() => {
    if (isOpen) {
      setActiveCategory(initialFilter);
      setSearchQuery('');
    }
  }, [isOpen, initialFilter]);

  const handleVote = (id: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, votes: item.votes + 1 };
      }
      return item;
    }));
  };

  const filteredIntegrations = integrations.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: (IntegrationCategory | 'All')[] = [
    'All', 'Marketing', 'Store', 'Marketplace', 'Analytics', 'CRM', 'Tool', 'Payment', 'Logistics', 'Accounting'
  ];

  // Helper to get translated category name
  const getCategoryName = (cat: string) => {
    if (cat === 'All') return t.filters.all;
    if (cat === 'Tool') return t.filters.tools;
    return (t.filters as any)[cat.toLowerCase()] || cat;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm max-w-2xl">{t.description}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">{t.statuses}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Search & Tabs */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                      ${activeCategory === cat 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}
                    `}
                  >
                    {getCategoryName(cat)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIntegrations.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group hover:-translate-y-1 hover:shadow-md hover:scale-[1.02]"
                >
                  <IntegrationLogo code={item.code} />
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                        {getCategoryName(item.category)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${
                        item.status === 'Available' ? 'bg-green-500' :
                        item.status === 'ComingSoon' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-xs text-slate-500">
                        {item.status === 'Available' ? 'Available' : 
                         item.status === 'ComingSoon' ? 'Coming Soon' : 'Voting'}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    {item.status === 'Available' && (
                      <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                        {t.buttons.connect}
                      </button>
                    )}
                    {item.status === 'ComingSoon' && (
                      <button disabled className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed">
                        {t.buttons.comingSoon}
                      </button>
                    )}
                    {item.status === 'Voting' && (
                      <button 
                        onClick={() => handleVote(item.id)}
                        className="flex items-center gap-2 px-4 py-2 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm font-medium rounded-lg transition-colors"
                      >
                        <span>{t.buttons.vote}</span>
                        <span className="text-xs bg-primary-100 dark:bg-primary-900/50 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                           <ThumbsUp className="w-3 h-3" /> +{item.votes}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">{t.cta.text}</span>
            <button className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              {t.cta.button}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IntegrationsModal;
