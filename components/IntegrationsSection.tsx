
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Translation, IntegrationItem, IntegrationCategory } from '../types';
import { INITIAL_INTEGRATIONS } from '../constants';
import IntegrationLogo from './IntegrationLogo';

interface Props {
  t: Translation['integrationsSection'];
  onOpenModal: () => void;
}

const IntegrationsSection: React.FC<Props> = ({ t, onOpenModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Select top 8-10 items for the preview
  const previewItems = [
    'woocommerce', 'shopify', 'allegro', 'ga4', 
    'google_ads', 'meta_ads', 'tiktok_ads', 'idosell', 'skyshop', 'baselinker'
  ];

  const displayItems = searchQuery 
    ? INITIAL_INTEGRATIONS.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : INITIAL_INTEGRATIONS.filter(item => previewItems.includes(item.id));

  const getSubtitle = (category: IntegrationCategory) => {
    return (t.cardSubtitles as any)[category.toLowerCase()] || category;
  };

  return (
    <section id="integrations" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
          {t.title}
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300 mb-10">
          {t.subtitle}
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
           <input 
             type="text"
             placeholder={t.searchPlaceholder}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
           />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <div 
                key={item.id}
                className="group bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-900 transition-all duration-300 flex flex-col items-center justify-center text-center h-40 hover:-translate-y-1 hover:scale-[1.02]"
              >
                <IntegrationLogo code={item.code} size="lg" className="mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">
                  {getSubtitle(item.category)}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-slate-500">
               No integrations found matching "{searchQuery}"
            </div>
          )}
        </div>

        <button 
          onClick={onOpenModal}
          className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-xl transition-colors shadow-lg"
        >
          {t.viewAllButton}
        </button>
      </div>
    </section>
  );
};

export default IntegrationsSection;
