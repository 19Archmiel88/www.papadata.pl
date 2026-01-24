import React, { useId, useMemo, useState } from 'react';
import { InteractiveButton } from './InteractiveButton';
import type { Translation } from '../types';
import { useApi } from '../hooks/useApi';
import { useModal } from '../context/useModal';
import { normalizeApiError } from '../hooks/useApiError';

interface ContactModalProps {
  t: Translation;
  isOpen?: boolean;
  onClose?: () => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const ContactModal: React.FC<ContactModalProps> = ({ t, isOpen = true, onClose }) => {
  const api = useApi();
  const { closeModal } = useModal();

  const handleClose = () => (onClose ? onClose() : closeModal());

  const titleId = useId();
  const descId = useId();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  const emailOk = useMemo(() => isValidEmail(trimmedEmail), [trimmedEmail]);
  const nameOk = trimmedName.length >= 2;
  const messageOk = trimmedMessage.length >= 10;

  const isFormValid = nameOk && emailOk && messageOk;
  const remaining = 2000 - message.length;

  const clientRequestId = useMemo(() => {
    if (typeof window === 'undefined') return 'ssr';
    return (crypto as any)?.randomUUID?.() ?? `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }, []);

  const fieldError = useMemo(() => {
    if (!name && !email && !message) return null;
    if (!nameOk) return t.footer.meta.contact_name_placeholder;
    if (!emailOk) return t.footer.meta.contact_email_placeholder;
    if (!messageOk) return t.footer.meta.contact_message_placeholder;
    return null;
  }, [emailOk, messageOk, name, nameOk, email, message, t.footer.meta]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      setSubmitError(t.common.error_desc);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.supportContact({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        source: 'contact_modal',
        clientRequestId,
      } as any);

      setSubmitted(true);
    } catch (error) {
      setSubmitError(normalizeApiError(error, t.common.error_desc));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="relative w-full max-w-2xl glass bg-white/95 dark:bg-[#0A0A0C]/95 rounded-[2.5rem] border border-black/10 dark:border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.7)] overflow-hidden"
      role="document"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-busy={isSubmitting}
    >
      <div className="absolute top-0 left-0 right-0 h-1 brand-gradient-bg" />

      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        className="absolute top-6 right-6 p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-start transition-all text-gray-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
        aria-label={t.common.close}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="p-8 sm:p-12">
        <h3 id={titleId} className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          {t.footer.meta.contact_title}
        </h3>
        <p id={descId} className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          {t.footer.meta.contact_desc}
        </p>

        {submitError && !submitted && (
          <div
            className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs font-semibold text-rose-500"
            aria-live="polite"
          >
            {submitError}
          </div>
        )}

        {submitted ? (
          <div className="mt-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
            <div className="text-xs font-black text-emerald-500 uppercase tracking-widest">
              {t.footer.meta.contact_success_title}
            </div>
            <p className="mt-2 text-xs-plus text-gray-500 dark:text-gray-400">
              {t.footer.meta.contact_success_desc}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center">
              <InteractiveButton
                variant="primary"
                onClick={handleClose}
                className="!h-12 !px-8 !text-xs font-black uppercase tracking-widest"
              >
                {t.common.close}
              </InteractiveButton>

              <InteractiveButton
                variant="secondary"
                onClick={() => {
                  setSubmitted(false);
                  setSubmitError(null);
                  setMessage('');
                }}
                className="!h-12 !px-8 !text-xs font-black uppercase tracking-widest"
              >
                {t.footer.meta.contact_cta}
              </InteractiveButton>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {fieldError && (
              <div className="rounded-2xl border border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-xs font-semibold text-gray-500">
                {fieldError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.footer.meta.contact_name_placeholder}
                aria-label={t.footer.meta.contact_name_placeholder}
                disabled={isSubmitting}
                minLength={2}
                required
                aria-invalid={Boolean(name) && !nameOk}
                className="w-full rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.meta.contact_email_placeholder}
                aria-label={t.footer.meta.contact_email_placeholder}
                disabled={isSubmitting}
                minLength={6}
                required
                aria-invalid={Boolean(email) && !emailOk}
                className="w-full rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
              />
            </div>

            <div className="space-y-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.footer.meta.contact_message_placeholder}
                aria-label={t.footer.meta.contact_message_placeholder}
                disabled={isSubmitting}
                minLength={10}
                maxLength={2000}
                required
                aria-invalid={Boolean(message) && !messageOk}
                className="w-full min-h-[140px] rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
              />

              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                <span>{messageOk ? t.footer.meta.contact_message_ok : t.footer.meta.contact_message_min}</span>
                <span className={remaining < 0 ? 'text-rose-500' : ''}>{remaining}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                {t.footer.meta.contact_email}
              </span>

              <InteractiveButton
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                disabled={!isFormValid || isSubmitting}
                className="!h-12 !px-8 !text-xs font-black uppercase tracking-widest"
              >
                {t.footer.meta.contact_cta}
              </InteractiveButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
