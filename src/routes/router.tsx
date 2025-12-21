import { createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import LandingLayout from '../layouts/LandingLayout';
import OverviewPage from '../pages/Dashboard/OverviewPage';
import AnalyticsPage from '../pages/Dashboard/AnalyticsPage';
import ReportsPage from '../pages/Dashboard/ReportsPage';
import CustomersPage from '../pages/Dashboard/CustomersPage';
import ProductsPage from '../pages/Dashboard/ProductsPage';
import IntegrationsPage from '../pages/Dashboard/IntegrationsPage';
import SupportPage from '../pages/Dashboard/SupportPage';
import SettingsPage from '../pages/Dashboard/SettingsPage';
import LandingPage from '../pages/Landing/LandingPage';
import AccessibilityPage from '../pages/Legal/AccessibilityPage';
import AiDisclaimerPage from '../pages/Legal/AiDisclaimerPage';
import CookiesPage from '../pages/Legal/CookiesPage';
import DpaPage from '../pages/Legal/DpaPage';
import PrivacyPage from '../pages/Legal/PrivacyPage';
import TermsPage from '../pages/Legal/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ProtectedRoute from './ProtectedRoute';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    path: paths.root,
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Navigate to={paths.dashboardOverview} replace /> },
          { path: 'overview', element: <OverviewPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'customers', element: <CustomersPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'integrations', element: <IntegrationsPage /> },
          { path: 'support', element: <SupportPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
      { path: paths.login, element: <LoginPage /> },
      { path: paths.signup, element: <SignupPage /> },
      {
        path: 'legal',
        element: <LandingLayout />,
        children: [
          { path: 'terms', element: <TermsPage /> },
          { path: 'privacy', element: <PrivacyPage /> },
          { path: 'cookies', element: <CookiesPage /> },
          { path: 'dpa', element: <DpaPage /> },
          { path: 'ai', element: <AiDisclaimerPage /> },
          { path: 'accessibility', element: <AccessibilityPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
