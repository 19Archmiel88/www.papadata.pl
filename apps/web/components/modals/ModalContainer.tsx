import React, { Suspense, useEffect, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../../context/useModal';
import { ModalRegistry, type ModalId, type ModalSize } from './ModalRegistry';
import { useUI } from '../../context/useUI';
import { useFocusTrap } from '../../hooks/useFocusTrap';

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  modalKey?: ModalId;
  title?: string;
  description?: string;
  size?: ModalSize;
  disableEsc?: boolean;
  disableOverlayClose?: boolean;
  children: React.ReactNode;
};

const sizeClassMap: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  modalKey,
  title,
  description,
  size = 'lg',
  disableEsc = false,
  disableOverlayClose = false,
  children,
}) => {
  const focusTrapRef = useFocusTrap(isOpen);
  const modalId = useId();
  const titleId = `modal-title-${modalId}`;
  const descId = `modal-desc-${modalId}`;

  useEffect(() => {
    if (!isOpen || disableEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [disableEsc, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  const sizeClass = sizeClassMap[size] ?? sizeClassMap.lg;
  const contentOffsetClass = modalKey === 'auth' ? 'md:-translate-y-10' : '';

  const onBackdropPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (disableOverlayClose) return;

    // tylko lewy klik myszy (touch/pen pomijamy)
    if (e.pointerType === 'mouse' && typeof e.button === 'number' && e.button !== 0) return;

    const contentEl = (focusTrapRef as React.RefObject<HTMLDivElement | null>)?.current;
    const target = e.target as Node | null;

    if (contentEl && target && contentEl.contains(target)) return;

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <div
            key={modalKey ?? 'modal'}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8"
            onPointerDown={onBackdropPointerDown}
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md z-0"
            />

            <motion.div
              ref={focusTrapRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative z-10 w-full ${sizeClass} max-h-[92vh] overflow-auto outline-none mx-auto ${contentOffsetClass}`}
            >
              <span id={titleId} className="sr-only">
                {title ?? 'Dialog'}
              </span>
              <span id={descId} className="sr-only">
                {description ?? 'Modal window'}
              </span>

              {children}
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export const ModalContainer: React.FC = () => {
  const { activeModal, modalProps, closeModal } = useModal();
  const { t } = useUI();

  const modalEntry = useMemo(() => (activeModal ? ModalRegistry[activeModal] : null), [activeModal]);
  const ModalComponent = modalEntry?.component ?? null;
  const meta = modalEntry?.meta ?? {};

  // KONTRAKT: modalProps.shell steruje "shell'em" i nie trafia do komponentu modala.
  const shell = (modalProps?.shell ?? {}) as {
    title?: string;
    description?: string;
    size?: ModalSize;
    disableEsc?: boolean;
    disableOverlayClose?: boolean;
  };

  // Reszta propsów idzie do modala.
  const componentProps = useMemo(() => {
    const { shell: _shell, ...rest } = modalProps ?? {};
    return rest;
  }, [modalProps]);

  const resolvedTitle = shell.title ?? meta.title ?? t.modals?.title ?? 'Dialog';
  const resolvedDescription = shell.description ?? meta.description ?? t.modals?.desc ?? 'Modal window';
  const resolvedSize = ((shell.size ?? meta.size ?? 'lg') as ModalSize) satisfies ModalSize;
  const resolvedDisableEsc = Boolean(shell.disableEsc ?? meta.disableEsc);
  const resolvedDisableOverlayClose = Boolean(shell.disableOverlayClose ?? meta.disableOverlayClose);

  const isOpen = Boolean(modalEntry && ModalComponent);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      modalKey={modalEntry?.id}
      title={resolvedTitle}
      description={resolvedDescription}
      size={resolvedSize}
      disableEsc={resolvedDisableEsc}
      disableOverlayClose={resolvedDisableOverlayClose}
    >
      <Suspense
        fallback={
          <div className="flex items-center gap-3 bg-dark-bg/50 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl mx-auto">
            <div className="w-2 h-2 rounded-full bg-brand-start animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
              {t.modals?.initializingInterface ?? 'Initializing interface'}
            </span>
          </div>
        }
      >
        {ModalComponent && (
          <ModalComponent t={t} isOpen={isOpen} onClose={closeModal} {...(componentProps as any)} />
        )}
      </Suspense>
    </ModalShell>
  );
};
