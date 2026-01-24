import { createContext } from 'react';
import type { Translation } from '../types';

export type Theme = 'light' | 'dark';
export type Lang = 'en' | 'pl';

export interface UIContextType {
  theme: Theme;
  lang: Lang;
  t: Translation;
  setLang: (l: Lang) => void;
  toggleTheme: () => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);
