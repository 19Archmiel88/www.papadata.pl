
import React from 'react';
import { Translation } from '../types';
import { Sparkles, Play } from 'lucide-react';
import GeminiInsightCard from './GeminiInsightCard';
import { getGeminiData } from './demo/mockDashboardData';

interface Props {
  /** Translation object containing text for the AI showcase section */
  t: Translation['aiSection'];
}

/**
 * A section showcasing the AI Assistant features.
 * Displays a laptop mockup with a simulated AI interface and a floating widget.
 */
const AIShowcaseSection: React.FC<Props> = ({ t }) => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 mb-4">
             <Sparkles className="w-4 h-4 text-indigo-500" />
             <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase">AI Assistant</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Laptop Mock */}
        <div className="relative mx-auto max-w-4xl">
          {/* Laptop Base shape */}
          <div className="relative z-10 bg-slate-900 rounded-t-2xl p-2 md:p-4 shadow-2xl border border-slate-700">
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative group cursor-pointer">
              {/* Fake Video Content (Placeholder) */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                 </div>
              </div>
              
              {/* Chat UI Mock Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-slate-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                 <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                     <Sparkles className="w-4 h-4 text-white" />
                   </div>
                   <div className="space-y-2 w-full">
                     <div className="h-2 w-3/4 bg-slate-700 rounded animate-pulse" />
                     <div className="h-2 w-1/2 bg-slate-700 rounded animate-pulse" />
                   </div>
                 </div>
              </div>
            </div>
            
            {/* Webcam dot */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
          </div>
          {/* Laptop Bottom Deck */}
          <div className="relative z-10 h-4 md:h-6 bg-slate-800 rounded-b-xl border-t border-slate-700 shadow-xl mx-4 md:mx-8">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-32 h-1 md:h-1.5 bg-slate-700 rounded-b-lg" />
          </div>

          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-indigo-500/20 blur-[100px] -z-0 pointer-events-none" />

          {/* Floating Widget - Side */}
          <div className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-[200px] hidden md:block animate-float">
             <div className="flex items-center gap-3 mb-2">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live</span>
             </div>
             <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.widget.title}</h4>
             <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded transition-colors">
               {t.widget.btn}
             </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <GeminiInsightCard data={getGeminiData('last30')} />
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseSection;
