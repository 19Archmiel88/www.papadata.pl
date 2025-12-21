import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { useT } from '../../hooks/useT';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  );
}

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  variant?: 'center' | 'drawer';
  initialFocusRef?: RefObject<HTMLElement>;
};

const Modal = ({ isOpen, title, onClose, children, variant = 'center', initialFocusRef }: ModalProps) => {
  const { t } = useT();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveRef.current = document.activeElement as HTMLElement | null;

    // Keep keyboard focus inside the dialog while it is open.
    const focusPanel = () => {
      const focusable = getFocusableElements(panelRef.current);
      const fallback = panelRef.current;
      const initial = initialFocusRef?.current ?? focusable[0] ?? fallback;
      initial?.focus();
    };

    focusPanel();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(panelRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !panelRef.current?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || !panelRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveRef.current?.focus();
    };
  }, [isOpen, onClose, initialFocusRef]);

  if (!isOpen) return null;

  const panelClassName =
    variant === 'drawer' ? 'modal-panel modal-panel--drawer' : 'modal-panel';

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className={panelClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
