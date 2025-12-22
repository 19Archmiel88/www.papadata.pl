import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import LandingLayout from '../layouts/LandingLayout';
import ProtectedRoute from './ProtectedRoute';
import { paths } from './paths';

// Lazy load pages
const OverviewPage = lazy(() => import('../pages/Dashboard/OverviewPage'));
const AnalyticsPage = lazy(() => import('../pages/Dashboard/AnalyticsPage'));
const ReportsPage = lazy(() => import('../pages/Dashboard/ReportsPage'));
const CustomersPage = lazy(() => import('../pages/Dashboard/CustomersPage'));
const ProductsPage = lazy(() => import('../pages/Dashboard/ProductsPage'));
const IntegrationsPage = lazy(() => import('../pages/Dashboard/IntegrationsPage'));
const SupportPage = lazy(() => import('../pages/Dashboard/SupportPage'));
const SettingsPage = lazy(() => import('../pages/Dashboard/SettingsPage'));
const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const AccessibilityPage = lazy(() => import('../pages/Legal/AccessibilityPage'));
const AiDisclaimerPage = lazy(() => import('../pages/Legal/AiDisclaimerPage'));
const CookiesPage = lazy(() => import('../pages/Legal/CookiesPage'));
const DpaPage = lazy(() => import('../pages/Legal/DpaPage'));
const PrivacyPage = lazy(() => import('../pages/Legal/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/Legal/TermsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/Auth/SignupPage'));

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
