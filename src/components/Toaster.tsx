import React, { useEffect, useState } from 'react';

interface Toast {
  id: number;
  message: string;
}

/**
 * Emits a toast notification. Components can call this helper to display
 * temporary messages to the user. Toasts automatically disappear after a
 * few seconds.
 */
export function pushToast(message: string) {
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));
}

/**
 * Component that listens for `toast` events on the window and renders
 * notifications. Should be mounted once at the root of the app.
 */
const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: custom.detail }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    window.addEventListener('toast', handler);
    return () => {
      window.removeEventListener('toast', handler);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-slate-800 text-slate-200 px-4 py-2 rounded shadow-md border border-slate-700"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toaster;