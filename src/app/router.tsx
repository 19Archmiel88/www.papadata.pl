import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import OrganizationStep from '../features/onboarding/OrganizationStep';
import IntegrationsStep from '../features/onboarding/IntegrationsStep';
import ConnectionsStep from '../features/onboarding/ConnectionsStep';
import ScheduleStep from '../features/onboarding/ScheduleStep';
import ReviewStep from '../features/onboarding/ReviewStep';

/**
 * Defines the application routes. The onboarding wizard is nested under
 * `/onboarding` and each numbered step corresponds to a child route. Upon
 * visiting the root path the user is redirected to the first step.
 */
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect base path to onboarding */}
        <Route path="/" element={<Navigate to="/onboarding/1-organization" replace />} />
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route path="1-organization" element={<OrganizationStep />} />
          <Route path="2-integrations" element={<IntegrationsStep />} />
          <Route path="3-connections" element={<ConnectionsStep />} />
          <Route path="4-schedule" element={<ScheduleStep />} />
          <Route path="5-review" element={<ReviewStep />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;