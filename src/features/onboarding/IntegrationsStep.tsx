import React, { useState } from 'react';
import { useOnboardingStore } from '../../store';
import { integrationSchema, integrationsSchema, ConnectorId, Integration } from '../../lib/validation/integrations';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import httpClient from '../../services/httpClient';
import { pushToast } from '../../components/Toaster';

/**
 * Step 2: Integrations. Allows users to select and configure connectors.
 * Selected integrations are stored in zustand and sent to the backend when
 * saving. A minimal UI is provided for demonstration purposes.
 */
const availableConnectors: { id: z.infer<typeof ConnectorId>; label: string }[] = [
  { id: 'woocommerce', label: 'WooCommerce' },
  { id: 'shopify', label: 'Shopify' },
  { id: 'allegro', label: 'Allegro' },
  { id: 'baselinker', label: 'BaseLinker' },
  { id: 'ga4', label: 'GA4' },
  { id: 'googleads', label: 'Google Ads' },
  { id: 'metaads', label: 'Meta Ads' },
  { id: 'payu', label: 'PayU' },
  { id: 'przelewy24', label: 'Przelewy24' },
  { id: 'inpost', label: 'InPost' },
  { id: 'tiktokads', label: 'TikTok Ads' },
  { id: 'gsc', label: 'Google Search Console' },
];

const IntegrationsStep: React.FC = () => {
  const { integrations, setIntegrations } = useOnboardingStore();
  const [selected, setSelected] = useState<Integration[]>(integrations);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ items: Integration[] }>({
    resolver: zodResolver(integrationsSchema.transform((items) => ({ items }))),
    defaultValues: { items: selected },
  });

  const toggleIntegration = (id: ConnectorId) => {
    setSelected((prev) => {
      if (prev.some((i) => i.id === id)) {
        return prev.filter((i) => i.id !== id);
      }
      return [...prev, { id, enabled: true, backfill_months: 12, plan: 'standard' } as Integration];
    });
  };

  const onSubmit = async () => {
    try {
      // Validate using schema before sending
      const parsed = integrationsSchema.parse(selected);
      setIntegrations(parsed);
      const res = await httpClient.put('api/onboarding/integrations', {
        json: parsed,
      });
      if (res.ok) {
        pushToast('Integracje zapisane');
      } else {
        pushToast('Błąd zapisu integracji');
      }
    } catch (err: any) {
      pushToast(err.message || 'Niepoprawne dane integracji');
    }
  };

  return (
    <div className="space-y-4">
      <p>Wybierz integracje, które chcesz uruchomić:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableConnectors.map((conn) => {
          const config = selected.find((i) => i.id === conn.id);
          return (
            <div key={conn.id} className="border border-slate-700 rounded p-4">
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={!!config}
                  onChange={() => toggleIntegration(conn.id)}
                  className="mr-2"
                />
                {conn.label}
              </label>
              {config && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-xs mb-1">Alias</label>
                    <input
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      value={config.alias || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelected((prev) => prev.map((i) => (i.id === conn.id ? { ...i, alias: value } : i)));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Backfill (miesiące)</label>
                    <input
                      type="number"
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      value={config.backfill_months}
                      min={1}
                      max={60}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setSelected((prev) => prev.map((i) => (i.id === conn.id ? { ...i, backfill_months: value } : i)));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Plan</label>
                    <select
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      value={config.plan}
                      onChange={(e) => {
                        const value = e.target.value as Integration['plan'];
                        setSelected((prev) => prev.map((i) => (i.id === conn.id ? { ...i, plan: value } : i)));
                      }}
                    >
                      <option value="standard">Standard</option>
                      <option value="extended">Rozszerzony</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-slate-900 px-4 py-2 rounded"
        onClick={onSubmit}
      >
        Zapisz integracje
      </button>
      {errors.items && <p className="text-red-500 text-sm mt-2">{errors.items.message as string}</p>}
    </div>
  );
};

export default IntegrationsStep;