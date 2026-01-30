import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useModal } from '../../context/useModal';

export const CheckoutCancel: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) return;
    try {
      window.localStorage.setItem(
        'pd_post_login_redirect',
        `${location.pathname}${location.search}`
      );
    } catch {
      // ignore
    }
    openModal('auth', { isRegistered: true });
  }, [isAuthenticated, location.pathname, location.search, openModal]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050507] text-gray-900 dark:text-gray-100 px-6">
      <div className="max-w-xl w-full rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-600">CANCELLED</p>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Płatność anulowana</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Nie pobraliśmy żadnych środków. Możesz wrócić do planów i spróbować ponownie.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 rounded-xl bg-brand-start text-white text-xs font-black uppercase tracking-widest"
          >
            Wróć do planów
          </button>
        </div>
      </div>
    </main>
  );
};
