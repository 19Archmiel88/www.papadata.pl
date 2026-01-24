import { createContext } from 'react';
import type { ModalId, ModalSize } from '../components/modals/ModalRegistry';

export type ModalType = ModalId;

export type ModalPayload = Record<string, unknown> & {
  shell?: {
    title?: string;
    description?: string;
    size?: ModalSize;
    disableEsc?: boolean;
    disableOverlayClose?: boolean;
  };
};

export type ModalStackItem = {
  type: ModalType;
  props: ModalPayload;
};

export type OpenModalOptions = {
  stack?: boolean;
};

export interface ModalContextType {
  activeModal: ModalType | null;
  modalProps: ModalPayload;
  openModal: (type: ModalType, props?: ModalPayload, options?: OpenModalOptions) => void;
  closeModal: () => void;
  closeAll: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);
