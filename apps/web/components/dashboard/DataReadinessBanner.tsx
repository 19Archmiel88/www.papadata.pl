import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TenantStatusPayload } from '../../data/tenantStatus';

type DataReadinessBannerProps = {
  status: TenantStatusPayload | null;
  loading: boolean;
  error: string | null;
};

const formatLastSync = (value?: string) => {
  if (!value) return null;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleString();
};

export const DataReadinessBanner: React.FC<DataReadinessBannerProps> = ({
  status,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  const lastSync = useMemo(() => formatLastSync(status?.lastSyncAt), [status?.lastSyncAt]);

  if (loading) {
    return (
      <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest text-blue-600">
          Sprawdzanie stanu danych…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 md:px-6 md:py-4">
        <div className="text-xs font-black uppercase tracking-widest text-rose-600">
          Błąd statusu danych
        </div>
        <p className="text-xs text-rose-600/90 mt-1">{error}</p>
      </div>
    );
  }

  if (!status) return null;

  if (status.mode === 'live') {
    if (!lastSync) return null;
    return (
      <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-4">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-600">
          Dane zaktualizowane {lastSync}
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          LIVE
        </div>
      </div>
    );
  }

  if (status.mode === 'processing') {
    return (
      <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-amber-600">
            Trwa synchronizacja
          </div>
          <p className="text-xs text-amber-700/90 mt-1">
            {lastSync ? `Ostatni sync: ${lastSync}` : 'Synchronizujemy dane z integracji.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-600">
            PROCESSING
          </span>
        </div>
      </div>
    );
  }

  if (status.mode === 'empty') {
    return (
      <div className="mb-6 rounded-2xl border border-brand-start/20 bg-brand-start/5 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-brand-start">
            Podłącz integracje
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Nie mamy jeszcze żadnych danych. Dodaj integracje, aby rozpocząć synchronizację.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/app/integrations')}
          className="px-4 py-2 rounded-xl bg-brand-start text-white text-xs font-black uppercase tracking-widest shadow-lg"
        >
          Przejdź do integracji
        </button>
      </div>
    );
  }

  if (status.mode === 'demo') {
    return (
      <div className="mb-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-sky-600">
            Dane demonstracyjne
          </div>
          <p className="text-xs text-sky-700/90 mt-1">
            Oglądasz przykładowe dane. Podłącz integracje, aby przejść na dane produkcyjne.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/app/integrations')}
          className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-black uppercase tracking-widest shadow-lg"
        >
          Dodaj integracje
        </button>
      </div>
    );
  }

  return null;
};

// Removed local declaration of TenantStatusPayload to avoid conflict with import.
