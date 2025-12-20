// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { pl } from './pl';

export const resources = {
  en: en,
  pl: pl,
} as const;

const storedLang = localStorage.getItem('lang');

i18n.use(initReactI18next).init({
  resources,
  lng: storedLang || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
