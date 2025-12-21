import { useContext } from 'react';
import { ConsentContext } from '../contexts/ConsentContext';

export const useConsent = () => {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
};
