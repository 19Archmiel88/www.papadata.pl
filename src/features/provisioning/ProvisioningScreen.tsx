import React from 'react';

interface ProvisioningScreenProps {
  steps: { id: string; label: string; status: string }[];
}

/**
 * Displays provisioning progress. Accepts an array of steps with status and
 * renders a simple list. Not hooked up to SSE in this demo.
 */
const ProvisioningScreen: React.FC<ProvisioningScreenProps> = ({ steps }) => {
  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              step.status === 'completed'
                ? 'bg-green-500'
                : step.status === 'running'
                ? 'bg-yellow-500'
                : 'bg-slate-500'
            }`}
          ></span>
          <span className="text-sm">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProvisioningScreen;