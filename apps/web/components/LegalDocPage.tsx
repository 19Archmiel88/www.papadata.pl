import React, { memo, useCallback, useMemo, useId } from 'react';
import type { Translation } from '../types';
import { Logo } from './Logo';
import { InteractiveButton } from './InteractiveButton';

interface LegalDocPageProps {
  t: Translation;
  content: string;
  fallbackTitle: string;
  onBack: () => void;
}

function parseLegalDoc(content: string, fallbackTitle: string): { title: string; body: string } {
  // enterprise: BOM + normalizacja końców linii
  const normalized = (content ?? '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const rawLines = normalized.split('\n');

  // pomijamy puste linie na początku
  let firstNonEmptyIdx = 0;
  while (firstNonEmptyIdx < rawLines.length && rawLines[firstNonEmptyIdx].trim() === '') {
    firstNonEmptyIdx += 1;
  }

  const firstLine = (rawLines[firstNonEmptyIdx]?.trim() ?? '').trim();

  // wspieramy # / ## / ### jako nagłówek startowy
  const headlineMatch = firstLine.match(/^(#{1,3})\s+(.*)$/);
  if (headlineMatch) {
    const title = (headlineMatch[2] ?? '').trim() || fallbackTitle;
    const body = rawLines.slice(firstNonEmptyIdx + 1).join('\n').trim();
    return { title, body };
  }

  return { title: fallbackTitle, body: normalized.trim() };
}

export const LegalDocPage: React.FC<LegalDocPageProps> = memo(
  ({ t, content, fallbackTitle, onBack }) => {
    const pageId = useId();
    const titleId = `legal-doc-title-${pageId}`;
    const bodyId = `legal-doc-body-${pageId}`;

    const { title, body } = useMemo(() => parseLegalDoc(content, fallbackTitle), [content, fallbackTitle]);

    const handleBack = useCallback(() => {
      onBack();
    }, [onBack]);

    return (
      <div className="min-h-screen relative overflow-hidden bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(78,38,226,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(78,38,226,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-10 md:py-16">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <Logo className="w-8 h-8 text-gray-900 dark:text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">PapaData</span>
                <span className="text-xs font-mono font-bold tracking-[0.3em] text-gray-500 uppercase">
                  {t.footer.col3_title}
                </span>
              </div>
            </div>

            <InteractiveButton
              variant="secondary"
              onClick={handleBack}
              type="button"
              className="!h-10 !px-5 !text-xs-plus font-semibold normal-case tracking-normal rounded-xl border-gray-200 dark:border-white/10 dark:bg-white/5"
            >
              {t.common.back_to_home}
            </InteractiveButton>
          </header>

          <main aria-labelledby={titleId} aria-describedby={bodyId}>
            <section className="glass rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0C]/80 p-6 sm:p-10 md:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:shadow-[0_40px_90px_rgba(0,0,0,0.5)]">
              <h1
                id={titleId}
                className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-6"
              >
                {title}
              </h1>

              <div
                id={bodyId}
                className="whitespace-pre-wrap text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium font-sans"
                aria-label={t.footer.col3_title}
              >
                {body}
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  },
);

LegalDocPage.displayName = 'LegalDocPage';
