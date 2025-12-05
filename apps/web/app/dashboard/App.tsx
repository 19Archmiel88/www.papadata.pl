'use client';

import React, { useState } from 'react';
import { AppView, WizardState } from './types';
import { Step1Company, Step2Integrations, Step3Keys, Step4Summary } from './components/WizardSteps';
import { Terminal } from './components/Terminal';
import { Dashboard } from './components/Dashboard';
import { Button } from './components/ui';
import { ArrowLeft, ArrowRight, Rocket, Hexagon } from 'lucide-react';

const App = () => {
  const [view, setView] = useState<AppView>(AppView.WIZARD);
  const [wizardState, setWizardState] = useState<WizardState>({
    step: 1,
    company: {
      nip: '',
      name: '',
      address: '',
      industry: '',
      currency: 'PLN',
      timezone: 'Europe/Warsaw',
      email: '',
      notifications: true,
      termsAccepted: false,
    },
    selectedIntegrations: [],
    integrationStatus: {},
  });

  const nextStep = () => setWizardState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
  const prevStep = () => setWizardState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

  const updateCompany = (data: Partial<WizardState['company']>) => {
    setWizardState((prev) => ({ ...prev, company: { ...prev.company, ...data } }));
  };

  const toggleIntegration = (id: string) => {
    setWizardState((prev) => {
      const current = prev.selectedIntegrations;
      const updated = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
      return { ...prev, selectedIntegrations: updated };
    });
  };

  const setIntegrationStatus = (id: string, status: 'pending' | 'connected' | 'error') => {
    setWizardState((prev) => ({
      ...prev,
      integrationStatus: { ...prev.integrationStatus, [id]: status },
    }));
  };

  const handleActivate = () => setView(AppView.TERMINAL);
  const handleTerminalComplete = () => setView(AppView.DASHBOARD);

  if (view === AppView.TERMINAL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>
        <Terminal company={wizardState.company} integrations={wizardState.selectedIntegrations} onComplete={handleTerminalComplete} />
      </div>
    );
  }

  if (view === AppView.DASHBOARD) {
    return <Dashboard companyName={wizardState.company.name || 'Klient Enterprise'} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <header className="h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Hexagon className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            PapaData <span className="text-slate-500 font-normal">| Enterprise</span>
          </span>
        </div>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Bezpieczne srodowisko wdrozeniowe</div>
      </header>

      <main className="flex-grow flex flex-col items-center pt-10 pb-16 px-4">
        <div className="w-full max-w-5xl mb-12">
          <div className="flex items-center justify-between relative px-10">
            <div className="absolute left-10 right-10 top-1/2 h-[2px] bg-slate-800 -z-0"></div>

            {[1, 2, 3, 4].map((step) => {
              const isActive = step === wizardState.step;
              const isCompleted = step < wizardState.step;

              return (
                <div key={step} className="relative z-10 group">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${
                      isActive
                        ? 'bg-slate-950 border-cyan-500 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-110'
                        : isCompleted
                        ? 'bg-slate-900 border-cyan-900 text-cyan-700'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <div className="w-3 h-3 bg-cyan-800 rounded-full" /> : step}
                  </div>
                  <div
                    className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-cyan-400' : isCompleted ? 'text-slate-500' : 'text-slate-700'
                    }`}
                  >
                    {step === 1 && 'Firma'}
                    {step === 2 && 'Integracje'}
                    {step === 3 && 'Klucze'}
                    {step === 4 && 'Start'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-5xl glass-card p-1">
          <div className="bg-slate-950/40 rounded-xl p-8 md:p-12 min-h-[500px]">
            {wizardState.step === 1 && <Step1Company data={wizardState.company} updateData={updateCompany} />}
            {wizardState.step === 2 && <Step2Integrations selectedIds={wizardState.selectedIntegrations} toggleIntegration={toggleIntegration} />}
            {wizardState.step === 3 && (
              <Step3Keys selectedIntegrations={wizardState.selectedIntegrations} statusMap={wizardState.integrationStatus} setStatus={setIntegrationStatus} />
            )}
            {wizardState.step === 4 && <Step4Summary data={wizardState} />}

            <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/5">
              <Button variant="ghost" onClick={prevStep} disabled={wizardState.step === 1} className={`${wizardState.step === 1 ? 'invisible' : ''} text-slate-500 hover:text-slate-300`}>
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </Button>

              {wizardState.step < 4 ? (
                <Button onClick={nextStep} disabled={wizardState.step === 1 && !wizardState.company.termsAccepted} variant="primary" className="px-8">
                  Dalej <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleActivate} variant="premium" className="px-8">
                  Aktywuj platforme <Rocket className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
