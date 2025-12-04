'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from './core';
const I18nContext = createContext(undefined);
const STORAGE_KEY = 'papadata.locale';
export const I18nProvider = ({ children }) => {
    const [locale, setLocaleState] = useState('pl');
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === 'pl' || stored === 'en') {
            setLocaleState(stored);
        }
    }, []);
    const setLocale = (next) => {
        setLocaleState(next);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, next);
        }
    };
    const value = useMemo(() => ({
        locale,
        setLocale,
        t: (key, params) => translate(locale, key, params)
    }), [locale]);
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return ctx;
}
