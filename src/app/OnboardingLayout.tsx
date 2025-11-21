import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

/**
 * Parent layout for the onboarding wizard. Displays the current step and
 * provides basic navigation controls (back/next). Guards can be added here
 * to restrict access based on authentication or user roles.
 */
const OnboardingLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = [
    '1-organization',
    '2-integrations',
    '3-connections',
    '4-schedule',
    '5-review',
  ];

  const currentIndex = steps.findIndex((step) => location.pathname.includes(step));

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      navigate(`/onboarding/${steps[currentIndex + 1]}`);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(`/onboarding/${steps[currentIndex - 1]}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-900 text-white">
      <header className="w-full max-w-4xl py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">Kreator konfiguracji</h1>
        <p className="text-sm text-slate-400">Krok {currentIndex + 1} z {steps.length}</p>
        <div className="w-full bg-slate-700 h-2 rounded mt-2">
          <div
            className="bg-cyan-500 h-2 rounded"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="w-full max-w-4xl px-4 py-4 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
        >
          Wstecz
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === steps.length - 1}
          className="px-4 py-2 bg-cyan-600 text-slate-900 font-semibold rounded disabled:opacity-50"
        >
          Dalej
        </button>
      </footer>
    </div>
  );
};

export default OnboardingLayout;