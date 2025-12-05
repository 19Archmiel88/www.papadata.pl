import React, { useMemo, useState } from 'react';
import { DemoTranslation, SupportTopic } from '../../types';
import { Send } from 'lucide-react';

interface Props {
  t: DemoTranslation['support'];
}

const Support: React.FC<Props> = ({ t }) => {
  const [topic, setTopic] = useState('');
  const [sent, setSent] = useState(false);
  const [extraValue, setExtraValue] = useState('');

  const topicOptions: SupportTopic[] = useMemo(() => t.dynamicTopics, [t.dynamicTopics]);
  const selectedTopic = topicOptions.find((opt) => opt.key === topic);
  const placeholder = t.form.topics.other === 'Other' ? 'Select...' : 'Wybierz...';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.title}</h2>
        <p className="text-slate-600 dark:text-slate-400">{t.text}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.form.topic}</label>
            <select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setExtraValue('');
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
            >
              <option value="">{placeholder}</option>
              {topicOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {selectedTopic?.extraLabel && selectedTopic.extraOptions && (
            <div className="space-y-2 animate-fade-in-up">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedTopic.extraLabel}</label>
              <select
                value={extraValue}
                onChange={(e) => setExtraValue(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
              >
                <option value="">{placeholder}</option>
                {selectedTopic.extraOptions?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.form.desc}</label>
          <textarea
            rows={4}
            placeholder={t.form.descPlaceholder}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.form.date}</label>
            <input
              type="date"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.form.email}</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-sm text-amber-800 dark:text-amber-200">
          {t.form.priceInfo}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> {t.form.btn}
        </button>
      </form>

      {sent && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] animate-fade-in-up text-center">
          {t.successToast}
        </div>
      )}
    </div>
  );
};

export default Support;
