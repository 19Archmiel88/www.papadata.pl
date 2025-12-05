import React, { useState } from 'react';
import { DemoTranslation, Language, Theme } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface Props {
  t: DemoTranslation['settings'];
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  alwaysExpanded: boolean;
  setAlwaysExpanded: (v: boolean) => void;
}

const Settings: React.FC<Props> = ({ t, lang, setLang, theme, setTheme, alwaysExpanded, setAlwaysExpanded }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t.title}</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 shadow-sm">
        
        {/* Language */}
        <div className="p-6 flex items-center justify-between">
          <span className="font-medium text-slate-900 dark:text-white">{t.labels.lang}</span>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <button 
              onClick={() => setLang('PL')} 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${lang === 'PL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Polski
            </button>
            <button 
              onClick={() => setLang('EN')} 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${lang === 'EN' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="p-6 flex items-center justify-between">
          <span className="font-medium text-slate-900 dark:text-white">{t.labels.theme}</span>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <button 
              onClick={() => setTheme('dark')} 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${theme === 'dark' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              {t.labels.themeOptions.dark}
            </button>
            <button 
              onClick={() => setTheme('light')} 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${theme === 'light' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              {t.labels.themeOptions.light}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="p-6 flex items-center justify-between">
          <span className="font-medium text-slate-900 dark:text-white">{t.labels.sidebar}</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={alwaysExpanded}
              onChange={e => setAlwaysExpanded(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">{t.labels.sidebarOption}</span>
          </label>
        </div>

        {/* Delete Account */}
        <div className="p-6 flex items-center justify-between">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 font-medium text-sm flex items-center gap-2 hover:underline"
          >
            <Trash2 className="w-4 h-4" /> {t.deleteBtn}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-sm text-center shadow-2xl"
               onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t.deleteModal.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{t.deleteModal.text}</p>
              <button onClick={() => setShowDeleteModal(false)} className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg">
                {t.deleteModal.btn}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;