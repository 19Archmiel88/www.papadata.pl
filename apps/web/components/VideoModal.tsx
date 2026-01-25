import React from 'react';
import type { Translation } from '../types';

interface VideoModalProps {
  /**
   * FULL embed URL, np. https://www.youtube-nocookie.com/embed/VIDEO_ID
   * albo https://www.youtube.com/embed/VIDEO_ID
   */
  src?: string;
  title?: string;

  t: Translation;
  isOpen?: boolean;
  onClose: () => void;
}

const isAllowedEmbedUrl = (raw?: string) => {
  if (!raw) return false;

  try {
    const url = new URL(raw);

    const host = url.hostname.toLowerCase();
    const path = url.pathname || '';

    const isYouTubeHost =
      host === 'www.youtube-nocookie.com' ||
      host === 'youtube-nocookie.com' ||
      host === 'www.youtube.com' ||
      host === 'youtube.com' ||
      host === 'm.youtube.com';

    const isVimeoHost = host === 'player.vimeo.com';

    if (isYouTubeHost) return path.startsWith('/embed/');
    if (isVimeoHost) return path.startsWith('/video/');

    return false;
  } catch {
    return false;
  }
};

export const VideoModal: React.FC<VideoModalProps> = ({ src, title, t, isOpen = true, onClose }) => {
  const modalTitle = title || t.videoModal.title;

  if (!isOpen) return null;

  const safeSrc = isAllowedEmbedUrl(src) ? src : undefined;

  return (
    <div className="w-full">
      <div
        className="relative w-full max-w-5xl mx-auto aspect-video glass rounded-[1.5rem] md:rounded-[2rem] border border-brand-start/30 shadow-[0_0_100px_rgba(78,38,226,0.3)] overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-[max(0.5rem,env(safe-area-inset-top))] right-[max(0.5rem,env(safe-area-inset-right))] md:top-6 md:right-6 z-10 p-2 rounded-full bg-black/40 hover:bg-brand-start transition-all duration-300 text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
          aria-label={t.videoModal.close_aria_label}
          type="button"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full h-full bg-black/30 flex items-center justify-center">
          {safeSrc ? (
            <iframe
              className="w-full h-full"
              src={safeSrc}
              title={modalTitle}
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="px-8 text-center">
              <div className="text-xs font-black uppercase tracking-[0.3em] text-white/60">
                {t.common.error_desc}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 brand-gradient-bg opacity-60" aria-hidden="true" />
      </div>
    </div>
  );
};
