import React, { useState, useCallback, useMemo } from 'react';
import {
  ModalContext,
  ModalPayload,
  ModalStackItem,
  ModalType,
  ModalContextType,
  OpenModalOptions,
} from './modal-context';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<ModalStackItem[]>([]);

  const openModal = useCallback(
    (type: ModalType, props: ModalPayload = {}, options?: OpenModalOptions) => {
      setStack((prev) => {
        if (options?.stack) return [...prev, { type, props }];
        return [{ type, props }];
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return [];
      return prev.slice(0, -1);
    });
  }, []);

  const closeAll = useCallback(() => {
    setStack([]);
  }, []);

  const top = stack.length > 0 ? stack[stack.length - 1] : null;

  const value = useMemo<ModalContextType>(
    () => ({
      activeModal: top?.type ?? null,
      modalProps: top?.props ?? {},
      openModal,
      closeModal,
      closeAll,
    }),
    [top, openModal, closeModal, closeAll]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
