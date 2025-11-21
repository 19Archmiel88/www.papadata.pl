import React, { useState } from 'react';

/**
 * Displays a simple GDPR/DPA consent banner at the bottom of the screen. The
 * user can acknowledge and hide the banner. This component does not
 * persist acceptance; in a real application it should update localStorage
 * or backend state.
 */
const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-slate-200 p-4 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
      <div>
        Korzystamy z pseudonimizacji, aby chronić dane osobowe (e‑mail, telefon, IP). Zapoznaj się z <a href="#" className="underline text-cyan-400">umową DPA</a> i <a href="#" className="underline text-cyan-400">RODO</a>.
      </div>
      <button
        onClick={() => setVisible(false)}
        className="bg-cyan-600 text-slate-900 px-3 py-1 rounded hover:bg-cyan-500"
      >
        Akceptuję
      </button>
    </div>
  );
};

export default ConsentBanner;