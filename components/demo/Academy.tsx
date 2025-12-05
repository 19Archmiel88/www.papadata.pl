import React, { useState } from 'react';
import { Play, FileText, Lock } from 'lucide-react';
import { DemoTranslation } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  t: DemoTranslation['academy'];
}

type Tile =
  | { type: 'video'; locked: boolean; title: string; subtitle: string }
  | { type: 'article'; locked: boolean; title: string; subtitle: string };

const Academy: React.FC<Props> = ({ t }) => {
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [activeModal, setActiveModal] = useState<{ type: 'video' | 'article'; title: string; subtitle: string; body?: string } | null>(null);

  const videos: Tile[] = t.videos.map((v) => ({ ...v, type: 'video' as const }));
  const articles: Tile[] = t.articles.map((a) => ({ ...a, type: 'article' as const }));

  const openTile = (tile: Tile) => {
    if (tile.locked) {
      setShowLockedModal(true);
      return;
    }
    setActiveModal({
      type: tile.type,
      title: tile.title,
      subtitle: tile.subtitle,
      body: tile.type === 'article' ? t.articleBody : t.videoBody,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">{t.text}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {videos.map((tile, idx) => (
          <div
            key={idx}
            onClick={() => openTile(tile)}
            className={`group cursor-pointer relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all ${idx === 0 ? 'md:col-span-2' : ''}`}
          >
            <div
              className={`h-44 md:h-56 relative flex items-center justify-center ${
                tile.type === 'video' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-50 dark:bg-indigo-900/20'
              } ${tile.locked ? 'grayscale opacity-80' : ''}`}
            >
              {tile.type === 'video' ? (
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white fill-current" />
                </div>
              ) : (
                <FileText className="w-10 h-10 text-indigo-400" />
              )}
              {tile.locked && (
                <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
                  <Lock className="w-7 h-7 text-slate-200 mb-2" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-100">{t.badgePremium}</span>
                </div>
              )}
            </div>
            <div className={`p-4 ${tile.locked ? 'opacity-70' : ''}`}>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                {tile.title}
              </h3>
              <p className="text-sm text-slate-500">{tile.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((tile, idx) => (
          <div
            key={idx}
            onClick={() => openTile(tile)}
            className="group cursor-pointer relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
          >
            <div
              className={`h-32 relative flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 ${tile.locked ? 'grayscale opacity-80' : ''}`}
            >
              <FileText className="w-10 h-10 text-indigo-400" />
              {tile.locked && (
                <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
                  <Lock className="w-6 h-6 text-slate-200 mb-2" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-100">{t.badgePremium}</span>
                </div>
              )}
            </div>
            <div className={`p-4 ${tile.locked ? 'opacity-70' : ''}`}>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                {tile.title}
              </h3>
              <p className="text-sm text-slate-500">{tile.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Locked Modal */}
      <AnimatePresence>
        {showLockedModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLockedModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-sm text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t.lockedModal.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{t.lockedModal.text}</p>
              <a
                href="/wizard"
                className="block w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors"
              >
                {t.lockedModal.btn}
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Content Modals */}
      <AnimatePresence>
        {activeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {activeModal.type === 'video' ? (
                <div className="aspect-video bg-slate-950 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 to-indigo-700/30" />
                  <div className="relative flex flex-col items-center gap-3 text-center px-6">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                    <p className="text-white text-sm">{activeModal.body || t.videoBody}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 h-full overflow-y-auto bg-white dark:bg-slate-900 text-left w-full">
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">{activeModal.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {activeModal.body || t.articleBody}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Academy;
