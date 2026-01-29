import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { translations } from '../translations';
import { UIContext, Lang, Theme } from './ui-context';
import { safeLocalStorage } from '../utils/safeLocalStorage';

const safeGet = (key: string): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return safeLocalStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    if (typeof window === 'undefined') return;
    safeLocalStorage.setItem(key, value);
  } catch {
    // noop
  }
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = safeGet('theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const [lang, setLang] = useState<Lang>(() => {
    const saved = safeGet('lang');
    return saved === 'en' || saved === 'pl' ? saved : 'pl';
  });

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    safeSet('theme', theme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    safeSet('lang', lang);
    document.documentElement.lang = t?.langCode ?? lang;
  }, [lang, t]);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    []
  );

  return (
    <UIContext.Provider value={{ theme, lang, t, setLang, toggleTheme }}>
      {children}
    </UIContext.Provider>
  );
};

