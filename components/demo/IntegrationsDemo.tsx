import React, { useState } from 'react';
import { Search, ThumbsUp, Check } from 'lucide-react';
import { DemoTranslation, IntegrationCategory, IntegrationHealthInfo, IntegrationItem } from '../../types';
import { INITIAL_INTEGRATIONS } from '../../constants';
import IntegrationLogo from '../IntegrationLogo';

interface Props {
  t: DemoTranslation['integrations'];
  integrationHealth?: Record<string, IntegrationHealthInfo & { longName: string }>;
  onReconnect?: (id: string) => void;
}

const IntegrationsDemo: React.FC<Props> = ({ t, integrationHealth, onReconnect }) => {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory | 'All'>('All');
  const [toast, setToast] = useState<string | null>(null);

  const integrationStatusList = Object.values(integrationHealth || {});
  const bannerMessage =
    integrationStatusList.some((entry) => entry.state === 'needs_reauth')
      ? t.status.bannerReauth
      : integrationStatusList.some((entry) => entry.state === 'error')
        ? t.status.bannerError
        : null;
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleConnect = (id: string) => {
    // In demo, we just simulate
    showToast(t.toasts.connected);
  };

  const handleVote = (id: string) => {
    setIntegrations(prev => prev.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
    showToast(t.toasts.vote);
  };

  const categories: (IntegrationCategory | 'All')[] = [
    'All',
    'Marketing',
    'Store',
    'Marketplace',
    'Analytics',
    'CRM',
    'Tool',
    'Payment',
    'Logistics',
    'Accounting',
  ];

  const filteredIntegrations = integrations.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 relative">
      {/* Toast */}
      {toast && (
        <div role="alert" className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-fade-in-up">
          {toast}
        </div>
      )}

      {/* Header Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{t.text}</p>
      </div>

      {bannerMessage && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-800 text-amber-900 dark:text-amber-100 px-4 py-3 text-sm">
          {bannerMessage}
        </div>
      )}

      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
           <input 
             type="text" 
             placeholder={t.searchPlaceholder}
             aria-label={t.searchPlaceholder}
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
           />
        </div>
        <div 
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          role="group"
          aria-label="Category filters"
        >
          {categories.map(cat => (
             <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                  activeCategory === cat 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
             >
               {t.categories[cat]}
             </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => {
          const health = integrationHealth?.[item.id];
          const needsReauth = health?.state === 'needs_reauth';
          const hasError = health?.state === 'error';
          return (
            <div
              key={item.id}
              className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200"
            >
               <IntegrationLogo code={item.code} />
               <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                  <span className="text-xs text-slate-500 uppercase">
                    {t.categories[item.category] || item.category}
                  </span>
                  {needsReauth && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">
                      {t.status.needsReauth}
                      <button
                        type="button"
                        onClick={() => onReconnect?.(item.id)}
                        disabled={!onReconnect}
                        className="text-primary-600 underline underline-offset-2 disabled:text-slate-400"
                      >
                        {t.status.reconnect}
                      </button>
                    </div>
                  )}
                  {hasError && (
                    <p className="mt-2 text-[11px] text-rose-500">
                      {health?.message || t.status.reconnectHint}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`w-2 h-2 rounded-full ${
                        item.status === 'Available' ? 'bg-green-500' :
                        item.status === 'ComingSoon' ? 'bg-amber-500' : 'bg-blue-500'
                     }`} />
                     <span className="text-xs text-slate-400">{item.status}</span>
                  </div>
               </div>
               <div>
                 {item.status === 'Available' && (
                   <button 
                    onClick={() => handleConnect(item.id)} 
                    aria-label={`${t.buttons.connect} ${item.name}`}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90"
                   >
                     {t.buttons.connect}
                   </button>
                 )}
                 {item.status === 'ComingSoon' && (
                   <button 
                    disabled 
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed" 
                    title={t.tooltips.comingSoon}
                   >
                     {t.buttons.comingSoon}
                   </button>
                 )}
                 {item.status === 'Voting' && (
                   <div className="flex flex-col items-end">
                     <button 
                      onClick={() => handleVote(item.id)} 
                      aria-label={`${t.buttons.vote} for ${item.name}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
                     >
                        {t.buttons.vote} <span className="text-[10px] bg-primary-100 dark:bg-primary-900/50 px-1 rounded flex gap-0.5 items-center"><ThumbsUp className="w-2 h-2" />{item.votes}</span>
                     </button>
                     <div className="text-[10px] text-slate-500 mt-1 text-center">
                       {t.votesLabel}: {item.votes}
                     </div>
                   </div>
                 )}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationsDemo;
