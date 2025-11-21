import React, { useState } from 'react';
import { useOnboardingStore } from '../../store';
import httpClient from '../../services/httpClient';
import { pushToast } from '../../components/Toaster';

/**
 * Step 5: Review and provisioning. Presents a snapshot of the collected
 * configuration and allows the user to trigger the provisioning workflow.
 */
const ReviewStep: React.FC = () => {
  const { profile, integrations, connections, schedule } = useOnboardingStore();
  const [starting, setStarting] = useState(false);

  const startProvisioning = async () => {
    setStarting(true);
    try {
      const res = await httpClient.post('api/provisioning/start', {
        json: { profile, integrations, schedule },
      });
      if (res.ok) {
        pushToast('Provisioning started');
        // You could listen for SSE events here
      } else {
        pushToast('Błąd rozpoczęcia provisioning');
      }
    } catch (err) {
      pushToast('Błąd sieci');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Podsumowanie konfiguracji</h2>
      <div className="border border-slate-700 p-4 rounded">
        <h3 className="font-semibold mb-2">Organizacja</h3>
        <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(profile, null, 2)}</pre>
      </div>
      <div className="border border-slate-700 p-4 rounded">
        <h3 className="font-semibold mb-2">Integracje</h3>
        <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(integrations, null, 2)}</pre>
      </div>
      <div className="border border-slate-700 p-4 rounded">
        <h3 className="font-semibold mb-2">Połączenia</h3>
        <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(connections, null, 2)}</pre>
      </div>
      <div className="border border-slate-700 p-4 rounded">
        <h3 className="font-semibold mb-2">Harmonogram</h3>
        <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(schedule, null, 2)}</pre>
      </div>
      <button
        onClick={startProvisioning}
        disabled={starting}
        className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 px-4 py-2 rounded"
      >
        {starting ? 'Uruchamianie...' : 'Aktywuj platformę'}
      </button>
    </div>
  );
};

export default ReviewStep;