import React, { useState } from 'react';
import { useOnboardingStore } from '../../store';
import { connectionSecretsSchema, ConnectionSecrets } from '../../lib/validation/connections';
import httpClient from '../../services/httpClient';
import { pushToast } from '../../components/Toaster';

interface ConnectionStatus {
  status: 'idle' | 'testing' | 'connected' | 'error';
  errorMsg?: string;
  secret_refs?: Record<string, string>;
}

/**
 * Step 3: Connections. For each selected integration prompt the user to
 * provide API secrets. The connection can be tested and the result is
 * displayed. Secrets are masked in the UI after successful connection.
 */
const ConnectionsStep: React.FC = () => {
  const { integrations, setConnections } = useOnboardingStore();
  const [secrets, setSecrets] = useState<Record<string, ConnectionSecrets>>({});
  const [statuses, setStatuses] = useState<Record<string, ConnectionStatus>>({});

  const handleSecretChange = (id: string, key: string, value: string) => {
    setSecrets((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const testConnection = async (id: string) => {
    try {
      const data = secrets[id];
      connectionSecretsSchema.parse(data);
    } catch (err: any) {
      pushToast(err.message || 'Niepoprawne sekrety');
      return;
    }
    setStatuses((prev) => ({ ...prev, [id]: { status: 'testing' } }));
    try {
      const res = await httpClient.post('api/connections/test', {
        json: { connector: id, secrets: secrets[id] },
      });
      if (!res.ok) throw new Error('Błąd testu');
      const body = await res.json();
      setStatuses((prev) => ({
        ...prev,
        [id]: { status: body.status === 'connected' ? 'connected' : 'error', secret_refs: body.secret_refs, errorMsg: body.error },
      }));
      if (body.status === 'connected') {
        pushToast(`Połączenie ${id} OK`);
        // mask secrets after connect
        setSecrets((prev) => ({ ...prev, [id]: {} }));
      } else {
        pushToast(`Połączenie ${id} nieudane`);
      }
    } catch (err) {
      setStatuses((prev) => ({ ...prev, [id]: { status: 'error', errorMsg: 'Błąd sieci' } }));
      pushToast('Błąd sieci');
    }
  };

  const allConnected = integrations.every((i) => statuses[i.id]?.status === 'connected');

  // When all connections are established update store
  React.useEffect(() => {
    if (allConnected) {
      const secretRefs: Record<string, any> = {};
      integrations.forEach((i) => {
        secretRefs[i.id] = statuses[i.id]?.secret_refs;
      });
      setConnections(secretRefs);
    }
  }, [allConnected, integrations, statuses, setConnections]);

  return (
    <div className="space-y-4">
      {integrations.length === 0 && (
        <p>Najpierw wybierz integracje w poprzednim kroku.</p>
      )}
      {integrations.map((integration) => {
        const status = statuses[integration.id] || { status: 'idle' };
        return (
          <div key={integration.id} className="border border-slate-700 p-4 rounded">
            <h3 className="font-semibold mb-2 capitalize">{integration.id}</h3>
            {status.status === 'connected' ? (
              <p className="text-green-500 text-sm">Połączono</p>
            ) : (
              <>
                <div className="space-y-2">
                  {/* For simplicity only one secret field per connector */}
                  <div>
                    <label className="block text-xs mb-1">API Key</label>
                    <input
                      type="password"
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      value={secrets[integration.id]?.apiKey || ''}
                      onChange={(e) => handleSecretChange(integration.id, 'apiKey', e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={() => testConnection(integration.id)}
                  disabled={status.status === 'testing'}
                  className="mt-2 px-3 py-1 bg-cyan-600 text-slate-900 rounded"
                >
                  {status.status === 'testing' ? 'Testowanie...' : 'Test Connection'}
                </button>
                {status.status === 'error' && (
                  <p className="text-red-500 text-xs mt-1">{status.errorMsg || 'Błąd'}</p>
                )}
              </>
            )}
          </div>
        );
      })}
      {integrations.length > 0 && allConnected && (
        <p className="text-green-500 mt-2">Wszystkie połączenia są aktywne. Możesz przejść dalej.</p>
      )}
    </div>
  );
};

export default ConnectionsStep;